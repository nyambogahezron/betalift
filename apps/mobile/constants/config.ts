// API Configuration
export const API_CONFIG = {
	// Update this URL based on your environment
	// For local development on Android Emulator: http://10.0.2.2:5000
	// For local development on iOS Simulator: http://localhost:5000
	// For physical devices: Use your computer's IP address
	baseURL: __DEV__
		? 'http://10.0.2.2:5000' // Android emulator
		: 'https://api.betalift.com', // Production URL
	timeout: 30000, // 30 seconds
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
}

// API endpoints
export const API_ENDPOINTS = {
	auth: {
		register: '/api/v1/auth/register',
		login: '/api/v1/auth/login',
		logout: '/api/v1/auth/logout',
		me: '/api/v1/auth/me',
		verifyEmail: '/api/v1/auth/verify-email',
		forgotPassword: '/api/v1/auth/forgot-password',
		resetPassword: '/api/v1/auth/reset-password',
	},
	users: {
		profile: (id: string) => `/api/v1/users/${id}`,
		update: (id: string) => `/api/v1/users/${id}`,
	},
	projects: {
		list: '/api/v1/projects',
		create: '/api/v1/projects',
		detail: (id: string) => `/api/v1/projects/${id}`,
		update: (id: string) => `/api/v1/projects/${id}`,
		delete: (id: string) => `/api/v1/projects/${id}`,
	},
	feedback: {
		list: '/api/v1/feedback',
		create: '/api/v1/feedback',
		detail: (id: string) => `/api/v1/feedback/${id}`,
		update: (id: string) => `/api/v1/feedback/${id}`,
		delete: (id: string) => `/api/v1/feedback/${id}`,
	},
}
