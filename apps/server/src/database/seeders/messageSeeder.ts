import Message, { type IMessage } from "../models/message.js";
import Conversation, { type IConversation } from "../models/conversation.js";
import type { IUser } from "../models/user.js";

export const seedMessages = async (
	users: IUser[],
	conversations: IConversation[],
) => {
	const createdMessages: IMessage[] = [];

	const sampleMessages = [
		"Hey, how are you doing?",
		"I found a bug in the latest release.",
		"Can you explain how this feature works?",
		"Great job on the new update!",
		"When is the next release coming out?",
		"Thanks for the feedback!",
		"I'll check that out.",
		"Sure, no problem.",
		"Have you tried clearing the cache?",
		"Yes, that fixed it. Thanks!",
	];

	for (const conversation of conversations) {
		const participants = conversation.participants.map((pId) =>
			users.find((u) => u._id.toString() === pId.toString()),
		).filter(Boolean) as IUser[];
		
		if (participants.length < 2) continue;

		// Create 3-8 messages per conversation
		const numberOfMessages = Math.floor(Math.random() * 6) + 3;
		let lastMessage = null;

		for (let i = 0; i < numberOfMessages; i++) {
			const sender = participants[i % 2]; // Alternate senders
			const content =
				sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

			const message = await Message.create({
				conversationId: conversation._id,
				senderId: sender?._id,
				content: content,
				type: "text",
				readBy: [sender?._id], // Mark as read by sender at least
			});

			lastMessage = message;
			createdMessages.push(message);
		}

		// Update conversation with last message
		if (lastMessage) {
			conversation.lastMessageId = lastMessage._id;
			await conversation.save();
		}
	}

	return createdMessages;
};
