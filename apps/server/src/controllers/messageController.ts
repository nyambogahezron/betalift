import type { Response } from "express";
import mongoose from "mongoose";
import Conversation from "../database/models/conversation";
import Message from "../database/models/message";
import User from "../database/models/user";
import asyncHandler from "../middleware/asyncHandler";
import type { AuthenticatedRequest } from "../middleware/authentication";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../utils/errors";

// @desc    Get user conversations
// @route   GET /api/v1/conversations
// @access  Private
export const getConversations = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const conversations = await Conversation.find({
			participants: req.user._id,
		})
			.populate("participants", "username displayName avatar")
			.populate("lastMessageId")
			.sort({ updatedAt: -1 });

		// Add unread count for each conversation
		const conversationsWithUnread = await Promise.all(
			conversations.map(async (conv) => {
				const unreadCount = await Message.countDocuments({
					conversationId: conv._id,
					senderId: { $ne: req.user?._id },
					readBy: { $nin: [req.user?._id] },
				});

				return {
					...conv.toJSON(),
					unreadCount,
				};
			}),
		);

		res.json({
			success: true,
			data: conversationsWithUnread,
		});
	},
);

// @desc    Get or create conversation
// @route   POST /api/v1/conversations
// @access  Private
export const createConversation = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { participantId } = req.body;

		if (!participantId) {
			throw new BadRequestError("Participant ID is required");
		}

		// Verify other user exists
		const otherUser = await User.findById(participantId);

		if (!otherUser) {
			throw new NotFoundError("User not found");
		}

		// Check if conversation already exists
		const existingConversation = await Conversation.findOne({
			participants: { $all: [req.user._id, participantId] },
		})
			.populate("participants", "username displayName avatar")
			.populate("lastMessageId");

		if (existingConversation) {
			res.json({
				success: true,
				data: existingConversation,
			});
			return;
		}

		// Create new conversation
		const conversation = await Conversation.create({
			participants: [req.user._id, participantId],
		});

		const populatedConversation = await Conversation.findById(
			conversation._id,
		).populate("participants", "username displayName avatar");

		res.status(201).json({
			success: true,
			data: populatedConversation,
		});
	},
);

// @desc    Get conversation messages
// @route   GET /api/v1/conversations/:id/messages
// @access  Private
export const getMessages = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const page = parseInt(req.query.page as string, 10) || 1;
		const limit = Math.min(parseInt(req.query.limit as string, 10) || 50, 100);
		const skip = (page - 1) * limit;

		const conversation = await Conversation.findById(req.params.id);

		if (!conversation) {
			throw new NotFoundError("Conversation not found");
		}

		// Verify user is a participant
		if (
			!conversation.participants.some((id) => id.toString() === req.user._id)
		) {
			throw new ForbiddenError(
				"You are not a participant in this conversation",
			);
		}

		const [messages, total] = await Promise.all([
			Message.find({ conversationId: req.params.id })
				.populate("senderId", "username displayName avatar")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit),
			Message.countDocuments({ conversationId: req.params.id }),
		]);

		res.json({
			success: true,
			data: {
				messages: messages.reverse(), // Reverse to show oldest first
				pagination: {
					page,
					limit,
					total,
					pages: Math.ceil(total / limit),
				},
			},
		});
	},
);

// @desc    Send message
// @route   POST /api/v1/conversations/:id/messages
// @access  Private
export const sendMessage = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const conversation = await Conversation.findById(req.params.id);

		if (!conversation) {
			throw new NotFoundError("Conversation not found");
		}

		// Verify user is a participant
		if (
			!conversation.participants.some((id) => id.toString() === req.user._id)
		) {
			throw new ForbiddenError(
				"You are not a participant in this conversation",
			);
		}

		const message = await Message.create({
			conversationId: req.params.id,
			senderId: req.user._id,
			content: req.body.content,
			type: req.body.type || "text",
			attachments: req.body.attachments || [],
			readBy: [new mongoose.Types.ObjectId(req.user._id)],
		});

		// Update conversation last message and updatedAt
		await Conversation.findByIdAndUpdate(req.params.id, {
			lastMessageId: message._id,
			updatedAt: new Date(),
		});

		const populatedMessage = await Message.findById(message._id).populate(
			"senderId",
			"username displayName avatar",
		);

		res.status(201).json({
			success: true,
			data: populatedMessage,
		});
	},
);

// @desc    Mark messages as read
// @route   PATCH /api/v1/conversations/:id/read
// @access  Private
export const markAsRead = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const conversation = await Conversation.findById(req.params.id);

		if (!conversation) {
			throw new NotFoundError("Conversation not found");
		}

		// Verify user is a participant
		if (
			!conversation.participants.some((id) => id.toString() === req.user._id)
		) {
			throw new ForbiddenError(
				"You are not a participant in this conversation",
			);
		}

		// Mark all unread messages as read
		await Message.updateMany(
			{
				conversationId: req.params.id,
				senderId: { $ne: req.user._id },
				readBy: { $nin: [req.user._id] },
			},
			{
				$addToSet: { readBy: req.user._id },
			},
		);

		res.json({
			success: true,
			message: "Messages marked as read",
		});
	},
);
