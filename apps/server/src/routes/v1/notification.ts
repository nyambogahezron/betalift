import { Router } from 'express'
import {
	getNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
	deleteNotification,
	deleteAllNotifications,
} from '../../controllers/notificationController'
import { authenticate } from '../../middleware/authentication'
import { validateParams, validateQuery } from '../../validators/middleware'
import { z } from 'zod'
import { mongoIdSchema, paginationSchema } from '../../validators/schemas'

const router = Router()

const idParamSchema = z.object({ id: mongoIdSchema })

router.get('/', authenticate, validateQuery(paginationSchema), getNotifications)
router.patch('/read-all', authenticate, markAllNotificationsAsRead)
router.delete('/', authenticate, deleteAllNotifications)
router.patch('/:id/read', authenticate, validateParams(idParamSchema), markNotificationAsRead)
router.delete('/:id', authenticate, validateParams(idParamSchema), deleteNotification)

export default router
