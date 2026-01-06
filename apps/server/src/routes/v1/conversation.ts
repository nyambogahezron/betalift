import { Router } from 'express'
import {
	getConversations,
	createConversation,
	getMessages,
	sendMessage,
	markAsRead,
} from '../../controllers/messageController'
import { authenticate } from '../../middleware/authentication'
import { validateParams, validateQuery, validateBody } from '../../validators/middleware'
import { z } from 'zod'
import {
	mongoIdSchema,
	paginationSchema,
	createConversationSchema,
	sendMessageSchema,
} from '../../validators/schemas'

const router = Router()

const idParamSchema = z.object({ id: mongoIdSchema })

router.get('/', authenticate, getConversations)
router.post('/', authenticate, validateBody(createConversationSchema), createConversation)
router.get('/:id/messages', authenticate, validateParams(idParamSchema), validateQuery(paginationSchema), getMessages)
router.post('/:id/messages', authenticate, validateParams(idParamSchema), validateBody(sendMessageSchema), sendMessage)
router.patch('/:id/read', authenticate, validateParams(idParamSchema), markAsRead)

export default router
