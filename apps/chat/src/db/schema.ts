import {
	integer,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const conversations = pgTable("conversations", {
	id: serial("id").primaryKey(),
	lastMessageId: integer("last_message_id"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversationParticipants = pgTable("conversation_participants", {
	id: serial("id").primaryKey(),
	conversationId: integer("conversation_id")
		.references(() => conversations.id)
		.notNull(),
	userId: text("user_id").notNull(),
	joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
	id: serial("id").primaryKey(),
	conversationId: integer("conversation_id")
		.references(() => conversations.id)
		.notNull(),
	senderId: text("sender_id").notNull(),
	content: text("content").notNull(),
	type: text("type").default("text").notNull(),
	attachments:
		jsonb("attachments").$type<
			{ type: "image" | "file"; url: string; name?: string; size?: number }[]
		>(),
	readBy: jsonb("read_by").$type<string[]>(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
