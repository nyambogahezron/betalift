import amqplib from "amqplib";
import { RABBITMQ_CONFIG } from "../config/rabbitmq";
import { logger } from "../utils/logger";

class RabbitMQClient {
	// biome-ignore lint/suspicious/noExplicitAny: External library typing mismatch
	private connection: any = null;
	// biome-ignore lint/suspicious/noExplicitAny: External library typing mismatch
	private channel: any = null;
	private static instance: RabbitMQClient;
	private isConnected = false;

	private constructor() {}

	public static getInstance(): RabbitMQClient {
		if (!RabbitMQClient.instance) {
			RabbitMQClient.instance = new RabbitMQClient();
		}
		return RabbitMQClient.instance;
	}

	public async connect(): Promise<void> {
		if (this.isConnected) return;

		try {
			logger.info("Connecting to RabbitMQ...");
			this.connection = await amqplib.connect(RABBITMQ_CONFIG.url);
			this.channel = await this.connection.createChannel();
			this.isConnected = true;

			logger.info("Connected to RabbitMQ");

			// Ensure queues exist
			if (this.channel) {
				await this.channel.assertQueue(RABBITMQ_CONFIG.queues.email, {
					durable: true,
				});
			}

			if (this.connection) {
				// biome-ignore lint/suspicious/noExplicitAny: Error object is unknown
				this.connection.on("error", (err: any) => {
					logger.error("RabbitMQ Connection Error:", err);
					this.isConnected = false;
					this.reconnect();
				});

				this.connection.on("close", () => {
					logger.warn("RabbitMQ Connection Closed");
					this.isConnected = false;
					this.reconnect();
				});
			}
		} catch (error) {
			logger.error("Failed to connect to RabbitMQ:", error);
			this.isConnected = false;
			setTimeout(() => this.connect(), 5000);
		}
	}

	private async reconnect(): Promise<void> {
		this.connection = null;
		this.channel = null;
		setTimeout(() => this.connect(), 5000);
	}

	// biome-ignore lint/suspicious/noExplicitAny: Payload type is flexible
	public async publishEmail(emailOptions: any): Promise<boolean> {
		if (!this.channel) {
			logger.error("RabbitMQ channel not available");
			return false;
		}

		try {
			return this.channel.sendToQueue(
				RABBITMQ_CONFIG.queues.email,
				Buffer.from(JSON.stringify(emailOptions)),
				{ persistent: true },
			);
		} catch (error) {
			logger.error("Error publishing to email queue:", error);
			return false;
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: Payload type is flexible
	public async publishNotification(notificationData: any): Promise<boolean> {
		if (!this.channel) {
			logger.error("RabbitMQ channel not available");
			return false;
		}

		try {
			return this.channel.sendToQueue(
				RABBITMQ_CONFIG.queues.notification,
				Buffer.from(JSON.stringify(notificationData)),
				{ persistent: true },
			);
		} catch (error) {
			logger.error("Error publishing to notification queue:", error);
			return false;
		}
	}
}

export default RabbitMQClient.getInstance();
