import mongoose from "mongoose";
import ENV from "../src/config/env.js";
import { logger } from "../src/utils/logger.js";
import { seedFeedback } from "../src/database/seeders/feedbackSeeder.js";
import { seedNotifications } from "../src/database/seeders/notificationSeeder.js";
import { seedProjectMemberships } from "../src/database/seeders/projectMembershipSeeder.js";
import { seedProjects } from "../src/database/seeders/projectSeeder.js";
import { seedReleases } from "../src/database/seeders/releaseSeeder.js";
import { seedUserEngagement } from "../src/database/seeders/userEngagementSeeder.js";
import { seedUsers } from "../src/database/seeders/userSeeder.js";
const seedDatabase = async () => {
    try {
        if (ENV.nodeEnv !== "development") {
            logger.info("Skipping database seeding in non-development environment");
            return;
        }
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
        const notifications = await seedNotifications(users);
        logger.info(`Seeded ${notifications.length} notifications`);
        logger.info("Database seeding completed successfully!");
        process.exit(0);
    }
    catch (error) {
        logger.error("Error seeding database:", error);
        process.exit(1);
    }
};
seedDatabase();
//# sourceMappingURL=seed.js.map