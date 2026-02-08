import type { NextFunction, Request, Response } from "express";
import ENV from "../config/env";
import { ApiError } from "../utils/errors";
import logger from '@repo/logger'

export const errorHandler = (
	err: Error | ApiError,
	req: Request,
	res: Response,
	_next: NextFunction,
): void => {
	let statusCode = 500;
	let message = "Internal Server Error";
	const stack = err.stack;

	if (err instanceof ApiError) {
		statusCode = err.statusCode;
		message = err.message;
	}

	if (err.name === "ValidationError") {
		statusCode = 400;
		message = err.message;
	}

	if (
		err.name === "MongoServerError" &&
		"code" in err &&
		(err as unknown as { code: number }).code === 11000
	) {
		statusCode = 409;
		const field = Object.keys(
			(err as unknown as { keyPattern: Record<string, number> }).keyPattern,
		)[0];
		message = `${field} already exists`;
	}

	if (err.name === "CastError") {
		statusCode = 400;
		message = "Invalid ID format";
	}

	if (err.name === "JsonWebTokenError") {
		statusCode = 401;
		message = "Invalid token";
	}

	if (err.name === "TokenExpiredError") {
		statusCode = 401;
		message = "Token expired";
	}

	logger.error(`Error: ${message}`, {
		statusCode,
		path: req.path,
		method: req.method,
		stack: ENV.nodeEnv === "development" ? stack : undefined,
	});

	res.status(statusCode).json({
		success: false,
		message,
		...(ENV.nodeEnv === "development" && { stack }),
	});
};
