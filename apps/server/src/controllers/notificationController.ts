import { Response } from 'express'
import Notification from '../database/models/notification'
import { AuthRequest, AuthenticatedRequest } from '../middleware/authentication'
import { asyncHandler } from '../middleware/asyncHandler'
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors'
import ENV from '../config/env'

// @desc    Get user notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const page = parseInt(req.query.page as string) || 1
		const limit = Math.min(
			parseInt(req.query.limit as string) || ENV.defaultPageSize,
			ENV.maxPageSize
		)
		const skip = (page - 1) * limit

		const isRead =
			req.query.isRead === 'true'
				? true
				: req.query.isRead === 'false'
				? false
				: undefined

		const query: any = { userId: req.user._id }

		if (isRead !== undefined) {
			query.isRead = isRead
		}

		const [notifications, total, unreadCount] = await Promise.all([
			Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
			Notification.countDocuments(query),
			Notification.countDocuments({ userId: req.user._id, isRead: false }),
		])

		res.json({
			success: true,
			data: {
				notifications,
				pagination: {
					page,
					limit,
					total,
					pages: Math.ceil(total / limit),
				},
				unreadCount,
			},
		})
	}
)

// @desc    Mark notification as read
// @route   PATCH /api/v1/notifications/:id/read
// @access  Private
export const markNotificationAsRead = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const notification = await Notification.findById(req.params.id)

		if (!notification) {
			throw new NotFoundError('Notification not found')
		}

		// Verify user owns the notification
		if (notification.userId.toString() !== req.user._id) {
			throw new ForbiddenError(
				'You do not have permission to update this notification'
			)
		}

		notification.isRead = true
		await notification.save()

		res.json({
			success: true,
			data: notification,
		})
	}
)

// @desc    Mark all notifications as read
// @route   PATCH /api/v1/notifications/read-all
// @access  Private
export const markAllNotificationsAsRead = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		await Notification.updateMany(
			{ userId: req.user._id, isRead: false },
			{ isRead: true }
		)

		res.json({
			success: true,
			message: 'All notifications marked as read',
		})
	}
)

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const notification = await Notification.findById(req.params.id)

		if (!notification) {
			throw new NotFoundError('Notification not found')
		}

		// Verify user owns the notification
		if (notification.userId.toString() !== req.user._id) {
			throw new ForbiddenError(
				'You do not have permission to delete this notification'
			)
		}

		await Notification.findByIdAndDelete(req.params.id)

		res.json({
			success: true,
			message: 'Notification deleted',
		})
	}
)

// @desc    Delete all notifications
// @route   DELETE /api/v1/notifications
// @access  Private
export const deleteAllNotifications = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		await Notification.deleteMany({ userId: req.user._id })

		res.json({
			success: true,
			message: 'All notifications deleted',
		})
	}
)
