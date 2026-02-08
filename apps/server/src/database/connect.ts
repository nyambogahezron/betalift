import mongoose from "mongoose";
import ENV from "../config/env";
import logger from '@repo/logger'

export const connectDatabase = async (): Promise<void> => {
	try {
		const mongoUri = ENV.nodeEnv === "test" ? ENV.mongoUriTest : ENV.mongoUri;

		await mongoose.connect(mongoUri);

		logger.info(`MongoDB connected successfully to ${ENV.nodeEnv} database`);

		mongoose.connection.on("error", (error) => {
			logger.error("MongoDB connection error:", error);
		});

		mongoose.connection.on("disconnected", () => {
			logger.warn("MongoDB disconnected");
		});
	} catch (error) {
		logger.error("Failed to connect to MongoDB:", error);
		logger.error(
			"MongoDB Connection Failed\n" +
				"Please ensure MongoDB is running:\n" +
				"  • Start MongoDB: sudo systemctl start mongod\n" +
				"  • Or use Docker: docker run -d -p 27017:27017 mongo\n" +
				"  • Check MongoDB status: sudo systemctl status mongod\n",
		);
		process.exit(1);
	}
};

export const disconnectDatabase = async (): Promise<void> => {
	try {
		await mongoose.disconnect();
		logger.info("MongoDB disconnected");
	} catch (error) {
		logger.error("Error disconnecting from MongoDB:", error);
	}
};
