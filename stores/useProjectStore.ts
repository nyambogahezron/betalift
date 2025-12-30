import { mockMemberships, mockProjects } from '@/data/mockData'
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

// Use mutable copies
let projectsData = [...mockProjects]
let membershipsData = [...mockMemberships]

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
		set({ projects: projectsData, isLoading: false })
	},

	fetchMyProjects: async (userId: string) => {
		set({ isLoading: true })
		await new Promise((resolve) => setTimeout(resolve, 500))
		const myProjects = projectsData.filter((p) => p.ownerId === userId)
		set({ myProjects, isLoading: false })
	},

	fetchJoinedProjects: async (userId: string) => {
		set({ isLoading: true })
		await new Promise((resolve) => setTimeout(resolve, 500))

		const approvedMemberships = membershipsData.filter(
			(m) => m.userId === userId && m.status === 'approved'
		)
		const pendingMemberships = membershipsData.filter(
			(m) => m.userId === userId && m.status === 'pending'
		)

		const joinedProjects = projectsData.filter((p) =>
			approvedMemberships.some((m) => m.projectId === p.id)
		)

		set({
			joinedProjects,
			pendingInvites: pendingMemberships,
			isLoading: false,
		})
	},

	getProjectById: (id: string) => {
		return projectsData.find((p) => p.id === id)
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

		projectsData.unshift(newProject)
		set((state) => ({
			projects: [newProject, ...state.projects],
			myProjects: [newProject, ...state.myProjects],
			isLoading: false,
		}))

		return newProject
	},

	updateProject: (id: string, updates: Partial<Project>) => {
		const projectIndex = projectsData.findIndex((p) => p.id === id)
		if (projectIndex !== -1) {
			projectsData[projectIndex] = {
				...projectsData[projectIndex],
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

		membershipsData.push(newMembership)

		set((state) => ({
			pendingInvites: [...state.pendingInvites, newMembership],
			isLoading: false,
		}))

		return true
	},

	leaveProject: (projectId: string, userId: string) => {
		const index = membershipsData.findIndex(
			(m) => m.projectId === projectId && m.userId === userId
		)
		if (index !== -1) {
			membershipsData.splice(index, 1)
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
