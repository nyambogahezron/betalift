import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api";

interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data?: T;
}

export const feedbackKeys = {
	all: ["feedback"] as const,
	lists: () => [...feedbackKeys.all, "list"] as const,
	list: (projectId: string, params?: any) =>
		[...feedbackKeys.lists(), projectId, params] as const,
	details: () => [...feedbackKeys.all, "detail"] as const,
	detail: (id: string) => [...feedbackKeys.details(), id] as const,
	comments: (id: string) => [...feedbackKeys.detail(id), "comments"] as const,
};

export const useProjectFeedback = (
	projectId: string,
	params?: {
		page?: number;
		limit?: number;
		type?: string;
		status?: string;
		priority?: string;
	},
) => {
	return useQuery({
		queryKey: feedbackKeys.list(projectId, params),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>(
				`/api/v1/projects/${projectId}/feedback`,
				{ params },
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to fetch feedback");
		},
		enabled: !!projectId,
	});
};

export const useFeedback = (feedbackId: string) => {
	return useQuery({
		queryKey: feedbackKeys.detail(feedbackId),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>(
				`/api/v1/feedback/${feedbackId}`,
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to fetch feedback");
		},
		enabled: !!feedbackId,
	});
};

export const useCreateFeedback = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			projectId: string;
			feedbackData: {
				title: string;
				description: string;
				type:
					| "bug"
					| "feature"
					| "improvement"
					| "praise"
					| "question"
					| "other";
				priority?: "low" | "medium" | "high" | "critical";
				attachments?: string[];
			};
		}) => {
			const response = await apiClient.post<ApiResponse<any>>(
				`/api/v1/projects/${params.projectId}/feedback`,
				params.feedbackData,
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to create feedback");
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: feedbackKeys.list(variables.projectId),
			});
		},
	});
};

export const useUpdateFeedback = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			feedbackId: string;
			updates: {
				title?: string;
				description?: string;
				type?:
					| "bug"
					| "feature"
					| "improvement"
					| "praise"
					| "question"
					| "other";
				priority?: "low" | "medium" | "high" | "critical";
				status?: string;
			};
		}) => {
			const response = await apiClient.patch<ApiResponse<any>>(
				`/api/v1/feedback/${params.feedbackId}`,
				params.updates,
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to update feedback");
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: feedbackKeys.detail(variables.feedbackId),
			});
		},
	});
};

export const useDeleteFeedback = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (feedbackId: string) => {
			const response = await apiClient.delete<ApiResponse<null>>(
				`/api/v1/feedback/${feedbackId}`,
			);

			if (response.data.success) {
				return true;
			}

			throw new Error(response.data.message || "Failed to delete feedback");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
		},
	});
};

export const useFeedbackComments = (feedbackId: string) => {
	return useQuery({
		queryKey: feedbackKeys.comments(feedbackId),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>(
				`/api/v1/feedback/${feedbackId}/comments`,
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to fetch comments");
		},
		enabled: !!feedbackId,
	});
};

export const useCreateComment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: { feedbackId: string; content: string }) => {
			const response = await apiClient.post<ApiResponse<any>>(
				`/api/v1/feedback/${params.feedbackId}/comments`,
				{ content: params.content },
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to create comment");
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: feedbackKeys.comments(variables.feedbackId),
			});
		},
	});
};

export const useDeleteComment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: { feedbackId: string; commentId: string }) => {
			const response = await apiClient.delete<ApiResponse<null>>(
				`/api/v1/feedback/${params.feedbackId}/comments/${params.commentId}`,
			);

			if (response.data.success) {
				return true;
			}

			throw new Error(response.data.message || "Failed to delete comment");
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: feedbackKeys.comments(variables.feedbackId),
			});
		},
	});
};

export const useVoteFeedback = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			feedbackId: string;
			voteType: "up" | "down";
		}) => {
			const response = await apiClient.post<ApiResponse<any>>(
				`/api/v1/feedback/${params.feedbackId}/vote`,
				{ voteType: params.voteType },
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to vote on feedback");
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: feedbackKeys.detail(variables.feedbackId),
			});
		},
	});
};
