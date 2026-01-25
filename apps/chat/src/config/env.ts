import dotenv from "dotenv";

dotenv.config();

const ENV = {
	DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/chatdb",
	CORS_ORIGIN: process.env.CORS_ORIGIN,
	PORT: process.env.PORT,
	JWT_SECRET: process.env.JWT_SECRET,
	RABBITMQ_URL: process.env.RABBITMQ_URL,
	NODE_ENV: process.env.NODE_ENV || "development",
};

export default ENV;
