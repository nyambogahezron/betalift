import type {
	Feedback,
	FeedbackComment,
	FeedbackFilters,
	FeedbackVote,
	SortOptions,
	User,
} from '@/interfaces'
import { create } from 'zustand'

interface FeedbackState {
	feedbacks: Feedback[]
	projectFeedbacks: Feedback[]
	selectedFeedback: Feedback | null
	comments: FeedbackComment[]
	filters: FeedbackFilters
	sortOptions: SortOptions
	isLoading: boolean

	// Actions
	fetchFeedbacks: (projectId: string) => Promise<void>
	getFeedbackById: (id: string) => Feedback | undefined
	selectFeedback: (feedback: Feedback | null) => void
	createFeedback: (
		feedback: Omit<
			Feedback,
			'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'commentCount'
		>
	) => Promise<Feedback>
	updateFeedback: (id: string, updates: Partial<Feedback>) => void
	deleteFeedback: (id: string) => void
	voteFeedback: (
		feedbackId: string,
		userId: string,
		type: 'up' | 'down'
	) => void
	fetchComments: (feedbackId: string) => Promise<void>
	addComment: (
		feedbackId: string,
		userId: string,
		content: string
	) => Promise<FeedbackComment>
	setFilters: (filters: FeedbackFilters) => void
	setSortOptions: (options: SortOptions) => void
	clearFilters: () => void
	setLoading: (loading: boolean) => void
}

// Mock users for feedback
const mockUsers: Record<string, User> = {
	'2': {
		id: '2',
		email: 'tester@betalift.com',
		username: 'janetester',
		displayName: 'Jane Tester',
		avatar: 'https://i.pravatar.cc/150?u=2',
		role: 'tester',
		stats: {
			projectsCreated: 0,
			projectsTested: 12,
			feedbackGiven: 89,
			feedbackReceived: 5,
		},
		createdAt: new Date('2024-02-20'),
	},
	'4': {
		id: '4',
		email: 'mike@betalift.com',
		username: 'miketest',
		displayName: 'Mike Tester',
		avatar: 'https://i.pravatar.cc/150?u=4',
		role: 'tester',
		stats: {
			projectsCreated: 1,
			projectsTested: 8,
			feedbackGiven: 45,
			feedbackReceived: 12,
		},
		createdAt: new Date('2024-04-05'),
	},
	'5': {
		id: '5',
		email: 'sarah@betalift.com',
		username: 'sarahdev',
		displayName: 'Sarah Developer',
		avatar: 'https://i.pravatar.cc/150?u=5',
		role: 'both',
		stats: {
			projectsCreated: 2,
			projectsTested: 6,
			feedbackGiven: 34,
			feedbackReceived: 28,
		},
		createdAt: new Date('2024-03-15'),
	},
}

