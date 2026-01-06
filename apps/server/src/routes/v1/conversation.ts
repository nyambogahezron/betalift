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

router.use(authenticate)

router
	.route('/')
	.get(getConversations)
	.post(validateBody(createConversationSchema), createConversation)

router
	.route('/:id/messages')
	.get(
		validateParams(idParamSchema),
		validateQuery(paginationSchema),
		getMessages
	)
	.post(
		validateParams(idParamSchema),
		validateBody(sendMessageSchema),
		sendMessage
	)

router.patch('/:id/read', validateParams(idParamSchema), markAsRead)

export default router
