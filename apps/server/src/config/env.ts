import dotenv from "dotenv";

dotenv.config();

const ENV = {
	nodeEnv: process.env.NODE_ENV || "development",
	port: parseInt(process.env.PORT || "5000", 10),

	// Database
	mongoUri: process.env.MONGODB_URI || "",
	mongoUriTest: process.env.MONGODB_URI_TEST || "",

	// JWT
	jwtSecret: process.env.JWT_SECRET || "",
	jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
	jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",

	// Email
	smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
	smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
	smtpSecure: process.env.SMTP_SECURE === "true",
	smtpUser: process.env.SMTP_USER || "",
	smtpPassword: process.env.SMTP_PASSWORD || "",
	emailFrom: process.env.EMAIL_FROM || "",

	// Client
	clientUrl: process.env.CLIENT_URL || "http://localhost:8081",

	// File Upload
	maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10), // 10MB
	uploadDir: process.env.UPLOAD_DIR || "uploads",

	// Rate Limiting
	rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
	rateLimitMaxRequests: parseInt(
		process.env.RATE_LIMIT_MAX_REQUESTS || "100",
		10,
	),

	// Pagination
	defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || "20", 10),
	maxPageSize: parseInt(process.env.MAX_PAGE_SIZE || "100", 10),
};

export default ENV;
