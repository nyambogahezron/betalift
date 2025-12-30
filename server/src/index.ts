import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import ENV from './config/env'
import { connectDatabase } from './database/connect'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'
import apiRoutes from './routes/api'

const app: Application = express()

// Connect to database
connectDatabase()

// Middleware
app.use(helmet())
app.use(
	cors({
		origin: ENV.clientUrl,
		credentials: true,
	})
)
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Health check route
app.get('/', (req: Request, res: Response) => {
	res.json({
		success: true,
		message: 'BetaLift API is running!',
		version: '1.0.0',
		timestamp: new Date().toISOString(),
	})
})

app.get('/health', (req: Request, res: Response) => {
	res.json({
		success: true,
		status: 'healthy',
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	})
})

// API routes
app.use('/api/v1', apiRoutes)

// Error handling middleware (must be last)
app.use(notFound)
app.use(errorHandler)

const server = app.listen(ENV.port, () => {
	logger.info(`Server is running on http://localhost:${ENV.port}`)
	logger.info(`Environment: ${ENV.nodeEnv}`)
})

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
	logger.info(`${signal} signal received: closing HTTP server`)
	server.close(() => {
		logger.info('HTTP server closed')
		process.exit(0)
	})
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
	logger.error('Uncaught Exception:', error)
	process.exit(1)
})

export default app


