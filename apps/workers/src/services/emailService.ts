import nodemailer from "nodemailer";
import ENV from "../config/env";
import { logger } from "../utils/logger";

const transporter = nodemailer.createTransport({
	host: ENV.smtpHost,
	port: ENV.smtpPort,
	secure: ENV.smtpSecure,
	auth: {
		user: ENV.smtpUser,
		pass: ENV.smtpPassword,
	},
});

export interface EmailOptions {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
	try {
		const info = await transporter.sendMail({
			from: ENV.emailFrom,
			to: options.to,
			subject: options.subject,
			text: options.text,
			html: options.html,
		});

		logger.info(`Email sent: ${info.messageId}`);
	} catch (error) {
		logger.error("Error sending email:", error);
		throw error;
	}
};
