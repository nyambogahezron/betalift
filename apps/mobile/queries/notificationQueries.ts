import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api";

interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data?: T;
}

export const notificationKeys = {
	all: ["notifications"] as const,
	lists: () => [...notificationKeys.all, "list"] as const,
	list: (params?: any) => [...notificationKeys.lists(), params] as const,
};

export const useNotifications = (params?: {
	page?: number;
	limit?: number;
}) => {
	return useQuery({
		queryKey: notificationKeys.list(params),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>(
				"/api/v1/notifications",
				{ params },
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to fetch notifications");
		},
	});
};

export const useMarkNotificationAsRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (notificationId: string) => {
			const response = await apiClient.patch<ApiResponse<any>>(
				`/api/v1/notifications/${notificationId}/read`,
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to mark as read");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
		},
	});
};

export const useMarkAllNotificationsAsRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const response = await apiClient.patch<ApiResponse<null>>(
				"/api/v1/notifications/read-all",
			);

			if (response.data.success) {
				return true;
			}

			throw new Error(response.data.message || "Failed to mark all as read");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
		},
	});
};

export const useDeleteNotification = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (notificationId: string) => {
			const response = await apiClient.delete<ApiResponse<null>>(
				`/api/v1/notifications/${notificationId}`,
			);

			if (response.data.success) {
				return true;
			}

			throw new Error(response.data.message || "Failed to delete notification");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
		},
	});
};

export const useDeleteAllNotifications = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const response = await apiClient.delete<ApiResponse<null>>(
				"/api/v1/notifications",
			);

			if (response.data.success) {
				return true;
			}

			throw new Error(
				response.data.message || "Failed to delete all notifications",
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
		},
	});
};
