import User from '../models/user.js'
import UserEngagement from '../models/userEngagement.js'

export const seedUsers = async () => {
	const users = [
		{
			email: 'sarah.johnson@example.com',
			username: 'sarahj',
			displayName: 'Sarah Johnson',
			password: 'password123',
			role: 'creator' as const,
			bio: 'Mobile app developer passionate about creating great user experiences',
			isEmailVerified: true,
			avatar: 'https://i.pravatar.cc/150?img=1',
		},
		{
			email: 'mike.chen@example.com',
			username: 'mikechen',
			displayName: 'Mike Chen',
			password: 'password123',
			role: 'tester' as const,
			bio: 'QA engineer who loves finding bugs and improving software quality',
			isEmailVerified: true,
			avatar: 'https://i.pravatar.cc/150?img=2',
		},
		{
			email: 'emily.davis@example.com',
			username: 'emilyd',
			displayName: 'Emily Davis',
			password: 'password123',
			role: 'both' as const,
			bio: 'Full-stack developer and beta testing enthusiast',
			isEmailVerified: true,
			avatar: 'https://i.pravatar.cc/150?img=3',
		},
		{
			email: 'alex.kim@example.com',
			username: 'alexkim',
			displayName: 'Alex Kim',
			password: 'password123',
			role: 'tester' as const,
			bio: 'Tech enthusiast who enjoys testing new applications',
			isEmailVerified: true,
			avatar: 'https://i.pravatar.cc/150?img=4',
		},
		{
			email: 'jessica.martinez@example.com',
			username: 'jessicam',
			displayName: 'Jessica Martinez',
			password: 'password123',
			role: 'creator' as const,
			bio: 'Product designer creating innovative solutions',
			isEmailVerified: true,
			avatar: 'https://i.pravatar.cc/150?img=5',
		},
	]

	const createdUsers = []
	for (const userData of users) {
		const user = await User.create(userData)
		
		// Create engagement profile for each user
		await UserEngagement.create({
			userId: user._id,
			totalTimeSpent: Math.floor(Math.random() * 10000),
			lastActiveAt: new Date(),
		})
		
		createdUsers.push(user)
	}

	return createdUsers
}
