import Project from "../models/project.js";
import ProjectMembership from "../models/projectMembership.js";
import Release from "../models/release.js";
import type { IUser } from "../models/user.js";

export const seedProjects = async (users: IUser[]) => {
	// Find super user
	const superUser = users.find((u) => u.email === "admin@betalift.com") || users[0];

	const projects = [
		{
			name: "BetaLift Mobile",
			description:
				"The official mobile companion for BetaLift. Manage your beta tests on the go.",
			ownerId: superUser?._id,
			category: "Productivity",
			platform: ["iOS", "Android"],
			status: "active",
			visibility: "public",
			techStack: ["React Native", "TypeScript", "Redux"],
			links: {
				website: "https://betalift.com",
				repository: "https://github.com/betalift/mobile",
			},
			tags: ["betalift", "mobile", "official"],
			screenshots: [
				"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
				"https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80",
			],
			icon: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=150&q=80",
		},
		{
			name: "FitTrack Pro",
			description:
				"A comprehensive fitness tracking app with workout plans, nutrition tracking, and progress analytics",
			ownerId: users.find(u => u.username === "sarahj")?._id || users[1]?._id,
			category: "Health & Fitness",
			platform: ["iOS", "Android"],
			status: "active",
			visibility: "public",
			techStack: ["React Native", "Node.js", "PostgreSQL", "Redis"],
			links: {
				repository: "https://github.com/sarahj/fittrack-pro",
				testflight: "https://testflight.apple.com/join/fittrack",
			},
			tags: ["fitness", "health", "mobile"],
			screenshots: [
				"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
			],
			icon: "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=150&q=80",
		},
		{
			name: "TaskMaster",
			description:
				"Smart task management with AI-powered prioritization and team collaboration features",
			ownerId: superUser?._id, // Super user owns this too
			category: "Productivity",
			platform: ["Web", "iOS", "Android"],
			status: "active",
			visibility: "public",
			techStack: ["Vue.js", "Express", "MongoDB", "TensorFlow"],
			links: {
				repository: "https://github.com/emilyd/taskmaster",
				website: "https://taskmaster.app",
			},
			tags: ["productivity", "ai", "collaboration"],
			screenshots: [
				"https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80",
			],
			icon: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&w=150&q=80",
		},
		{
			name: "PhotoShare",
			description:
				"Privacy-focused photo sharing platform with end-to-end encryption",
			ownerId: users.find(u => u.username === "jessicam")?._id || users[4]?._id,
			category: "Social",
			platform: ["Web", "iOS", "Android"],
			status: "active",
			visibility: "public",
			techStack: ["React", "Firebase", "Flutter", "WebRTC"],
			links: {
				repository: "https://github.com/jessicam/photoshare",
				playstore: "https://play.google.com/store/apps/photoshare",
			},
			tags: ["social", "photos", "privacy", "encryption"],
			screenshots: [
				"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
			],
			icon: "https://images.unsplash.com/photo-1520607162513-77705e685728?auto=format&fit=crop&w=150&q=80",
		},
		{
			name: "CryptoTracker",
			description: "Real-time cryptocurrency portfolio tracker and news aggregator",
			ownerId: superUser?._id,
			category: "other", // Finance mapped to other for now or update enum if possible, keeping 'other' to be safe based on model
			platform: ["Web", "iOS"],
			status: "beta",
			visibility: "public",
			techStack: ["React", "Node.js", "WebSockets"],
			links: {
				website: "https://cryptotracker.example.com",
			},
			tags: ["crypto", "finance", "real-time"],
			screenshots: [
				"https://images.unsplash.com/photo-1621504450168-b8c437536104?auto=format&fit=crop&w=800&q=80",
			],
			icon: "https://images.unsplash.com/photo-1622630998477-20aa696fb4a5?auto=format&fit=crop&w=150&q=80",
		}
	];

	const createdProjects = [];
	for (const projectData of projects) {
		const project = await Project.create(projectData);

		// Add owner as admin member
		await ProjectMembership.create({
			projectId: project._id,
			userId: projectData.ownerId,
			role: "creator",
			status: "approved",
		});

		// Note: Additional members and releases will be handled by their respective seeders
		// or we can leave the legacy logic here if we didn't fully move it.
		// The plan was "new" seeders for membership and releases.
		// So we can remove the inline creation of members/releases here to avoid duplication if we use the new seeders.
		// Assuming index.ts will call `seedProjectMemberships` and `seedReleases`.
		
		createdProjects.push(project);
	}

	return createdProjects;
};
