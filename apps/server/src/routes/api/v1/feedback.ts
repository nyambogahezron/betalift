import { Router } from 'express'
import {
	getFeedbackById,
	updateFeedback,
	deleteFeedback,
	getFeedbackComments,
	createFeedbackComment,
	deleteFeedbackComment,
	voteFeedback,
} from '../../../controllers/feedback'
import { authenticate } from '../../../middleware/authentication'
import { idValidation } from '../../../middleware/validation'

const router = Router()

router.get('/:id', idValidation(), getFeedbackById)
router.patch('/:id', authenticate, idValidation(), updateFeedback)
router.delete('/:id', authenticate, idValidation(), deleteFeedback)

// Comments routes
router.get('/:id/comments', idValidation(), getFeedbackComments)
router.post(
	'/:id/comments',
	authenticate,
	idValidation(),
	createFeedbackComment
)
router.delete('/:id/comments/:commentId', authenticate, deleteFeedbackComment)

// Vote routes
router.post('/:id/vote', authenticate, idValidation(), voteFeedback)

export default router
