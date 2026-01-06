import { Router } from 'express'
import {
	getUsers,
	getUserById,
	updateUser,
	deleteUser,
	getUserStats,
	updateSettings,
	getUserEngagement,
	updateUserEngagement,
} from '../../controllers/user'
import { authenticate } from '../../middleware/authentication'
import { validateParams, validateQuery, validateBody } from '../../validators/middleware'
import { z } from 'zod'
import {
	mongoIdSchema,
	getUsersQuerySchema,
	updateUserSchema,
	updateUserSettingsSchema,
	updateUserEngagementSchema,
} from '../../validators/schemas'

const router = Router()

const idParamSchema = z.object({ id: mongoIdSchema })

router.get('/', validateQuery(getUsersQuerySchema), getUsers)
router.get('/:id', validateParams(idParamSchema), getUserById)
router.patch('/:id', authenticate, validateParams(idParamSchema), validateBody(updateUserSchema), updateUser)
router.delete('/:id', authenticate, validateParams(idParamSchema), deleteUser)
router.get('/:id/stats', validateParams(idParamSchema), getUserStats)
router.patch('/:id/settings', authenticate, validateParams(idParamSchema), validateBody(updateUserSettingsSchema), updateSettings)
router.get('/:id/engagement', authenticate, validateParams(idParamSchema), getUserEngagement)
router.patch(
	'/:id/engagement',
	authenticate,
	validateParams(idParamSchema),
	validateBody(updateUserEngagementSchema),
	updateUserEngagement
)

export default router
