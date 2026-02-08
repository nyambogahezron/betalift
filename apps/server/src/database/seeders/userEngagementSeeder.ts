import type { IUser } from "../models/user";
import UserEngagement from "../models/userEngagement";

export const seedUserEngagement = async (users: IUser[]) => {
	const updatedEngagements = [];

	const interestsList = [
		"Mobile",
		"Web",
		"AI",
		"Gaming",
		"Productivity",
		"Social",
		"Health",
		"Finance",
		"Education",
	];
	const skillsList = [
		"QA",
		"UI/UX",
		"Frontend",
		"Backend",
		"Security",
		"Performance",
		"Accessibility",
	];

	const mockEngagements: Record<string, any> = {
		"demo@betalift.com": {
			availability: {
				status: "available",
				hoursPerWeek: 15,
				timezone: "America/Los_Angeles",
				preferredContactMethod: "in-app",
			},
			interests: [
				"Mobile Apps",
				"AI/ML",
				"Developer Tools",
				"Productivity",
				"Gaming",
				"Finance",
			],
			skills: [
				"React Native",
				"TypeScript",
				"Node.js",
				"Swift",
				"Kotlin",
				"Firebase",
			],
			testingExperience: "expert",
		},
		"sarah@example.com": {
			availability: {
				status: "available",
				hoursPerWeek: 10,
				timezone: "America/New_York",
				preferredContactMethod: "in-app",
			},
			interests: ["Mobile Apps", "AI/ML", "Developer Tools", "Productivity"],
			skills: ["React Native", "TypeScript", "iOS", "UI/UX Design"],
			testingExperience: "expert",
		},
		"mike@example.com": {
			availability: {
				status: "available",
				hoursPerWeek: 20,
				timezone: "America/Chicago",
				preferredContactMethod: "email",
			},
			interests: ["QA Testing", "Accessibility", "Performance", "Security"],
			skills: ["Manual Testing", "Automation", "Selenium", "Appium"],
			testingExperience: "expert",
		},
		"emma@example.com": {
			availability: {
				status: "busy",
				hoursPerWeek: 5,
				timezone: "Europe/London",
				preferredContactMethod: "in-app",
			},
			interests: [
				"UI Design",
				"UX Research",
				"Design Systems",
				"Accessibility",
			],
			skills: ["Figma", "Sketch", "Adobe XD", "CSS", "React"],
			testingExperience: "intermediate",
		},
		"alex@example.com": {
			availability: {
				status: "away",
				hoursPerWeek: 8,
				timezone: "America/Denver",
				preferredContactMethod: "in-app",
			},
			interests: ["Full-Stack", "Cloud", "DevOps", "APIs"],
			skills: ["Node.js", "Python", "AWS", "Docker", "GraphQL"],
			testingExperience: "intermediate",
		},
		"lisa@example.com": {
			availability: {
				status: "available",
				hoursPerWeek: 25,
				timezone: "Asia/Tokyo",
				preferredContactMethod: "in-app",
			},
			interests: [
				"Security Testing",
				"Edge Cases",
				"Performance",
				"Localization",
			],
			skills: [
				"Penetration Testing",
				"Load Testing",
				"API Testing",
				"Mobile Testing",
			],
			testingExperience: "expert",
		},
	};

	for (const user of users) {
		const engagement = await UserEngagement.findOne({ userId: user._id });

		if (engagement) {
			if (user.email && mockEngagements[user.email]) {
				const data = mockEngagements[user.email];
				engagement.interests = data.interests;
				engagement.skills = data.skills;
				engagement.testingExperience = data.testingExperience;
				engagement.availability = data.availability;
			} else {
				engagement.interests = interestsList
					.sort(() => 0.5 - Math.random())
					.slice(0, 3);
				engagement.skills = skillsList
					.sort(() => 0.5 - Math.random())
					.slice(0, 3);
				engagement.testingExperience = (
					["beginner", "intermediate", "expert"] as const
				)[Math.floor(Math.random() * 3)] as
					| "beginner"
					| "intermediate"
					| "expert";
				const toStatus = (["available", "busy", "away"] as const)[
					Math.floor(Math.random() * 3)
				] as "available" | "busy" | "away";
				engagement.availability = {
					status: toStatus,
					hoursPerWeek: Math.floor(Math.random() * 20) + 5,
					timezone: "UTC",
					preferredContactMethod: (["in-app", "email"] as const)[
						Math.floor(Math.random() * 2)
					] as "in-app" | "email",
				};
			}

			await engagement.save();
			updatedEngagements.push(engagement);
		} else {
			let newEngagementData: any = {
				userId: user._id,
				lastActiveAt: new Date(),
			};

			if (user.email && mockEngagements[user.email]) {
				const data = mockEngagements[user.email];
				newEngagementData = { ...newEngagementData, ...data };
			} else {
				newEngagementData = {
					...newEngagementData,
					interests: interestsList.sort(() => 0.5 - Math.random()).slice(0, 3),
					skills: skillsList.sort(() => 0.5 - Math.random()).slice(0, 3),
					testingExperience: (["beginner", "intermediate", "expert"] as const)[
						Math.floor(Math.random() * 3)
					],
				};
			}

			const newEngagement = await UserEngagement.create(newEngagementData);
			updatedEngagements.push(newEngagement);
		}
	}

	return updatedEngagements;
};
