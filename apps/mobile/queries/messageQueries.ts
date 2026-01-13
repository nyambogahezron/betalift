import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api";

interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data?: T;
}

export const messageKeys = {
	all: ["messages"] as const,
	conversations: () => [...messageKeys.all, "conversations"] as const,
	conversation: (id: string) => [...messageKeys.conversations(), id] as const,
	messages: (conversationId: string) =>
		[...messageKeys.conversation(conversationId), "messages"] as const,
};

export const useConversations = () => {
	return useQuery({
		queryKey: messageKeys.conversations(),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>(
				"/api/v1/conversations",
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to fetch conversations");
		},
	});
};

export const useCreateConversation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (participantIds: string[]) => {
			const response = await apiClient.post<ApiResponse<any>>(
				"/api/v1/conversations",
				{ participantIds },
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to create conversation");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
		},
	});
};

export const useMessages = (
	conversationId: string,
	params?: {
		page?: number;
		limit?: number;
	},
) => {
	return useQuery({
		queryKey: messageKeys.messages(conversationId),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>(
				`/api/v1/conversations/${conversationId}/messages`,
				{ params },
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to fetch messages");
		},
		enabled: !!conversationId,
	});
};

export const useSendMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			conversationId: string;
			messageData: {
				content: string;
				type?: "text" | "image" | "file";
				attachments?: string[];
			};
		}) => {
			const response = await apiClient.post<ApiResponse<any>>(
				`/api/v1/conversations/${params.conversationId}/messages`,
				params.messageData,
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			throw new Error(response.data.message || "Failed to send message");
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: messageKeys.messages(variables.conversationId),
			});
			queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
		},
	});
};

export const useMarkConversationAsRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (conversationId: string) => {
			const response = await apiClient.patch<ApiResponse<null>>(
				`/api/v1/conversations/${conversationId}/read`,
			);

			if (response.data.success) {
				return true;
			}

			throw new Error(response.data.message || "Failed to mark as read");
		},
		onSuccess: (_, conversationId) => {
			queryClient.invalidateQueries({
				queryKey: messageKeys.conversation(conversationId),
			});
			queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
		},
	});
};
