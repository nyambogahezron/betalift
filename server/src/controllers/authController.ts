import { Response } from 'express'
import { validationResult } from 'express-validator'
import User from '../database/models/user.js'
import UserEngagement from '../database/models/userEngagement.js'
import { AuthRequest } from '../middleware/authentication.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
	generateAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
	generateVerificationToken,
	generateResetToken,
} from '../utils/jwt.js'
import {
	sendVerificationEmail,
	sendPasswordResetEmail,
} from '../services/emailService.js'
import {
	BadRequestError,
	UnauthorizedError,
	NotFoundError,
	ConflictError,
} from '../utils/errors/index.js'
import { handleValidationErrors } from '../helpers/validation.js'

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			throw new BadRequestError(errors.array()[0]?.msg || "Validation error")
		}

		const { email, password, username, displayName, role } = req.body

		// Check if user already exists
		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		})

		if (existingUser) {
			if (existingUser.email === email) {
				throw new ConflictError('Email already registered')
			}
			throw new ConflictError('Username already taken')
		}

		// Create user
		const user = await User.create({
			email,
			password,
			username,
			displayName: displayName || username,
			role: role || 'both',
		})

		// Create user engagement profile
		await UserEngagement.create({
			userId: user._id,
		})

		// Generate verification token
		const verificationToken = generateVerificationToken()
		user.emailVerificationToken = verificationToken
		user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
		await user.save()

		// Send verification email
		try {
			await sendVerificationEmail(user.email, user.username, verificationToken)
		} catch (error) {
			console.error('Failed to send verification email:', error)
		}

		// Generate tokens
		const accessToken = generateAccessToken({
			userId: user._id.toString(),
			email: user.email,
			username: user.username,
		})

		const refreshToken = generateRefreshToken({
			userId: user._id.toString(),
			email: user.email,
			username: user.username,
		})

		user.refreshToken = refreshToken
		await user.save()

		res.status(201).json({
			success: true,
			message:
				'User registered successfully. Please check your email to verify your account.',
			data: {
				user: user.toJSON(),
				accessToken,
				refreshToken,
			},
		})
	}
)

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		throw new BadRequestError(errors.array()[0]?.msg || "Validation error")
	}

	const { email, password } = req.body

	// Find user and include password field
	const user = await User.findOne({ email }).select('+password')

	if (!user || !(await user.comparePassword(password))) {
		throw new UnauthorizedError('Invalid email or password')
	}

	// Generate tokens
	const accessToken = generateAccessToken({
		userId: user._id.toString(),
		email: user.email,
		username: user.username,
	})

	const refreshToken = generateRefreshToken({
		userId: user._id.toString(),
		email: user.email,
		username: user.username,
	})

	user.refreshToken = refreshToken
	await user.save()

	// Update last active
	await UserEngagement.findOneAndUpdate(
		{ userId: user._id },
		{ lastActiveAt: new Date() }
	)

	res.json({
		success: true,
		message: 'Login successful',
		data: {
			user: user.toJSON(),
			accessToken,
			refreshToken,
		},
	})
})

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const { refreshToken: token } = req.body

		if (!token) {
			throw new BadRequestError('Refresh token is required')
		}

		try {
			const decoded = verifyRefreshToken(token)

			// Find user and verify refresh token matches
			const user = await User.findById(decoded.userId).select('+refreshToken')

			if (!user || user.refreshToken !== token) {
				throw new UnauthorizedError('Invalid refresh token')
			}

			// Generate new access token
			const accessToken = generateAccessToken({
				userId: user._id.toString(),
				email: user.email,
				username: user.username,
			})

			res.json({
				success: true,
				data: {
					accessToken,
				},
			})
		} catch (error) {
			throw new UnauthorizedError('Invalid or expired refresh token')
		}
	}
)

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
	if (!req.user) {
		throw new UnauthorizedError()
	}

	// Clear refresh token
	await User.findByIdAndUpdate(req.user._id, { refreshToken: null })

	res.json({
		success: true,
		message: 'Logout successful',
	})
})

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getCurrentUser = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new UnauthorizedError()
		}

		const user = await User.findById(req.user._id)

		if (!user) {
			throw new NotFoundError('User not found')
		}

		res.json({
			success: true,
			data: user.toJSON(),
		})
	}
)

// @desc    Verify email
// @route   POST /api/v1/auth/verify-email
// @access  Public
export const verifyEmail = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const { token } = req.body

		if (!token) {
			throw new BadRequestError('Verification token is required')
		}

		const user = await User.findOne({
			emailVerificationToken: token,
			emailVerificationExpires: { $gt: Date.now() },
		}).select('+emailVerificationToken +emailVerificationExpires')

		if (!user) {
			throw new BadRequestError('Invalid or expired verification token')
		}

		user.isEmailVerified = true
		user.emailVerificationToken = undefined
		user.emailVerificationExpires = undefined
		await user.save()

		res.json({
			success: true,
			message: 'Email verified successfully',
		})
	}
)

// @desc    Request password reset
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const { email } = req.body

		if (!email) {
			throw new BadRequestError('Email is required')
		}

		const user = await User.findOne({ email })

		if (!user) {
			// Don't reveal if user exists
			res.json({
				success: true,
				message:
					'If an account exists with that email, a password reset link has been sent.',
			})
			return
		}

		// Generate reset token
		const resetToken = generateResetToken()
		user.resetPasswordToken = resetToken
		user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
		await user.save()

		// Send reset email
		try {
			await sendPasswordResetEmail(user.email, user.username, resetToken)
		} catch (error) {
			user.resetPasswordToken = undefined
			user.resetPasswordExpires = undefined
			await user.save()
			throw new BadRequestError('Failed to send password reset email')
		}

		res.json({
			success: true,
			message:
				'If an account exists with that email, a password reset link has been sent.',
		})
	}
)

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const { token, password } = req.body

		if (!token || !password) {
			throw new BadRequestError('Token and password are required')
		}

		if (password.length < 6) {
			throw new BadRequestError('Password must be at least 6 characters long')
		}

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		}).select('+resetPasswordToken +resetPasswordExpires +password')

		if (!user) {
			throw new BadRequestError('Invalid or expired reset token')
		}

		user.password = password
		user.resetPasswordToken = undefined
		user.resetPasswordExpires = undefined
		user.refreshToken = undefined // Invalidate all sessions
		await user.save()

		res.json({
			success: true,
			message: 'Password reset successful',
		})
	}
)
