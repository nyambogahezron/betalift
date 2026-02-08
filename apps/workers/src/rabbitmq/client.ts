import amqplib, { type Channel, type ChannelModel } from "amqplib";
import { RABBITMQ_CONFIG } from "../config/env";
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

	public async connect(): Promise<ChannelModel | null> {
		if (this.isConnected && this.connection) return this.connection;

		try {
			logger.info("Connecting to RabbitMQ...");
			const connection = await amqplib.connect(RABBITMQ_CONFIG.rabbitmqUrl);
			this.connection = connection;
			this.channel = await connection.createChannel();
			this.isConnected = true;

			logger.info("Connected to RabbitMQ");

			connection.on("error", (err: Error) => {
				logger.error("RabbitMQ Connection Error:", err);
				this.isConnected = false;
				this.reconnect();
			});

			connection.on("close", () => {
				logger.warn("RabbitMQ Connection Closed");
				this.isConnected = false;
				this.reconnect();
			});

			return connection;
		} catch (error) {
			logger.error("Failed to connect to RabbitMQ:", error);
			this.isConnected = false;
			setTimeout(() => this.connect(), 5000);
			return null;
		}
	}

	private async reconnect(): Promise<void> {
		this.connection = null;
		this.channel = null;
		setTimeout(() => this.connect(), 5000);
	}

	public getChannel(): Channel | null {
		return this.channel;
	}

	public async close(): Promise<void> {
		if (this.connection) {
			await this.connection.close();
		}
	}
}

export default RabbitMQClient.getInstance();
