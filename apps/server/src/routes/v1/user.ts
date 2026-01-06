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

router.get("/", validateQuery(getUsersQuerySchema), getUsers);

router.use(authenticate);

router
	.route("/:id")
	.get(validateParams(idParamSchema), getUserById)
	.patch(
		validateParams(idParamSchema),
		validateBody(updateUserSchema),
		updateUser,
	)
	.delete(validateParams(idParamSchema), deleteUser);
router.get("/:id/stats", validateParams(idParamSchema), getUserStats);
router.patch(
	"/:id/settings",
	validateParams(idParamSchema),
	validateBody(updateUserSettingsSchema),
	updateSettings,
);

router
	.route("/:id/engagement")
	.get(validateParams(idParamSchema), getUserEngagement)
	.patch(
		validateParams(idParamSchema),
		validateBody(updateUserEngagementSchema),
		updateUserEngagement,
	);

export default router;
