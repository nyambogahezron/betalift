import { Router } from 'express'
import {
	getNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
	deleteNotification,
	deleteAllNotifications,
} from '../../../controllers/notificationController'
import { authenticate } from '../../../middleware/authentication'
import { idValidation, paginationValidation } from '../../../middleware/validation'

const router = Router()

router.get('/', authenticate, paginationValidation(), getNotifications)
router.patch('/read-all', authenticate, markAllNotificationsAsRead)
router.delete('/', authenticate, deleteAllNotifications)
router.patch('/:id/read', authenticate, idValidation(), markNotificationAsRead)
router.delete('/:id', authenticate, idValidation(), deleteNotification)

export default router
