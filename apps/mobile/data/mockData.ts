import type {
	Conversation,
	Feedback,
	JoinRequest,
	Message,
	Project,
	ProjectMembership,
	Release,
	User,
	UserEngagement,
} from "@/interfaces";

// USERS

export const demoUser: User = {
	id: "demo",
	email: "demo@betalift.com",
	username: "demouser",
	displayName: "Demo User",
	avatar: "https://i.pravatar.cc/150?u=demo",
	bio: "Full-stack developer and app enthusiast. I love building and testing innovative mobile apps. Currently working on several exciting projects and always looking for talented testers!",
	role: "both",
	stats: {
		projectsCreated: 5,
		projectsTested: 12,
		feedbackGiven: 78,
		feedbackReceived: 156,
	},
	createdAt: new Date("2024-01-01"),
};

export const mockUsers: User[] = [
	demoUser,
	{
		id: "u1",
		email: "sarah@example.com",
		username: "sarahdev",
		displayName: "Sarah Johnson",
		avatar: "https://i.pravatar.cc/150?u=sarah",
		bio: "Mobile developer with 5 years experience. Love testing new apps and providing detailed feedback. Specialized in iOS and React Native development.",
		role: "both",
		stats: {
			projectsCreated: 3,
			projectsTested: 15,
			feedbackGiven: 45,
			feedbackReceived: 28,
		},
		createdAt: new Date("2024-01-15"),
	},
	{
		id: "u2",
		email: "mike@example.com",
		username: "miketester",
		displayName: "Mike Chen",
		avatar: "https://i.pravatar.cc/150?u=mike",
		bio: "QA Engineer passionate about finding bugs and improving UX. Expert in accessibility testing and performance optimization.",
		role: "tester",
		stats: {
			projectsCreated: 0,
			projectsTested: 28,
			feedbackGiven: 120,
			feedbackReceived: 5,
		},
		createdAt: new Date("2024-02-20"),
	},
	{
		id: "u3",
		email: "emma@example.com",
		username: "emmaui",
		displayName: "Emma Wilson",
		avatar: "https://i.pravatar.cc/150?u=emma",
		bio: "UI/UX Designer who loves giving design feedback. Focused on creating beautiful and intuitive user experiences.",
		role: "both",
		stats: {
			projectsCreated: 4,
			projectsTested: 8,
			feedbackGiven: 32,
			feedbackReceived: 45,
		},
		createdAt: new Date("2024-03-10"),
	},
	{
		id: "u4",
		email: "alex@example.com",
		username: "alexcoder",
		displayName: "Alex Rivera",
		avatar: "https://i.pravatar.cc/150?u=alex",
		bio: "Full-stack developer building cool stuff. Passionate about clean code and user-centric design.",
		role: "creator",
		stats: {
			projectsCreated: 7,
			projectsTested: 3,
			feedbackGiven: 15,
			feedbackReceived: 89,
		},
		createdAt: new Date("2024-01-05"),
	},
	{
		id: "u5",
		email: "lisa@example.com",
		username: "lisaqa",
		displayName: "Lisa Park",
		avatar: "https://i.pravatar.cc/150?u=lisa",
		bio: "Professional tester. I break things so you don't have to. Expert in edge cases and security testing.",
		role: "tester",
		stats: {
			projectsCreated: 0,
			projectsTested: 42,
			feedbackGiven: 189,
			feedbackReceived: 8,
		},
		createdAt: new Date("2024-04-01"),
	},
	{
		id: "u6",
		email: "james@example.com",
		username: "jamesbuilds",
		displayName: "James Cooper",
		avatar: "https://i.pravatar.cc/150?u=james",
		bio: "Indie developer creating apps that solve real problems. Always open to feedback!",
		role: "creator",
		stats: {
			projectsCreated: 6,
			projectsTested: 2,
			feedbackGiven: 10,
			feedbackReceived: 134,
		},
		createdAt: new Date("2024-02-15"),
	},
	{
		id: "u7",
		email: "nina@example.com",
		username: "ninatech",
		displayName: "Nina Patel",
		avatar: "https://i.pravatar.cc/150?u=nina",
		bio: "Tech enthusiast and beta testing addict. I test apps on multiple devices and platforms.",
		role: "tester",
		stats: {
			projectsCreated: 1,
			projectsTested: 35,
			feedbackGiven: 156,
			feedbackReceived: 12,
		},
		createdAt: new Date("2024-03-20"),
	},
	{
		id: "u8",
		email: "david@example.com",
		username: "davidux",
		displayName: "David Kim",
		avatar: "https://i.pravatar.cc/150?u=david",
		bio: "Product designer turned developer. I appreciate both form and function in apps.",
		role: "both",
		stats: {
			projectsCreated: 3,
			projectsTested: 18,
			feedbackGiven: 67,
			feedbackReceived: 34,
		},
		createdAt: new Date("2024-04-15"),
	},
	{
		id: "u9",
		email: "rachel@example.com",
		username: "rachelcodes",
		displayName: "Rachel Green",
		avatar: "https://i.pravatar.cc/150?u=rachel",
		bio: "iOS developer with a keen eye for detail. I specialize in testing Apple ecosystem apps.",
		role: "both",
		stats: {
			projectsCreated: 2,
			projectsTested: 22,
			feedbackGiven: 89,
			feedbackReceived: 23,
		},
		createdAt: new Date("2024-05-01"),
	},
	{
		id: "u10",
		email: "tom@example.com",
		username: "tomandroid",
		displayName: "Tom Anderson",
		avatar: "https://i.pravatar.cc/150?u=tom",
		bio: "Android developer and tester. Expert in Material Design and Android-specific UX patterns.",
		role: "both",
		stats: {
			projectsCreated: 4,
			projectsTested: 16,
			feedbackGiven: 54,
			feedbackReceived: 41,
		},
		createdAt: new Date("2024-05-15"),
	},
];

