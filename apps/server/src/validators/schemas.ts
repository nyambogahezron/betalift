import { z } from "zod";

export const mongoIdSchema = z
	.string()
	.regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const paginationSchema = z.object({
	page: z.coerce.number().int().min(1).optional().default(1),
	limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const registerSchema = z.object({
	email: z.string().email("Please provide a valid email").toLowerCase(),
	password: z.string().min(6, "Password must be at least 6 characters long"),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(30, "Username cannot exceed 30 characters")
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"Username can only contain letters, numbers, and underscores",
		),
	displayName: z
		.string()
		.max(50, "Display name cannot exceed 50 characters")
		.optional(),
	role: z.enum(["developer", "tester", "both"]).optional(),
});

export const loginSchema = z.object({
	email: z.string().email("Please provide a valid email").toLowerCase(),
	password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
	token: z.string().min(1, "Verification token is required"),
});

export const forgotPasswordSchema = z.object({
	email: z.string().email("Please provide a valid email"),
});

export const resetPasswordSchema = z.object({
	token: z.string().min(1, "Reset token is required"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const refreshTokenSchema = z.object({
	refreshToken: z.string().optional(),
});

export const updateUserSchema = z.object({
	displayName: z
		.string()
		.max(50, "Display name cannot exceed 50 characters")
		.optional(),
	bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
	avatar: z.string().url({ message: "Invalid avatar URL" }).optional(),
	role: z.enum(["developer", "tester", "both"]).optional(),
});

export const updateUserSettingsSchema = z.object({
	emailNotifications: z.boolean().optional(),
	pushNotifications: z.boolean().optional(),
	weeklyDigest: z.boolean().optional(),
	theme: z.enum(["light", "dark", "system"]).optional(),
	language: z.string().optional(),
});

export const updateUserEngagementSchema = z.object({
	lastActiveAt: z.date().optional(),
	lastViewedProjectId: z.string().optional(),
	preferredCategories: z.array(z.string()).optional(),
});

export const createProjectSchema = z.object({
	name: z
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(100, "Name cannot exceed 100 characters"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(2000, "Description cannot exceed 2000 characters"),
	category: z.string().min(1, "Category is required"),
	tags: z.array(z.string()).optional(),
	repositoryUrl: z
		.string()
		.url({ message: "Invalid repository URL" })
		.optional(),
	website: z.string().url({ message: "Invalid website URL" }).optional(),
	icon: z.string().url({ message: "Invalid icon URL" }).optional(),
	isPublic: z.boolean().optional().default(true),
	lookingForTesters: z.boolean().optional().default(true),
});

export const updateProjectSchema = z.object({
	name: z.string().min(3).max(100).optional(),
	description: z.string().min(10).max(2000).optional(),
	category: z.string().optional(),
	tags: z.array(z.string()).optional(),
	repositoryUrl: z.union([z.string().url(), z.literal("")]).optional(),
	website: z.union([z.string().url(), z.literal("")]).optional(),
	icon: z.union([z.string().url(), z.literal("")]).optional(),
	isPublic: z.boolean().optional(),
	lookingForTesters: z.boolean().optional(),
	status: z
		.enum(["planning", "development", "testing", "released", "archived"])
		.optional(),
});

export const createJoinRequestSchema = z.object({
	message: z
		.string()
		.max(500, "Message cannot exceed 500 characters")
		.optional(),
});

export const updateJoinRequestSchema = z.object({
	status: z.enum(["pending", "approved", "rejected"]),
});

export const createReleaseSchema = z.object({
	version: z.string().min(1, "Version is required"),
	title: z
		.string()
		.min(3, "Title must be at least 3 characters")
		.max(100, "Title cannot exceed 100 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	releaseNotes: z.string().optional(),
	releaseType: z
		.enum(["alpha", "beta", "rc", "stable"])
		.optional()
		.default("beta"),
	downloadUrl: z.string().url("Invalid download URL").optional(),
	isPublic: z.boolean().optional().default(true),
});

export const updateReleaseSchema = z.object({
	version: z.string().optional(),
	title: z.string().min(3).max(100).optional(),
	description: z.string().min(10).optional(),
	releaseNotes: z.string().optional(),
	releaseType: z.enum(["alpha", "beta", "rc", "stable"]).optional(),
	downloadUrl: z.string().url().optional().or(z.literal("")),
	isPublic: z.boolean().optional(),
});

export const createFeedbackSchema = z.object({
	title: z
		.string()
		.min(5, "Title must be at least 5 characters")
		.max(200, "Title cannot exceed 200 characters"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(5000, "Description cannot exceed 5000 characters"),
	type: z.enum(["bug", "feature", "improvement", "question"]),
	priority: z
		.enum(["low", "medium", "high", "critical"])
		.optional()
		.default("medium"),
	category: z.string().optional(),
	attachments: z.array(z.string().url()).optional(),
});

export const updateFeedbackSchema = z.object({
	title: z.string().min(5).max(200).optional(),
	description: z.string().min(10).max(5000).optional(),
	type: z.enum(["bug", "feature", "improvement", "question"]).optional(),
	priority: z.enum(["low", "medium", "high", "critical"]).optional(),
	status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
	category: z.string().optional(),
	attachments: z.array(z.string().url()).optional(),
});

export const createFeedbackCommentSchema = z.object({
	content: z
		.string()
		.min(1, "Comment cannot be empty")
		.max(2000, "Comment cannot exceed 2000 characters"),
});

export const voteFeedbackSchema = z.object({
	voteType: z.enum(["upvote", "downvote"]),
});

export const createConversationSchema = z.object({
	participantIds: z
		.array(mongoIdSchema)
		.min(1, "At least one participant is required"),
	message: z
		.string()
		.min(1, "Message cannot be empty")
		.max(5000, "Message cannot exceed 5000 characters")
		.optional(),
});

export const sendMessageSchema = z.object({
	content: z
		.string()
		.min(1, "Message cannot be empty")
		.max(5000, "Message cannot exceed 5000 characters"),
	attachments: z.array(z.string().url()).optional(),
});

export const getUsersQuerySchema = paginationSchema.extend({
	search: z.string().optional(),
	role: z.enum(["developer", "tester", "both"]).optional(),
});

export const getProjectsQuerySchema = paginationSchema.extend({
	search: z.string().optional(),
	category: z.string().optional(),
	status: z
		.enum(["planning", "development", "testing", "released", "archived"])
		.optional(),
	lookingForTesters: z.coerce.boolean().optional(),
});

export const getFeedbackQuerySchema = paginationSchema.extend({
	type: z.enum(["bug", "feature", "improvement", "question"]).optional(),
	status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
	priority: z.enum(["low", "medium", "high", "critical"]).optional(),
	search: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type UpdateFeedbackInput = z.infer<typeof updateFeedbackSchema>;
