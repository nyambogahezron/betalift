import { Router } from 'express'
import {
	register,
	login,
	refreshToken,
	logout,
	getCurrentUser,
	verifyEmail,
	forgotPassword,
	resetPassword,
} from '../../controllers/authController'
import { authenticate } from '../../middleware/authentication'
import { validateBody } from '../../validators/middleware'
import {
	registerSchema,
	loginSchema,
	verifyEmailSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	refreshTokenSchema,
} from '../../validators/schemas'

const router = Router()

router.post('/register', validateBody(registerSchema), register)
router.post('/login', validateBody(loginSchema), login)
router.post('/refresh', validateBody(refreshTokenSchema), refreshToken)
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, getCurrentUser)
router.post('/verify-email', validateBody(verifyEmailSchema), verifyEmail)
router.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPassword)
router.post('/reset-password', validateBody(resetPasswordSchema), resetPassword)

export default router
