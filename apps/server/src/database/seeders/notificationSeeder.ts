import Notification from "../models/notification.js";
import type { IUser } from "../models/user.js";

export const seedNotifications = async (users: IUser[]) => {
	const createdNotifications = [];

	const notificationTypes = [
		"project_invite",
		"project_joined",
		"feedback_received",
		"feedback_comment",
		"feedback_status_changed",
		"project_update",
	] as const;

	const sampleMessages = {
		project_invite: "You have been invited to join Project X",
		project_joined: "You successfully joined Project Y",
		feedback_received: "New feedback received on your project",
		feedback_comment: "Someone commented on your feedback",
		feedback_status_changed: "Your feedback status has been updated",
		project_update: "Project Z has a new update available",
	};

	for (const user of users) {
		// Create 2-5 notifications for each user
		const numberOfNotifications = Math.floor(Math.random() * 4) + 2;

		for (let i = 0; i < numberOfNotifications; i++) {
			const type =
				notificationTypes[Math.floor(Math.random() * notificationTypes.length)];

			const notification = await Notification.create({
				userId: user._id,
				type: type,
				title: type.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
				message: sampleMessages[type],
				isRead: Math.random() > 0.5,
				createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
			});
			createdNotifications.push(notification);
		}
	}

	return createdNotifications;
};
