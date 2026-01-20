import fs from "node:fs";
import path from "node:path";
import {
	getPasswordResetEmail,
	getVerifyEmail,
	getWelcomeEmail,
} from "../src/templates/emails";
import ENV from "../src/config/env";
import { logger } from "../src/utils/logger";

if (ENV.nodeEnv !== "development") {
	logger.info("Skipping email preview generation in non-development environment");
	process.exit(0);
}

const outputDir = path.join(process.cwd(), "public/email-previews");

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir);
}

const previewData = [
	{
		name: "welcome.html",
		content: getWelcomeEmail(
			"TestUser",
			"123",
			"https://betalift.com/verify-email?token=123",
		),
	},
	{
		name: "verify.html",
		content: getVerifyEmail("TestUser", "123", "https://betalift.com/verify-email?token=123"),
	},
	{
		name: "reset-password.html",
		content: getPasswordResetEmail(
			"TestUser",
			"123",
			"https://betalift.com/reset-password?token=123",
		),
	},
];

for (const item of previewData) {
	fs.writeFileSync(path.join(outputDir, item.name), item.content);
	console.log(`Generated: ${item.name}`);
}
