import nodemailer from 'nodemailer'
import ENV from '../config/env'
import { logger } from '../utils/logger'

const transporter = nodemailer.createTransport({
	host: ENV.smtpHost,
	port: ENV.smtpPort,
	secure: ENV.smtpSecure,
	auth: {
		user: ENV.smtpUser,
		pass: ENV.smtpPassword,
	},
})

export interface EmailOptions {
	to: string
	subject: string
	html: string
	text?: string
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
	try {
		const info = await transporter.sendMail({
			from: ENV.emailFrom,
			to: options.to,
			subject: options.subject,
			text: options.text,
			html: options.html,
		})

		logger.info(`Email sent: ${info.messageId}`)
	} catch (error) {
		logger.error('Error sending email:', error)
		throw error
	}
}

export const sendVerificationEmail = async (
	email: string,
	username: string,
	token: string
): Promise<void> => {
	const verificationUrl = `${ENV.clientUrl}/verify-email?token=${token}`

	const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2>Welcome to BetaLift, ${username}!</h2>
			<p>Thank you for signing up. Please verify your email address to get started.</p>
			<p>Click the button below to verify your email:</p>
			<a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
				Verify Email
			</a>
			<p>Or copy and paste this link into your browser:</p>
			<p style="word-break: break-all;">${verificationUrl}</p>
			<p>This link will expire in 24 hours.</p>
			<p>If you didn't create an account, please ignore this email.</p>
		</div>
	`

	await sendEmail({
		to: email,
		subject: 'Verify your email - BetaLift',
		html,
		text: `Welcome to BetaLift! Please verify your email by visiting: ${verificationUrl}`,
	})
}

export const sendPasswordResetEmail = async (
	email: string,
	username: string,
	token: string
): Promise<void> => {
	const resetUrl = `${ENV.clientUrl}/reset-password?token=${token}`

	const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2>Password Reset Request</h2>
			<p>Hi ${username},</p>
			<p>You requested to reset your password. Click the button below to reset it:</p>
			<a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
				Reset Password
			</a>
			<p>Or copy and paste this link into your browser:</p>
			<p style="word-break: break-all;">${resetUrl}</p>
			<p>This link will expire in 1 hour.</p>
			<p>If you didn't request a password reset, please ignore this email.</p>
		</div>
	`

	await sendEmail({
		to: email,
		subject: 'Reset your password - BetaLift',
		html,
		text: `Reset your password by visiting: ${resetUrl}`,
	})
}
