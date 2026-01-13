import ProjectMembership from "../models/projectMembership.js";
import type { IProject } from "../models/project.js";
import type { IUser } from "../models/user.js";

export const seedProjectMemberships = async (
	users: IUser[],
	projects: IProject[],
) => {
	const createdMemberships = [];

	for (const project of projects) {
		// Owner is already added as a member in projectSeeder (we will move that logic here or check existence)
		// But based on the existing projectSeeder.ts, it was adding the owner.
		// We will assume projectSeeder handles the owner membership or we can ensure it here.
		// Let's create memberships for other users.

		// Add 2-5 random testers to each project
		const potentialTesters = users.filter(
			(u) => u._id.toString() !== project.ownerId.toString(),
		);

		const numberOfTesters = Math.floor(Math.random() * 4) + 2;
		const selectedTesters = potentialTesters
			.sort(() => 0.5 - Math.random())
			.slice(0, numberOfTesters);

		for (const tester of selectedTesters) {
			// Check if membership already exists (to prevent duplicates if run multiple times or overlapping logic)
			const existing = await ProjectMembership.findOne({
				projectId: project._id,
				userId: tester._id,
			});

			if (!existing) {
				const membership = await ProjectMembership.create({
					projectId: project._id,
					userId: tester._id,
					role: "tester",
					status: Math.random() > 0.2 ? "approved" : "pending", // 80% approved
					joinedAt: new Date(),
				});
				createdMemberships.push(membership);
			}
		}
	}

	return createdMemberships;
};
