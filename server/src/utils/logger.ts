import { createLogger, format, transports } from 'winston'
import ENV from '../config/env'

const { combine, timestamp, printf, colorize, errors } = format

const logFormat = printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} [${level}]: ${stack || message}`
})

export const logger = createLogger({
	level: ENV.nodeEnv === 'production' ? 'info' : 'debug',
	format: combine(
		errors({ stack: true }),
		timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		logFormat
	),
	transports: [
		new transports.Console({
			format: combine(colorize(), logFormat),
		}),
		new transports.File({ filename: 'logs/error.log', level: 'error' }),
		new transports.File({ filename: 'logs/combined.log' }),
	],
})

// If we're not in production, log to the console with colorized output
if (ENV.nodeEnv !== 'production') {
	logger.add(
		new transports.Console({
			format: combine(colorize(), logFormat),
		})
	)
}
