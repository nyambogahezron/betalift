import { Response } from 'express'
import { validationResult } from 'express-validator'
import User from '../database/models/user'
import UserEngagement from '../database/models/userEngagement'
import Project from '../database/models/project'
import Feedback from '../database/models/feedback'
import { AuthRequest } from '../middleware/authentication'
import { asyncHandler } from '../middleware/asyncHandler'
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors'
import ENV from '../config/env'

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
export const getUsers = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const page = parseInt(req.query.page as string) || 1
		const limit = Math.min(
			parseInt(req.query.limit as string) || ENV.defaultPageSize,
			ENV.maxPageSize
		)
		const skip = (page - 1) * limit

		const search = req.query.search as string
		const role = req.query.role as string

		const query: any = {}

		if (search) {
			query.$or = [
				{ username: { $regex: search, $options: 'i' } },
				{ displayName: { $regex: search, $options: 'i' } },
				{ bio: { $regex: search, $options: 'i' } },
			]
		}

		if (role) {
			query.role = role
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
	}
)

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Public
export const getUserById = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			throw new BadRequestError(errors.array()[0]?.msg || "Validation error")
		}

		const user = await User.findById(req.params.id)

		if (!user) {
			throw new NotFoundError('User not found')
		}

		// Get user engagement if available
		const engagement = await UserEngagement.findOne({ userId: user._id })

		res.json({
			success: true,
			data: {
				...user.toJSON(),
				engagement: engagement?.toJSON(),
			},
		})
	}
)

// @desc    Update user profile
// @route   PATCH /api/v1/users/:id
// @access  Private
export const updateUser = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new ForbiddenError()
		}

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			throw new BadRequestError(errors.array()[0]?.msg || "Validation error")
		}

		// Users can only update their own profile
		if (req.user._id !== req.params.id) {
			throw new ForbiddenError('You can only update your own profile')
		}

		const { displayName, bio, avatar, role } = req.body

		const updateData: any = {}
		if (displayName !== undefined) updateData.displayName = displayName
		if (bio !== undefined) updateData.bio = bio
		if (avatar !== undefined) updateData.avatar = avatar
		if (role !== undefined) updateData.role = role

		const user = await User.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
			runValidators: true,
		})

		if (!user) {
			throw new NotFoundError('User not found')
		}

		res.json({
			success: true,
			message: 'Profile updated successfully',
			data: user.toJSON(),
		})
	}
)

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private
export const deleteUser = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new ForbiddenError()
		}

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			throw new BadRequestError(errors.array()[0]?.msg || "Validation error")
		}

		// Users can only delete their own account
		if (req.user._id !== req.params.id) {
			throw new ForbiddenError('You can only delete your own account')
		}

		const user = await User.findById(req.params.id)

		if (!user) {
			throw new NotFoundError('User not found')
		}

		// Delete user and associated data
		await Promise.all([
			User.findByIdAndDelete(req.params.id),
			UserEngagement.findOneAndDelete({ userId: req.params.id }),
			// Note: You might want to handle projects, feedback, etc. differently
		])

		res.json({
			success: true,
			message: 'User deleted successfully',
		})
	}
)

// @desc    Get user stats
// @route   GET /api/v1/users/:id/stats
// @access  Public
export const getUserStats = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			throw new BadRequestError(errors.array()[0]?.msg || "Validation error")
		}

		const user = await User.findById(req.params.id)

		if (!user) {
			throw new NotFoundError('User not found')
		}

		// Get additional stats
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
	}
)

// @desc    Update user settings
// @route   PATCH /api/v1/users/:id/settings
// @access  Private
export const updateSettings = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new ForbiddenError()
		}

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			throw new BadRequestError(errors.array()[0]?.msg || "Validation error")
		}

		// Users can only update their own settings
		if (req.user._id !== req.params.id) {
			throw new ForbiddenError('You can only update your own settings')
		}

		const { settings } = req.body

		const user = await User.findByIdAndUpdate(
			req.params.id,
			{ settings },
			{ new: true, runValidators: true }
		)

		if (!user) {
			throw new NotFoundError('User not found')
		}

		res.json({
			success: true,
			message: 'Settings updated successfully',
			data: user.toJSON(),
		})
	}
)

// @desc    Get user engagement
// @route   GET /api/v1/users/:id/engagement
// @access  Private
export const getUserEngagement = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new ForbiddenError()
		}

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			throw new BadRequestError(errors.array()[0]?.msg || "Validation error")
		}

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

// @desc    Update user engagement
// @route   PATCH /api/v1/users/:id/engagement
// @access  Private
export const updateUserEngagement = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new ForbiddenError()
		}

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			throw new BadRequestError(errors.array()[0]?.msg || "Validation error")
		}

		// Users can only update their own engagement
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
