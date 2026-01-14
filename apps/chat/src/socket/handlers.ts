import type { Server, Socket } from "socket.io";
import {
	consumeConversationPoints,
	consumeMessagePoints,
} from "../middleware/rateLimiter";
import type { AuthenticatedSocket } from "../middleware/socketAuth";
import RabbitMQClient from "../rabbitmq/client";
import {
	createConversationSchema,
	getMessagesSchema,
	sendMessageSchema,
} from "../schemas/socket";
import * as conservationService from "../services/conversationService";
import * as messageService from "../services/messageService";
import { logger } from "../utils/logger";

export const registerSocketHandlers = (io: Server, socket: Socket) => {
	const authSocket = socket as AuthenticatedSocket;
	const userId = authSocket.user?._id;

	if (!userId) {
		return;
	}

	socket.on("get_conversations", async (callback) => {
		try {
			const conversations =
				await conservationService.getConversationsForUser(userId);
			if (typeof callback === "function") {
				callback({ success: true, data: conversations });
			} else {
				socket.emit("conversations_list", {
					success: true,
					data: conversations,
				});
			}
		} catch (error) {
			logger.error("Socket error get_conversations:", error);
			if (typeof callback === "function") {
				callback({ success: false, message: "Failed to fetch conversations" });
			}
		}
	});

	socket.on("create_conversation", async (data, callback) => {
		try {
			const rateLimit = await consumeConversationPoints(userId);
			if (!rateLimit.success) {
				if (typeof callback === "function") {
					return callback({
						success: false,
						message: "Rate limit exceeded. Please try again later.",
					});
				}
				return;
			}

			const validation = createConversationSchema.safeParse(data);
			if (!validation.success) {
				if (typeof callback === "function") {
					return callback({
						success: false,
						message: "Invalid data",
						errors: validation.error.format(),
					});
				}
				return;
			}
			const { participantId } = validation.data;

			const conversation = await conservationService.createConversation(
				userId,
				participantId,
			);

			socket.join(conversation._id.toString());

			if (typeof callback === "function") {
				callback({ success: true, data: conversation });
			}
		} catch (error) {
			logger.error("Socket error create_conversation:", error);
			if (typeof callback === "function") {
				callback({ success: false, message: "Failed to create conversation" });
			}
		}
	});

	socket.on("get_messages", async (data, callback) => {
		try {
			const validation = getMessagesSchema.safeParse(data);
			if (!validation.success) {
				if (typeof callback === "function") {
					return callback({
						success: false,
						message: "Invalid data",
						errors: validation.error.format(),
					});
				}
				return;
			}
			const { conversationId, limit, offset } = validation.data;

			const messages = await messageService.getMessagesForConversation(
				conversationId,
				limit,
				offset,
			);

			if (typeof callback === "function") {
				callback({ success: true, data: messages });
			} else {
				socket.emit("messages_list", {
					success: true,
					conversationId,
					data: messages,
				});
			}
		} catch (error) {
			logger.error("Socket error get_messages:", error);
			if (typeof callback === "function") {
				callback({ success: false, message: "Failed to fetch messages" });
			}
		}
	});

	socket.on("send_message", async (data, callback) => {
		try {
			const rateLimit = await consumeMessagePoints(userId);
			if (!rateLimit.success) {
				if (typeof callback === "function") {
					return callback({
						success: false,
						message: "Rate limit exceeded. Please try again later.",
					});
				}
				return;
			}

			const validation = sendMessageSchema.safeParse(data);
			if (!validation.success) {
				if (typeof callback === "function") {
					return callback({
						success: false,
						message: "Invalid data",
						errors: validation.error.format(),
					});
				}
				return;
			}

			const { conversationId, content, type, attachments } = validation.data;

			const message = await messageService.createMessage(
				userId,
				conversationId,
				content,
				type,
				attachments,
			);

			if (!message) {
				throw new Error("Failed to create message");
			}

			io.to(conversationId.toString()).emit("new_message", message);

			const participants =
				await conservationService.getConversationParticipants(conversationId);
			const otherParticipants = participants.filter((pId) => pId !== userId);

			otherParticipants.forEach(async (participantId) => {
				const notification = {
					userId: participantId,
					title: "New Message",
					message: `You have a new message: ${content.substring(0, 50)}${content.length > 50 ? "..." : ""}`,
					data: {
						conversationId,
						messageId: message.id,
						senderId: userId,
					},
				};

				await RabbitMQClient.publishNotification(notification);
			});

			if (typeof callback === "function") {
				callback({ success: true, data: message });
			}
		} catch (error) {
			logger.error("Socket error send_message:", error);
			if (typeof callback === "function") {
				callback({ success: false, message: "Failed to send message" });
			}
		}
	});

	const joinUserRooms = async () => {
		try {
			const conversations =
				await conservationService.getConversationsForUser(userId);
			conversations.forEach((c) => {
				socket.join(c._id.toString());
			});
		} catch (e) {
			logger.error("Failed to join rooms", e);
		}
	};

	joinUserRooms();
};