// USER ENGAGEMENTS

export const mockUserEngagements: Record<string, UserEngagement> = {
	demo: {
		userId: "demo",
		projectsViewed: [
			{ projectId: "1", viewedAt: new Date("2024-12-30"), duration: 300 },
			{ projectId: "2", viewedAt: new Date("2024-12-29"), duration: 240 },
			{ projectId: "3", viewedAt: new Date("2024-12-28"), duration: 180 },
			{ projectId: "4", viewedAt: new Date("2024-12-27"), duration: 150 },
			{ projectId: "5", viewedAt: new Date("2024-12-26"), duration: 200 },
		],
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
		preferredPlatforms: ["ios", "android", "web"],
		testingExperience: "expert",
		lastActiveAt: new Date("2024-12-30"),
	},
	u1: {
		userId: "u1",
		projectsViewed: [
			{ projectId: "1", viewedAt: new Date("2024-12-29"), duration: 180 },
			{ projectId: "2", viewedAt: new Date("2024-12-28"), duration: 120 },
		],
		availability: {
			status: "available",
			hoursPerWeek: 10,
			timezone: "America/New_York",
			preferredContactMethod: "in-app",
		},
		interests: ["Mobile Apps", "AI/ML", "Developer Tools", "Productivity"],
		skills: ["React Native", "TypeScript", "iOS", "UI/UX Design"],
		preferredPlatforms: ["ios", "android"],
		testingExperience: "expert",
		lastActiveAt: new Date("2024-12-30"),
	},
	u2: {
		userId: "u2",
		projectsViewed: [
			{ projectId: "3", viewedAt: new Date("2024-12-30"), duration: 90 },
			{ projectId: "4", viewedAt: new Date("2024-12-29"), duration: 200 },
		],
		availability: {
			status: "available",
			hoursPerWeek: 20,
			timezone: "America/Chicago",
			preferredContactMethod: "email",
		},
		interests: ["QA Testing", "Accessibility", "Performance", "Security"],
		skills: ["Manual Testing", "Automation", "Selenium", "Appium"],
		preferredPlatforms: ["android", "web"],
		testingExperience: "expert",
		lastActiveAt: new Date("2024-12-30"),
	},
	u3: {
		userId: "u3",
		projectsViewed: [
			{ projectId: "1", viewedAt: new Date("2024-12-28"), duration: 150 },
		],
		availability: {
			status: "busy",
			hoursPerWeek: 5,
			timezone: "Europe/London",
			preferredContactMethod: "in-app",
		},
		interests: ["UI Design", "UX Research", "Design Systems", "Accessibility"],
		skills: ["Figma", "Sketch", "Adobe XD", "CSS", "React"],
		preferredPlatforms: ["ios", "web"],
		testingExperience: "intermediate",
		lastActiveAt: new Date("2024-12-29"),
	},
	u4: {
		userId: "u4",
		projectsViewed: [
			{ projectId: "2", viewedAt: new Date("2024-12-27"), duration: 100 },
		],
		availability: {
			status: "away",
			hoursPerWeek: 8,
			timezone: "America/Denver",
			preferredContactMethod: "in-app",
		},
		interests: ["Full-Stack", "Cloud", "DevOps", "APIs"],
		skills: ["Node.js", "Python", "AWS", "Docker", "GraphQL"],
		preferredPlatforms: ["web", "desktop"],
		testingExperience: "intermediate",
		lastActiveAt: new Date("2024-12-25"),
	},
	u5: {
		userId: "u5",
		projectsViewed: [
			{ projectId: "1", viewedAt: new Date("2024-12-30"), duration: 300 },
			{ projectId: "2", viewedAt: new Date("2024-12-30"), duration: 250 },
			{ projectId: "3", viewedAt: new Date("2024-12-29"), duration: 200 },
		],
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
		preferredPlatforms: ["ios", "android", "web", "desktop"],
		testingExperience: "expert",
		lastActiveAt: new Date("2024-12-30"),
	},
};

// PROJECTS

