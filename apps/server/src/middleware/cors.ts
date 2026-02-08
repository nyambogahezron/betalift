import ENV from "../config/env";

const corsOptions = {
	origin: (
		origin: string | undefined,
		callback: (err: Error | null, allow?: boolean) => void,
	) => {
		if (ENV.nodeEnv === "development" || (origin && origin === ENV.clientUrl)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: ["*"],
	credentials: true,
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"X-CSRF-Token",
		"X-API-Client",
	],
};

export default corsOptions;
