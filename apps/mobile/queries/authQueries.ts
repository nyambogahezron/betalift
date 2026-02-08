import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient, { handleApiError } from "../services/api";

interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data?: T;
	error?: string;
}

export interface AuthResponse {
	user: {
		_id: string;
		email: string;
		username: string;
		displayName: string;
		role: "creator" | "tester" | "both";
		avatar?: string;
		bio?: string;
		isEmailVerified: boolean;
		createdAt: string;
		updatedAt: string;
	};
	accessToken: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials {
	email: string;
	password: string;
	username: string;
	displayName?: string;
	role: "creator" | "tester" | "both";
}

export interface VerifyEmailRequest {
	token: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	token: string;
	password: string;
}

export const authKeys = {
	all: ["auth"] as const,
	currentUser: () => [...authKeys.all, "current"] as const,
};

export const useRegister = () => {
	return useMutation({
		mutationFn: async (credentials: RegisterCredentials) => {
			try {
				const response = await apiClient.post<ApiResponse<AuthResponse>>(
					"/api/v1/auth/register",
					credentials,
				);

				if (response.data.success && response.data.data) {
					return response.data.data;
				}

				throw new Error(response.data.error || "Registration failed");
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},
	});
};

export const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (credentials: LoginCredentials) => {
			try {
				const response = await apiClient.post<ApiResponse<AuthResponse>>(
					"/api/v1/auth/login",
					credentials,
				);

				if (response.data.success && response.data.data) {
					return response.data.data;
				}

				throw new Error(response.data.error || "Login failed");
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
		},
	});
};

export const useLogout = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			try {
				const response = await apiClient.post<ApiResponse<null>>(
					"/api/v1/auth/logout",
				);

				if (response.data.success) {
					return true;
				}

				throw new Error(response.data.error || "Logout failed");
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},
		onSuccess: () => {
			queryClient.clear();
		},
	});
};

export const useCurrentUser = () => {
	return useQuery({
		queryKey: authKeys.currentUser(),
		queryFn: async () => {
			try {
				const response =
					await apiClient.get<ApiResponse<AuthResponse["user"]>>(
						"/api/v1/auth/me",
					);

				if (response.data.success && response.data.data) {
					return response.data.data;
				}

				throw new Error(response.data.error || "Failed to get current user");
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},
	});
};

export const useVerifyEmail = () => {
	return useMutation({
		mutationFn: async (request: VerifyEmailRequest) => {
			try {
				const response = await apiClient.post<ApiResponse<null>>(
					"/api/v1/auth/verify-email",
					request,
				);

				if (response.data.success) {
					return true;
				}

				throw new Error(response.data.error || "Email verification failed");
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},
	});
};

export const useForgotPassword = () => {
	return useMutation({
		mutationFn: async (request: ForgotPasswordRequest) => {
			try {
				const response = await apiClient.post<ApiResponse<null>>(
					"/api/v1/auth/forgot-password",
					request,
				);

				if (response.data.success) {
					return true;
				}

				throw new Error(response.data.error || "Failed to send reset email");
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},
	});
};

export const useResetPassword = () => {
	return useMutation({
		mutationFn: async (request: ResetPasswordRequest) => {
			try {
				const response = await apiClient.post<ApiResponse<null>>(
					"/api/v1/auth/reset-password",
					request,
				);

				if (response.data.success) {
					return true;
				}

				throw new Error(response.data.error || "Password reset failed");
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},
	});
};
