import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { type AxiosError, type AxiosInstance } from 'axios'
import { API_CONFIG } from '../constants/config'

const apiClient: AxiosInstance = axios.create({
	baseURL: API_CONFIG.baseURL,
	timeout: API_CONFIG.timeout,
	headers: API_CONFIG.headers,
})

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		if (error.response?.status === 401) {
			try {
				await AsyncStorage.removeItem('auth-storage')
			} catch (e) {
				console.error('Error clearing auth:', e)
			}
		}

		return Promise.reject(error)
	}
)

export const handleApiError = (error: unknown): string => {
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError<{
			message?: string
			error?: string
		}>

		if (axiosError.response) {
			return (
				axiosError.response.data?.message ||
				axiosError.response.data?.error ||
				'An error occurred. Please try again.'
			)
		} else if (axiosError.request) {
			return 'Network error. Please check your connection.'
		}
	}

	return 'An unexpected error occurred.'
}

export default apiClient
