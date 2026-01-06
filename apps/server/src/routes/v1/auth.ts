import { Router } from "express";
import {
	forgotPassword,
	getCurrentUser,
	login,
	logout,
	refreshToken,
	register,
	resetPassword,
	verifyEmail,
} from "../../controllers/authController";
import { authenticate } from "../../middleware/authentication";
import { authLimiter, readLimiter } from "../../middleware/rateLimiter";
import { validateBody } from "../../validators/middleware";
import {
	forgotPasswordSchema,
	loginSchema,
	refreshTokenSchema,
	registerSchema,
	resetPasswordSchema,
	verifyEmailSchema,
} from "../../validators/schemas";

const router = Router();

router.post("/register", authLimiter, validateBody(registerSchema), register);
router.post("/login", authLimiter, validateBody(loginSchema), login);
router.post(
	"/refresh",
	authLimiter,
	validateBody(refreshTokenSchema),
	refreshToken,
);
router.post("/logout", authLimiter, authenticate, logout);
router.get("/me", readLimiter, authenticate, getCurrentUser);
router.post(
	"/verify-email",
	authLimiter,
	validateBody(verifyEmailSchema),
	verifyEmail,
);
router.post(
	"/forgot-password",
	authLimiter,
	validateBody(forgotPasswordSchema),
	forgotPassword,
);
router.post(
	"/reset-password",
	authLimiter,
	validateBody(resetPasswordSchema),
	resetPassword,
);

export default router;
