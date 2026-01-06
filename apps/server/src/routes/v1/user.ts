import { Router } from "express";
import { z } from "zod";
import {
	deleteUser,
	getUserById,
	getUserEngagement,
	getUserStats,
	getUsers,
	updateSettings,
	updateUser,
	updateUserEngagement,
} from "../../controllers/userController";
import { authenticate } from "../../middleware/authentication";
import { readLimiter, writeLimiter } from "../../middleware/rateLimiter";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "../../validators/middleware";
import {
	getUsersQuerySchema,
	mongoIdSchema,
	updateUserEngagementSchema,
	updateUserSchema,
	updateUserSettingsSchema,
} from "../../validators/schemas";

const router = Router();

const idParamSchema = z.object({ id: mongoIdSchema });

router.get("/", readLimiter, validateQuery(getUsersQuerySchema), getUsers);

router.use(authenticate);

router
	.route("/:id")
	.get(readLimiter, validateParams(idParamSchema), getUserById)
	.patch(
		writeLimiter,
		validateParams(idParamSchema),
		validateBody(updateUserSchema),
		updateUser,
	)
	.delete(writeLimiter, validateParams(idParamSchema), deleteUser);
router.get(
	"/:id/stats",
	readLimiter,
	validateParams(idParamSchema),
	getUserStats,
);
router.patch(
	"/:id/settings",
	writeLimiter,
	validateParams(idParamSchema),
	validateBody(updateUserSettingsSchema),
	updateSettings,
);

router
	.route("/:id/engagement")
	.get(readLimiter, validateParams(idParamSchema), getUserEngagement)
	.patch(
		writeLimiter,
		validateParams(idParamSchema),
		validateBody(updateUserEngagementSchema),
		updateUserEngagement,
	);

export default router;
