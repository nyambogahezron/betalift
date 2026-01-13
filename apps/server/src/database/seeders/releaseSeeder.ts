import Release from "../models/release.js";
import type { IProject } from "../models/project.js";

export const seedReleases = async (projects: IProject[]) => {
	const createdReleases = [];

	for (const project of projects) {
		// Existing project seed might create some releases.
		// We will add more releases here if needed, or rely on projectSeeder if it's already doing it.
		// The existing projectSeeder.ts creates releases inline.
		// However, the plan was to have a separate seeder.
		// Let's create NEW releases for projects that might not have them, or add more history.
		
		// Let's verify if the project already has releases.
		const existingReleases = await Release.countDocuments({ projectId: project._id });
		
		if (existingReleases === 0) {
			// Create initial alpha/beta releases
			const releases = [
				{
					projectId: project._id,
					version: "0.1.0",
					title: "Alpha Release",
					description: "Initial alpha release for internal testing",
					type: "alpha",
					status: "archived",
					publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
				},
				{
					projectId: project._id,
					version: "0.5.0",
					title: "Beta Release",
					description: "First public beta",
					type: "beta",
					status: "published",
					publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
				}
			];

			for (const releaseData of releases) {
				const release = await Release.create(releaseData);
				createdReleases.push(release);
			}
		} else {
             // Add a new "upcoming" draft release
             const release = await Release.create({
                 projectId: project._id,
                 version: "2.0.0-draft",
                 title: "Upcoming Major Release",
                 description: "Draft for the next major version",
                 type: "major",
                 status: "draft",
             });
             createdReleases.push(release);
        }
	}

	return createdReleases;
};