export const mockProjects: Project[] = [
	{
		id: "1",
		name: "TaskFlow Pro",
		description:
			"A modern task management app with AI-powered prioritization and smart scheduling. Features include drag-and-drop organization, team collaboration, time tracking, and detailed analytics dashboard.",
		shortDescription: "AI-powered task management",
		ownerId: "demo",
		ownerName: "Demo User",
		ownerAvatar: "https://i.pravatar.cc/150?u=demo",
		status: "active",
		category: "mobile-app",
		links: {
			website: "https://taskflowpro.app",
			testFlight: "https://testflight.apple.com/taskflow",
			github: "https://github.com/taskflow/app",
		},
		screenshots: [
			"https://picsum.photos/seed/tf1/400/800",
			"https://picsum.photos/seed/tf2/400/800",
			"https://picsum.photos/seed/tf3/400/800",
			"https://picsum.photos/seed/tf4/400/800",
		],
		icon: "https://picsum.photos/seed/tficon/200/200",
		techStack: ["React Native", "TypeScript", "Node.js", "PostgreSQL"],
		testerCount: 24,
		feedbackCount: 47,
		maxTesters: 50,
		isPublic: true,
		createdAt: new Date("2024-06-15"),
	},
	{
		id: "2",
		name: "FitTrack",
		description:
			"Comprehensive fitness tracking application with workout plans, nutrition logging, progress photos, and social features. Integrates with Apple Health and Google Fit.",
		shortDescription: "Complete fitness companion",
		ownerId: "demo",
		ownerName: "Demo User",
		ownerAvatar: "https://i.pravatar.cc/150?u=demo",
		status: "active",
		category: "mobile-app",
		links: {
			website: "https://fittrack.io",
			playStore: "https://play.google.com/store/apps/details?id=io.fittrack",
		},
		screenshots: [
			"https://picsum.photos/seed/ft1/400/800",
			"https://picsum.photos/seed/ft2/400/800",
			"https://picsum.photos/seed/ft3/400/800",
		],
		icon: "https://picsum.photos/seed/fticon/200/200",
		techStack: ["Flutter", "Dart", "Firebase", "TensorFlow"],
		testerCount: 56,
		feedbackCount: 89,
		maxTesters: 100,
		isPublic: true,
		createdAt: new Date("2024-05-20"),
	},
	{
		id: "3",
		name: "BudgetBuddy",
		description:
			"Personal finance app with expense tracking, budget goals, investment portfolio monitoring, and bill reminders. Features beautiful charts and insights.",
		shortDescription: "Smart personal finance",
		ownerId: "demo",
		ownerName: "Demo User",
		ownerAvatar: "https://i.pravatar.cc/150?u=demo",
		status: "active",
		category: "mobile-app",
		links: {
			website: "https://budgetbuddy.finance",
			testFlight: "https://testflight.apple.com/budgetbuddy",
		},
		screenshots: [
			"https://picsum.photos/seed/bb1/400/800",
			"https://picsum.photos/seed/bb2/400/800",
			"https://picsum.photos/seed/bb3/400/800",
		],
		icon: "https://picsum.photos/seed/bbicon/200/200",
		techStack: ["React Native", "Expo", "Supabase", "Plaid API"],
		testerCount: 42,
		feedbackCount: 65,
		maxTesters: 75,
		isPublic: true,
		createdAt: new Date("2024-04-10"),
	},
	{
		id: "4",
		name: "CodeSnippet",
		description:
			"A beautiful code snippet manager for developers. Save, organize, and share your code snippets with syntax highlighting, tags, and cloud sync.",
		shortDescription: "Code snippet manager",
		ownerId: "u4",
		ownerName: "Alex Rivera",
		ownerAvatar: "https://i.pravatar.cc/150?u=alex",
		status: "active",
		category: "desktop-app",
		links: {
			website: "https://codesnippet.dev",
			github: "https://github.com/codesnippet/app",
		},
		screenshots: [
			"https://picsum.photos/seed/cs1/800/500",
			"https://picsum.photos/seed/cs2/800/500",
		],
		icon: "https://picsum.photos/seed/csicon/200/200",
		techStack: ["Electron", "React", "TypeScript", "SQLite"],
		testerCount: 15,
		feedbackCount: 23,
		isPublic: true,
		createdAt: new Date("2024-07-01"),
	},
	{
		id: "5",
		name: "PhotoEdit AI",
		description:
			"AI-powered photo editing app with one-tap enhancements, background removal, style transfer, and professional-grade editing tools.",
		shortDescription: "AI photo editing",
		ownerId: "demo",
		ownerName: "Demo User",
		ownerAvatar: "https://i.pravatar.cc/150?u=demo",
		status: "active",
		category: "mobile-app",
		links: {
			website: "https://photoedit.ai",
		},
		screenshots: [
			"https://picsum.photos/seed/pe1/400/800",
			"https://picsum.photos/seed/pe2/400/800",
		],
		icon: "https://picsum.photos/seed/peicon/200/200",
		techStack: ["Swift", "CoreML", "Vision", "Metal"],
		testerCount: 78,
		feedbackCount: 112,
		maxTesters: 100,
		isPublic: true,
		createdAt: new Date("2024-03-05"),
	},
	{
		id: "6",
		name: "MindfulMoments",
		description:
			"Meditation and mindfulness app with guided sessions, sleep stories, breathing exercises, and mood tracking.",
		shortDescription: "Meditation & mindfulness",
		ownerId: "u3",
		ownerName: "Emma Wilson",
		ownerAvatar: "https://i.pravatar.cc/150?u=emma",
		status: "active",
		category: "mobile-app",
		links: {
			website: "https://mindfulmoments.app",
			testFlight: "https://testflight.apple.com/mindful",
		},
		screenshots: [
			"https://picsum.photos/seed/mm1/400/800",
			"https://picsum.photos/seed/mm2/400/800",
			"https://picsum.photos/seed/mm3/400/800",
		],
		icon: "https://picsum.photos/seed/mmicon/200/200",
		techStack: ["React Native", "TypeScript", "AWS"],
		testerCount: 34,
		feedbackCount: 51,
		maxTesters: 60,
		isPublic: true,
		createdAt: new Date("2024-08-01"),
	},
	{
		id: "7",
		name: "RecipeBox",
		description:
			"Digital recipe manager with meal planning, grocery lists, nutritional info, and cooking timers. Share recipes with friends and family.",
		shortDescription: "Recipe & meal planner",
		ownerId: "u6",
		ownerName: "James Cooper",
		ownerAvatar: "https://i.pravatar.cc/150?u=james",
		status: "active",
		category: "mobile-app",
		links: {
			website: "https://recipebox.kitchen",
		},
		screenshots: [
			"https://picsum.photos/seed/rb1/400/800",
			"https://picsum.photos/seed/rb2/400/800",
		],
		icon: "https://picsum.photos/seed/rbicon/200/200",
		techStack: ["Flutter", "Firebase", "Algolia"],
		testerCount: 28,
		feedbackCount: 39,
		isPublic: true,
		createdAt: new Date("2024-09-15"),
	},
	{
		id: "8",
		name: "DevDash",
		description:
			"Developer dashboard aggregating GitHub, CI/CD, and project management data into one beautiful interface.",
		shortDescription: "Developer dashboard",
		ownerId: "demo",
		ownerName: "Demo User",
		ownerAvatar: "https://i.pravatar.cc/150?u=demo",
		status: "beta",
		category: "web-app",
		links: {
			website: "https://devdash.io",
			github: "https://github.com/devdash/app",
		},
		screenshots: [
			"https://picsum.photos/seed/dd1/800/500",
			"https://picsum.photos/seed/dd2/800/500",
		],
		icon: "https://picsum.photos/seed/ddicon/200/200",
		techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
		testerCount: 12,
		feedbackCount: 18,
		maxTesters: 25,
		isPublic: true,
		createdAt: new Date("2024-11-01"),
	},
];

