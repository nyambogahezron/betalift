import jwt from "jsonwebtoken";
import type { Socket } from "socket.io";
import ENV from "../config/env";

interface JWTPayload extends jwt.JwtPayload {
	userId: string;
	[key: string]: unknown;
}

export interface AuthenticatedSocket extends Socket {
	user?: JWTPayload & { _id: string };
}

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
	const jwtSecret = ENV.JWT_SECRET;


	if (!jwtSecret) {
		return next(new Error("Unauthorized: JWT secret not configured"));
	}

	const token =
		socket.handshake.auth.token ||
		socket.handshake.headers.authorization?.split(" ")[1];

	if (!token) {
		return next(new Error("Unauthorized: No token provided"));
	}

	try {
		const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
		(socket as AuthenticatedSocket).user = { ...decoded, _id: decoded.userId };
		next();
	} catch (_error) {
		next(new Error("Unauthorized: Invalid token"));
	}
};
