import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient, { handleApiError } from '../services/api'

export interface NotificationType {
	id: string
	title: string
	message: string
	type:
		| 'project_invite'
		| 'project_joined'
		| 'feedback_received'
		| 'feedback_comment'
		| 'feedback_status_changed'
		| 'project_update'
	data?: any
	isRead: boolean
	createdAt: string
}

interface NotificationResponse {
	notifications: NotificationType[]
	pagination: {
		page: number
		limit: number
		total: number
		pages: number
	}
	unreadCount: number
}

export const notificationKeys = {
	all: ['notifications'] as const,
	list: (filters: Record<string, any>) =>
		[...notificationKeys.all, filters] as const,
}

// Fetch notifications
export const useNotifications = (params: { page?: number; isRead?: boolean } = {}) => {
	return useQuery({
		queryKey: notificationKeys.list(params),
		queryFn: async () => {
			try {
				const { data } = await apiClient.get<{
					success: boolean
					data: NotificationResponse
				}>('/notifications', {
					params,
				})
				return data.data
			} catch (error) {
				throw new Error(handleApiError(error))
			}
		},
	});
};

// Mark as read
export const useMarkNotificationAsRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await apiClient.patch(`/notifications/${id}/read`)
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all })
		},
	})
};

// Mark all as read
export const useMarkAllNotificationsAsRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const { data } = await apiClient.patch('/notifications/read-all')
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all })
		},
	});
};

// Delete notification
export const useDeleteNotification = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await apiClient.delete(`/notifications/${id}`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all })
		},
	})
};
