import ENV from "../config/env";
import {
	getFeedbackCommentEmail,
	getFeedbackReceivedEmail,
	getFeedbackStatusChangedEmail,
	getPasswordResetEmail,
	getProjectInviteEmail,
	getProjectJoinedEmail,
	getProjectUpdateEmail,
	getVerifyEmail,
} from "../templates/emails";
import logger from '@repo/logger'

import RabbitMQClient from "../rabbitmq/client";

export interface EmailOptions {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
	try {
		const published = await RabbitMQClient.publishEmail(options);
		if (published) {
			logger.info(`Email queued for: ${options.to}`);
		} else {
			logger.error(`Failed to queue email for: ${options.to}`);
			throw new Error("Failed to queue email");
		}
	} catch (error) {
		logger.error("Error queueing email:", error);
		throw error;
	}
};

export const sendVerificationEmail = async (
	email: string,
	username: string,
	token: string,
): Promise<void> => {
	const verificationUrl = `${ENV.clientUrl}/verify-email?token=${token}`;
	const html = getVerifyEmail(username, verificationUrl, token);

	await sendEmail({
		to: email,
		subject: "Verify your email - BetaLift",
		html,
		text: `Welcome to BetaLift! Please verify your email by visiting: ${verificationUrl}`,
	});
};

export const sendPasswordResetEmail = async (
	email: string,
	username: string,
	token: string,
): Promise<void> => {
	const resetUrl = `${ENV.clientUrl}/reset-password?token=${token}`;
	const html = getPasswordResetEmail(username, resetUrl, token);

	await sendEmail({
		to: email,
		subject: "Reset your password - BetaLift",
		html,
		text: `Reset your password by visiting: ${resetUrl}`,
	});
};

export const sendProjectInviteEmail = async (
	email: string,
	inviterName: string,
	projectName: string,
	projectId: string,
): Promise<void> => {
	const inviteUrl = `${ENV.clientUrl}/projects/${projectId}/join`;
	const html = getProjectInviteEmail(inviterName, projectName, inviteUrl);

	await sendEmail({
		to: email,
		subject: `Invitation to join ${projectName} on BetaLift`,
		html,
		text: `${inviterName} has invited you to join the project "${projectName}". Join here: ${inviteUrl}`,
	});
};

export const sendProjectJoinedEmail = async (
	email: string,
	username: string,
	projectName: string,
	projectId: string,
): Promise<void> => {
	const projectUrl = `${ENV.clientUrl}/projects/${projectId}`;
	const html = getProjectJoinedEmail(username, projectName, projectUrl);

	await sendEmail({
		to: email,
		subject: `Welcome to ${projectName}`,
		html,
		text: `You have successfully joined "${projectName}". View project: ${projectUrl}`,
	});
};

export const sendFeedbackReceivedEmail = async (
	email: string,
	projectName: string,
	feedbackTitle: string,
	submitterName: string,
	feedbackId: string,
): Promise<void> => {
	const feedbackUrl = `${ENV.clientUrl}/feedback/${feedbackId}`;
	const html = getFeedbackReceivedEmail(
		projectName,
		feedbackTitle,
		submitterName,
		feedbackUrl,
	);

	await sendEmail({
		to: email,
		subject: `New feedback on ${projectName}`,
		html,
		text: `New feedback "${feedbackTitle}" from ${submitterName}. View here: ${feedbackUrl}`,
	});
};

export const sendFeedbackCommentEmail = async (
	email: string,
	feedbackTitle: string,
	commenterName: string,
	commentPreview: string,
	feedbackId: string,
): Promise<void> => {
	const feedbackUrl = `${ENV.clientUrl}/feedback/${feedbackId}`;
	const html = getFeedbackCommentEmail(
		feedbackTitle,
		commenterName,
		commentPreview,
		feedbackUrl,
	);

	await sendEmail({
		to: email,
		subject: `New comment on ${feedbackTitle}`,
		html,
		text: `${commenterName} commented on "${feedbackTitle}": "${commentPreview}". View here: ${feedbackUrl}`,
	});
};

export const sendFeedbackStatusChangedEmail = async (
	email: string,
	feedbackTitle: string,
	newStatus: string,
	feedbackId: string,
): Promise<void> => {
	const feedbackUrl = `${ENV.clientUrl}/feedback/${feedbackId}`;
	const html = getFeedbackStatusChangedEmail(
		feedbackTitle,
		newStatus,
		feedbackUrl,
	);

	await sendEmail({
		to: email,
		subject: `Status update: ${feedbackTitle}`,
		html,
		text: `The status of your feedback "${feedbackTitle}" is now ${newStatus}. View here: ${feedbackUrl}`,
	});
};

export const sendProjectUpdateEmail = async (
	email: string,
	projectName: string,
	updateTitle: string,
	updatePreview: string,
	updateId: string,
): Promise<void> => {
	const updateUrl = `${ENV.clientUrl}/updates/${updateId}`;
	const html = getProjectUpdateEmail(
		projectName,
		updateTitle,
		updatePreview,
		updateUrl,
	);

	await sendEmail({
		to: email,
		subject: `Update on ${projectName}: ${updateTitle}`,
		html,
		text: `Project Update: ${updateTitle}. ${updatePreview}. Read more: ${updateUrl}`,
	});
};
