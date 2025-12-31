import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, JWTPayload } from '../utils/jwt'
import { UnauthorizedError } from '../utils/errors'
import User from '../database/models/user'

export interface AuthRequest extends Request {
	user?: JWTPayload & { _id: string }
}

export const authenticate = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '')

		if (!token) {
			throw new UnauthorizedError('No token provided')
		}

		const decoded = verifyAccessToken(token)

		// Verify user still exists
		const user = await User.findById(decoded.userId)
		if (!user) {
			throw new UnauthorizedError('User not found')
		}

		req.user = { ...decoded, _id: decoded.userId }
		next()
	} catch (error) {
		next(new UnauthorizedError('Invalid token'))
	}
}

export const optionalAuthenticate = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '')

		if (token) {
			const decoded = verifyAccessToken(token)
			req.user = { ...decoded, _id: decoded.userId }
		}
		next()
	} catch (error) {
		// Continue without authentication
		next()
	}
}
