export interface User {
	id: string;
	email: string;
	username: string;
	displayName?: string;
	bio?: string;
	avatar?: string;
	stats: UserStats;
	createdAt: Date;
	updatedAt?: Date;
}

export interface UserStats {
	projectsCreated: number;
	projectsTested: number;
	feedbackGiven: number;
	feedbackReceived: number;
}

export type ProjectStatus = "active" | "beta" | "closed" | "paused";

export interface Project {
	id: string;
	name: string;
	description: string;
	shortDescription?: string;
	ownerId: string;
	ownerName: string;
	ownerAvatar?: string;
	creator?: User;
	status: ProjectStatus;
	category?: ProjectCategory;
	links?: ProjectLinks;
	screenshots?: string[];
	icon?: string;
	techStack: string[];
	testerCount: number;
	feedbackCount: number;
	rating?: number;
	maxTesters?: number;
	isPublic: boolean;
	createdAt: Date;
	updatedAt?: Date;
}

export type ProjectCategory =
	| "mobile-app"
	| "web-app"
	| "desktop-app"
	| "game"
	| "api"
	| "other";

export interface ProjectLinks {
	website?: string;
	testFlight?: string;
	playStore?: string;
	appStore?: string;
	github?: string;
	discord?: string;
	documentation?: string;
}

export interface ProjectMembership {
	id: string;
	projectId: string;
	userId: string;
	user?: User;
	role: "creator" | "tester";
	status: "pending" | "approved" | "rejected";
	joinedAt: Date;
}

export type FeedbackType =
	| "bug"
	| "feature"
	| "improvement"
	| "praise"
	| "question"
	| "other";
export type FeedbackStatus =
	| "pending"
	| "open"
	| "in-progress"
	| "resolved"
	| "closed"
	| "wont-fix";
export type FeedbackPriority = "low" | "medium" | "high" | "critical";

export interface Feedback {
	id: string;
	projectId: string;
	project?: Project;
	userId: string;
	userName?: string;
	userAvatar?: string;
	user?: User;
	type: FeedbackType;
	priority?: FeedbackPriority;
	title: string;
	description: string;
	screenshots?: string[];
	stepsToReproduce?: string;
	deviceInfo?: DeviceInfo;
	status: FeedbackStatus;
	upvotes: number;
	downvotes: number;
	votes?: FeedbackVote[];
	commentCount: number;
	createdAt: Date;
	updatedAt?: Date;
	resolvedAt?: Date;
}

export interface DeviceInfo {
	platform?: "ios" | "android" | "web";
	model?: string;
	os?: string;
	osVersion?: string;
	deviceModel?: string;
	appVersion?: string;
	screenSize?: string;
}

export interface FeedbackComment {
	id: string;
	feedbackId: string;
	userId: string;
	user?: User;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
}

export interface FeedbackVote {
	id: string;
	feedbackId: string;
	userId: string;
	type: "up" | "down";
	createdAt: Date;
}

export interface Notification {
	id: string;
	userId: string;
	type: NotificationType;
	title: string;
	message: string;
	data?: Record<string, unknown>;
	isRead: boolean;
	createdAt: Date;
}

export type NotificationType =
	| "project_invite"
	| "project_joined"
	| "feedback_received"
	| "feedback_comment"
	| "feedback_status_changed"
	| "project_update";

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

// Filter and sort types
export interface FeedbackFilters {
	type?: FeedbackType[];
	status?: FeedbackStatus[];
	priority?: FeedbackPriority[];
	userId?: string;
}

export interface SortOptions {
	field: string;
	direction: "asc" | "desc";
}

// Settings types
export interface UserSettings {
	notifications: NotificationSettings;
	privacy: PrivacySettings;
	appearance: AppearanceSettings;
}

export interface NotificationSettings {
	pushEnabled: boolean;
	emailEnabled: boolean;
	feedbackUpdates: boolean;
	projectInvites: boolean;
	weeklyDigest: boolean;
}

export interface PrivacySettings {
	profilePublic: boolean;
	showEmail: boolean;
	showStats: boolean;
}

export interface AppearanceSettings {
	theme: "dark" | "light" | "system";
	language: string;
}

// Message types
export interface Conversation {
	id: string;
	participants: User[];
	lastMessage?: Message;
	unreadCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface Message {
	id: string;
	conversationId: string;
	senderId: string;
	sender?: User;
	content: string;
	type: "text" | "image" | "file";
	attachments?: MessageAttachment[];
	isRead?: boolean;
	readBy?: string[];
	createdAt: Date;
}

export interface MessageAttachment {
	id: string;
	type: "image" | "file";
	url: string;
	name?: string;
	size?: number;
}

// Release types
export interface Release {
	id: string;
	projectId: string;
	version: string;
	title: string;
	description?: string;
	changelog?: string | string[]; // Markdown content or list of changes
	releaseNotes?: string; // Markdown content
	type?: "major" | "minor" | "patch" | "beta" | "alpha";
	status?: "draft" | "beta" | "published" | "archived";
	fileSize?: number;
	buildNumber?: string;
	minOsVersion?: string;
	downloadUrl?: string;
	testFlightUrl?: string;
	playStoreUrl?: string;
	appStoreUrl?: string;
	publishedAt?: Date;
	createdAt: Date;
}

// Join Request types
export interface JoinRequest {
	id: string;
	projectId: string;
	project?: Project;
	userId: string;
	user?: User;
	message?: string;
	status: "pending" | "approved" | "rejected" | "accepted";
	reviewedBy?: string;
	reviewedAt?: Date;
	respondedAt?: Date;
	rejectionReason?: string;
	createdAt: Date;
}

// User Engagement types
export interface UserEngagement {
	userId: string;
	projectsViewed: ProjectView[];
	availability: UserAvailability;
	interests: string[];
	skills: string[];
	preferredPlatforms: ("ios" | "android" | "web" | "desktop")[];
	testingExperience: "beginner" | "intermediate" | "expert";
	lastActiveAt: Date;
}

export interface ProjectView {
	projectId: string;
	project?: Project;
	viewedAt: Date;
	duration?: number; // seconds spent viewing
}

export interface UserAvailability {
	status: "available" | "busy" | "away" | "offline";
	hoursPerWeek?: number;
	timezone?: string;
	preferredContactMethod?: "in-app" | "email" | "discord";
}
