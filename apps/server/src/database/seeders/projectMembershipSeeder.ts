import type { IProject } from "../models/project.js";
import ProjectMembership from "../models/projectMembership.js";
import type { IUser } from "../models/user.js";

export const seedProjectMemberships = async (
	users: IUser[],
	projects: IProject[],
) => {
	const createdMemberships = [];

	for (const project of projects) {
		const potentialTesters = users.filter(
			(u) => u._id.toString() !== project.ownerId.toString(),
		);

		const numberOfTesters = Math.floor(Math.random() * 4) + 2;
		const selectedTesters = potentialTesters
			.sort(() => 0.5 - Math.random())
			.slice(0, numberOfTesters);

		for (const tester of selectedTesters) {
			const existing = await ProjectMembership.findOne({
				projectId: project._id,
				userId: tester._id,
			});

			if (!existing) {
				const membership = await ProjectMembership.create({
					projectId: project._id,
					userId: tester._id,

					status: Math.random() > 0.2 ? "approved" : "pending",
					joinedAt: new Date(),
				});
				createdMemberships.push(membership);
			}
		}
	}

	return createdMemberships;
};
