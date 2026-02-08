import type { User } from "@/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
	user: (User & { accessToken?: string }) | null;
	isAuthenticated: boolean;
	hasSeenOnboarding: boolean;

	setUser: (user: (User & { accessToken?: string }) | null) => void;
	setAuthenticated: (isAuthenticated: boolean) => void;
	clearAuth: () => void;
	updateProfile: (updates: Partial<User>) => void;
	setHasSeenOnboarding: (seen: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			hasSeenOnboarding: false,

			setUser: (user: (User & { accessToken?: string }) | null) => {
				set({
					user,
					isAuthenticated: !!user,
				});
			},

			setAuthenticated: (isAuthenticated: boolean) => {
				set({ isAuthenticated });
			},

			clearAuth: () => {
				set({
					user: null,
					isAuthenticated: false,
				});
			},

			updateProfile: (updates: Partial<User>) => {
				const currentUser = get().user;
				if (currentUser) {
					set({
						user: { ...currentUser, ...updates },
					});
				}
			},

			setHasSeenOnboarding: (seen: boolean) => {
				set({ hasSeenOnboarding: seen });
			},
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
				hasSeenOnboarding: state.hasSeenOnboarding,
			}),
		},
	),
);
