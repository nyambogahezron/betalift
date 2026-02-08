import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 500,
	standardHeaders: true,
	legacyHeaders: false,
	message: "Too many requests from this IP, please try again later",
	skip: (req) => {
		return req.path === "/api/v1/csrf-token";
	},
});

export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
	message: "Too many authentication attempts, please try again later",
	skipSuccessfulRequests: true,
});

export const readLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	message: "Too many requests, please slow down",
});

export const writeLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
	message: "Too many write requests, please slow down",
});

export const frequentAccessLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 200,
	standardHeaders: true,
	legacyHeaders: false,
	message: "Too many requests, please slow down",
});

export const loginRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	skipSuccessfulRequests: true, // Don't count successful logins
	message: {
		success: false,
		message:
			"Too many login attempts from this IP. Please try again after 15 minutes.",
		error: "RATE_LIMIT_EXCEEDED",
	},
	handler: (_req, res) => {
		res.status(429).json({
			success: false,
			message:
				"Too many login attempts from this IP. Please try again after 15 minutes.",
			error: "RATE_LIMIT_EXCEEDED",
		});
	},
});
