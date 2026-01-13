import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api";

interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data?: T;
}

export const userKeys = {
	all: ["users"] as const,
	lists: () => [...userKeys.all, "list"] as const,
	list: (params?: any) => [...userKeys.lists(), params] as const,
	details: () => [...userKeys.all, "detail"] as const,
	detail: (id: string) => [...userKeys.details(), id] as const,
	stats: (id: string) => [...userKeys.detail(id), "stats"] as const,
	settings: (id: string) => [...userKeys.detail(id), "settings"] as const,
	engagement: (id: string) => [...userKeys.detail(id), "engagement"] as const,
};

export const useUsers = (params?: {
	page?: number;
	limit?: number;
	search?: string;
	role?: string;
}) => {
	return useQuery({
		queryKey: userKeys.list(params),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>("/api/v1/users", {
				params,
			});

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to fetch users");
		},
	});
};

export const useUser = (userId: string) => {
	return useQuery({
		queryKey: userKeys.detail(userId),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>(
				`/api/v1/users/${userId}`,
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to fetch user");
		},
		enabled: !!userId,
	});
};

export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			userId: string;
			updates: {
				username?: string;
				displayName?: string;
				bio?: string;
				avatar?: string;
				role?: "creator" | "tester" | "both";
			};
		}) => {
			const response = await apiClient.patch<ApiResponse<any>>(
				`/api/v1/users/${params.userId}`,
				params.updates,
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to update user");
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: userKeys.detail(variables.userId),
			});
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
		},
	});
};

export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (userId: string) => {
			const response = await apiClient.delete<ApiResponse<null>>(
				`/api/v1/users/${userId}`,
			);

			if (response.data.success) {
				return true;
			}

			throw new Error(response.data.message || "Failed to delete user");
		},
		onSuccess: (_, userId) => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			queryClient.removeQueries({ queryKey: userKeys.detail(userId) });
		},
	});
};

export const useUserStats = (userId: string) => {
	return useQuery({
		queryKey: userKeys.stats(userId),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>(
				`/api/v1/users/${userId}/stats`,
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to fetch user stats");
		},
		enabled: !!userId,
	});
};

export const useUpdateUserSettings = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			userId: string;
			settings: {
				notifications?: {
					email?: boolean;
					push?: boolean;
					inApp?: boolean;
				};
				privacy?: {
					showEmail?: boolean;
					showProfile?: boolean;
				};
			};
		}) => {
			const response = await apiClient.patch<ApiResponse<any>>(
				`/api/v1/users/${params.userId}/settings`,
				params.settings,
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to update settings");
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: userKeys.settings(variables.userId),
			});
		},
	});
};

export const useUserEngagement = (userId: string) => {
	return useQuery({
		queryKey: userKeys.engagement(userId),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>(
				`/api/v1/users/${userId}/engagement`,
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to fetch engagement");
		},
		enabled: !!userId,
	});
};

export const useUpdateUserEngagement = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			userId: string;
			action: "view" | "click" | "share" | "like";
			targetType: "project" | "feedback" | "user";
			targetId: string;
		}) => {
			const response = await apiClient.post<ApiResponse<any>>(
				`/api/v1/users/${params.userId}/engagement`,
				{
					action: params.action,
					targetType: params.targetType,
					targetId: params.targetId,
				},
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to update engagement");
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: userKeys.engagement(variables.userId),
			});
		},
	});
};
