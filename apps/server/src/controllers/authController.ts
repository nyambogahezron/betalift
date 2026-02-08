import { User, UserEngagement } from "@repo/database";
import type { Response } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import type {
	AuthRequest,
	AuthenticatedRequest,
} from "../middleware/authentication.js";
import {
	recordFailedIpAttempt,
	resetIpAttempts,
} from "../middleware/loginAttemptTracker.js";
import {
	sendPasswordResetEmail,
	sendVerificationEmail,
} from "../services/emailService.js";
import {
	BadRequestError,
	ConflictError,
	NotFoundError,
	UnauthorizedError,
} from "../utils/errors/index.js";
import {
	generateAccessToken,
	generateResetToken,
	generateVerificationToken,
} from "../utils/jwt.js";

// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const { email, password, username, displayName } = req.body;

		const isUserAvailable = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (isUserAvailable) {
			throw new ConflictError("Email or username already in use");
		}

		const verificationToken = generateVerificationToken();

		const user = await User.create({
			email,
			password,
			username,
			displayName: displayName || username,
			emailVerificationToken: verificationToken,
			emailVerificationExpires: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
		});

		await UserEngagement.create({ userId: user._id });

		try {
			await sendVerificationEmail(user.email, user.username, verificationToken);
		} catch (error) {
			console.error("Failed to send verification email:", error);
		}

		const accessToken = generateAccessToken({
			userId: user._id.toString(),
		});

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		res.status(201).json({
			message:
				"User registered successfully. Please check your email to verify your account.",
			user,
		});
	},
);

// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email }).select(
		"+password +accountLockedUntil +failedLoginAttempts",
	);

	if (!user) {
		recordFailedIpAttempt(req);
		throw new UnauthorizedError("Invalid email or password");
	}

	if (user.isAccountLocked()) {
		const lockTimeRemaining = user.accountLockedUntil
			? Math.ceil((user.accountLockedUntil.getTime() - Date.now()) / 1000 / 60)
			: 0;

		throw new UnauthorizedError(
			`Account is temporarily locked due to multiple failed login attempts. Please try again in ${lockTimeRemaining} minute${lockTimeRemaining !== 1 ? "s" : ""}.`,
		);
	}

	const isPasswordValid = await user.comparePassword(password);

	if (!isPasswordValid) {
		await user.incrementFailedAttempts();
		recordFailedIpAttempt(req);

		const remainingAttempts = Math.max(0, 5 - user.failedLoginAttempts);

		if (remainingAttempts > 0 && remainingAttempts <= 3) {
			throw new UnauthorizedError(
				`Invalid email or password. ${remainingAttempts} attempt${remainingAttempts !== 1 ? "s" : ""} remaining before account lockout.`,
			);
		}

		throw new UnauthorizedError("Invalid email or password");
	}

	await user.resetFailedAttempts();
	resetIpAttempts(req);

	const accessToken = generateAccessToken({
		userId: user._id.toString(),
	});

	await UserEngagement.findOneAndUpdate(
		{ userId: user._id },
		{ lastActiveAt: new Date() },
	);

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	res.json({
		message: "Login successful",
		user,
	});
});

// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(
	async (_req: AuthenticatedRequest, res: Response) => {
		res.clearCookie("accessToken");

		res.json({
			message: "Logout successful",
		});
	},
);

// @route   GET /api/v1/auth/me
// @access  Private
export const getCurrentUser = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const user = await User.findById(req.user._id);

		if (!user) throw new NotFoundError("User not found");

		res.json({
			user,
		});
	},
);

// @route   POST /api/v1/auth/verify-email
// @access  Public
export const verifyEmail = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const { token } = req.body;

		if (!token) throw new BadRequestError("Verification token is required");

		const user = await User.findOne({
			emailVerificationToken: token,
			emailVerificationExpires: { $gt: Date.now() },
		}).select("+emailVerificationToken +emailVerificationExpires");

		if (!user) {
			throw new BadRequestError("Invalid or expired verification token");
		}

		user.isEmailVerified = true;
		user.emailVerificationToken = undefined;
		user.emailVerificationExpires = undefined;
		await user.save();

		res.json({
			message: "Email verified successfully",
		});
	},
);

// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const { email } = req.body;

		if (!email) throw new BadRequestError("Email is required");

		const user = await User.findOne({ email });

		if (!user) {
			res.json({
				message:
					"If an account exists with that email, a password reset link has been sent.",
			});
			return;
		}

		const resetToken = generateResetToken();
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
		await user.save();

		// Send reset email
		try {
			await sendPasswordResetEmail(user.email, user.username, resetToken);
		} catch (_error) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpires = undefined;
			await user.save();
			throw new BadRequestError("Failed to send password reset email");
		}

		res.json({
			message:
				"If an account exists with that email, a password reset link has been sent.",
		});
	},
);

// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const { token, password } = req.body;

		if (!token || !password) {
			throw new BadRequestError("Token and password are required");
		}

		if (password.length < 6) {
			throw new BadRequestError("Password must be at least 6 characters long");
		}

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		}).select("+resetPasswordToken +resetPasswordExpires +password");

		if (!user) {
			throw new BadRequestError("Invalid or expired reset token");
		}

		user.password = password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		user.refreshToken = undefined; // Invalidate all sessions
		await user.save();

		res.json({
			message: "Password reset successful",
		});
	},
);
