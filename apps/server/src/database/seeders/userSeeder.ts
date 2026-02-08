import User from "../models/user.js";
import UserEngagement from "../models/userEngagement.js";

export const seedUsers = async () => {
	const users = [
		// Super User - Owners most items
		{
			email: "admin@betalift.com",
			username: "superuser",
			displayName: "Super User",
			password: "password123",
			bio: "I am the super user of BetaLift. I own many projects and test many apps.",
			isEmailVerified: true,
			avatar:
				"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "sarah.johnson@example.com",
			username: "sarahj",
			displayName: "Sarah Johnson",
			password: "password123",
			bio: "Mobile app developer passionate about creating great user experiences",
			isEmailVerified: true,
			avatar:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "mike.chen@example.com",
			username: "mikechen",
			displayName: "Mike Chen",
			password: "password123",
			bio: "QA engineer who loves finding bugs and improving software quality",
			isEmailVerified: true,
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "emily.davis@example.com",
			username: "emilyd",
			displayName: "Emily Davis",
			password: "password123",
			bio: "Full-stack developer and beta testing enthusiast",
			isEmailVerified: true,
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "alex.kim@example.com",
			username: "alexkim",
			displayName: "Alex Kim",
			password: "password123",
			bio: "Tech enthusiast who enjoys testing new applications",
			isEmailVerified: true,
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "jessica.martinez@example.com",
			username: "jessicam",
			displayName: "Jessica Martinez",
			password: "password123",
			bio: "Product designer creating innovative solutions",
			isEmailVerified: true,
			avatar:
				"https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "david.wilson@example.com",
			username: "davidw",
			displayName: "David Wilson",
			password: "password123",
			bio: "Avid gamer and mobile app enthusiast",
			isEmailVerified: true,
			avatar:
				"https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "lisa.wang@example.com",
			username: "lisawang",
			displayName: "Lisa Wang",
			password: "password123",
			bio: "Founder of multiple SaaS products",
			isEmailVerified: true,
			avatar:
				"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "james.taylor@example.com",
			username: "jamest",
			displayName: "James Taylor",
			password: "password123",
			bio: "Indie hacker and community builder",
			isEmailVerified: true,
			avatar:
				"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "sophia.brown@example.com",
			username: "sophiab",
			displayName: "Sophia Brown",
			password: "password123",
			bio: "UX researcher looking for usability issues",
			isEmailVerified: true,
			avatar:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
		},
		{
			email: "demo@betalift.com",
			username: "demouser",
			displayName: "Demo User",
			password: "password123",
			bio: "Full-stack developer and app enthusiast. I love building and testing innovative mobile apps. Currently working on several exciting projects and always looking for talented testers!",
			isEmailVerified: true,
			avatar: "https://i.pravatar.cc/150?u=demo",
			createdAt: new Date("2024-01-01"),
		},
		{
			email: "sarah@example.com",
			username: "sarahdev",
			displayName: "Sarah Johnson (Mobile)",
			password: "password123",
			bio: "Mobile developer with 5 years experience. Love testing new apps and providing detailed feedback. Specialized in iOS and React Native development.",
			isEmailVerified: true,
			avatar: "https://i.pravatar.cc/150?u=sarah",
			createdAt: new Date("2024-01-15"),
		},
		{
			email: "mike@example.com",
			username: "miketester",
			displayName: "Mike Chen (Mobile)",
			password: "password123",
			bio: "QA Engineer passionate about finding bugs and improving UX. Expert in accessibility testing and performance optimization.",
			isEmailVerified: true,
			avatar: "https://i.pravatar.cc/150?u=mike",
			createdAt: new Date("2024-02-20"),
		},
		{
			email: "emma@example.com",
			username: "emmaui",
			displayName: "Emma Wilson",
			password: "password123",
			bio: "UI/UX Designer who loves giving design feedback. Focused on creating beautiful and intuitive user experiences.",
			isEmailVerified: true,
			avatar: "https://i.pravatar.cc/150?u=emma",
			createdAt: new Date("2024-03-10"),
		},
		{
			email: "alex@example.com",
			username: "alexcoder",
			displayName: "Alex Rivera",
			password: "password123",
			bio: "Full-stack developer building cool stuff. Passionate about clean code and user-centric design.",
			isEmailVerified: true,
			avatar: "https://i.pravatar.cc/150?u=alex",
			createdAt: new Date("2024-01-05"),
		},
		{
			email: "lisa@example.com",
			username: "lisaqa",
			displayName: "Lisa Park",
			password: "password123",
			bio: "Professional tester. I break things so you don't have to. Expert in edge cases and security testing.",
			isEmailVerified: true,
			avatar: "https://i.pravatar.cc/150?u=lisa",
			createdAt: new Date("2024-04-01"),
		},
		{
			email: "james@example.com",
			username: "jamesbuilds",
			displayName: "James Cooper",
			password: "password123",
			bio: "Indie developer creating apps that solve real problems. Always open to feedback!",
			isEmailVerified: true,
			avatar: "https://i.pravatar.cc/150?u=james",
			createdAt: new Date("2024-02-15"),
		},
		{
			email: "nina@example.com",
			username: "ninatech",
			displayName: "Nina Patel",
			password: "password123",
			bio: "Tech enthusiast and beta testing addict. I test apps on multiple devices and platforms.",
			isEmailVerified: true,
			avatar: "https://i.pravatar.cc/150?u=nina",
			createdAt: new Date("2024-03-20"),
		},
		{
			email: "david@example.com",
			username: "davidux",
			displayName: "David Kim",
			password: "password123",
			bio: "Product designer turned developer. I appreciate both form and function in apps.",
			isEmailVerified: true,
			avatar: "https://i.pravatar.cc/150?u=david",
			createdAt: new Date("2024-04-15"),
		},
		{
			email: "rachel@example.com",
			username: "rachelcodes",
			displayName: "Rachel Green",
			password: "password123",
			bio: "iOS developer with a keen eye for detail. I specialize in testing Apple ecosystem apps.",
			isEmailVerified: true,
			avatar: "https://i.pravatar.cc/150?u=rachel",
			createdAt: new Date("2024-05-01"),
		},
		{
			email: "tom@example.com",
			username: "tomandroid",
			displayName: "Tom Anderson",
			password: "password123",
			bio: "Android developer and tester. Expert in Material Design and Android-specific UX patterns.",
			isEmailVerified: true,
			avatar: "https://i.pravatar.cc/150?u=tom",
			createdAt: new Date("2024-05-15"),
		},
	];

	const createdUsers = [];
	for (const userData of users) {
		const user = await User.create(userData);

		await UserEngagement.create({
			userId: user._id,
			lastActiveAt: new Date(),
		});

		createdUsers.push(user);
	}

	return createdUsers;
};
