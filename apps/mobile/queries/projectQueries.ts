import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../services/api'

interface ApiResponse<T> {
	success: boolean
	message?: string
	data?: T
}


export const projectKeys = {
	all: ['projects'] as const,
	lists: () => [...projectKeys.all, 'list'] as const,
	list: (params?: any) => [...projectKeys.lists(), params] as const,
	details: () => [...projectKeys.all, 'detail'] as const,
	detail: (id: string) => [...projectKeys.details(), id] as const,
	members: (id: string) => [...projectKeys.detail(id), 'members'] as const,
	joinRequests: (id: string) => [...projectKeys.detail(id), 'join-requests'] as const,
	releases: (id: string) => [...projectKeys.detail(id), 'releases'] as const,
}



export const useProjects = (params?: {
	page?: number
	limit?: number
	search?: string
	status?: string
}) => {
	return useQuery({
		queryKey: projectKeys.list(params),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>('/api/v1/projects', {
				params,
			})

			if (response.data.success && response.data.data) {
				return response.data.data
			}

			throw new Error(response.data.message || 'Failed to fetch projects')
		},
	})
}

export const useProject = (id: string) => {
	return useQuery({
		queryKey: projectKeys.detail(id),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>(
				`/api/v1/projects/${id}`
			)

			if (response.data.success && response.data.data) {
				return response.data.data
			}

			throw new Error(response.data.message || 'Failed to fetch project')
		},
		enabled: !!id,
	})
}

export const useCreateProject = () => {
	const queryClient = useQueryClient()
	
	return useMutation({
		mutationFn: async (projectData: {
			title: string
			description: string
			category?: string
			tags?: string[]
			links?: { type: string; url: string }[]
			visibility?: 'public' | 'private'
		}) => {
			const response = await apiClient.post<ApiResponse<any>>(
				'/api/v1/projects',
				projectData
			)

			if (response.data.success && response.data.data) {
				return response.data.data
			}

			throw new Error(response.data.message || 'Failed to create project')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
		},
	})
}

export const useUpdateProject = () => {
	const queryClient = useQueryClient()
	
	return useMutation({
		mutationFn: async (params: {
			id: string
			updates: {
				title?: string
				description?: string
				category?: string
				tags?: string[]
				links?: { type: string; url: string }[]
				visibility?: 'public' | 'private'
				status?: string
			}
		}) => {
			const response = await apiClient.patch<ApiResponse<any>>(
				`/api/v1/projects/${params.id}`,
				params.updates
			)

			if (response.data.success && response.data.data) {
				return response.data.data
			}

			throw new Error(response.data.message || 'Failed to update project')
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) })
			queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
		},
	})
}

export const useDeleteProject = () => {
	const queryClient = useQueryClient()
	
	return useMutation({
		mutationFn: async (id: string) => {
			const response = await apiClient.delete<ApiResponse<null>>(
				`/api/v1/projects/${id}`
			)

			if (response.data.success) {
				return true
			}

			throw new Error(response.data.message || 'Failed to delete project')
		},
		onSuccess: (_, deletedId) => {
			queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
			queryClient.removeQueries({ queryKey: projectKeys.detail(deletedId) })
		},
	})
}

export const useProjectMembers = (projectId: string) => {
	return useQuery({
		queryKey: projectKeys.members(projectId),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>(
				`/api/v1/projects/${projectId}/members`
			)

			if (response.data.success && response.data.data) {
				return response.data.data
			}

			throw new Error(response.data.message || 'Failed to fetch members')
		},
		enabled: !!projectId,
	})
}

export const useCreateJoinRequest = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (params: {
			projectId: string
			message?: string
		}) => {
			const response = await apiClient.post<ApiResponse<any>>(
				`/api/v1/projects/${params.projectId}/requests`,
				{ message: params.message }
			)

			if (response.data.success && response.data.data) {
				return response.data.data
			}

			throw new Error(response.data.message || 'Failed to create join request')
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ 
				queryKey: projectKeys.joinRequests(variables.projectId) 
			})
		},
	})
}

export const useProjectJoinRequests = (projectId: string) => {
	return useQuery({
		queryKey: projectKeys.joinRequests(projectId),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>(
				`/api/v1/projects/${projectId}/requests`
			)

			if (response.data.success && response.data.data) {
				return response.data.data
			}

			throw new Error(response.data.message || 'Failed to fetch join requests')
		},
		enabled: !!projectId,
	})
}

export const useUpdateJoinRequest = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (params: {
			projectId: string
			requestId: string
			status: 'approved' | 'rejected'
		}) => {
			const response = await apiClient.patch<ApiResponse<any>>(
				`/api/v1/projects/${params.projectId}/requests/${params.requestId}`,
				{ status: params.status }
			)

			if (response.data.success && response.data.data) {
				return response.data.data
			}

			throw new Error(response.data.message || 'Failed to update join request')
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ 
				queryKey: projectKeys.joinRequests(variables.projectId) 
			})
			queryClient.invalidateQueries({ 
				queryKey: projectKeys.members(variables.projectId) 
			})
		},
	})
}

export const useProjectReleases = (projectId: string) => {
	return useQuery({
		queryKey: projectKeys.releases(projectId),
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<any>>(
				`/api/v1/projects/${projectId}/releases`
			)

			if (response.data.success && response.data.data) {
				return response.data.data
			}

			throw new Error(response.data.message || 'Failed to fetch releases')
		},
		enabled: !!projectId,
	})
}

export const useCreateRelease = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (params: {
			projectId: string
			releaseData: {
				version: string
				title: string
				description?: string
				releaseNotes?: string
				downloadUrl?: string
			}
		}) => {
			const response = await apiClient.post<ApiResponse<any>>(
				`/api/v1/projects/${params.projectId}/releases`,
				params.releaseData
			)

			if (response.data.success && response.data.data) {
				return response.data.data
			}

			throw new Error(response.data.message || 'Failed to create release')
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ 
				queryKey: projectKeys.releases(variables.projectId) 
			})
		},
	})
}

export const useUpdateRelease = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (params: {
			projectId: string
			releaseId: string
			updates: {
				version?: string
				title?: string
				description?: string
				releaseNotes?: string
				downloadUrl?: string
				status?: string
			}
		}) => {
			const response = await apiClient.patch<ApiResponse<any>>(
				`/api/v1/projects/${params.projectId}/releases/${params.releaseId}`,
				params.updates
			)

			if (response.data.success && response.data.data) {
				return response.data.data
			}

			throw new Error(response.data.message || 'Failed to update release')
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ 
				queryKey: projectKeys.releases(variables.projectId) 
			})
		},
	})
}

export const useDeleteRelease = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (params: {
			projectId: string
			releaseId: string
		}) => {
			const response = await apiClient.delete<ApiResponse<null>>(
				`/api/v1/projects/${params.projectId}/releases/${params.releaseId}`
			)

			if (response.data.success) {
				return true
			}

			throw new Error(response.data.message || 'Failed to delete release')
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ 
				queryKey: projectKeys.releases(variables.projectId) 
			})
		},
	})
}
