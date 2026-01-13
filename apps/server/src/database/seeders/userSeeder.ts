import User from "../models/user.js";
import UserEngagement from "../models/userEngagement.js";

export const seedUsers = async () => {
	const users = [
		// Super User - Owners most items
		{
			email: "admin@betalift.com",
			username: "superuser",
			displayName: "Super User",
			password: "password123", // Will be hashed by pre-save hook
			role: "both" as const,
			bio: "I am the super user of BetaLift. I own many projects and test many apps.",
			isEmailVerified: true,
			avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "sarah.johnson@example.com",
			username: "sarahj",
			displayName: "Sarah Johnson",
			password: "password123",
			role: "creator" as const,
			bio: "Mobile app developer passionate about creating great user experiences",
			isEmailVerified: true,
			avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "mike.chen@example.com",
			username: "mikechen",
			displayName: "Mike Chen",
			password: "password123",
			role: "tester" as const,
			bio: "QA engineer who loves finding bugs and improving software quality",
			isEmailVerified: true,
			avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "emily.davis@example.com",
			username: "emilyd",
			displayName: "Emily Davis",
			password: "password123",
			role: "both" as const,
			bio: "Full-stack developer and beta testing enthusiast",
			isEmailVerified: true,
			avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "alex.kim@example.com",
			username: "alexkim",
			displayName: "Alex Kim",
			password: "password123",
			role: "tester" as const,
			bio: "Tech enthusiast who enjoys testing new applications",
			isEmailVerified: true,
			avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "jessica.martinez@example.com",
			username: "jessicam",
			displayName: "Jessica Martinez",
			password: "password123",
			role: "creator" as const,
			bio: "Product designer creating innovative solutions",
			isEmailVerified: true,
			avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "david.wilson@example.com",
			username: "davidw",
			displayName: "David Wilson",
			password: "password123",
			role: "tester" as const,
			bio: "Avid gamer and mobile app enthusiast",
			isEmailVerified: true,
			avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "lisa.wang@example.com",
			username: "lisawang",
			displayName: "Lisa Wang",
			password: "password123",
			role: "creator" as const,
			bio: "Founder of multiple SaaS products",
			isEmailVerified: true,
			avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "james.taylor@example.com",
			username: "jamest",
			displayName: "James Taylor",
			password: "password123",
			role: "both" as const,
			bio: "Indie hacker and community builder",
			isEmailVerified: true,
			avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "sophia.brown@example.com",
			username: "sophiab",
			displayName: "Sophia Brown",
			password: "password123",
			role: "tester" as const,
			bio: "UX researcher looking for usability issues",
			isEmailVerified: true,
			avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
		}
	];

	const createdUsers = [];
	for (const userData of users) {
		const user = await User.create(userData);

		// Create engagement profile for each user
		await UserEngagement.create({
			userId: user._id,
			lastActiveAt: new Date(),
		});

		createdUsers.push(user);
	}

	return createdUsers;
};
