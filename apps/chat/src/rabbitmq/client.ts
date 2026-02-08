import { type Channel, type ChannelModel, connect } from "amqplib";
import { RABBITMQ_CONFIG } from "../config/rabbitmq";
import { logger } from '@repo/logger'

class RabbitMQClient {
	private connection: ChannelModel | null = null;
	private channel: Channel | null = null;
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
			const connection = await connect(RABBITMQ_CONFIG.url);
			this.connection = connection;
			this.channel = await connection.createChannel();
			this.isConnected = true;

			logger.info("Connected to RabbitMQ");

			// Ensure queues exist
			if (this.channel) {
				await this.channel.assertQueue(RABBITMQ_CONFIG.queues.notification, {
					durable: true,
				});
				await this.channel.assertQueue(RABBITMQ_CONFIG.queues.email, {
					durable: true,
				});
			}

			if (this.connection) {
				this.connection.on("error", (err: Error) => {
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

	public async publishNotification(data: unknown): Promise<boolean> {
		if (!this.channel) {
			logger.error("RabbitMQ channel not available");
			return false;
		}

		try {
			return this.channel.sendToQueue(
				RABBITMQ_CONFIG.queues.notification,
				Buffer.from(JSON.stringify(data)),
				{ persistent: true },
			);
		} catch (error) {
			logger.error("Error publishing to notification queue:", error);
			return false;
		}
	}
}

export default RabbitMQClient.getInstance();