// FEEDBACK

export const mockFeedbacks: Feedback[] = [
	{
		id: "f1",
		projectId: "1",
		userId: "u2",
		user: mockUsers.find((u) => u.id === "u2")!,
		type: "bug",
		priority: "high",
		title: "App crashes when adding task with long title",
		description:
			'When I try to create a task with a title longer than 100 characters, the app crashes immediately. This happens consistently on both iOS and Android.\n\nSteps to reproduce:\n1. Open the app\n2. Click "Add Task"\n3. Enter a very long title (100+ characters)\n4. Click Save\n\nExpected: Task should be created or show error\nActual: App crashes',
		screenshots: [
			"https://picsum.photos/seed/bug1/400/800",
			"https://picsum.photos/seed/bug2/400/800",
		],
		deviceInfo: {
			platform: "ios",
			osVersion: "17.2",
			deviceModel: "iPhone 15 Pro",
			appVersion: "1.2.3",
		},
		status: "open",
		upvotes: 12,
		downvotes: 0,
		commentCount: 5,
		createdAt: new Date("2024-12-01"),
	},
	{
		id: "f2",
		projectId: "1",
		userId: "u5",
		user: mockUsers.find((u) => u.id === "u5")!,
		type: "feature",
		priority: "medium",
		title: "Add dark mode support",
		description:
			"It would be great to have a dark mode option. The current light theme is a bit harsh on the eyes when using the app at night. Many modern apps support this feature and it would greatly improve the user experience.",
		screenshots: [],
		deviceInfo: {
			platform: "android",
			osVersion: "14",
			deviceModel: "Pixel 8",
			appVersion: "1.2.3",
		},
		status: "in-progress",
		upvotes: 45,
		downvotes: 2,
		commentCount: 12,
		createdAt: new Date("2024-11-28"),
	},
	{
		id: "f3",
		projectId: "1",
		userId: "u1",
		user: mockUsers.find((u) => u.id === "u1")!,
		type: "praise",
		title: "Love the new AI prioritization feature!",
		description:
			"The AI prioritization feature is amazing! It correctly identified my most urgent tasks and helped me focus on what matters. The suggestions are spot on and have improved my productivity significantly. Great work!",
		screenshots: ["https://picsum.photos/seed/praise1/400/800"],
		status: "resolved",
		upvotes: 28,
		downvotes: 0,
		commentCount: 3,
		createdAt: new Date("2024-11-25"),
	},
	{
		id: "f4",
		projectId: "1",
		userId: "u7",
		user: mockUsers.find((u) => u.id === "u7")!,
		type: "bug",
		priority: "critical",
		title: "Data loss after app update",
		description:
			"After updating to version 1.2.3, all my tasks disappeared. I had over 50 tasks organized in different categories. This is a critical issue as I lost weeks of work.",
		screenshots: [],
		deviceInfo: {
			platform: "ios",
			osVersion: "17.1",
			deviceModel: "iPhone 14",
			appVersion: "1.2.3",
		},
		status: "resolved",
		upvotes: 67,
		downvotes: 0,
		commentCount: 18,
		createdAt: new Date("2024-11-20"),
		resolvedAt: new Date("2024-11-22"),
	},
	{
		id: "f5",
		projectId: "1",
		userId: "u8",
		user: mockUsers.find((u) => u.id === "u8")!,
		type: "feature",
		priority: "low",
		title: "Widget for home screen",
		description:
			"A home screen widget showing upcoming tasks would be very useful. It would allow quick glance at tasks without opening the app.",
		screenshots: [],
		deviceInfo: {
			platform: "ios",
			osVersion: "17.2",
			deviceModel: "iPhone 15",
			appVersion: "1.2.3",
		},
		status: "open",
		upvotes: 23,
		downvotes: 1,
		commentCount: 4,
		createdAt: new Date("2024-12-05"),
	},
	{
		id: "f6",
		projectId: "2",
		userId: "u2",
		user: mockUsers.find((u) => u.id === "u2")!,
		type: "bug",
		priority: "medium",
		title: "Workout timer stops when screen locks",
		description:
			"The workout timer stops counting when the screen auto-locks. This makes it impossible to track rest periods without keeping the screen on.",
		screenshots: ["https://picsum.photos/seed/fit1/400/800"],
		deviceInfo: {
			platform: "android",
			osVersion: "14",
			deviceModel: "Samsung S24",
			appVersion: "2.1.0",
		},
		status: "in-progress",
		upvotes: 34,
		downvotes: 0,
		commentCount: 7,
		createdAt: new Date("2024-12-10"),
	},
	{
		id: "f7",
		projectId: "2",
		userId: "u9",
		user: mockUsers.find((u) => u.id === "u9")!,
		type: "feature",
		priority: "high",
		title: "Apple Watch integration",
		description:
			"Please add Apple Watch support! Would love to track workouts directly from my watch and have it sync with the app.",
		screenshots: [],
		deviceInfo: {
			platform: "ios",
			osVersion: "17.2",
			deviceModel: "iPhone 15 Pro Max",
			appVersion: "2.1.0",
		},
		status: "open",
		upvotes: 89,
		downvotes: 3,
		commentCount: 15,
		createdAt: new Date("2024-12-08"),
	},
	{
		id: "f8",
		projectId: "3",
		userId: "u5",
		user: mockUsers.find((u) => u.id === "u5")!,
		type: "bug",
		priority: "high",
		title: "Charts not rendering on older devices",
		description:
			"The expense charts fail to render on older Android devices (Android 9 and below). Just shows a blank space where the chart should be.",
		screenshots: ["https://picsum.photos/seed/budget1/400/800"],
		deviceInfo: {
			platform: "android",
			osVersion: "9",
			deviceModel: "Samsung A50",
			appVersion: "1.5.0",
		},
		status: "open",
		upvotes: 15,
		downvotes: 0,
		commentCount: 6,
		createdAt: new Date("2024-12-12"),
	},
	{
		id: "f9",
		projectId: "3",
		userId: "u3",
		user: mockUsers.find((u) => u.id === "u3")!,
		type: "praise",
		title: "Beautiful UI design!",
		description:
			"Just wanted to say the app looks absolutely gorgeous. The color scheme, typography, and overall layout are top-notch. Really enjoyable to use!",
		screenshots: ["https://picsum.photos/seed/budget2/400/800"],
		status: "resolved",
		upvotes: 42,
		downvotes: 0,
		commentCount: 5,
		createdAt: new Date("2024-12-05"),
	},
	{
		id: "f10",
		projectId: "5",
		userId: "u10",
		user: mockUsers.find((u) => u.id === "u10")!,
		type: "feature",
		priority: "medium",
		title: "Batch processing for multiple photos",
		description:
			"Would be great to apply the same edits to multiple photos at once. Useful for editing a series of photos from the same shoot.",
		screenshots: [],
		deviceInfo: {
			platform: "ios",
			osVersion: "17.1",
			deviceModel: "iPad Pro",
			appVersion: "3.0.0",
		},
		status: "open",
		upvotes: 56,
		downvotes: 2,
		commentCount: 8,
		createdAt: new Date("2024-12-15"),
	},
];

