import mongoose from "mongoose";
import ENV from "../../config/env.js";
import { logger } from "../../utils/logger.js";
import { seedUsers } from "./userSeeder.js";
import { seedUserEngagement } from "./userEngagementSeeder.js";
import { seedProjects } from "./projectSeeder.js";
import { seedProjectMemberships } from "./projectMembershipSeeder.js";
import { seedReleases } from "./releaseSeeder.js";
import { seedFeedback } from "./feedbackSeeder.js";
import { seedConversations } from "./conversationSeeder.js";
import { seedMessages } from "./messageSeeder.js";
import { seedNotifications } from "./notificationSeeder.js";

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

		const engagements = await seedUserEngagement(users);
		logger.info(`Seeded/Updated ${engagements.length} user engagement profiles`);

		const projects = await seedProjects(users);
		logger.info(`Seeded ${projects.length} projects`);

		const memberships = await seedProjectMemberships(users, projects);
		logger.info(`Seeded ${memberships.length} project memberships`);

		const releases = await seedReleases(projects);
		logger.info(`Seeded ${releases.length} releases`);

		const feedback = await seedFeedback(users, projects);
		logger.info(`Seeded ${feedback.length} feedback items`);

		const conversations = await seedConversations(users);
		logger.info(`Seeded ${conversations.length} conversations`);

		const messages = await seedMessages(users, conversations);
		logger.info(`Seeded ${messages.length} messages`);

		const notifications = await seedNotifications(users);
		logger.info(`Seeded ${notifications.length} notifications`);

		logger.info("Database seeding completed successfully!");
		process.exit(0);
	} catch (error) {
		logger.error("Error seeding database:", error);
		process.exit(1);
	}
};

seedDatabase();
