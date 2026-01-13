import Conversation from "../models/conversation.js";
import type { IUser } from "../models/user.js";

export const seedConversations = async (users: IUser[]) => {
	const createdConversations = [];

	// Create conversations between random pairs of users
	// We'll create about 5-10 conversations
	const numberOfConversations = 8;

	for (let i = 0; i < numberOfConversations; i++) {
		// Pick two distinct users
		const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
		const participants = [shuffledUsers[0], shuffledUsers[1]];
		const participantIds = participants.map((u) => u._id);

		// Check if conversation already exists
		const existing = await Conversation.findOne({
			participants: { $all: participantIds },
		});

		if (!existing) {
			const conversation = await Conversation.create({
				participants: participantIds,
				// lastMessageId will be updated when messages are seeded
			});
			createdConversations.push(conversation);
		}
	}

	return createdConversations;
};