// JOIN REQUESTS

export const mockJoinRequests: JoinRequest[] = [
	{
		id: "jr1",
		projectId: "1",
		userId: "u2",
		user: mockUsers.find((u) => u.id === "u2")!,
		status: "pending",
		message:
			"Hi! I'm a QA engineer with 5 years of experience. I'd love to help test TaskFlow Pro!",
		createdAt: new Date("2024-12-28"),
	},
	{
		id: "jr2",
		projectId: "1",
		userId: "u5",
		user: mockUsers.find((u) => u.id === "u5")!,
		status: "pending",
		message:
			"Professional tester here. I can test on multiple devices and provide detailed bug reports.",
		createdAt: new Date("2024-12-27"),
	},
	{
		id: "jr3",
		projectId: "1",
		userId: "u7",
		user: mockUsers.find((u) => u.id === "u7")!,
		status: "pending",
		message:
			"Love testing productivity apps. I have experience with similar task management apps.",
		createdAt: new Date("2024-12-26"),
	},
	{
		id: "jr4",
		projectId: "1",
		userId: "u9",
		user: mockUsers.find((u) => u.id === "u9")!,
		status: "accepted",
		message: "iOS developer interested in testing React Native apps.",
		createdAt: new Date("2024-12-20"),
		respondedAt: new Date("2024-12-21"),
	},
	{
		id: "jr5",
		projectId: "1",
		userId: "u10",
		user: mockUsers.find((u) => u.id === "u10")!,
		status: "rejected",
		message: "Want to test this app.",
		rejectionReason: "Looking for more detailed testing experience.",
		createdAt: new Date("2024-12-15"),
		respondedAt: new Date("2024-12-16"),
	},
	{
		id: "jr6",
		projectId: "2",
		userId: "u3",
		user: mockUsers.find((u) => u.id === "u3")!,
		status: "pending",
		message:
			"UI/UX designer here! Would love to provide design feedback on the fitness app.",
		createdAt: new Date("2024-12-29"),
	},
	{
		id: "jr7",
		projectId: "2",
		userId: "u8",
		user: mockUsers.find((u) => u.id === "u8")!,
		status: "pending",
		message: "Fitness enthusiast and developer. I test apps while working out!",
		createdAt: new Date("2024-12-28"),
	},
	{
		id: "jr8",
		projectId: "3",
		userId: "u1",
		user: mockUsers.find((u) => u.id === "u1")!,
		status: "pending",
		message:
			"Finance apps are my specialty. Happy to provide thorough testing.",
		createdAt: new Date("2024-12-30"),
	},
];

// CONVERSATIONS & MESSAGES

