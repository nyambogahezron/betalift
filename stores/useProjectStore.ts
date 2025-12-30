import type { Project, ProjectMembership } from '@/interfaces'
import { create } from 'zustand'

interface ProjectState {
	projects: Project[]
	myProjects: Project[]
	joinedProjects: Project[]
	pendingInvites: ProjectMembership[]
	selectedProject: Project | null
	isLoading: boolean

	// Actions
	fetchProjects: () => Promise<void>
	fetchMyProjects: (userId: string) => Promise<void>
	fetchJoinedProjects: (userId: string) => Promise<void>
	getProjectById: (id: string) => Project | undefined
	selectProject: (project: Project | null) => void
	createProject: (
		project: Omit<Project, 'id' | 'createdAt' | 'testerCount' | 'feedbackCount'>
	) => Promise<Project>
	updateProject: (id: string, updates: Partial<Project>) => void
	joinProject: (projectId: string, userId: string) => Promise<boolean>
	leaveProject: (projectId: string, userId: string) => void
	setLoading: (loading: boolean) => void
}

// Mock projects data
const mockProjects: Project[] = [
	{
		id: '1',
		name: 'TaskFlow Pro',
		description:
			'A modern task management app with AI-powered prioritization and smart scheduling. Features include drag-and-drop organization, team collaboration, time tracking, and detailed analytics dashboard.',
		shortDescription: 'AI-powered task management',
		ownerId: '1',
		ownerName: 'John Creator',
		ownerAvatar: 'https://i.pravatar.cc/150?u=1',
		status: 'active',
		category: 'mobile-app',
		links: {
			website: 'https://taskflowpro.app',
			testFlight: 'https://testflight.apple.com/taskflow',
			github: 'https://github.com/taskflow/app',
		},
		screenshots: [
			'https://picsum.photos/seed/tf1/400/800',
			'https://picsum.photos/seed/tf2/400/800',
			'https://picsum.photos/seed/tf3/400/800',
			'https://picsum.photos/seed/tf4/400/800',
		],
		icon: 'https://picsum.photos/seed/tficon/200/200',
		techStack: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL'],
		testerCount: 24,
		feedbackCount: 47,
		maxTesters: 50,
		isPublic: true,
		createdAt: new Date('2024-06-15'),
	},
	{
		id: '2',
		name: 'FitTrack',
		description:
			'Comprehensive fitness tracking application with workout plans, nutrition logging, progress photos, and social features. Integrates with Apple Health and Google Fit.',
		shortDescription: 'Complete fitness companion',
		ownerId: '1',
		ownerName: 'John Creator',
		ownerAvatar: 'https://i.pravatar.cc/150?u=1',
		status: 'active',
		category: 'mobile-app',
		links: {
			website: 'https://fittrack.io',
			playStore: 'https://play.google.com/store/apps/details?id=io.fittrack',
		},
		screenshots: [
			'https://picsum.photos/seed/ft1/400/800',
			'https://picsum.photos/seed/ft2/400/800',
			'https://picsum.photos/seed/ft3/400/800',
		],
		icon: 'https://picsum.photos/seed/fticon/200/200',
		techStack: ['Flutter', 'Dart', 'Firebase', 'TensorFlow'],
		testerCount: 56,
		feedbackCount: 89,
		maxTesters: 100,
		isPublic: true,
		createdAt: new Date('2024-05-20'),
	},
	{
		id: '3',
		name: 'CodeSnippet',
		description:
			'A beautiful code snippet manager for developers. Save, organize, and share your code snippets with syntax highlighting, tags, and cloud sync.',
		shortDescription: 'Code snippet manager',
		ownerId: '3',
		ownerName: 'Alex Developer',
		ownerAvatar: 'https://i.pravatar.cc/150?u=3',
		status: 'active',
		category: 'desktop-app',
		links: {
			website: 'https://codesnippet.dev',
			github: 'https://github.com/codesnippet/app',
		},
		screenshots: [
			'https://picsum.photos/seed/cs1/800/500',
			'https://picsum.photos/seed/cs2/800/500',
		],
		icon: 'https://picsum.photos/seed/csicon/200/200',
		techStack: ['Electron', 'React', 'TypeScript', 'SQLite'],
		testerCount: 15,
		feedbackCount: 23,
		isPublic: true,
		createdAt: new Date('2024-07-01'),
	},
	{
		id: '4',
		name: 'BudgetBuddy',
		description:
			'Personal finance app with expense tracking, budget goals, investment portfolio monitoring, and bill reminders. Features beautiful charts and insights.',
		shortDescription: 'Smart personal finance',
		ownerId: '3',
		ownerName: 'Alex Developer',
		ownerAvatar: 'https://i.pravatar.cc/150?u=3',
		status: 'active',
		category: 'mobile-app',
		links: {
			website: 'https://budgetbuddy.finance',
			testFlight: 'https://testflight.apple.com/budgetbuddy',
			playStore:
				'https://play.google.com/store/apps/details?id=finance.budgetbuddy',
		},
		screenshots: [
			'https://picsum.photos/seed/bb1/400/800',
			'https://picsum.photos/seed/bb2/400/800',
			'https://picsum.photos/seed/bb3/400/800',
		],
		icon: 'https://picsum.photos/seed/bbicon/200/200',
		techStack: ['React Native', 'Expo', 'Supabase', 'Plaid API'],
		testerCount: 42,
		feedbackCount: 65,
		maxTesters: 75,
		isPublic: true,
		createdAt: new Date('2024-04-10'),
	},
	{
		id: '5',
		name: 'PhotoEdit AI',
		description:
			'AI-powered photo editing app with one-tap enhancements, background removal, style transfer, and professional-grade editing tools.',
		shortDescription: 'AI photo editing',
		ownerId: '1',
		ownerName: 'John Creator',
		ownerAvatar: 'https://i.pravatar.cc/150?u=1',
		status: 'closed',
		category: 'mobile-app',
		links: {
			website: 'https://photoedit.ai',
		},
		screenshots: [
			'https://picsum.photos/seed/pe1/400/800',
			'https://picsum.photos/seed/pe2/400/800',
		],
		icon: 'https://picsum.photos/seed/peicon/200/200',
		techStack: ['Swift', 'CoreML', 'Vision', 'Metal'],
		testerCount: 100,
		feedbackCount: 156,
		isPublic: true,
		createdAt: new Date('2024-01-05'),
	},
]

