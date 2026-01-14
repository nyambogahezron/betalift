import { RateLimiterMemory } from "rate-limiter-flexible";

const messageLimiter = new RateLimiterMemory({
	points: 10,
	duration: 10,
});

const conversationLimiter = new RateLimiterMemory({
	points: 5,
	duration: 60,
});

export const consumeMessagePoints = async (userId: string) => {
	try {
		await messageLimiter.consume(userId);
		return { success: true };
	} catch (_) {
		return { success: false };
	}
};

export const consumeConversationPoints = async (userId: string) => {
	try {
		await conversationLimiter.consume(userId);
		return { success: true };
	} catch (_) {
		return { success: false };
	}
};
