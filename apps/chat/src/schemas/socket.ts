import { z } from "zod";

export const createConversationSchema = z.object({
	participantId: z.string().min(1, "Participant ID is required"),
});

export const getMessagesSchema = z.object({
	conversationId: z.coerce.number().min(1, "Conversation ID is required"),
	limit: z.number().int().positive().optional().default(50),
	offset: z.number().int().nonnegative().optional().default(0),
});

export const sendMessageSchema = z.object({
	conversationId: z.coerce.number().min(1, "Conversation ID is required"),
	content: z.string().min(1, "Message content cannot be empty"),
	type: z.enum(["text", "image", "file"]).default("text"),
	attachments: z
		.array(
			z.object({
				type: z.enum(["image", "file"]),
				url: z.string().url(),
				name: z.string().optional(),
				size: z.number().optional(),
			}),
		)
		.optional()
		.default([]),
});
