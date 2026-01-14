import dotenv from "dotenv";

dotenv.config();

const ENV = {
	nodeEnv: process.env.NODE_ENV || "development",

	// Database
	mongoUri: process.env.MONGODB_URI || "",
	mongoUriTest: process.env.MONGODB_URI_TEST || "",

	// RabbitMQ
	rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://localhost",

	// Email
	smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
	smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
	smtpSecure: process.env.SMTP_SECURE === "true",
	smtpUser: process.env.SMTP_USER || "",
	smtpPassword: process.env.SMTP_PASSWORD || "",
	emailFrom: process.env.EMAIL_FROM || "",

	// Client
	clientUrl: process.env.CLIENT_URL || "http://localhost:8081",
	serverUrl: process.env.SERVER_URL || "http://localhost:5000",
};

export const RABBITMQ_CONFIG = {
	rabbitmqUrl: ENV.rabbitmqUrl,
	queues: {
		email: "email_queue",
		notification: "notification_queue",
	},
};

export default ENV;
