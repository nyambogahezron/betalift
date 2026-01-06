import { Router } from 'express'
import {
	getFeedbackById,
	updateFeedback,
	deleteFeedback,
	getFeedbackComments,
	createFeedbackComment,
	deleteFeedbackComment,
	voteFeedback,
} from '../../controllers/feedbackController'
import { authenticate } from '../../middleware/authentication'
import { validateParams, validateBody } from '../../validators/middleware'
import { z } from 'zod'
import {
	mongoIdSchema,
	updateFeedbackSchema,
	createFeedbackCommentSchema,
	voteFeedbackSchema,
} from '../../validators/schemas'

const router = Router()

const idParamSchema = z.object({ id: mongoIdSchema })
const commentIdParamSchema = z.object({ id: mongoIdSchema, commentId: mongoIdSchema })

router.route('/:id').get(validateParams(idParamSchema), getFeedbackById)
	.patch(authenticate, validateParams(idParamSchema), validateBody(updateFeedbackSchema), updateFeedback)
	.delete(authenticate, validateParams(idParamSchema), deleteFeedback)


router.route('/:id/comments').get(validateParams(idParamSchema), getFeedbackComments)
.post(authenticate, validateParams(idParamSchema), validateBody(createFeedbackCommentSchema), createFeedbackComment)

router.delete('/:id/comments/:commentId', authenticate, validateParams(commentIdParamSchema), deleteFeedbackComment)

router.post('/:id/vote', authenticate, validateParams(idParamSchema), validateBody(voteFeedbackSchema), voteFeedback)

export default router
