import Feedback, { type IFeedback } from "../models/feedback.js";
import FeedbackComment from "../models/feedbackComment.js";
import FeedbackVote from "../models/feedbackVote.js";
import type { IProject } from "../models/project.js";
import type { IUser } from "../models/user.js";

export const seedFeedback = async (users: IUser[], projects: IProject[]) => {
	// Find super user
	const superUser = users.find((u) => u.email === "admin@betalift.com");

	const feedbackItems: Partial<IFeedback>[] = [
		{
			projectId: projects[0]?._id,
			userId: users[1]?._id,
			title: "App crashes when uploading workout photos",
			description:
				"Whenever I try to upload photos of my workouts, the app crashes immediately. This happens every time on my device.",
			type: "bug",
			status: "open",
			priority: "high",
			deviceInfo: {
				os: "iOS",
				osVersion: "17.2",
				appVersion: "1.0.0",
				deviceModel: "iPhone 13 Pro",
			},
			screenshots: [
				"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80",
			],
		},
		{
			projectId: projects[0]?._id,
			userId: users[3]?._id,
			title: "Add dark mode support",
			description:
				"It would be great to have a dark mode option for late-night workout logging",
			type: "feature",
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
			description:
				"The word 'notification' is spelled wrong in the settings > alerts section.",
			type: "bug",
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
			status: "in-progress",
			priority: "high",
			deviceInfo: {
				os: "Web",
			},
		},
		{
			projectId: projects[1]?._id,
			userId: users[1]?._id,
			title: "Amazing AI prioritization feature!",
			description:
				"The AI task prioritization is incredibly accurate and has really helped me stay organized",
			type: "improvement",
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
			status: "open",
			priority: "medium",
			deviceInfo: {
				os: "Web",
			},
		},
		{
			projectId: projects[2]?._id, // PhotoShare
			userId: users[2]?._id,
			title: "Filters not applying correctly",
			description:
				"When I apply the 'Vintage' filter, it just turns the image black.",
			type: "bug",
			status: "open",
			priority: "medium",
			deviceInfo: {
				os: "iOS",
				osVersion: "16.5",
				appVersion: "1.0.1",
				deviceModel: "iPad Air",
			},
		},
		{
			projectId: projects.find((p) => p.name === "TaskFlow Pro")?._id,
			userId: users.find((u) => u.email === "mike@example.com")?._id, // u2 aka miketester
			title: "App crashes when adding task with long title",
			description:
				'When I try to create a task with a title longer than 100 characters, the app crashes immediately. This happens consistently on both iOS and Android.\n\nSteps to reproduce:\n1. Open the app\n2. Click "Add Task"\n3. Enter a very long title (100+ characters)\n4. Click Save\n\nExpected: Task should be created or show error\nActual: App crashes',
			type: "bug",
			priority: "high",
			status: "open",
			upvotes: 12,
			deviceInfo: {
				platform: "ios" as const,
				osVersion: "17.2",
				deviceModel: "iPhone 15 Pro",
				appVersion: "1.2.3",
			},
			screenshots: [
				"https://picsum.photos/seed/bug1/400/800",
				"https://picsum.photos/seed/bug2/400/800",
			],
		},
		{
			projectId: projects.find((p) => p.name === "TaskFlow Pro")?._id,
			userId: users.find((u) => u.email === "lisa@example.com")?._id, // u5 aka lisaqa
			title: "Add dark mode support",
			description:
				"It would be great to have a dark mode option. The current light theme is a bit harsh on the eyes when using the app at night. Many modern apps support this feature and it would greatly improve the user experience.",
			type: "feature",
			priority: "medium",
			status: "in-progress",
			upvotes: 45,
			deviceInfo: {
				platform: "android" as const,
				osVersion: "14",
				deviceModel: "Pixel 8",
				appVersion: "1.2.3",
			},
		},
		{
			projectId: projects.find((p) => p.name === "TaskFlow Pro")?._id,
			userId: users.find((u) => u.email === "sarah@example.com")?._id, // u1 aka sarahdev
			title: "Love the new AI prioritization feature!",
			description:
				"The AI prioritization feature is amazing! It correctly identified my most urgent tasks and helped me focus on what matters. The suggestions are spot on and have improved my productivity significantly. Great work!",
			type: "praise",
			priority: "low",
			status: "resolved",
			upvotes: 28,
			screenshots: ["https://picsum.photos/seed/praise1/400/800"],
		},
		{
			projectId: projects.find((p) => p.name === "TaskFlow Pro")?._id,
			userId: users.find((u) => u.email === "nina@example.com")?._id, // u7 aka ninatech
			title: "Data loss after app update",
			description:
				"After updating to version 1.2.3, all my tasks disappeared. I had over 50 tasks organized in different categories. This is a critical issue as I lost weeks of work.",
			type: "bug",
			priority: "critical",
			status: "resolved",
			upvotes: 67,
			deviceInfo: {
				platform: "ios" as const,
				osVersion: "17.1",
				deviceModel: "iPhone 14",
				appVersion: "1.2.3",
			},
		},
		{
			projectId: projects.find((p) => p.name === "TaskFlow Pro")?._id,
			userId: users.find((u) => u.email === "david@example.com")?._id, // u8 aka davidux
			title: "Widget for home screen",
			description:
				"A home screen widget showing upcoming tasks would be very useful. It would allow quick glance at tasks without opening the app.",
			type: "feature",
			priority: "low",
			status: "open",
			upvotes: 23,
			deviceInfo: {
				platform: "ios" as const,
				osVersion: "17.2",
				deviceModel: "iPhone 15",
				appVersion: "1.2.3",
			},
		},
		{
			projectId: projects.find((p) => p.name === "FitTrack")?._id,
			userId: users.find((u) => u.email === "mike@example.com")?._id, // u2
			title: "Workout timer stops when screen locks",
			description:
				"The workout timer stops counting when the screen auto-locks. This makes it impossible to track rest periods without keeping the screen on.",
			type: "bug",
			priority: "medium",
			status: "in-progress",
			upvotes: 34,
			screenshots: ["https://picsum.photos/seed/fit1/400/800"],
			deviceInfo: {
				platform: "android" as const,
				osVersion: "14",
				deviceModel: "Samsung S24",
				appVersion: "2.1.0",
			},
		},
		{
			projectId: projects.find((p) => p.name === "FitTrack")?._id,
			userId: users.find((u) => u.email === "rachel@example.com")?._id, // u9 aka rachelcodes
			title: "Apple Watch integration",
			description:
				"Please add Apple Watch support! Would love to track workouts directly from my watch and have it sync with the app.",
			type: "feature",
			priority: "high",
			status: "open",
			upvotes: 89,
			deviceInfo: {
				platform: "ios" as const,
				osVersion: "17.2",
				deviceModel: "iPhone 15 Pro Max",
				appVersion: "2.1.0",
			},
		},
		{
			projectId: projects.find((p) => p.name === "BudgetBuddy")?._id,
			userId: users.find((u) => u.email === "lisa@example.com")?._id, // u5
			title: "Charts not rendering on older devices",
			description:
				"The expense charts fail to render on older Android devices (Android 9 and below). Just shows a blank space where the chart should be.",
			type: "bug",
			priority: "high",
			status: "open",
			upvotes: 15,
			screenshots: ["https://picsum.photos/seed/budget1/400/800"],
			deviceInfo: {
				platform: "android" as const,
				osVersion: "9",
				deviceModel: "Samsung A50",
				appVersion: "1.5.0",
			},
		},
		{
			projectId: projects.find((p) => p.name === "BudgetBuddy")?._id,
			userId: users.find((u) => u.email === "emma@example.com")?._id, // u3
			title: "Beautiful UI design!",
			description:
				"Just wanted to say the app looks absolutely gorgeous. The color scheme, typography, and overall layout are top-notch. Really enjoyable to use!",
			type: "praise",
			priority: "low",
			status: "resolved",
			upvotes: 42,
			screenshots: ["https://picsum.photos/seed/budget2/400/800"],
		},
		{
			projectId: projects.find((p) => p.name === "PhotoEdit AI")?._id,
			userId: users.find((u) => u.email === "tom@example.com")?._id, // u10 aka tomandroid
			title: "Batch processing for multiple photos",
			description:
				"Would be great to apply the same edits to multiple photos at once. Useful for editing a series of photos from the same shoot.",
			type: "feature",
			priority: "medium",
			status: "open",
			upvotes: 56,
			deviceInfo: {
				platform: "ios" as const,
				osVersion: "17.1",
				deviceModel: "iPad Pro",
				appVersion: "3.0.0",
			},
		},
	];

	const createdFeedback: any[] = [];
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
				feedbackId: feedback.id,
				userId: voter._id,
				type: Math.random() > 0.3 ? "up" : "down",
			});
		}

		createdFeedback.push(feedback);
	}

	return createdFeedback;
};
