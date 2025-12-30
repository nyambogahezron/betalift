import { demoUser, mockFeedbacks, mockUsers } from '@/data/mockData'
import type {
	Feedback,
	FeedbackComment,
	FeedbackFilters,
	FeedbackVote,
	SortOptions,
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

// Use mutable copy
let feedbacksData = [...mockFeedbacks]

// Mock comments - enhanced with more entries
const mockComments: FeedbackComment[] = [
	{
		id: 'c1',
		feedbackId: 'f1',
		userId: 'demo',
		user: demoUser,
		content:
			'Thank you for reporting this! We have identified the issue and are working on a fix. Will be resolved in the next update.',
		createdAt: new Date('2024-12-01T10:30:00'),
	},
	{
		id: 'c2',
		feedbackId: 'f1',
		userId: 'u2',
		user: mockUsers.find((u) => u.id === 'u2')!,
		content:
			'Great, looking forward to the fix! Let me know if you need any more information.',
		createdAt: new Date('2024-12-01T11:00:00'),
	},
	{
		id: 'c3',
		feedbackId: 'f2',
		userId: 'demo',
		user: demoUser,
		content:
			'Dark mode is now in development! Expected release in version 2.1.0.',
		createdAt: new Date('2024-11-30T09:00:00'),
	},
	{
		id: 'c4',
		feedbackId: 'f2',
		userId: 'u5',
		user: mockUsers.find((u) => u.id === 'u5')!,
		content:
			'Awesome! Will it support automatic switching based on system settings?',
		createdAt: new Date('2024-11-30T10:15:00'),
	},
	{
		id: 'c5',
		feedbackId: 'f3',
		userId: 'demo',
		user: demoUser,
		content:
			'Thank you so much for the kind words! Glad you love the AI feature! 🎉',
		createdAt: new Date('2024-11-26T08:00:00'),
	},
	{
		id: 'c6',
		feedbackId: 'f4',
		userId: 'demo',
		user: demoUser,
		content:
			'This is a critical bug. We are investigating immediately. In the meantime, please check if you had cloud backup enabled.',
		createdAt: new Date('2024-11-20T09:00:00'),
	},
	{
		id: 'c7',
		feedbackId: 'f4',
		userId: 'u7',
		user: mockUsers.find((u) => u.id === 'u7')!,
		content: 'I did have backup enabled but it seems the data was overwritten.',
		createdAt: new Date('2024-11-20T10:30:00'),
	},
	{
		id: 'c8',
		feedbackId: 'f4',
		userId: 'demo',
		user: demoUser,
		content:
			'We found the issue and released a hotfix (v1.2.4). Your data should now be restored from our server backup. Please update and let us know!',
		createdAt: new Date('2024-11-22T14:00:00'),
	},
]

// Mock votes
const mockVotes: FeedbackVote[] = []

export const useFeedbackStore = create<FeedbackState>()((set, get) => ({
	feedbacks: feedbacksData,
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
		let filtered = feedbacksData.filter((f) => f.projectId === projectId)

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
		return feedbacksData.find((f) => f.id === id)
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

		feedbacksData.unshift(newFeedback)

		set((state) => ({
			feedbacks: [newFeedback, ...state.feedbacks],
			projectFeedbacks: [newFeedback, ...state.projectFeedbacks],
			isLoading: false,
		}))

		return newFeedback
	},

	updateFeedback: (id: string, updates: Partial<Feedback>) => {
		const index = feedbacksData.findIndex((f) => f.id === id)
		if (index !== -1) {
			feedbacksData[index] = {
				...feedbacksData[index],
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
		const index = feedbacksData.findIndex((f) => f.id === id)
		if (index !== -1) {
			feedbacksData.splice(index, 1)
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
				const feedback = feedbacksData.find((f) => f.id === feedbackId)
				if (feedback) {
					feedback[updateKey] = Math.max(0, feedback[updateKey] - 1)
				}
			} else {
				// Change vote
				existingVote.type = type
				const feedback = feedbacksData.find((f) => f.id === feedbackId)
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

			const feedback = feedbacksData.find((f) => f.id === feedbackId)
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
			feedbacks: [...feedbacksData],
			projectFeedbacks: state.projectFeedbacks.map((f) => {
				const updated = feedbacksData.find((mf) => mf.id === f.id)
				return updated || f
			}),
			selectedFeedback: state.selectedFeedback
				? feedbacksData.find((f) => f.id === state.selectedFeedback?.id) ||
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
		const feedback = feedbacksData.find((f) => f.id === feedbackId)
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
