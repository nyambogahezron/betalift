import {
	forgotPasswordSchema,
	loginSchema,
	registerSchema,
	resetPasswordSchema,
	verifyEmailSchema,
} from '@repo/schema'
import { Router } from 'express'
import {
	forgotPassword,
	getCurrentUser,
	login,
	logout,
	register,
	resetPassword,
	verifyEmail,
} from '../../controllers/authController'
import { authenticate } from '../../middleware/authentication'
import { checkIpLockout } from '../../middleware/loginAttemptTracker'
import {
	authLimiter,
	loginRateLimiter,
	readLimiter,
} from '../../middleware/rateLimiter'
import { validateBody } from '../../validators/middleware'

const router: Router = Router()

router.post('/register', authLimiter, validateBody(registerSchema), register)
router.post(
	'/login',
	loginRateLimiter,
	checkIpLockout,
	validateBody(loginSchema),
	login,
)
router.post('/logout', authLimiter, authenticate, logout)
router.get('/me', readLimiter, authenticate, getCurrentUser)
router.post(
	'/verify-email',
	authLimiter,
	validateBody(verifyEmailSchema),
	verifyEmail,
)
router.post(
	'/forgot-password',
	authLimiter,
	validateBody(forgotPasswordSchema),
	forgotPassword,
)
router.post(
	'/reset-password',
	authLimiter,
	validateBody(resetPasswordSchema),
	resetPassword,
)

export default router