// Mock memberships (for joined projects)
const mockMemberships: ProjectMembership[] = [
	{
		id: 'm1',
		projectId: '3',
		userId: '2',
		role: 'tester',
		status: 'approved',
		joinedAt: new Date('2024-07-15'),
	},
	{
		id: 'm2',
		projectId: '4',
		userId: '2',
		role: 'tester',
		status: 'approved',
		joinedAt: new Date('2024-08-01'),
	},
	{
		id: 'm3',
		projectId: '1',
		userId: '2',
		role: 'tester',
		status: 'pending',
		joinedAt: new Date('2024-08-10'),
	},
]

export const useProjectStore = create<ProjectState>()((set, get) => ({
	projects: [],
	myProjects: [],
	joinedProjects: [],
	pendingInvites: [],
	selectedProject: null,
	isLoading: false,

	fetchProjects: async () => {
		set({ isLoading: true })
		await new Promise((resolve) => setTimeout(resolve, 500))
		set({ projects: mockProjects, isLoading: false })
	},

	fetchMyProjects: async (userId: string) => {
		set({ isLoading: true })
		await new Promise((resolve) => setTimeout(resolve, 500))
		const myProjects = mockProjects.filter((p) => p.ownerId === userId)
		set({ myProjects, isLoading: false })
	},

	fetchJoinedProjects: async (userId: string) => {
		set({ isLoading: true })
		await new Promise((resolve) => setTimeout(resolve, 500))

		const approvedMemberships = mockMemberships.filter(
			(m) => m.userId === userId && m.status === 'approved'
		)
		const pendingMemberships = mockMemberships.filter(
			(m) => m.userId === userId && m.status === 'pending'
		)

		const joinedProjects = mockProjects.filter((p) =>
			approvedMemberships.some((m) => m.projectId === p.id)
		)

		set({
			joinedProjects,
			pendingInvites: pendingMemberships,
			isLoading: false,
		})
	},

	getProjectById: (id: string) => {
		return mockProjects.find((p) => p.id === id)
	},

	selectProject: (project: Project | null) => {
		set({ selectedProject: project })
	},

	createProject: async (projectData) => {
		set({ isLoading: true })
		await new Promise((resolve) => setTimeout(resolve, 800))

		const newProject: Project = {
			...projectData,
			id: Date.now().toString(),
			testerCount: 0,
			feedbackCount: 0,
			createdAt: new Date(),
		}

		mockProjects.unshift(newProject)
		set((state) => ({
			projects: [newProject, ...state.projects],
			myProjects: [newProject, ...state.myProjects],
			isLoading: false,
		}))

		return newProject
	},

	updateProject: (id: string, updates: Partial<Project>) => {
		const projectIndex = mockProjects.findIndex((p) => p.id === id)
		if (projectIndex !== -1) {
			mockProjects[projectIndex] = {
				...mockProjects[projectIndex],
				...updates,
				updatedAt: new Date(),
			}
			set((state) => ({
				projects: state.projects.map((p) =>
					p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
				),
				myProjects: state.myProjects.map((p) =>
					p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
				),
				selectedProject:
					state.selectedProject?.id === id
						? { ...state.selectedProject, ...updates, updatedAt: new Date() }
						: state.selectedProject,
			}))
		}
	},

	joinProject: async (projectId: string, userId: string) => {
		set({ isLoading: true })
		await new Promise((resolve) => setTimeout(resolve, 500))

		const newMembership: ProjectMembership = {
			id: `m${Date.now()}`,
			projectId,
			userId,
			role: 'tester',
			status: 'pending',
			joinedAt: new Date(),
		}

		mockMemberships.push(newMembership)

		set((state) => ({
			pendingInvites: [...state.pendingInvites, newMembership],
			isLoading: false,
		}))

		return true
	},

	leaveProject: (projectId: string, userId: string) => {
		const index = mockMemberships.findIndex(
			(m) => m.projectId === projectId && m.userId === userId
		)
		if (index !== -1) {
			mockMemberships.splice(index, 1)
		}

		set((state) => ({
			joinedProjects: state.joinedProjects.filter((p) => p.id !== projectId),
			pendingInvites: state.pendingInvites.filter(
				(m) => m.projectId !== projectId
			),
		}))
	},

	setLoading: (loading: boolean) => {
		set({ isLoading: loading })
	},
}))
