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
import {
	frequentAccessLimiter,
	writeLimiter,
} from "../../middleware/rateLimiter";
import { validateParams, validateQuery } from "../../validators/middleware";
import { mongoIdSchema, paginationSchema } from "../../validators/schemas";

const router = Router();

const idParamSchema = z.object({ id: mongoIdSchema });

router.use(authenticate);

router
	.route("/")
	.get(frequentAccessLimiter, validateQuery(paginationSchema), getNotifications)
	.delete(writeLimiter, deleteAllNotifications);

router.patch("/read-all", writeLimiter, markAllNotificationsAsRead);
router.patch(
	"/:id/read",
	writeLimiter,
	validateParams(idParamSchema),
	markNotificationAsRead,
);
router.delete(
	"/:id",
	writeLimiter,
	validateParams(idParamSchema),
	deleteNotification,
);

export default router;
