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
} from '../../../controllers/user'
import { authenticate } from '../../../middleware/authentication'
import {
	idValidation,
	paginationValidation,
} from '../../../middleware/validation'

const router = Router()

router.get('/', paginationValidation(), getUsers)
router.get('/:id', idValidation(), getUserById)
router.patch('/:id', authenticate, idValidation(), updateUser)
router.delete('/:id', authenticate, idValidation(), deleteUser)
router.get('/:id/stats', idValidation(), getUserStats)
router.patch('/:id/settings', authenticate, idValidation(), updateSettings)
router.get('/:id/engagement', authenticate, idValidation(), getUserEngagement)
router.patch(
	'/:id/engagement',
	authenticate,
	idValidation(),
	updateUserEngagement
)

export default router
