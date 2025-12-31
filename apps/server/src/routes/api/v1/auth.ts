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
} from '../../../controllers/authController'
import { authenticate } from '../../../middleware/authentication'
import { registerValidation, loginValidation } from '../../../middleware/validation'

const router = Router()

router.post('/register', registerValidation(), register)
router.post('/login', loginValidation(), login)
router.post('/refresh', refreshToken)
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, getCurrentUser)
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router
