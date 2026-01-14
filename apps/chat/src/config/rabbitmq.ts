import ENV from "./env";

export const RABBITMQ_CONFIG = {
	url: ENV.RABBITMQ_URL || "amqp://localhost",
	queues: {
		notification: "notification_queue",
		email: "email_queue",
	},
};
