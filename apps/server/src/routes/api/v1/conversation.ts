import { Router } from 'express'
import {
	getConversations,
	createConversation,
	getMessages,
	sendMessage,
	markAsRead,
} from '../../../controllers/messageController'
import { authenticate } from '../../../middleware/authentication'
import { idValidation, paginationValidation } from '../../../middleware/validation'

const router = Router()

router.get('/', authenticate, getConversations)
router.post('/', authenticate, createConversation)
router.get('/:id/messages', authenticate, idValidation(), paginationValidation(), getMessages)
router.post('/:id/messages', authenticate, idValidation(), sendMessage)
router.patch('/:id/read', authenticate, idValidation(), markAsRead)

export default router
