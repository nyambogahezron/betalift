import { createLogger as createWinstonLogger, format, transports, type Logger } from "winston";

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} [${level}]: ${stack || message}`;
});

export interface LoggerOptions {
	service: string;
	nodeEnv?: string;
	logDir?: string;
}

export const createLogger = (options: LoggerOptions): Logger => {
	const nodeEnv = options.nodeEnv || "development";
	const logDir = options.logDir || "logs";
	const service = options.service;

	const logger = createWinstonLogger({
		level: nodeEnv === "production" ? "info" : "debug",
		defaultMeta: { service },
		format: combine(
			errors({ stack: true }),
			timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
			logFormat,
		),
		transports: [
			new transports.Console({
				format: combine(colorize(), logFormat),
			}),
		],
	});

    // Add file transports
    logger.add(new transports.File({ filename: `${logDir}/error.log`, level: "error" }));
    logger.add(new transports.File({ filename: `${logDir}/combined.log` }));

	return logger;
};

export const logger = createLogger({
	service: process.env.SERVICE_NAME || "betalift",
	nodeEnv: process.env.NODE_ENV,
});

export default logger;
