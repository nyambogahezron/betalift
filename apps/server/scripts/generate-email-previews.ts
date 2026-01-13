import fs from "node:fs";
import path from "node:path";
import {
	getPasswordResetEmail,
	getVerifyEmail,
	getWelcomeEmail,
} from "../src/templates/emails";

const outputDir = path.join(process.cwd(), "email-previews");

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir);
}

const previewData = [
	{
		name: "welcome.html",
		content: getWelcomeEmail("TestUser", "https://betalift.com/verify-email?token=123"),
	},
	{
		name: "verify.html",
		content: getVerifyEmail("TestUser", "https://betalift.com/verify-email?token=123"),
	},
	{
		name: "reset-password.html",
		content: getPasswordResetEmail(
			"TestUser",
			"https://betalift.com/reset-password?token=123",
		),
	},
];

for (const item of previewData) {
	fs.writeFileSync(path.join(outputDir, item.name), item.content);
	console.log(`Generated: ${item.name}`);
}
