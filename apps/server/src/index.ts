import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import helmet from "helmet";
import morgan from "morgan";
import ENV from "./config/env";
import { connectDatabase } from "./database/connect";
import { csrfMiddleware, generateCsrfToken } from "./middleware/csrf";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { apiLimiter } from "./middleware/rateLimiter";
import apiRoutes from "./routes";
import { logger } from "./utils/logger";

const app: Application = express();


connectDatabase();

// Middleware
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(apiLimiter);
app.use(csrfMiddleware);
app.use(
	cors({
		origin: ENV.clientUrl,
		credentials: true,
	}),
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Health check route
app.get("/", (_req: Request, res: Response) => {
	res.json({
		success: true,
		message: "BetaLift API is running!",
		version: "1.0.0",
		timestamp: new Date().toISOString(),
	});
});

app.get("/health", (_req: Request, res: Response) => {
	res.json({
		success: true,
		status: "healthy",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	});
});

// API routes
app.use("/api/v1", apiRoutes);

// CSRF token route
app.get("/csrf-token", generateCsrfToken);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const server = app.listen(ENV.port, () => {
	logger.info(`Server is running on http://localhost:${ENV.port}`);
	logger.info(`Environment: ${ENV.nodeEnv}`);
});

const gracefulShutdown = (signal: string) => {
	logger.info(`${signal} signal received: closing HTTP server`);
	server.close(() => {
		logger.info("HTTP server closed");
		process.exit(0);
	});
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason, promise) => {
	logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
	logger.error("Uncaught Exception:", error);
	process.exit(1);
});

export default app;
