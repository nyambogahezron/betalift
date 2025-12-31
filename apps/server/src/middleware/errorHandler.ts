import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/errors'
import { logger } from '../utils/logger'
import ENV from '../config/env'

export const errorHandler = (
	err: Error | ApiError,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	let statusCode = 500
	let message = 'Internal Server Error'
	let stack = err.stack

	if (err instanceof ApiError) {
		statusCode = err.statusCode
		message = err.message
	}

	// Mongoose validation error
	if (err.name === 'ValidationError') {
		statusCode = 400
		message = err.message
	}

	// Mongoose duplicate key error
	if (err.name === 'MongoServerError' && (err as any).code === 11000) {
		statusCode = 409
		const field = Object.keys((err as any).keyPattern)[0]
		message = `${field} already exists`
	}

	// Mongoose cast error
	if (err.name === 'CastError') {
		statusCode = 400
		message = 'Invalid ID format'
	}

	// JWT errors
	if (err.name === 'JsonWebTokenError') {
		statusCode = 401
		message = 'Invalid token'
	}

	if (err.name === 'TokenExpiredError') {
		statusCode = 401
		message = 'Token expired'
	}

	logger.error(`Error: ${message}`, {
		statusCode,
		path: req.path,
		method: req.method,
		stack: ENV.nodeEnv === 'development' ? stack : undefined,
	})

	res.status(statusCode).json({
		success: false,
		message,
		...(ENV.nodeEnv === 'development' && { stack }),
	})
}
