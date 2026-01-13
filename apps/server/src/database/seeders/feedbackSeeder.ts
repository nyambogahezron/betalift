import Feedback from "../models/feedback.js";
import FeedbackComment from "../models/feedbackComment.js";
import FeedbackVote from "../models/feedbackVote.js";
import type { IProject } from "../models/project.js";
import type { IUser } from "../models/user.js";

export const seedFeedback = async (users: IUser[], projects: IProject[]) => {
	// Find super user
	const superUser = users.find((u) => u.email === "admin@betalift.com");

	const feedbackItems = [
		{
			projectId: projects[0]?._id,
			userId: users[1]?._id,
			title: "App crashes when uploading workout photos",
			description:
				"Whenever I try to upload photos of my workouts, the app crashes immediately. This happens every time on my device.",
			type: "bug",
			category: "functionality",
			status: "open",
			priority: "high",
			deviceInfo: {
				os: "iOS",
				osVersion: "17.2",
				appVersion: "1.0.0",
				deviceModel: "iPhone 13 Pro",
			},
			screenshots: ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80"],
		},
		{
			projectId: projects[0]?._id,
			userId: users[3]?._id,
			title: "Add dark mode support",
			description:
				"It would be great to have a dark mode option for late-night workout logging",
			type: "feature",
			category: "ui-ux",
			status: "open",
			priority: "medium",
			deviceInfo: {
				os: "Android",
				osVersion: "14",
				appVersion: "1.0.0",
				deviceModel: "Google Pixel 7",
			},
		},
		{
			projectId: projects[0]?._id,
			userId: superUser?._id, // Super user feedback
			title: "Typo in the settings menu",
			description: "The word 'notification' is spelled wrong in the settings > alerts section.",
			type: "bug",
			category: "ui-ux",
			status: "resolved",
			priority: "low",
			deviceInfo: {
				os: "iOS",
				osVersion: "17.4",
				appVersion: "1.0.2",
				deviceModel: "iPhone 15 Pro",
			},
		},
		{
			projectId: projects[1]?._id,
			userId: users[0]?._id,
			title: "Calendar view not showing all tasks",
			description:
				"Some tasks are not appearing in the calendar view even though they have due dates set",
			type: "bug",
			category: "functionality",
			status: "in-progress",
			priority: "high",
			deviceInfo: {
				os: "Web",
				browser: "Chrome",
				browserVersion: "120.0",
			},
		},
		{
			projectId: projects[1]?._id,
			userId: users[1]?._id,
			title: "Amazing AI prioritization feature!",
			description:
				"The AI task prioritization is incredibly accurate and has really helped me stay organized",
			type: "improvement",
			category: "feedback",
			status: "resolved",
			priority: "low",
			deviceInfo: {
				os: "iOS",
				osVersion: "17.1",
				appVersion: "1.1.0",
				deviceModel: "iPhone 14",
			},
		},
		{
			projectId: projects[2]?._id,
			userId: users[1]?._id,
			title: "Photo upload takes too long",
			description:
				"Uploading high-res photos takes several minutes. Need better compression or background upload",
			type: "bug",
			category: "performance",
			status: "open",
			priority: "high",
			deviceInfo: {
				os: "Android",
				osVersion: "13",
				appVersion: "1.0.0",
				deviceModel: "Samsung Galaxy S23",
			},
		},
		{
			projectId: projects[3]?._id, // CryptoTracker
			userId: superUser?._id,
			title: "Add support for Solana",
			description: "Please add support for tracking Solana wallets.",
			type: "feature",
			category: "functionality",
			status: "open",
			priority: "medium",
			deviceInfo: {
				os: "Web",
				browser: "Firefox",
				browserVersion: "121.0",
			}
		},
		{
			projectId: projects[2]?._id, // PhotoShare
			userId: users[2]?._id,
			title: "Filters not applying correctly",
			description: "When I apply the 'Vintage' filter, it just turns the image black.",
			type: "bug",
			category: "functionality",
			status: "open",
			priority: "medium",
			deviceInfo: {
				os: "iOS",
				osVersion: "16.5",
				appVersion: "1.0.1",
				deviceModel: "iPad Air",
			}
		}
	];

	const createdFeedback = [];
	for (const feedbackData of feedbackItems) {
		const feedback = await Feedback.create(feedbackData);

		// Add some comments
		const commenters = users
			.filter((u) => u._id.toString() !== feedbackData.userId?.toString())
			.slice(0, 2);

		for (const commenter of commenters) {
			await FeedbackComment.create({
				feedbackId: feedback._id,
				userId: commenter._id,
				content: "Thanks for reporting this! We're looking into it.",
			});
		}

		// Add some votes
		const voters = users.slice(0, 3);
		for (const voter of voters) {
			await FeedbackVote.create({
				feedbackId: feedback._id,
				userId: voter._id,
				type: Math.random() > 0.3 ? "up" : "down",
			});
		}

		createdFeedback.push(feedback);
	}

	return createdFeedback;
};