export const mockConversations: Conversation[] = [
	{
		id: "conv1",
		participants: [mockUsers.find((u) => u.id === "u1")!],
		lastMessage: {
			id: "m1",
			conversationId: "conv1",
			senderId: "u1",
			content:
				"Thanks for the detailed feedback! I'll fix those issues in the next release.",
			type: "text",
			createdAt: new Date("2024-12-30T14:30:00"),
			readBy: ["demo"],
		},
		unreadCount: 2,
		updatedAt: new Date("2024-12-30T14:30:00"),
		createdAt: new Date("2024-12-01"),
	},
	{
		id: "conv2",
		participants: [mockUsers.find((u) => u.id === "u2")!],
		lastMessage: {
			id: "m2",
			conversationId: "conv2",
			senderId: "demo",
			content: "Sure, I'd love to test your new project!",
			type: "text",
			createdAt: new Date("2024-12-29T10:15:00"),
			readBy: ["demo", "u2"],
		},
		unreadCount: 0,
		updatedAt: new Date("2024-12-29T10:15:00"),
		createdAt: new Date("2024-11-15"),
	},
	{
		id: "conv3",
		participants: [mockUsers.find((u) => u.id === "u3")!],
		lastMessage: {
			id: "m3",
			conversationId: "conv3",
			senderId: "u3",
			content:
				"Hey! Would you mind checking out my new app? I think you'd be a great fit for testing it.",
			type: "text",
			createdAt: new Date("2024-12-28T18:45:00"),
			readBy: ["u3"],
		},
		unreadCount: 1,
		updatedAt: new Date("2024-12-28T18:45:00"),
		createdAt: new Date("2024-12-01"),
	},
	{
		id: "conv4",
		participants: [mockUsers.find((u) => u.id === "u4")!],
		lastMessage: {
			id: "m4",
			conversationId: "conv4",
			senderId: "demo",
			content:
				"The crash bug is fixed now. Let me know if you find anything else!",
			type: "text",
			createdAt: new Date("2024-12-26T09:20:00"),
			readBy: ["demo", "u4"],
		},
		unreadCount: 0,
		updatedAt: new Date("2024-12-26T09:20:00"),
		createdAt: new Date("2024-10-20"),
	},
	{
		id: "conv5",
		participants: [mockUsers.find((u) => u.id === "u5")!],
		lastMessage: {
			id: "m5",
			conversationId: "conv5",
			senderId: "u5",
			content: "I've uploaded the test results. Check the attachments! 📎",
			type: "text",
			createdAt: new Date("2024-12-24T16:00:00"),
			readBy: ["u5"],
		},
		unreadCount: 3,
		updatedAt: new Date("2024-12-24T16:00:00"),
		createdAt: new Date("2024-12-01"),
	},
	{
		id: "conv6",
		participants: [mockUsers.find((u) => u.id === "u6")!],
		lastMessage: {
			id: "m6",
			conversationId: "conv6",
			senderId: "u6",
			content:
				"Great feedback on RecipeBox! Working on those improvements now.",
			type: "text",
			createdAt: new Date("2024-12-23T11:00:00"),
			readBy: ["demo", "u6"],
		},
		unreadCount: 0,
		updatedAt: new Date("2024-12-23T11:00:00"),
		createdAt: new Date("2024-11-10"),
	},
	{
		id: "conv7",
		participants: [mockUsers.find((u) => u.id === "u7")!],
		lastMessage: {
			id: "m7",
			conversationId: "conv7",
			senderId: "demo",
			content: "Welcome to the beta! Let me know if you have any questions.",
			type: "text",
			createdAt: new Date("2024-12-22T15:30:00"),
			readBy: ["demo", "u7"],
		},
		unreadCount: 0,
		updatedAt: new Date("2024-12-22T15:30:00"),
		createdAt: new Date("2024-12-20"),
	},
	{
		id: "conv8",
		participants: [mockUsers.find((u) => u.id === "u8")!],
		lastMessage: {
			id: "m8",
			conversationId: "conv8",
			senderId: "u8",
			content: "The new UI looks amazing! 🎨",
			type: "text",
			createdAt: new Date("2024-12-21T09:45:00"),
			readBy: ["u8"],
		},
		unreadCount: 1,
		updatedAt: new Date("2024-12-21T09:45:00"),
		createdAt: new Date("2024-12-15"),
	},
];

export const mockMessages: Record<string, Message[]> = {
	conv1: [
		{
			id: "m1-1",
			conversationId: "conv1",
			senderId: "u1",
			content: "Hey! I saw your project and I'd love to help test it.",
			type: "text",
			createdAt: new Date("2024-12-28T10:00:00"),
			readBy: ["demo", "u1"],
		},
		{
			id: "m1-2",
			conversationId: "conv1",
			senderId: "demo",
			content:
				"That would be great! What's your experience with React Native apps?",
			type: "text",
			createdAt: new Date("2024-12-28T10:05:00"),
			readBy: ["demo", "u1"],
		},
		{
			id: "m1-3",
			conversationId: "conv1",
			senderId: "u1",
			content:
				"I've been testing React Native apps for about 2 years. I specialize in finding edge cases and performance issues.",
			type: "text",
			createdAt: new Date("2024-12-28T10:08:00"),
			readBy: ["demo", "u1"],
		},
		{
			id: "m1-4",
			conversationId: "conv1",
			senderId: "demo",
			content:
				"Perfect! I'll add you to the beta tester list. You should get an invite soon.",
			type: "text",
			createdAt: new Date("2024-12-28T10:15:00"),
			readBy: ["demo", "u1"],
		},
		{
			id: "m1-5",
			conversationId: "conv1",
			senderId: "u1",
			content: "Awesome, thanks! 🎉",
			type: "text",
			createdAt: new Date("2024-12-28T10:16:00"),
			readBy: ["demo", "u1"],
		},
		{
			id: "m1-6",
			conversationId: "conv1",
			senderId: "u1",
			content:
				"I found a few bugs while testing. The login screen crashes when rotating the device.",
			type: "text",
			createdAt: new Date("2024-12-29T14:00:00"),
			readBy: ["demo", "u1"],
		},
		{
			id: "m1-7",
			conversationId: "conv1",
			senderId: "demo",
			content:
				"Thanks for catching that! Can you send me a screenshot or screen recording?",
			type: "text",
			createdAt: new Date("2024-12-29T14:30:00"),
			readBy: ["demo", "u1"],
		},
		{
			id: "m1-8",
			conversationId: "conv1",
			senderId: "u1",
			content: "Here's the crash log and a screenshot",
			type: "text",
			createdAt: new Date("2024-12-30T09:00:00"),
			readBy: ["demo", "u1"],
			attachments: [
				{
					id: "a1",
					type: "image",
					url: "https://picsum.photos/seed/screenshot1/400/600",
					name: "crash_screenshot.png",
				},
			],
		},
		{
			id: "m1-9",
			conversationId: "conv1",
			senderId: "demo",
			content: "Got it! I'll fix this today.",
			type: "text",
			createdAt: new Date("2024-12-30T09:15:00"),
			readBy: ["demo", "u1"],
		},
		{
			id: "m1-10",
			conversationId: "conv1",
			senderId: "u1",
			content:
				"Thanks for the detailed feedback! I'll fix those issues in the next release.",
			type: "text",
			createdAt: new Date("2024-12-30T14:30:00"),
			readBy: ["demo"],
		},
	],
	conv2: [
		{
			id: "m2-1",
			conversationId: "conv2",
			senderId: "u2",
			content:
				"Hi! I noticed you created BudgetBuddy. Would you like some testing help?",
			type: "text",
			createdAt: new Date("2024-11-15T09:00:00"),
			readBy: ["demo", "u2"],
		},
		{
			id: "m2-2",
			conversationId: "conv2",
			senderId: "demo",
			content: "Absolutely! What kind of testing do you specialize in?",
			type: "text",
			createdAt: new Date("2024-11-15T09:30:00"),
			readBy: ["demo", "u2"],
		},
		{
			id: "m2-3",
			conversationId: "conv2",
			senderId: "u2",
			content:
				"I focus on accessibility testing and making sure apps work well with screen readers.",
			type: "text",
			createdAt: new Date("2024-11-15T10:00:00"),
			readBy: ["demo", "u2"],
		},
		{
			id: "m2-4",
			conversationId: "conv2",
			senderId: "demo",
			content: "That's exactly what we need! I've sent you an invite.",
			type: "text",
			createdAt: new Date("2024-11-15T10:15:00"),
			readBy: ["demo", "u2"],
		},
		{
			id: "m2-5",
			conversationId: "conv2",
			senderId: "demo",
			content: "Sure, I'd love to test your new project!",
			type: "text",
			createdAt: new Date("2024-12-29T10:15:00"),
			readBy: ["demo", "u2"],
		},
	],
};

