import apiClient, { handleApiError } from "./api";

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

/**
 * Login user
 */
export const loginUser = async (
	credentials: LoginCredentials,
): Promise<ApiResponse<AuthResponse>> => {
	try {
		const response = await apiClient.post<ApiResponse<AuthResponse>>(
			"/api/v1/auth/login",
			credentials,
		);
		return response.data;
	} catch (error) {
		return {
			success: false,
			error: handleApiError(error),
		};
	}
};

/**
 * Register new user
 */
export const registerUser = async (
	credentials: RegisterCredentials,
): Promise<ApiResponse<AuthResponse>> => {
	try {
		const response = await apiClient.post<ApiResponse<AuthResponse>>(
			"/api/v1/auth/register",
			credentials,
		);
		return response.data;
	} catch (error) {
		return {
			success: false,
			error: handleApiError(error),
		};
	}
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<ApiResponse<null>> => {
	try {
		const response = await apiClient.post<ApiResponse<null>>(
			"/api/v1/auth/logout",
		);
		return response.data;
	} catch (error) {
		return {
			success: false,
			error: handleApiError(error),
		};
	}
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<
	ApiResponse<AuthResponse["user"]>
> => {
	try {
		const response =
			await apiClient.get<ApiResponse<AuthResponse["user"]>>("/api/v1/auth/me");
		return response.data;
	} catch (error) {
		return {
			success: false,
			error: handleApiError(error),
		};
	}
};

/**
 * Verify email with token
 */
export const verifyEmail = async (
	request: VerifyEmailRequest,
): Promise<ApiResponse<null>> => {
	try {
		const response = await apiClient.post<ApiResponse<null>>(
			"/api/v1/auth/verify-email",
			request,
		);
		return response.data;
	} catch (error) {
		return {
			success: false,
			error: handleApiError(error),
		};
	}
};

/**
 * Request password reset
 */
export const forgotPassword = async (
	request: ForgotPasswordRequest,
): Promise<ApiResponse<null>> => {
	try {
		const response = await apiClient.post<ApiResponse<null>>(
			"/api/v1/auth/forgot-password",
			request,
		);
		return response.data;
	} catch (error) {
		return {
			success: false,
			error: handleApiError(error),
		};
	}
};

/**
 * Reset password with token
 */
export const resetPassword = async (
	request: ResetPasswordRequest,
): Promise<ApiResponse<null>> => {
	try {
		const response = await apiClient.post<ApiResponse<null>>(
			"/api/v1/auth/reset-password",
			request,
		);
		return response.data;
	} catch (error) {
		return {
			success: false,
			error: handleApiError(error),
		};
	}
};
