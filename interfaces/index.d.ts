interface User {
	id: string
	email: string
	username: string
	avatar?: string
	role: 'creator' | 'tester'
	createdAt: Date
}

interface Project {
	id: string
	name: string
	description: string
	creatorId: string
	status: 'active' | 'closed'
	links: {
		website?: string
		testFlight?: string
		playStore?: string
	}
	screenshots: string[]
	techStack: string[]
	testerCount: number
	feedbackCount: number
	createdAt: Date
}

interface Feedback {
	id: string
	projectId: string
	userId: string
	type: 'bug' | 'feature' | 'praise'
	title: string
	description: string
	screenshots: string[]
	deviceInfo: DeviceInfo
	status: 'open' | 'in-progress' | 'resolved'
	upvotes: number
	createdAt: Date
}