// RELEASES

export const mockReleases: Record<string, Release[]> = {
	"1": [
		{
			id: "r1-1",
			projectId: "1",
			version: "2.1.0",
			title: "Major Performance Update",
			releaseNotes: `## What's New

### 🚀 Performance Improvements
- Reduced app startup time by 40%
- Optimized image loading and caching
- Fixed memory leaks in the dashboard
- Improved scrolling performance in lists

### ✨ New Features
- **Dark Mode Support**: Finally! You can now switch between light and dark themes in settings.
- **Gesture Navigation**: Swipe left/right to navigate between screens.
- **Push Notification Customization**: Choose which notifications you want to receive.
- **Offline Mode**: Core features now work without internet connection.

### 🐛 Bug Fixes
- Fixed crash on device rotation (iOS)
- Resolved login issues on iOS 17
- Fixed notification badge count not updating
- Resolved data sync conflicts
- Fixed keyboard overlap on smaller devices

### 🔧 Technical Improvements
- Updated to React Native 0.73
- Migrated to Expo SDK 50
- Improved error handling and logging
- Added crash reporting

### 📝 Known Issues
- Some users may experience brief loading delays on first launch
- Push notifications may be delayed on Android 14

---

## Installation

1. Download the latest build from the link below
2. If you had a previous version, uninstall it first
3. Install the new version and grant necessary permissions

## Feedback

Please report any issues through the feedback section in the app or message me directly!`,
			status: "published",
			downloadUrl: "https://example.com/download/v2.1.0",
			fileSize: 45600000,
			buildNumber: "210",
			minOsVersion: "iOS 14.0 / Android 8.0",
			changelog: [
				"Reduced app startup time by 40%",
				"Added dark mode support",
				"Fixed crash on device rotation",
				"Updated to React Native 0.73",
			],
			publishedAt: new Date("2024-12-30"),
			createdAt: new Date("2024-12-28"),
		},
		{
			id: "r1-2",
			projectId: "1",
			version: "2.0.1",
			title: "Hotfix Release",
			releaseNotes: `## Bug Fixes

- Fixed critical crash when opening settings
- Resolved data sync issues
- Fixed UI glitches on smaller screens`,
			status: "published",
			downloadUrl: "https://example.com/download/v2.0.1",
			fileSize: 44200000,
			buildNumber: "201",
			minOsVersion: "iOS 14.0 / Android 8.0",
			publishedAt: new Date("2024-12-20"),
			createdAt: new Date("2024-12-19"),
		},
		{
			id: "r1-3",
			projectId: "1",
			version: "2.0.0",
			title: "Complete Redesign",
			releaseNotes: `## Major Update

This release includes a complete UI redesign and new features.

### Highlights
- Brand new user interface
- Improved navigation flow
- Better accessibility support
- Enhanced security features`,
			status: "published",
			downloadUrl: "https://example.com/download/v2.0.0",
			fileSize: 48500000,
			buildNumber: "200",
			minOsVersion: "iOS 14.0 / Android 8.0",
			publishedAt: new Date("2024-12-01"),
			createdAt: new Date("2024-11-25"),
		},
		{
			id: "r1-4",
			projectId: "1",
			version: "2.2.0-beta",
			title: "Beta: New Dashboard",
			releaseNotes: `## Beta Release

Testing the new dashboard redesign. Please report any issues!

### Features in Testing
- New analytics dashboard
- Real-time collaboration
- Improved export options`,
			status: "beta",
			downloadUrl: "https://example.com/download/v2.2.0-beta",
			fileSize: 46800000,
			buildNumber: "220",
			minOsVersion: "iOS 14.0 / Android 8.0",
			createdAt: new Date("2024-12-29"),
		},
		{
			id: "r1-5",
			projectId: "1",
			version: "2.3.0",
			title: "Upcoming: AI Features",
			releaseNotes: `## Coming Soon

AI-powered features are being developed.

### Planned Features
- Smart suggestions
- Auto-categorization
- Natural language search`,
			status: "draft",
			createdAt: new Date("2024-12-28"),
		},
	],
	"2": [
		{
			id: "r2-1",
			projectId: "2",
			version: "3.0.0",
			title: "FitTrack 3.0 - Major Update",
			releaseNotes: `## What's New in FitTrack 3.0

### 💪 New Workout Features
- Custom workout builder
- Rest timer with vibration alerts
- Superset and circuit training support
- Voice guidance during exercises

### 📊 Enhanced Analytics
- Weekly progress reports
- Body composition tracking
- Personal records history
- Social comparisons

### 🍎 Nutrition Updates
- Barcode scanner for food
- Restaurant menu database
- Meal prep suggestions
- Water intake tracking`,
			status: "published",
			downloadUrl: "https://example.com/fittrack/v3.0.0",
			fileSize: 52000000,
			buildNumber: "300",
			minOsVersion: "iOS 14.0 / Android 9.0",
			publishedAt: new Date("2024-12-25"),
			createdAt: new Date("2024-12-20"),
		},
		{
			id: "r2-2",
			projectId: "2",
			version: "3.1.0-beta",
			title: "Beta: Apple Watch Support",
			releaseNotes: `## Apple Watch Integration

Testing Apple Watch companion app!

### Features
- Workout tracking on wrist
- Heart rate monitoring
- Quick log exercises
- Sync with iPhone app`,
			status: "beta",
			downloadUrl: "https://example.com/fittrack/v3.1.0-beta",
			fileSize: 54000000,
			buildNumber: "310",
			minOsVersion: "iOS 15.0 / watchOS 9.0",
			createdAt: new Date("2024-12-28"),
		},
	],
	"3": [
		{
			id: "r3-1",
			projectId: "3",
			version: "1.5.0",
			title: "BudgetBuddy - Investment Tracking",
			releaseNotes: `## New: Investment Portfolio

### 📈 Investment Features
- Stock portfolio tracking
- Crypto support
- Dividend tracking
- Cost basis calculations

### 🔄 Sync Improvements
- Bank connection updates
- Faster transaction sync
- Better categorization`,
			status: "published",
			downloadUrl: "https://example.com/budgetbuddy/v1.5.0",
			fileSize: 38000000,
			buildNumber: "150",
			minOsVersion: "iOS 13.0 / Android 8.0",
			publishedAt: new Date("2024-12-15"),
			createdAt: new Date("2024-12-10"),
		},
	],
	"5": [
		{
			id: "r5-1",
			projectId: "5",
			version: "3.0.0",
			title: "PhotoEdit AI 3.0",
			releaseNotes: `## AI Revolution

### 🤖 New AI Features
- One-tap sky replacement
- Portrait mode for any photo
- AI-powered color grading
- Smart object removal

### 🎨 New Filters
- 50+ new filter presets
- Cinematic film looks
- Vintage camera effects`,
			status: "published",
			downloadUrl: "https://example.com/photoedit/v3.0.0",
			fileSize: 68000000,
			buildNumber: "300",
			minOsVersion: "iOS 15.0 / Android 10.0",
			publishedAt: new Date("2024-12-20"),
			createdAt: new Date("2024-12-15"),
		},
	],
};

