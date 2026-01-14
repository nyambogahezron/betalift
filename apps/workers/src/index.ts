import { connectDatabase } from "./database/connect";
import RabbitMQClient from "./rabbitmq/client";
import { logger } from "./utils/logger";
import { startEmailWorker } from "./workers/emailWorker";
import { startNotificationWorker } from "./workers/notificationWorker";

const start = async () => {
	try {
		await connectDatabase();

		await RabbitMQClient.connect();

		const channel = RabbitMQClient.getChannel();

		if (channel) {
			logger.info("Starting workers service...");
			await startEmailWorker(channel);
			await startNotificationWorker(channel);

			logger.info("Workers started successfully");
		} else {
			logger.error("Failed to Initialize RabbitMQ Channel");
			process.exit(1);
		}
	} catch (error) {
		logger.error("Failed to start workers:", error);
		process.exit(1);
	}
};

start();

process.on("SIGTERM", async () => {
	logger.info("SIGTERM received. Shutting down...");
	await RabbitMQClient.close();
	process.exit(0);
});
