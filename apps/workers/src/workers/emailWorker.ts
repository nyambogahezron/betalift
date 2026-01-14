import type { Channel, Message } from "amqplib";
import { type EmailOptions, sendEmail } from "../services/emailService";
import { logger } from "../utils/logger";

const QUEUE_NAME = "email_queue";

export const startEmailWorker = async (channel: Channel): Promise<void> => {
	try {
		await channel.assertQueue(QUEUE_NAME, { durable: true });
		logger.info(`Email worker waiting for messages in ${QUEUE_NAME}`);

		channel.consume(QUEUE_NAME, async (msg: Message | null) => {
			if (!msg) return;

			try {
				const emailData: EmailOptions = JSON.parse(msg.content.toString());
				logger.info(`Processing email for: ${emailData.to}`);

				await sendEmail(emailData);

				channel.ack(msg);
				logger.info("Email processed successfully");
			} catch (error) {
				logger.error("Error processing email message:", error);
				// Depending on the error, we might want to nack(requeue=false) or nack(requeue=true)
				// For now, let's reject and not requeue to avoid infinite loops on bad data
				channel.nack(msg, false, false);
			}
		});
	} catch (error) {
		logger.error("Error starting email worker:", error);
	}
};
