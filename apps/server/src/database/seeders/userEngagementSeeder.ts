import UserEngagement from "../models/userEngagement.js";
import type { IUser } from "../models/user.js";

export const seedUserEngagement = async (users: IUser[]) => {
	const updatedEngagements = [];

	const interestsList = ["Mobile", "Web", "AI", "Gaming", "Productivity", "Social", "Health", "Finance", "Education"];
	const skillsList = ["QA", "UI/UX", "Frontend", "Backend", "Security", "Performance", "Accessibility"];

	for (const user of users) {
		const engagement = await UserEngagement.findOne({ userId: user._id });
		
		if (engagement) {
			// Update existing engagement with more realistic data
			engagement.interests = interestsList.sort(() => 0.5 - Math.random()).slice(0, 3);
			engagement.skills = skillsList.sort(() => 0.5 - Math.random()).slice(0, 3);
			engagement.testingExperience = (["beginner", "intermediate", "expert"] as const)[Math.floor(Math.random() * 3)];
			engagement.availability = {
				status: (["available", "busy", "away"] as const)[Math.floor(Math.random() * 3)],
				hoursPerWeek: Math.floor(Math.random() * 20) + 5,
				timezone: "UTC",
				preferredContactMethod: (["in-app", "email"] as const)[Math.floor(Math.random() * 2)],
			};
			
			await engagement.save();
			updatedEngagements.push(engagement);
		} else {
            // Should be created by userSeeder, but just in case
            const newEngagement = await UserEngagement.create({
                userId: user._id,
                interests: interestsList.sort(() => 0.5 - Math.random()).slice(0, 3),
                skills: skillsList.sort(() => 0.5 - Math.random()).slice(0, 3),
                testingExperience: (["beginner", "intermediate", "expert"] as const)[Math.floor(Math.random() * 3)],
                lastActiveAt: new Date(),
            });
            updatedEngagements.push(newEngagement);
        }
	}

	return updatedEngagements;
};
