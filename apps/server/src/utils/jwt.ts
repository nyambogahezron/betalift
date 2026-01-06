import jwt from 'jsonwebtoken'
import ENV from '../config/env'
import { Response } from 'express'
export interface JWTPayload {
	userId: string
	username?: string
}

export const generateAccessToken = (payload: JWTPayload): string => {
	return jwt.sign(payload, ENV.jwtSecret, {
		expiresIn: ENV.jwtExpiresIn,
	} as jwt.SignOptions)
}

export const generateRefreshToken = (payload: JWTPayload): string => {
	return jwt.sign(payload, ENV.jwtRefreshSecret, {
		expiresIn: ENV.jwtRefreshExpiresIn,
	} as jwt.SignOptions)
}

export const verifyAccessToken = (token: string): JWTPayload => {
	return jwt.verify(token, ENV.jwtSecret) as JWTPayload
}

export const verifyRefreshToken = (token: string): JWTPayload => {
	return jwt.verify(token, ENV.jwtRefreshSecret) as JWTPayload
}

export const generateVerificationToken = (): string => {
	return jwt.sign({ random: Math.random() }, ENV.jwtSecret, {
		expiresIn: '24h',
	})
}

export const generateResetToken = (): string => {
	return jwt.sign({ random: Math.random() }, ENV.jwtSecret, {
		expiresIn: '1h',
	})
}

export const attachTokensToResponse = (
	res: Response,
	accessToken: string,
	refreshToken: string
): void => {
	res.cookie('accessToken', accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	})

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
	})
}	