import type { Response } from "express";
import User from "../database/models/user.js";
import asyncHandler from "../middleware/asyncHandler.js";
import type { AuthenticatedRequest } from "../middleware/authentication.js";
import {
	getLockedIpAddresses,
	unlockIpAddress,
} from "../middleware/loginAttemptTracker.js";
import { BadRequestError, NotFoundError } from "../utils/errors/index.js";

/**
 * Manually unlock a user account
 * @route   POST /api/v1/admin/security/unlock-account
 * @access  Private/Admin
 */
export const unlockUserAccount = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { userId } = req.body;

		if (!userId) {
			throw new BadRequestError("User ID is required");
		}

		const user = await User.findById(userId).select(
			"+accountLockedUntil +failedLoginAttempts",
		);

		if (!user) {
			throw new NotFoundError("User not found");
		}

		await user.resetFailedAttempts();

		res.json({
			success: true,
			message: "User account unlocked successfully",
			data: {
				userId: user._id,
				email: user.email,
				username: user.username,
			},
		});
	},
);

/**
 * Get all locked user accounts
 * @route   GET /api/v1/admin/security/locked-accounts
 * @access  Private/Admin
 */
export const getLockedAccounts = asyncHandler(
	async (_req: AuthenticatedRequest, res: Response) => {
		const lockedUsers = await User.find({
			accountLockedUntil: { $gt: new Date() },
		})
			.select("email username failedLoginAttempts accountLockedUntil")
			.lean();

		res.json({
			success: true,
			message: "Locked accounts retrieved successfully",
			data: {
				count: lockedUsers.length,
				accounts: lockedUsers.map((user) => ({
					id: user._id,
					email: user.email,
					username: user.username,
					failedAttempts: user.failedLoginAttempts,
					lockedUntil: user.accountLockedUntil,
				})),
			},
		});
	},
);

/**
 * Get all locked IP addresses
 * @route   GET /api/v1/admin/security/locked-ips
 * @access  Private/Admin
 */
export const getLockedIps = asyncHandler(
	async (_req: AuthenticatedRequest, res: Response) => {
		const lockedIps = await getLockedIpAddresses();

		res.json({
			success: true,
			message: "Locked IP addresses retrieved successfully",
			data: {
				count: lockedIps.length,
				ips: lockedIps,
			},
		});
	},
);

/**
 * Manually unlock an IP address
 * @route   POST /api/v1/admin/security/unlock-ip
 * @access  Private/Admin
 */
export const unlockIp = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { ip } = req.body;

		if (!ip) {
			throw new BadRequestError("IP address is required");
		}

		const unlocked = await unlockIpAddress(ip);

		if (!unlocked) {
			throw new NotFoundError("IP address not found in lockout list");
		}

		res.json({
			success: true,
			message: "IP address unlocked successfully",
			data: {
				ip,
			},
		});
	},
);

/**
 * Get security statistics
 * @route   GET /api/v1/admin/security/stats
 * @access  Private/Admin
 */
export const getSecurityStats = asyncHandler(
	async (_req: AuthenticatedRequest, res: Response) => {
		// Get locked accounts count
		const lockedAccountsCount = await User.countDocuments({
			accountLockedUntil: { $gt: new Date() },
		});

		// Get accounts with failed attempts (but not locked)
		const accountsWithFailedAttempts = await User.countDocuments({
			failedLoginAttempts: { $gt: 0 },
			$or: [
				{ accountLockedUntil: { $exists: false } },
				{ accountLockedUntil: { $lte: new Date() } },
			],
		});

		// Get locked IPs count
		const lockedIps = await getLockedIpAddresses();

		// Get accounts with recent failed attempts (last 24 hours)
		const recentFailedAttempts = await User.countDocuments({
			lastFailedLogin: {
				$gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
			},
		});

		res.json({
			success: true,
			message: "Security statistics retrieved successfully",
			data: {
				lockedAccounts: lockedAccountsCount,
				accountsWithFailedAttempts,
				lockedIpAddresses: lockedIps.length,
				recentFailedAttempts24h: recentFailedAttempts,
			},
		});
	},
);

/**
 * Get user security details
 * @route   GET /api/v1/admin/security/user/:userId
 * @access  Private/Admin
 */
export const getUserSecurityDetails = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { userId } = req.params;

		const user = await User.findById(userId).select(
			"email username failedLoginAttempts accountLockedUntil lastFailedLogin",
		);

		if (!user) {
			throw new NotFoundError("User not found");
		}

		const isLocked = user.isAccountLocked();

		res.json({
			success: true,
			message: "User security details retrieved successfully",
			data: {
				userId: user._id,
				email: user.email,
				username: user.username,
				failedLoginAttempts: user.failedLoginAttempts,
				isAccountLocked: isLocked,
				accountLockedUntil: user.accountLockedUntil,
				lastFailedLogin: user.lastFailedLogin,
			},
		});
	},
);

/**
 * Reset all failed login attempts (emergency use only)
 * @route   POST /api/v1/admin/security/reset-all
 * @access  Private/Admin
 */
export const resetAllFailedAttempts = asyncHandler(
	async (_req: AuthenticatedRequest, res: Response) => {
		const result = await User.updateMany(
			{
				$or: [
					{ failedLoginAttempts: { $gt: 0 } },
					{ accountLockedUntil: { $exists: true } },
				],
			},
			{
				$set: {
					failedLoginAttempts: 0,
				},
				$unset: {
					accountLockedUntil: "",
					lastFailedLogin: "",
				},
			},
		);

		res.json({
			success: true,
			message: "All failed login attempts reset successfully",
			data: {
				usersUpdated: result.modifiedCount,
			},
		});
	},
);