// Mock feedback data
const mockFeedbacks: Feedback[] = [
	{
		id: 'f1',
		projectId: '1',
		userId: '2',
		user: mockUsers['2'],
		type: 'bug',
		priority: 'high',
		title: 'App crashes when adding task with long title',
		description:
			'When I try to create a task with a title longer than 100 characters, the app crashes immediately. This happens consistently on both iOS and Android. Steps to reproduce:\n1. Open the app\n2. Click "Add Task"\n3. Enter a very long title (100+ characters)\n4. Click Save\n\nExpected: Task should be created or show error\nActual: App crashes',
		screenshots: [
			'https://picsum.photos/seed/bug1/400/800',
			'https://picsum.photos/seed/bug2/400/800',
		],
		deviceInfo: {
			platform: 'ios',
			osVersion: '17.2',
			deviceModel: 'iPhone 15 Pro',
			appVersion: '1.2.3',
		},
		status: 'open',
		upvotes: 12,
		downvotes: 0,
		commentCount: 3,
		createdAt: new Date('2024-08-01'),
	},
	{
		id: 'f2',
		projectId: '1',
		userId: '4',
		user: mockUsers['4'],
		type: 'feature',
		priority: 'medium',
		title: 'Add dark mode support',
		description:
			'It would be great to have a dark mode option. The current light theme is a bit harsh on the eyes when using the app at night. Many modern apps support this feature and it would greatly improve the user experience.',
		screenshots: [],
		deviceInfo: {
			platform: 'android',
			osVersion: '14',
			deviceModel: 'Pixel 8',
			appVersion: '1.2.3',
		},
		status: 'in-progress',
		upvotes: 45,
		downvotes: 2,
		commentCount: 8,
		createdAt: new Date('2024-07-28'),
	},
	{
		id: 'f3',
		projectId: '1',
		userId: '5',
		user: mockUsers['5'],
		type: 'praise',
		title: 'Love the new AI prioritization feature!',
		description:
			'The AI prioritization feature is amazing! It correctly identified my most urgent tasks and helped me focus on what matters. The suggestions are spot on and have improved my productivity significantly. Great work!',
		screenshots: ['https://picsum.photos/seed/praise1/400/800'],
		status: 'resolved',
		upvotes: 28,
		downvotes: 0,
		commentCount: 2,
		createdAt: new Date('2024-07-25'),
	},
	{
		id: 'f4',
		projectId: '1',
		userId: '2',
		user: mockUsers['2'],
		type: 'bug',
		priority: 'critical',
		title: 'Data loss after app update',
		description:
			'After updating to version 1.2.3, all my tasks disappeared. I had over 50 tasks organized in different categories. This is a critical issue as I lost weeks of work.',
		screenshots: [],
		deviceInfo: {
			platform: 'ios',
			osVersion: '17.1',
			deviceModel: 'iPhone 14',
			appVersion: '1.2.3',
		},
		status: 'resolved',
		upvotes: 67,
		downvotes: 0,
		commentCount: 15,
		createdAt: new Date('2024-07-20'),
		resolvedAt: new Date('2024-07-22'),
	},
	{
		id: 'f5',
		projectId: '1',
		userId: '4',
		user: mockUsers['4'],
		type: 'feature',
		priority: 'low',
		title: 'Widget for home screen',
		description:
			'A home screen widget showing upcoming tasks would be very useful. It would allow quick glance at tasks without opening the app.',
		screenshots: [],
		deviceInfo: {
			platform: 'android',
			osVersion: '14',
			deviceModel: 'Samsung S24',
			appVersion: '1.2.2',
		},
		status: 'open',
		upvotes: 34,
		downvotes: 5,
		commentCount: 4,
		createdAt: new Date('2024-07-15'),
	},
	{
		id: 'f6',
		projectId: '2',
		userId: '2',
		user: mockUsers['2'],
		type: 'bug',
		priority: 'medium',
		title: 'Calorie calculation seems incorrect',
		description:
			'The calorie burn calculation for running seems to be off. When I run 5km, it shows I burned 800 calories which seems way too high based on other fitness apps.',
		screenshots: ['https://picsum.photos/seed/fitbug1/400/800'],
		deviceInfo: {
			platform: 'ios',
			osVersion: '17.2',
			deviceModel: 'iPhone 15',
			appVersion: '2.1.0',
		},
		status: 'open',
		upvotes: 23,
		downvotes: 3,
		commentCount: 6,
		createdAt: new Date('2024-08-05'),
	},
	{
		id: 'f7',
		projectId: '3',
		userId: '5',
		user: mockUsers['5'],
		type: 'feature',
		title: 'Support for more languages',
		description:
			'Please add syntax highlighting support for Rust, Go, and Kotlin. Currently only JavaScript, Python, and Java are supported.',
		screenshots: [],
		status: 'in-progress',
		upvotes: 19,
		downvotes: 0,
		commentCount: 3,
		createdAt: new Date('2024-07-30'),
	},
	{
		id: 'f8',
		projectId: '4',
		userId: '2',
		user: mockUsers['2'],
		type: 'praise',
		title: 'Best budget app I have used!',
		description:
			'The interface is so clean and intuitive. I finally understand where my money goes each month. The insights feature is particularly helpful!',
		screenshots: [],
		status: 'resolved',
		upvotes: 41,
		downvotes: 1,
		commentCount: 5,
		createdAt: new Date('2024-08-02'),
	},
]

