import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { conversations, messages } from "../db/schema";

type MessageAttachments = (typeof messages.$inferInsert)["attachments"];

export const getMessagesForConversation = async (
	conversationId: number,
	limit = 50,
	offset = 0,
) => {
	const result = await db
		.select()
		.from(messages)
		.where(eq(messages.conversationId, conversationId))
		.orderBy(desc(messages.createdAt))
		.limit(limit)
		.offset(offset);

	return result.reverse();
};

export const createMessage = async (
	userId: string,
	conversationId: number,
	content: string,
	type = "text",
	attachments: MessageAttachments = [],
) => {
	const [newMessage] = await db
		.insert(messages)
		.values({
			conversationId,
			senderId: userId,
			content,
			type,
			attachments,
			readBy: [userId],
		})
		.returning();

	if (!newMessage) {
		throw new Error("Failed to create message");
	}

	await db
		.update(conversations)
		.set({ lastMessageId: newMessage.id, updatedAt: new Date() })
		.where(eq(conversations.id, conversationId));

	return newMessage;
};
