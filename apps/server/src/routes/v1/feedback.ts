import { Router } from "express";
import { z } from "zod";
import {
	createFeedbackComment,
	deleteFeedback,
	deleteFeedbackComment,
	getFeedbackById,
	getFeedbackComments,
	updateFeedback,
	voteFeedback,
} from "../../controllers/feedbackController";
import { authenticate } from "../../middleware/authentication";
import { readLimiter, writeLimiter } from "../../middleware/rateLimiter";
import { validateBody, validateParams } from "../../validators/middleware";
import {
	createFeedbackCommentSchema,
	mongoIdSchema,
	updateFeedbackSchema,
	voteFeedbackSchema,
} from "../../validators/schemas";

const router = Router();

const idParamSchema = z.object({ id: mongoIdSchema });
const commentIdParamSchema = z.object({
	id: mongoIdSchema,
	commentId: mongoIdSchema,
});

router
	.route("/:id")
	.get(readLimiter, validateParams(idParamSchema), getFeedbackById)
	.patch(
		writeLimiter,
		authenticate,
		validateParams(idParamSchema),
		validateBody(updateFeedbackSchema),
		updateFeedback,
	)
	.delete(
		writeLimiter,
		authenticate,
		validateParams(idParamSchema),
		deleteFeedback,
	);

router
	.route("/:id/comments")
	.get(readLimiter, validateParams(idParamSchema), getFeedbackComments)
	.post(
		writeLimiter,
		authenticate,
		validateParams(idParamSchema),
		validateBody(createFeedbackCommentSchema),
		createFeedbackComment,
	);

router.delete(
	"/:id/comments/:commentId",
	writeLimiter,
	authenticate,
	validateParams(commentIdParamSchema),
	deleteFeedbackComment,
);

router.post(
	"/:id/vote",
	writeLimiter,
	authenticate,
	validateParams(idParamSchema),
	validateBody(voteFeedbackSchema),
	voteFeedback,
);

export default router;
