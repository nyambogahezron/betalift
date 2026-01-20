import { Expo, type ExpoPushMessage, type ExpoPushTicket } from "expo-server-sdk";
// Assuming we can use logger here similar to server, or console.
// Check logger in apps/workers/src/utils/logger
import { logger } from "../utils/logger";

class PushNotificationService {
	private expo: Expo;
	private static instance: PushNotificationService;

	private constructor() {
		this.expo = new Expo();
	}

	public static getInstance(): PushNotificationService {
		if (!PushNotificationService.instance) {
			PushNotificationService.instance = new PushNotificationService();
		}
		return PushNotificationService.instance;
	}

	/**
	 * Send push notifications to multiple tokens
	 * @param tokens Array of Expo push tokens
	 * @param title Notification title
	 * @param body Notification body
	 * @param data Optional data payload
	 */
	public async sendPush(
		tokens: string[],
		title: string,
		body: string,
		// biome-ignore lint/suspicious/noExplicitAny: Data can be anything
		data?: any,
	): Promise<void> {
		const messages: ExpoPushMessage[] = [];

		for (const token of tokens) {
			if (!Expo.isExpoPushToken(token)) {
				logger.warn(`Push token ${token} is not valid Expo push token`);
				continue;
			}

			messages.push({
				to: token,
				sound: "default",
				title,
				body,
				data,
			});
		}

		if (messages.length === 0) {
			return;
		}

		const chunks = this.expo.chunkPushNotifications(messages);
		const tickets: ExpoPushTicket[] = [];

		for (const chunk of chunks) {
			try {
				const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
				tickets.push(...ticketChunk);
			} catch (error) {
				logger.error("Error sending push notification chunk:", error);
			}
		}

		// Handle errors in tickets (optional but recommended)
		for (const ticket of tickets) {
			if (ticket.status === "error") {
				logger.error(`Error sending notification: ${ticket.message}`, ticket);
			}
		}
	}
}

export default PushNotificationService.getInstance();
