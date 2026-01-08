import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, {
	AxiosError,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from 'axios'
import { API_CONFIG } from '../constants/config'

const apiClient: AxiosInstance = axios.create({
	baseURL: API_CONFIG.baseURL,
	timeout: API_CONFIG.timeout,
	headers: API_CONFIG.headers,
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		try {
			// Get token from AsyncStorage
			const authData = await AsyncStorage.getItem('auth-storage')
			if (authData) {
				const { state } = JSON.parse(authData)
				const token = state?.user?.accessToken

				if (token) {
					config.headers.Authorization = `Bearer ${token}`
				}
			}
		} catch (error) {
			console.error('Error getting auth token:', error)
		}

		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// Response interceptor to handle errors
apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		if (error.response?.status === 401) {
			// Handle unauthorized - clear auth and redirect to login
			try {
				await AsyncStorage.removeItem('auth-storage')
				// You can use navigation here if needed
			} catch (e) {
				console.error('Error clearing auth:', e)
			}
		}

		return Promise.reject(error)
	}
)

// Generic API error handler
export const handleApiError = (error: unknown): string => {
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError<{
			message?: string
			error?: string
		}>

		if (axiosError.response) {
			// Server responded with error
			return (
				axiosError.response.data?.message ||
				axiosError.response.data?.error ||
				'An error occurred. Please try again.'
			)
		} else if (axiosError.request) {
			// Request made but no response
			return 'Network error. Please check your connection.'
		}
	}

	return 'An unexpected error occurred.'
}

export default apiClient