// PROJECT MEMBERSHIPS

export const mockMemberships: ProjectMembership[] = [
	{
		id: "m1",
		projectId: "4",
		userId: "demo",
		role: "tester",
		status: "approved",
		joinedAt: new Date("2024-10-15"),
	},
	{
		id: "m2",
		projectId: "6",
		userId: "demo",
		role: "tester",
		status: "approved",
		joinedAt: new Date("2024-11-01"),
	},
	{
		id: "m3",
		projectId: "7",
		userId: "demo",
		role: "tester",
		status: "approved",
		joinedAt: new Date("2024-11-20"),
	},
	{
		id: "m4",
		projectId: "1",
		userId: "u1",
		role: "tester",
		status: "approved",
		joinedAt: new Date("2024-12-01"),
	},
	{
		id: "m5",
		projectId: "1",
		userId: "u9",
		role: "tester",
		status: "approved",
		joinedAt: new Date("2024-12-21"),
	},
	{
		id: "m6",
		projectId: "2",
		userId: "u2",
		role: "tester",
		status: "approved",
		joinedAt: new Date("2024-11-15"),
	},
	{
		id: "m7",
		projectId: "2",
		userId: "u5",
		role: "tester",
		status: "approved",
		joinedAt: new Date("2024-12-01"),
	},
	{
		id: "m8",
		projectId: "3",
		userId: "u3",
		role: "tester",
		status: "approved",
		joinedAt: new Date("2024-12-10"),
	},
];

// HELPER FUNCTIONS

export const getUserById = (id: string): User | undefined => {
	return mockUsers.find((u) => u.id === id);
};

export const getProjectById = (id: string): Project | undefined => {
	return mockProjects.find((p) => p.id === id);
};

export const getProjectsByOwner = (ownerId: string): Project[] => {
	return mockProjects.filter((p) => p.ownerId === ownerId);
};

export const getJoinedProjects = (userId: string): Project[] => {
	const membershipProjectIds = mockMemberships
		.filter((m) => m.userId === userId && m.status === "approved")
		.map((m) => m.projectId);
	return mockProjects.filter((p) => membershipProjectIds.includes(p.id));
};

export const getFeedbackForProject = (projectId: string): Feedback[] => {
	return mockFeedbacks.filter((f) => f.projectId === projectId);
};

export const getFeedbackById = (feedbackId: string): Feedback | undefined => {
	return mockFeedbacks.find((f) => f.id === feedbackId);
};

export const getJoinRequestsForProject = (projectId: string): JoinRequest[] => {
	return mockJoinRequests.filter((jr) => jr.projectId === projectId);
};

export const getReleasesForProject = (projectId: string): Release[] => {
	return mockReleases[projectId] || [];
};

export const getConversationsForUser = (_userId: string): Conversation[] => {
	return mockConversations;
};

export const getMessagesForConversation = (
	conversationId: string,
): Message[] => {
	return mockMessages[conversationId] || [];
};

export const getUserEngagement = (
	userId: string,
): UserEngagement | undefined => {
	return mockUserEngagements[userId];
};
