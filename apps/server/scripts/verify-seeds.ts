import mongoose from "mongoose";
import ENV from "../src/config/env.js";
import Feedback from "../src/database/models/feedback.js";
import Project from "../src/database/models/project.js";
import User from "../src/database/models/user.js";
import { logger } from "../src/utils/logger.js";

const verifySeeds = async () => {
	if (ENV.nodeEnv !== "development") {
		logger.info(
			"Skipping database verification in non-development environment",
		);
		return;
	}

	try {
		await mongoose.connect(ENV.mongoUri);
		logger.info("Connected to MongoDB for verification");

		const userCount = await User.countDocuments();
		logger.info(`User count: ${userCount}`);

		const superUser = await User.findOne({ email: "admin@betalift.com" });
		if (superUser) {
			logger.info("Super user found");
			logger.info(`Super User ID: ${superUser._id}`);
		} else {
			logger.error("Super user NOT found");
		}

		const projectCount = await Project.countDocuments();
		logger.info(`Project count: ${projectCount}`);

		const superUserProjects = await Project.countDocuments({
			ownerId: superUser?._id,
		});
		logger.info(`Projects owned by Super User: ${superUserProjects}`);

		const feedbackCount = await Feedback.countDocuments();
		logger.info(`Feedback count: ${feedbackCount}`);

		logger.info("Verification completed.");
		process.exit(0);
	} catch (error) {
		logger.error("Error verifying seeds:", error);
		process.exit(1);
	}
};

verifySeeds();
