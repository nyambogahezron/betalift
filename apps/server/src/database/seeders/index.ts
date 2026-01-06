import mongoose from "mongoose";
import ENV from "../../config/env.js";
import { logger } from "../../utils/logger.js";
import { seedFeedback } from "./feedbackSeeder.js";
import { seedProjects } from "./projectSeeder.js";
import { seedUsers } from "./userSeeder.js";

const seedDatabase = async () => {
	try {
		await mongoose.connect(ENV.mongoUri);
		logger.info("Connected to MongoDB");

		logger.info("Clearing existing data...");
		await mongoose.connection.db?.dropDatabase();
		logger.info("Database cleared");

		logger.info("Starting database seeding...");

		const users = await seedUsers();
		logger.info(`Seeded ${users.length} users`);

		const projects = await seedProjects(users);
		logger.info(`Seeded ${projects.length} projects`);

		const feedback = await seedFeedback(users, projects);
		logger.info(`Seeded ${feedback.length} feedback items`);

		logger.info("Database seeding completed successfully!");
		process.exit(0);
	} catch (error) {
		logger.error("Error seeding database:", error);
		process.exit(1);
	}
};

seedDatabase();
