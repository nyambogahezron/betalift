import { Router } from "express";
import { z } from "zod";
import {
	createConversation,
	getConversations,
	getMessages,
	markAsRead,
	sendMessage,
} from "../../controllers/messageController";
import { authenticate } from "../../middleware/authentication";
import { readLimiter, writeLimiter } from "../../middleware/rateLimiter";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "../../validators/middleware";
import {
	createConversationSchema,
	mongoIdSchema,
	paginationSchema,
	sendMessageSchema,
} from "../../validators/schemas";

const router = Router();

const idParamSchema = z.object({ id: mongoIdSchema });

router.use(authenticate);

router
	.route("/")
	.get(readLimiter, getConversations)
	.post(
		writeLimiter,
		validateBody(createConversationSchema),
		createConversation,
	);

router
	.route("/:id/messages")
	.get(
		readLimiter,
		validateParams(idParamSchema),
		validateQuery(paginationSchema),
		getMessages,
	)
	.post(
		writeLimiter,
		validateParams(idParamSchema),
		validateBody(sendMessageSchema),
		sendMessage,
	);

router.patch(
	"/:id/read",
	writeLimiter,
	validateParams(idParamSchema),
	markAsRead,
);

export default router;
