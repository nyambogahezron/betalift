import { Router } from "express";
import { z } from "zod";
import {
	deleteAllNotifications,
	deleteNotification,
	getNotifications,
	markAllNotificationsAsRead,
	markNotificationAsRead,
} from "../../controllers/notificationController";
import { authenticate } from "../../middleware/authentication";
import { validateParams, validateQuery } from "../../validators/middleware";
import { mongoIdSchema, paginationSchema } from "../../validators/schemas";

const router = Router();

const idParamSchema = z.object({ id: mongoIdSchema });

router.use(authenticate);

router
	.route("/")
	.get(validateQuery(paginationSchema), getNotifications)
	.delete(deleteAllNotifications);

router.patch("/read-all", markAllNotificationsAsRead);
router.patch(
	"/:id/read",
	validateParams(idParamSchema),
	markNotificationAsRead,
);
router.delete("/:id", validateParams(idParamSchema), deleteNotification);

export default router;