// Mock comments
const mockComments: FeedbackComment[] = [
	{
		id: 'c1',
		feedbackId: 'f1',
		userId: '1',
		user: {
			id: '1',
			email: 'creator@betalift.com',
			username: 'johncreator',
			displayName: 'John Creator',
			avatar: 'https://i.pravatar.cc/150?u=1',
			role: 'creator',
			stats: {
				projectsCreated: 5,
				projectsTested: 2,
				feedbackGiven: 15,
				feedbackReceived: 47,
			},
			createdAt: new Date('2024-01-15'),
		},
		content:
			'Thank you for reporting this! We have identified the issue and are working on a fix. Will be resolved in the next update.',
		createdAt: new Date('2024-08-01T10:30:00'),
	},
	{
		id: 'c2',
		feedbackId: 'f1',
		userId: '2',
		user: mockUsers['2'],
		content:
			'Great, looking forward to the fix! Let me know if you need any more information.',
		createdAt: new Date('2024-08-01T11:00:00'),
	},
	{
		id: 'c3',
		feedbackId: 'f2',
		userId: '1',
		user: {
			id: '1',
			email: 'creator@betalift.com',
			username: 'johncreator',
			displayName: 'John Creator',
			avatar: 'https://i.pravatar.cc/150?u=1',
			role: 'creator',
			stats: {
				projectsCreated: 5,
				projectsTested: 2,
				feedbackGiven: 15,
				feedbackReceived: 47,
			},
			createdAt: new Date('2024-01-15'),
		},
		content:
			'Dark mode is now in development! Expected release in version 1.3.0.',
		createdAt: new Date('2024-07-30T09:00:00'),
	},
]

// Mock votes
const mockVotes: FeedbackVote[] = []

