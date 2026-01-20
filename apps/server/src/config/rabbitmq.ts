import ENV from "./env";

export const RABBITMQ_CONFIG = {
	url: ENV.rabbitmqUrl,
	queues: {
		email: "email_queue",
		notification: "notification_queue",
	},
};
