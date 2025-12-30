import { demoUser, mockUsers } from '@/data/mockData'
import type { User, UserSettings } from '@/interfaces'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
	user: User | null
	isAuthenticated: boolean
	isLoading: boolean
	hasSeenOnboarding: boolean
	settings: UserSettings

	// Actions
	login: (email: string, password: string) => Promise<boolean>
	loginAsDemo: () => Promise<boolean>
	register: (
		email: string,
		password: string,
		username: string,
		role: User['role']
	) => Promise<boolean>
	logout: () => void
	updateProfile: (updates: Partial<User>) => void
	updateSettings: (updates: Partial<UserSettings>) => void
	setLoading: (loading: boolean) => void
	setHasSeenOnboarding: (seen: boolean) => void
}

const defaultSettings: UserSettings = {
	notifications: {
		pushEnabled: true,
		emailEnabled: true,
		feedbackUpdates: true,
		projectInvites: true,
		weeklyDigest: false,
	},
	privacy: {
		profilePublic: true,
		showEmail: false,
		showStats: true,
	},
	appearance: {
		theme: 'dark',
		language: 'en',
	},
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			isLoading: false,
			hasSeenOnboarding: false,
			settings: defaultSettings,

			login: async (email: string, password: string) => {
				set({ isLoading: true })

				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 1000))

				const user = mockUsers.find(
					(u) => u.email.toLowerCase() === email.toLowerCase()
				)

				if (user) {
					set({ user, isAuthenticated: true, isLoading: false })
					return true
				}

				// For demo, create a new user on login
				const newUser: User = {
					id: Date.now().toString(),
					email,
					username: email.split('@')[0],
					displayName: email.split('@')[0],
					role: 'both',
					stats: {
						projectsCreated: 0,
						projectsTested: 0,
						feedbackGiven: 0,
						feedbackReceived: 0,
					},
					createdAt: new Date(),
				}

				set({ user: newUser, isAuthenticated: true, isLoading: false })
				return true
			},

			loginAsDemo: async () => {
				set({ isLoading: true })

				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 800))

				// Use the comprehensive demo account
				set({ user: demoUser, isAuthenticated: true, isLoading: false })
				return true
			},

			register: async (
				email: string,
				password: string,
				username: string,
				role: User['role']
			) => {
				set({ isLoading: true })

				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 1000))

				const newUser: User = {
					id: Date.now().toString(),
					email,
					username,
					displayName: username,
					role,
					stats: {
						projectsCreated: 0,
						projectsTested: 0,
						feedbackGiven: 0,
						feedbackReceived: 0,
					},
					createdAt: new Date(),
				}

				set({ user: newUser, isAuthenticated: true, isLoading: false })
				return true
			},

			logout: () => {
				set({ user: null, isAuthenticated: false, settings: defaultSettings })
			},

			setHasSeenOnboarding: (seen: boolean) => {
				set({ hasSeenOnboarding: seen })
			},

			updateProfile: (updates: Partial<User>) => {
				const { user } = get()
				if (user) {
					set({ user: { ...user, ...updates, updatedAt: new Date() } })
				}
			},

			updateSettings: (updates: Partial<UserSettings>) => {
				const { settings } = get()
				set({
					settings: {
						...settings,
						...updates,
					},
				})
			},

			setLoading: (loading: boolean) => {
				set({ isLoading: loading })
			},
		}),
		{
			name: 'betalift-auth',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
				hasSeenOnboarding: state.hasSeenOnboarding,
				settings: state.settings,
			}),
		}
	)
)
