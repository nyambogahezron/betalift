import { Router } from 'express'
import authRoutes from './v1/auth.js'
import userRoutes from './v1/user.js'
import projectRoutes from './v1/project.js'
import feedbackRoutes from './v1/feedback.js'
import conversationRoutes from './v1/conversation.js'
import notificationRoutes from './v1/notification.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/projects', projectRoutes)
router.use('/feedback', feedbackRoutes)
router.use('/conversations', conversationRoutes)
router.use('/notifications', notificationRoutes)

export default router
