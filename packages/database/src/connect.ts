import mongoose from "mongoose";

export const connectDatabase = async (mongoUri: string): Promise<void> => {
	try {
		await mongoose.connect(mongoUri);
		console.log("MongoDB connected successfully");

		mongoose.connection.on("error", (error) => {
			console.error("MongoDB connection error:", error);
		});

		mongoose.connection.on("disconnected", () => {
			console.warn("MongoDB disconnected");
		});
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error);
		throw error;
	}
};

export const disconnectDatabase = async (): Promise<void> => {
	try {
		await mongoose.disconnect();
		console.log("MongoDB disconnected");
	} catch (error) {
		console.error("Error disconnecting from MongoDB:", error);
	}
};
