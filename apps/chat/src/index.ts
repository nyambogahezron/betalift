import cors from "cors";
import express from "express";
import ip from "ip";
import { Server } from "socket.io";
import ENV from "./config/env";
import { socketAuth } from "./middleware/socketAuth";
import RabbitMQClient from "./rabbitmq/client";
import { registerSocketHandlers } from "./socket/handlers";
import { logger } from "./utils/logger";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
	res.json({ status: "ok" });
});

const server = app.listen(ENV.PORT, () => {
	logger.info('Chat Service Starting...')
	logger.info(`Chat server running on http://${ip.address()}:${ENV.PORT}`);
});

const io = new Server(server, {
	cors: {
		origin: ENV.CORS_ORIGIN || "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.use(socketAuth);

io.on("connection", (socket) => {
	logger.info("User connected:", socket.id);
	registerSocketHandlers(io, socket);

	socket.on("disconnect", () => {
		logger.info("User disconnected:", socket.id);
	});
});

RabbitMQClient.connect();

export { io };
