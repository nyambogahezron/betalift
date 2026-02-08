import { IPLoginAttempt } from "@repo/database";
import type { NextFunction, Request, Response } from "express";

const MAX_ATTEMPTS_PER_IP = 10;
const IP_LOCKOUT_DURATION = 30 * 60 * 1000;
const ATTEMPT_WINDOW = 15 * 60 * 1000;

function getClientIp(req: Request): string {
	const forwardedFor = req.headers["x-forwarded-for"];
	if (forwardedFor) {
		const forwarded = Array.isArray(forwardedFor)
			? forwardedFor[0]
			: forwardedFor;
		return forwarded?.split(",")[0]?.trim() || "unknown";
	}
	return (
		(req.headers["x-real-ip"] as string) ||
		req.socket.remoteAddress ||
		"unknown"
	);
}

export async function checkIpLockout(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const ip = getClientIp(req);
		const now = new Date();

		const attempt = await IPLoginAttempt.findOne({
			ipAddress: ip,
			lockedUntil: { $gt: now },
		});

		if (attempt?.lockedUntil) {
			const remainingTime = Math.ceil(
				(attempt.lockedUntil.getTime() - now.getTime()) / 1000 / 60,
			);
			res.status(429).json({
				success: false,
				message: `Too many failed login attempts from this IP address. Please try again in ${remainingTime} minute${remainingTime !== 1 ? "s" : ""}.`,
				error: "IP_LOCKED",
				retryAfter: attempt.lockedUntil.toISOString(),
			});
			return;
		}

		next();
	} catch (error) {
		console.error("Error checking IP lockout:", error);
		next();
	}
}

export async function recordFailedIpAttempt(req: Request): Promise<void> {
	try {
		const ip = getClientIp(req);
		const now = new Date();

		const attempt = await IPLoginAttempt.findOne({ ipAddress: ip });

		if (attempt) {
			const timeSinceFirst = now.getTime() - attempt.firstAttemptAt.getTime();

			if (timeSinceFirst > ATTEMPT_WINDOW) {
				attempt.failedAttempts = 1;
				attempt.firstAttemptAt = now;
				attempt.lastAttemptAt = now;
				attempt.lockedUntil = undefined;
			} else {
				attempt.failedAttempts += 1;
				attempt.lastAttemptAt = now;

				if (attempt.failedAttempts >= MAX_ATTEMPTS_PER_IP) {
					attempt.lockedUntil = new Date(now.getTime() + IP_LOCKOUT_DURATION);
				}
			}

			await attempt.save();
		} else {
			await IPLoginAttempt.create({
				ipAddress: ip,
				failedAttempts: 1,
				firstAttemptAt: now,
				lastAttemptAt: now,
			});
		}
	} catch (error) {
		console.error("Error recording IP attempt:", error);
	}
}

export async function resetIpAttempts(req: Request): Promise<void> {
	try {
		const ip = getClientIp(req);
		await IPLoginAttempt.deleteOne({ ipAddress: ip });
	} catch (error) {
		console.error("Error resetting IP attempts:", error);
	}
}

export async function getRemainingIpAttempts(req: Request): Promise<number> {
	try {
		const ip = getClientIp(req);
		const attempt = await IPLoginAttempt.findOne({ ipAddress: ip });

		if (!attempt) return MAX_ATTEMPTS_PER_IP;

		const now = new Date();
		const timeSinceFirst = now.getTime() - attempt.firstAttemptAt.getTime();
		if (timeSinceFirst > ATTEMPT_WINDOW) {
			return MAX_ATTEMPTS_PER_IP;
		}

		return Math.max(0, MAX_ATTEMPTS_PER_IP - attempt.failedAttempts);
	} catch (error) {
		console.error("Error getting remaining IP attempts:", error);
		return MAX_ATTEMPTS_PER_IP;
	}
}

export async function unlockIpAddress(ip: string): Promise<boolean> {
	try {
		const result = await IPLoginAttempt.deleteOne({ ipAddress: ip });
		return result.deletedCount > 0;
	} catch (error) {
		console.error("Error unlocking IP address:", error);
		return false;
	}
}

export async function getLockedIpAddresses(): Promise<
	Array<{
		ip: string;
		attempts: number;
		lockedUntil: Date;
	}>
> {
	try {
		const now = new Date();
		const lockedAttempts = await IPLoginAttempt.find({
			lockedUntil: { $gt: now },
		}).lean();

		return lockedAttempts.map((attempt) => ({
			ip: attempt.ipAddress,
			attempts: attempt.failedAttempts,
			lockedUntil: attempt.lockedUntil as Date,
		}));
	} catch (error) {
		console.error("Error getting locked IP addresses:", error);
		return [];
	}
}
