import { desc, eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { conversationParticipants, conversations } from "../db/schema";

export const getConversationsForUser = async (userId: string) => {
	const userConversations = await db
		.select({
			conversationId: conversationParticipants.conversationId,
		})
		.from(conversationParticipants)
		.where(eq(conversationParticipants.userId, userId));

	const conversationIds = userConversations.map((c) => c.conversationId);

	if (conversationIds.length === 0) {
		return [];
	}

	const results = await db
		.select({
			id: conversations.id,
			updatedAt: conversations.updatedAt,
			lastMessageId: conversations.lastMessageId,
		})
		.from(conversations)
		.where(inArray(conversations.id, conversationIds))
		.orderBy(desc(conversations.updatedAt));

	const participants = await db
		.select()
		.from(conversationParticipants)
		.where(inArray(conversationParticipants.conversationId, conversationIds));

	return results.map((conv) => {
		const parts = participants
			.filter((p) => p.conversationId === conv.id)
			.map((p) => ({ _id: p.userId }));

		return {
			_id: conv.id,
			...conv,
			participants: parts,
		};
	});
};

export const createConversation = async (
	userId: string,
	participantId: string,
) => {
	const myConvs = await db
		.select({ id: conversationParticipants.conversationId })
		.from(conversationParticipants)
		.where(eq(conversationParticipants.userId, userId));

	const theirConvs = await db
		.select({ id: conversationParticipants.conversationId })
		.from(conversationParticipants)
		.where(eq(conversationParticipants.userId, participantId));

	const commonConvId = myConvs.find((c1) =>
		theirConvs.some((c2) => c2.id === c1.id),
	)?.id;

	if (commonConvId) {
		const conv = await db
			.select()
			.from(conversations)
			.where(eq(conversations.id, commonConvId))
			.limit(1);
		if (conv[0]) {
			return { ...conv[0], _id: conv[0].id };
		}
	}

	const [newConv] = await db.insert(conversations).values({}).returning();

	if (!newConv) {
		throw new Error("Failed to create conversation");
	}

	await db.insert(conversationParticipants).values([
		{ conversationId: newConv.id, userId: userId },
		{ conversationId: newConv.id, userId: participantId },
	]);

	return { ...newConv, _id: newConv.id };
};

export const getConversationParticipants = async (conversationId: number) => {
	const participants = await db
		.select({
			userId: conversationParticipants.userId,
		})
		.from(conversationParticipants)
		.where(eq(conversationParticipants.conversationId, conversationId));

	return participants.map((p) => p.userId);
};
