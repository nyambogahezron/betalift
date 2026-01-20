import type { Response } from "express";
import ENV from "../config/env";
import Feedback from "../database/models/feedback";
import Project from "../database/models/project";
import User from "../database/models/user";
import UserEngagement from "../database/models/userEngagement";
import asyncHandler from "../middleware/asyncHandler";
import type {
	AuthenticatedRequest,
	AuthRequest,
} from "../middleware/authentication";
import { ForbiddenError, NotFoundError } from "../utils/errors";

// @route   GET /api/v1/users
// @access  Public
export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
	const page = parseInt(req.query.page as string, 10) || 1
	const limit = Math.min(
		parseInt(req.query.limit as string, 10) || ENV.defaultPageSize,
		ENV.maxPageSize
	)
	const skip = (page - 1) * limit

	const search = req.query.search as string

	const query: {
		$or?: Array<Record<string, { $regex: string; $options: string }>>
	} = {}

	if (search) {
		query.$or = [
			{ username: { $regex: search, $options: 'i' } },
			{ displayName: { $regex: search, $options: 'i' } },
			{ bio: { $regex: search, $options: 'i' } },
		]
	}

	const [users, total] = await Promise.all([
		User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
		User.countDocuments(query),
	])

	res.json({
		success: true,
		data: {
			users,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		},
	})
})

// @route   GET /api/v1/users/:id
// @access  Public
export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
	const user = await User.findById(req.params.id)

	if (!user) throw new NotFoundError('User not found')

	const engagement = await UserEngagement.findOne({ userId: user._id })

	res.json({
		success: true,
		data: {
			...user.toJSON(),
			engagement: engagement?.toJSON(),
		},
	})
})

// @route   PATCH /api/v1/users/:id
// @access  Private
export const updateUser = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		if (req.user._id !== req.params.id) {
			throw new ForbiddenError('You can only update your own profile')
		}

		const { displayName, bio, avatar } = req.body

		const updateData: {
			displayName?: string
			bio?: string
			avatar?: string
		} = {}
		if (displayName !== undefined) updateData.displayName = displayName
		if (bio !== undefined) updateData.bio = bio
		if (avatar !== undefined) updateData.avatar = avatar

		const user = await User.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
			runValidators: true,
		})

		if (!user) throw new NotFoundError('User not found')

		res.json({
			success: true,
			message: 'Profile updated successfully',
			data: user.toJSON(),
		})
	}
)

// @route   DELETE /api/v1/users/:id
// @access  Private
export const deleteUser = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		if (req.user._id !== req.params.id) {
			throw new ForbiddenError('You can only delete your own account')
		}

		const user = await User.findById(req.params.id)

		if (!user) throw new NotFoundError('User not found')

		await Promise.all([
			User.findByIdAndDelete(req.params.id),
			UserEngagement.findOneAndDelete({ userId: req.params.id }),
		])

		res.json({
			success: true,
			message: 'User deleted successfully',
		})
	}
)

// @route   GET /api/v1/users/:id/stats
// @access  Public
export const getUserStats = asyncHandler(async (req: AuthRequest, res: Response) => {
	const user = await User.findById(req.params.id)

	if (!user) throw new NotFoundError('User not found')

	const [projects, feedback] = await Promise.all([
		Project.find({ ownerId: req.params.id }),
		Feedback.find({ userId: req.params.id }),
	])

	res.json({
		success: true,
		data: {
			...user.stats,
			projects: projects.length,
			recentFeedback: feedback.slice(0, 5),
		},
	})
})

// @route   PATCH /api/v1/users/:id/settings
// @access  Private
export const updateSettings = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		if (req.user._id !== req.params.id) {
			throw new ForbiddenError('You can only update your own settings')
		}

		const { settings } = req.body

		const user = await User.findByIdAndUpdate(
			req.params.id,
			{ settings },
			{ new: true, runValidators: true }
		)

		if (!user) throw new NotFoundError('User not found')

		res.json({
			success: true,
			message: 'Settings updated successfully',
			data: user.toJSON(),
		})
	}
)

// @route   GET /api/v1/users/:id/engagement
// @access  Private
export const getUserEngagement = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const engagement = await UserEngagement.findOne({
			userId: req.params.id,
		}).populate('projectsViewed.projectId', 'name icon')

		if (!engagement) {
			throw new NotFoundError('Engagement data not found')
		}

		res.json({
			success: true,
			data: engagement.toJSON(),
		})
	}
)

// @route   PATCH /api/v1/users/:id/engagement
// @access  Private
export const updateUserEngagement = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		if (req.user._id !== req.params.id) {
			throw new ForbiddenError('You can only update your own engagement')
		}

		const updateData = req.body

		const engagement = await UserEngagement.findOneAndUpdate(
			{ userId: req.params.id },
			{ ...updateData, lastActiveAt: new Date() },
			{ new: true, upsert: true, runValidators: true }
		)

		res.json({
			success: true,
			message: 'Engagement updated successfully',
			data: engagement.toJSON(),
		})
	}
)

// @route   POST /api/v1/users/push-token
// @access  Private
export const registerPushToken = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { pushToken } = req.body

		if (!pushToken) {
			throw new Error('Push token is required')
		}

		const user = await User.findById(req.user._id)

		if (!user) throw new NotFoundError('User not found')

		if (!user.pushTokens.includes(pushToken)) {
			user.pushTokens.push(pushToken)
			await user.save()
		}

		res.json({
			success: true,
			message: 'Push token registered successfully',
		})
	}
)
