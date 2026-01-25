import { baseLayout } from "./layout";
import { styles } from "./styles";

type linkProp = `https://${string}` | `http://${string}`;

export const getWelcomeEmail = (
	username: string,
	link: linkProp,
	token: string,
): string => {
	const content = `
        <h2 style="${styles.heading}">Welcome to BetaLift, ${username}!</h2>
        <p style="${styles.paragraph}">To get started, please confirm your email address by clicking the button below:</p>
        
        <div style="text-align: center;">
            <a href="${link}" style="${styles.button}" class="btn">Verify Your Email</a>
        </div>
        
        <p style="${styles.paragraph}">Or enter this code:</p>
        <div style="${styles.codeBlock}">
            ${token}
        </div>
        
        <p style="${styles.paragraph}">This link will expire in 24 hours.</p>
        <p style="${styles.paragraph}">If you didn't create an account, you can safely ignore this email.</p>
    `;

	return baseLayout(content, {
		title: "Welcome to BetaLift",
		previewText: "Verify your email to get started with BetaLift",
	});
};

export const getVerifyEmail = (
	username: string,
	link: linkProp,
	token: string,
): string => {
	const content = `
        <h2 style="${styles.heading}">Verify your email</h2>
        <p style="${styles.paragraph}">Hi ${username},</p>
        <p style="${styles.paragraph}">Please verify your email address to ensure your account is secure and to unlock all features.</p>
        
        <div style="text-align: center;">
            <a href="${link}" style="${styles.button}" class="btn">Verify Email</a>
        </div>
        
        <p style="${styles.paragraph}">Or enter this code:</p>
        <div style="${styles.codeBlock}">
            ${token}
        </div>
        
        <p style="${styles.paragraph}">This link expires in 24 hours.</p>
    `;

	return baseLayout(content, {
		title: "Verify your Email",
		previewText: "Please verify your email address",
	});
};

export const getPasswordResetEmail = (
	username: string,
	link: linkProp,
	token: string,
): string => {
	const content = `
        <h2 style="${styles.heading}">Password Reset Request</h2>
        <p style="${styles.paragraph}">Hi ${username},</p>
        <p style="${styles.paragraph}">We received a request to reset your password. If this was you, you can set a new password by clicking the button below:</p>
        
        <div style="text-align: center;">
            <a href="${link}" style="${styles.button}" class="btn">Reset Password</a>
        </div>
        
        <p style="${styles.paragraph}">Or enter this code:</p>
        <div style="${styles.codeBlock}">
            ${token}
        </div>
        
        <p style="${styles.paragraph}">This link will expire in 1 hour.</p>
        <p style="${styles.paragraph}">If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
    `;

	return baseLayout(content, {
		title: "Reset your Password",
		previewText: "Instructions to reset your password",
	});
};

export const getProjectInviteEmail = (
	inviterName: string,
	projectName: string,
	link: linkProp,
): string => {
	const content = `
        <h2 style="${styles.heading}">Project Invitation</h2>
        <p style="${styles.paragraph}">Hi there,</p>
        <p style="${styles.paragraph}">${inviterName} has invited you to join the project "<strong>${projectName}</strong>" on BetaLift.</p>
        <p style="${styles.paragraph}">Click the button below to accept the invitation and get started:</p>
        
        <div style="text-align: center;">
            <a href="${link}" style="${styles.button}" class="btn">Join Project</a>
        </div>
        
        <p style="${styles.paragraph}">Or use this link:</p>
        <p style="${styles.paragraph} word-break: break-all; color: #666;">
            <a href="${link}" style="${styles.link}">${link}</a>
        </p>
    `;

	return baseLayout(content, {
		title: `Invitation to join ${projectName}`,
		previewText: `${inviterName} invited you to join ${projectName}`,
	});
};

export const getProjectJoinedEmail = (
	username: string,
	projectName: string,
	link: linkProp,
): string => {
	const content = `
        <h2 style="${styles.heading}">Welcome to the Team!</h2>
        <p style="${styles.paragraph}">Hi ${username},</p>
        <p style="${styles.paragraph}">You have successfully joined "<strong>${projectName}</strong>". We're excited to see what you'll build!</p>
        
        <div style="text-align: center;">
            <a href="${link}" style="${styles.button}" class="btn">View Project</a>
        </div>
    `;

	return baseLayout(content, {
		title: `You joined ${projectName}`,
		previewText: `Welcome to the ${projectName} team`,
	});
};

export const getFeedbackReceivedEmail = (
	projectName: string,
	feedbackTitle: string,
	submitterName: string,
	link: linkProp,
): string => {
	const content = `
        <h2 style="${styles.heading}">New Feedback Received</h2>
        <p style="${styles.paragraph}">Good news! You've received new feedback on "<strong>${projectName}</strong>" from ${submitterName}.</p>
        
        <div style="background-color: #f9f9f9; padding: 16px; border-left: 4px solid #007bff; margin-bottom: 24px;">
            <p style="margin: 0; font-weight: bold;">${feedbackTitle}</p>
        </div>
        
        <div style="text-align: center;">
            <a href="${link}" style="${styles.button}" class="btn">View Feedback</a>
        </div>
    `;

	return baseLayout(content, {
		title: `New feedback on ${projectName}`,
		previewText: `New feedback: ${feedbackTitle}`,
	});
};

export const getFeedbackCommentEmail = (
	feedbackTitle: string,
	commenterName: string,
	commentPreview: string,
	link: linkProp,
): string => {
	const content = `
        <h2 style="${styles.heading}">New Comment</h2>
        <p style="${styles.paragraph}"><strong>${commenterName}</strong> commented on "<strong>${feedbackTitle}</strong>":</p>
        
        <div style="background-color: #f9f9f9; padding: 16px; border-radius: 4px; margin-bottom: 24px; font-style: italic;">
            "${commentPreview}"
        </div>
        
        <div style="text-align: center;">
            <a href="${link}" style="${styles.button}" class="btn">Reply to Comment</a>
        </div>
    `;

	return baseLayout(content, {
		title: `New comment on ${feedbackTitle}`,
		previewText: `${commenterName} commented: ${commentPreview}`,
	});
};

export const getFeedbackStatusChangedEmail = (
	feedbackTitle: string,
	newStatus: string,
	link: linkProp,
): string => {
	const content = `
        <h2 style="${styles.heading}">Status Update</h2>
        <p style="${styles.paragraph}">The status of your feedback "<strong>${feedbackTitle}</strong>" has been updated to:</p>
        
        <div style="text-align: center; margin: 24px 0;">
            <span style="background-color: #e3f2fd; color: #0d47a1; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 18px;">
                ${newStatus.toUpperCase()}
            </span>
        </div>
        
        <div style="text-align: center;">
            <a href="${link}" style="${styles.button}" class="btn">View Details</a>
        </div>
    `;

	return baseLayout(content, {
		title: `Feedback status updated: ${newStatus}`,
		previewText: `Your feedback is now ${newStatus}`,
	});
};

export const getProjectUpdateEmail = (
	projectName: string,
	updateTitle: string,
	updatePreview: string,
	link: linkProp,
): string => {
	const content = `
        <h2 style="${styles.heading}">Project Update: ${projectName}</h2>
        <h3 style="font-size: 18px; margin-bottom: 12px;">${updateTitle}</h3>
        <p style="${styles.paragraph}">${updatePreview}</p>
        
        <div style="text-align: center;">
            <a href="${link}" style="${styles.button}" class="btn">Read Full Update</a>
        </div>
    `;

	return baseLayout(content, {
		title: `Update on ${projectName}`,
		previewText: `New update: ${updateTitle}`,
	});
};
