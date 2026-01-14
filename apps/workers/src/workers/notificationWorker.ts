import type { Channel, Message } from "amqplib";
import Notification from "../database/models/notification";
import { logger } from "../utils/logger";

const QUEUE_NAME = "notification_queue";
const NOTIFICATION_RETENTION_DAYS = 30;

export const startNotificationWorker = async (
	channel: Channel,
): Promise<void> => {
	try {
		await channel.assertQueue(QUEUE_NAME, { durable: true });
		logger.info(`Notification worker waiting for messages in ${QUEUE_NAME}`);

		channel.consume(QUEUE_NAME, async (msg: Message | null) => {
			if (!msg) return;

			try {
				const notificationData = JSON.parse(msg.content.toString());
				logger.info(
					`Processing notification for user: ${notificationData.userId}`,
				);

				if (notificationData.save) {
					await Notification.create(notificationData);
				}

				channel.ack(msg);
			} catch (error) {
				logger.error("Error processing notification message:", error);
				channel.nack(msg, false, false);
			}
		});

		startCleanupTask();
	} catch (error) {
		logger.error("Error starting notification worker:", error);
	}
};

const startCleanupTask = () => {
	logger.info("Starting notification cleanup task...");

	deleteOldNotifications();

	setInterval(
		() => {
			deleteOldNotifications();
		},
		24 * 60 * 60 * 1000,
	);
};

const deleteOldNotifications = async () => {
	try {
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - NOTIFICATION_RETENTION_DAYS);

		const result = await Notification.deleteMany({
			createdAt: { $lt: cutoffDate },
		});

		logger.info(
			`Cleanup: Deleted ${result.deletedCount} old notifications created before ${cutoffDate.toISOString()}`,
		);
	} catch (error) {
		logger.error("Error deleting old notifications:", error);
	}
};