export const useFeedbackStore = create<FeedbackState>()((set, get) => ({
	feedbacks: mockFeedbacks,
	projectFeedbacks: [],
	selectedFeedback: null,
	comments: [],
	filters: {},
	sortOptions: { field: 'createdAt', direction: 'desc' },
	isLoading: false,

	fetchFeedbacks: async (projectId: string) => {
		set({ isLoading: true })
		await new Promise((resolve) => setTimeout(resolve, 500))

		const { filters, sortOptions } = get()
		let filtered = mockFeedbacks.filter((f) => f.projectId === projectId)

		// Apply filters
		if (filters.type && filters.type.length > 0) {
			filtered = filtered.filter((f) => filters.type!.includes(f.type))
		}
		if (filters.status && filters.status.length > 0) {
			filtered = filtered.filter((f) => filters.status!.includes(f.status))
		}
		if (filters.priority && filters.priority.length > 0) {
			filtered = filtered.filter(
				(f) => f.priority && filters.priority!.includes(f.priority)
			)
		}

		// Apply sorting
		filtered.sort((a, b) => {
			let aVal: number | Date
			let bVal: number | Date

			switch (sortOptions.field) {
				case 'upvotes':
					aVal = a.upvotes
					bVal = b.upvotes
					break
				case 'createdAt':
				default:
					aVal = new Date(a.createdAt)
					bVal = new Date(b.createdAt)
			}

			if (sortOptions.direction === 'asc') {
				return aVal > bVal ? 1 : -1
			}
			return aVal < bVal ? 1 : -1
		})

		set({ projectFeedbacks: filtered, isLoading: false })
	},

	getFeedbackById: (id: string) => {
		return mockFeedbacks.find((f) => f.id === id)
	},

	selectFeedback: (feedback: Feedback | null) => {
		set({ selectedFeedback: feedback })
	},

	createFeedback: async (feedbackData) => {
		set({ isLoading: true })
		await new Promise((resolve) => setTimeout(resolve, 500))

		const newFeedback: Feedback = {
			...feedbackData,
			id: `f${Date.now()}`,
			upvotes: 0,
			downvotes: 0,
			commentCount: 0,
			createdAt: new Date(),
		}

		mockFeedbacks.unshift(newFeedback)

		set((state) => ({
			feedbacks: [newFeedback, ...state.feedbacks],
			projectFeedbacks: [newFeedback, ...state.projectFeedbacks],
			isLoading: false,
		}))

		return newFeedback
	},

	updateFeedback: (id: string, updates: Partial<Feedback>) => {
		const index = mockFeedbacks.findIndex((f) => f.id === id)
		if (index !== -1) {
			mockFeedbacks[index] = {
				...mockFeedbacks[index],
				...updates,
				updatedAt: new Date(),
			}

			set((state) => ({
				feedbacks: state.feedbacks.map((f) =>
					f.id === id ? { ...f, ...updates, updatedAt: new Date() } : f
				),
				projectFeedbacks: state.projectFeedbacks.map((f) =>
					f.id === id ? { ...f, ...updates, updatedAt: new Date() } : f
				),
				selectedFeedback:
					state.selectedFeedback?.id === id
						? { ...state.selectedFeedback, ...updates, updatedAt: new Date() }
						: state.selectedFeedback,
			}))
		}
	},

	deleteFeedback: (id: string) => {
		const index = mockFeedbacks.findIndex((f) => f.id === id)
		if (index !== -1) {
			mockFeedbacks.splice(index, 1)
		}

		set((state) => ({
			feedbacks: state.feedbacks.filter((f) => f.id !== id),
			projectFeedbacks: state.projectFeedbacks.filter((f) => f.id !== id),
			selectedFeedback:
				state.selectedFeedback?.id === id ? null : state.selectedFeedback,
		}))
	},

	voteFeedback: (feedbackId: string, userId: string, type: 'up' | 'down') => {
		const existingVote = mockVotes.find(
			(v) => v.feedbackId === feedbackId && v.userId === userId
		)

		if (existingVote) {
			if (existingVote.type === type) {
				// Remove vote
				const index = mockVotes.indexOf(existingVote)
				mockVotes.splice(index, 1)

				const updateKey = type === 'up' ? 'upvotes' : 'downvotes'
				const feedback = mockFeedbacks.find((f) => f.id === feedbackId)
				if (feedback) {
					feedback[updateKey] = Math.max(0, feedback[updateKey] - 1)
				}
			} else {
				// Change vote
				existingVote.type = type
				const feedback = mockFeedbacks.find((f) => f.id === feedbackId)
				if (feedback) {
					if (type === 'up') {
						feedback.upvotes += 1
						feedback.downvotes = Math.max(0, feedback.downvotes - 1)
					} else {
						feedback.downvotes += 1
						feedback.upvotes = Math.max(0, feedback.upvotes - 1)
					}
				}
			}
		} else {
			// Add new vote
			mockVotes.push({
				id: `v${Date.now()}`,
				feedbackId,
				userId,
				type,
				createdAt: new Date(),
			})

			const feedback = mockFeedbacks.find((f) => f.id === feedbackId)
			if (feedback) {
				if (type === 'up') {
					feedback.upvotes += 1
				} else {
					feedback.downvotes += 1
				}
			}
		}

		// Update state
		set((state) => ({
			feedbacks: [...mockFeedbacks],
			projectFeedbacks: state.projectFeedbacks.map((f) => {
				const updated = mockFeedbacks.find((mf) => mf.id === f.id)
				return updated || f
			}),
			selectedFeedback: state.selectedFeedback
				? mockFeedbacks.find((f) => f.id === state.selectedFeedback?.id) ||
				  state.selectedFeedback
				: null,
		}))
	},

	fetchComments: async (feedbackId: string) => {
		set({ isLoading: true })
		await new Promise((resolve) => setTimeout(resolve, 300))

		const comments = mockComments.filter((c) => c.feedbackId === feedbackId)
		set({ comments, isLoading: false })
	},

	addComment: async (feedbackId: string, userId: string, content: string) => {
		await new Promise((resolve) => setTimeout(resolve, 300))

		const newComment: FeedbackComment = {
			id: `c${Date.now()}`,
			feedbackId,
			userId,
			content,
			createdAt: new Date(),
		}

		mockComments.push(newComment)

		// Update feedback comment count
		const feedback = mockFeedbacks.find((f) => f.id === feedbackId)
		if (feedback) {
			feedback.commentCount += 1
		}

		set((state) => ({
			comments: [...state.comments, newComment],
		}))

		return newComment
	},

	setFilters: (filters: FeedbackFilters) => {
		set({ filters })
	},

	setSortOptions: (options: SortOptions) => {
		set({ sortOptions: options })
	},

	clearFilters: () => {
		set({ filters: {} })
	},

	setLoading: (loading: boolean) => {
		set({ isLoading: loading })
	},
}))
