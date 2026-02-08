import Project from "../models/project.js";
import ProjectMembership from "../models/projectMembership.js";
import type { IUser } from "../models/user.js";

export const seedProjects = async (users: IUser[]) => {
	// Find super user
	const superUser =
		users.find((u) => u.email === "admin@betalift.com") || users[0];

	const projects = [
		{
			name: "BetaLift Mobile",
			description:
				"The official mobile companion for BetaLift. Manage your beta tests on the go.",
			ownerId: superUser?._id,
			category: "Productivity",
			status: "active",
			isPublic: true,
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
			ownerId: users.find((u) => u.username === "sarahj")?._id || users[1]?._id,
			category: "Health & Fitness",
			status: "active",
			isPublic: true,
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
			status: "active",
			isPublic: true,
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
			ownerId:
				users.find((u) => u.username === "jessicam")?._id || users[4]?._id,
			category: "Social",
			status: "active",
			isPublic: true,
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
			description:
				"Real-time cryptocurrency portfolio tracker and news aggregator",
			ownerId: superUser?._id,
			category: "other", // Finance mapped to other for now or update enum if possible, keeping 'other' to be safe based on model
			status: "beta",
			isPublic: true,
			techStack: ["React", "Node.js", "WebSockets"],
			links: {
				website: "https://cryptotracker.example.com",
			},
			tags: ["crypto", "finance", "real-time"],
			screenshots: [
				"https://images.unsplash.com/photo-1621504450168-b8c437536104?auto=format&fit=crop&w=800&q=80",
			],
			icon: "https://images.unsplash.com/photo-1622630998477-20aa696fb4a5?auto=format&fit=crop&w=150&q=80",
		},
		{
			name: "TaskFlow Pro",
			description:
				"A modern task management app with AI-powered prioritization and smart scheduling. Features include drag-and-drop organization, team collaboration, time tracking, and detailed analytics dashboard.",
			ownerId: users.find((u) => u.email === "demo@betalift.com")?._id,
			category: "Productivity",
			status: "active",
			isPublic: true,
			techStack: ["React Native", "TypeScript", "Node.js", "PostgreSQL"],
			links: {
				website: "https://taskflowpro.app",
				testflight: "https://testflight.apple.com/taskflow",
				repository: "https://github.com/taskflow/app",
			},
			tags: ["task-management", "ai", "productivity"],
			screenshots: [
				"https://picsum.photos/seed/tf1/400/800",
				"https://picsum.photos/seed/tf2/400/800",
				"https://picsum.photos/seed/tf3/400/800",
				"https://picsum.photos/seed/tf4/400/800",
			],
			icon: "https://picsum.photos/seed/tficon/200/200",
		},
		{
			name: "FitTrack",
			description:
				"Comprehensive fitness tracking application with workout plans, nutrition logging, progress photos, and social features. Integrates with Apple Health and Google Fit.",
			ownerId: users.find((u) => u.email === "demo@betalift.com")?._id,
			category: "Health & Fitness",
			status: "active",
			isPublic: true,
			techStack: ["Flutter", "Dart", "Firebase", "TensorFlow"],
			links: {
				website: "https://fittrack.io",
				playstore: "https://play.google.com/store/apps/details?id=io.fittrack",
			},
			tags: ["fitness", "health", "tracking"],
			screenshots: [
				"https://picsum.photos/seed/ft1/400/800",
				"https://picsum.photos/seed/ft2/400/800",
				"https://picsum.photos/seed/ft3/400/800",
			],
			icon: "https://picsum.photos/seed/fticon/200/200",
		},
		{
			name: "BudgetBuddy",
			description:
				"Personal finance app with expense tracking, budget goals, investment portfolio monitoring, and bill reminders. Features beautiful charts and insights.",
			ownerId: users.find((u) => u.email === "demo@betalift.com")?._id,
			category: "other",
			status: "active",
			isPublic: true,
			techStack: ["React Native", "Expo", "Supabase", "Plaid API"],
			links: {
				website: "https://budgetbuddy.finance",
				testflight: "https://testflight.apple.com/budgetbuddy",
			},
			tags: ["finance", "budget", "personal"],
			screenshots: [
				"https://picsum.photos/seed/bb1/400/800",
				"https://picsum.photos/seed/bb2/400/800",
				"https://picsum.photos/seed/bb3/400/800",
			],
			icon: "https://picsum.photos/seed/bbicon/200/200",
		},
		{
			name: "CodeSnippet",
			description:
				"A beautiful code snippet manager for developers. Save, organize, and share your code snippets with syntax highlighting, tags, and cloud sync.",
			ownerId: users.find((u) => u.email === "alex@example.com")?._id,
			category: "other",
			status: "active",
			isPublic: true,
			techStack: ["Electron", "React", "TypeScript", "SQLite"],
			links: {
				website: "https://codesnippet.dev",
				repository: "https://github.com/codesnippet/app",
			},
			tags: ["developer-tools", "snippets", "code"],
			screenshots: [
				"https://picsum.photos/seed/cs1/800/500",
				"https://picsum.photos/seed/cs2/800/500",
			],
			icon: "https://picsum.photos/seed/csicon/200/200",
		},
		{
			name: "PhotoEdit AI",
			description:
				"AI-powered photo editing app with one-tap enhancements, background removal, style transfer, and professional-grade editing tools.",
			ownerId: users.find((u) => u.email === "demo@betalift.com")?._id,
			category: "other",
			status: "active",
			isPublic: true,
			techStack: ["Swift", "CoreML", "Vision", "Metal"],
			links: {
				website: "https://photoedit.ai",
			},
			tags: ["photo", "ai", "editing"],
			screenshots: [
				"https://picsum.photos/seed/pe1/400/800",
				"https://picsum.photos/seed/pe2/400/800",
			],
			icon: "https://picsum.photos/seed/peicon/200/200",
		},
		{
			name: "MindfulMoments",
			description:
				"Meditation and mindfulness app with guided sessions, sleep stories, breathing exercises, and mood tracking.",
			ownerId: users.find((u) => u.email === "emma@example.com")?._id, // Owner: Emma Wilson
			category: "Health & Fitness",
			status: "active",
			isPublic: true,
			techStack: ["React Native", "TypeScript", "AWS"],
			links: {
				website: "https://mindfulmoments.app",
				testflight: "https://testflight.apple.com/mindful",
			},
			tags: ["meditation", "mindfulness", "health"],
			screenshots: [
				"https://picsum.photos/seed/mm1/400/800",
				"https://picsum.photos/seed/mm2/400/800",
				"https://picsum.photos/seed/mm3/400/800",
			],
			icon: "https://picsum.photos/seed/mmicon/200/200",
		},
		{
			name: "RecipeBox",
			description:
				"Digital recipe manager with meal planning, grocery lists, nutritional info, and cooking timers. Share recipes with friends and family.",
			ownerId: users.find((u) => u.email === "james@example.com")?._id, // Owner: James Cooper
			category: "other",
			status: "active",
			isPublic: true,
			techStack: ["Flutter", "Firebase", "Algolia"],
			links: {
				website: "https://recipebox.kitchen",
			},
			tags: ["cooking", "recipes", "food"],
			screenshots: [
				"https://picsum.photos/seed/rb1/400/800",
				"https://picsum.photos/seed/rb2/400/800",
			],
			icon: "https://picsum.photos/seed/rbicon/200/200",
		},
		{
			name: "DevDash",
			description:
				"Developer dashboard aggregating GitHub, CI/CD, and project management data into one beautiful interface.",
			ownerId: users.find((u) => u.email === "demo@betalift.com")?._id,
			category: "other",
			status: "beta",
			isPublic: true,
			techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
			links: {
				website: "https://devdash.io",
				repository: "https://github.com/devdash/app",
			},
			tags: ["dashboard", "developer", "metrics"],
			screenshots: [
				"https://picsum.photos/seed/dd1/800/500",
				"https://picsum.photos/seed/dd2/800/500",
			],
			icon: "https://picsum.photos/seed/ddicon/200/200",
		},
	];

	const createdProjects = [];
	for (const projectData of projects) {
		const project = await Project.create(projectData);

		// Add owner as admin member
		await ProjectMembership.create({
			projectId: project._id,
			userId: projectData.ownerId,

			status: "approved",
		});

		createdProjects.push(project);
	}

	return createdProjects;
};
