import type { Response } from "express";
import type mongoose from "mongoose";
import ENV from "../config/env";
import Feedback from "../database/models/feedback";
import FeedbackComment from "../database/models/feedbackComment";
import FeedbackVote from "../database/models/feedbackVote";
import Notification from "../database/models/notification";
import Project from "../database/models/project";
import User from "../database/models/user";
import asyncHandler from "../middleware/asyncHandler";
import type {
	AuthenticatedRequest,
	AuthRequest,
} from "../middleware/authentication";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../utils/errors";

// @route   GET /api/v1/projects/:projectId/feedback
// @access  Public
export const getFeedback = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const page = parseInt(req.query.page as string, 10) || 1;
		const limit = Math.min(
			parseInt(req.query.limit as string, 10) || ENV.defaultPageSize,
			ENV.maxPageSize,
		);
		const skip = (page - 1) * limit;

		const { projectId } = req.params;
		const { type, status, priority, userId, sort } = req.query;

		const query: {
			projectId?: string;
			type?: { $in: string[] };
			status?: { $in: string[] };
			priority?: { $in: string[] };
			userId?: string;
		} = { projectId };

		if (type) {
			query.type = { $in: (type as string).split(",") };
		}

		if (status) {
			query.status = { $in: (status as string).split(",") };
		}

		if (priority) {
			query.priority = { $in: (priority as string).split(",") };
		}

		if (userId) {
			query.userId = userId as string;
		}

		let sortQuery: { createdAt?: -1; upvotes?: -1; priority?: -1 } = {
			createdAt: -1,
		};

		if (sort === "upvotes") {
			sortQuery = { upvotes: -1 };
		} else if (sort === "recent") {
			sortQuery = { createdAt: -1 };
		} else if (sort === "priority") {
			sortQuery = { priority: -1 };
		}

		const [feedback, total] = await Promise.all([
			Feedback.find(query)
				.populate("userId", "username displayName avatar")
				.populate("projectId", "name icon")
				.sort(sortQuery)
				.skip(skip)
				.limit(limit),
			Feedback.countDocuments(query),
		]);

		res.json({
			success: true,
			data: {
				feedback,
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

// @route   GET /api/v1/feedback/:id
// @access  Public
export const getFeedbackById = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const feedback = await Feedback.findById(req.params.id)
			.populate("userId", "username displayName avatar bio")
			.populate("projectId", "name icon ownerId");

		if (!feedback) {
			throw new NotFoundError("Feedback not found");
		}

		res.json({
			success: true,
			data: feedback,
		});
	},
);

// @route   POST /api/v1/projects/:projectId/feedback
// @access  Private
export const createFeedback = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { projectId } = req.params;

		const project = await Project.findById(projectId);

		if (!project) {
			throw new NotFoundError("Project not found");
		}

		const feedback = await Feedback.create({
			...req.body,
			projectId,
			userId: req.user._id,
		});

		await Project.findByIdAndUpdate(projectId, {
			$inc: { feedbackCount: 1 },
		});

		await User.findByIdAndUpdate(req.user._id, {
			$inc: { "stats.feedbackGiven": 1 },
		});

		await User.findByIdAndUpdate(project.ownerId, {
			$inc: { "stats.feedbackReceived": 1 },
		});

		const currentUser = await User.findById(req.user._id);

		await Notification.create({
			userId: project.ownerId,
			type: "feedback_received",
			title: "New Feedback",
			message: `${currentUser?.username || "Someone"} submitted feedback on ${
				project.name
			}`,
			data: {
				projectId,
				feedbackId: feedback._id,
			},
		});

		const populatedFeedback = await Feedback.findById(feedback._id)
			.populate("userId", "username displayName avatar")
			.populate("projectId", "name icon");

		res.status(201).json({
			success: true,
			message: "Feedback created successfully",
			data: populatedFeedback,
		});
	},
);

// @route   PATCH /api/v1/feedback/:id
// @access  Private
export const updateFeedback = asyncHandler(
	async (req: AuthenticatedRequest, _res: Response) => {
		const feedback = await Feedback.findById(req.params.id).populate(
			"projectId",
			"ownerId",
		);

		if (!feedback) {
			throw new NotFoundError("Feedback not found");
		}

		const project = feedback.projectId as unknown as {
			ownerId: mongoose.Types.ObjectId;
		};

		// Only feedback author or project owner can update
		if (
			feedback.userId.toString() !== req.user._id &&
			project.ownerId.toString() !== req.user._id
		) {
			throw new ForbiddenError(
				"You do not have permission to update this feedback",
			);
		}

		// If status is being changed to resolved, set resolvedAt
			req.body.resolvedAt = new Date();

			// Notify feedback author
			if (project.ownerId.toString() === req.user._id) {
				await Notification.create({
					userId: feedback.userId,
					type: "feedback_status_changed",
					title: "Feedback Resolved",
					message: `Your feedback has been resolved`,
					data: {
						feedbackId: feedback._id,
					},
				});
			}
		}

		const updatedFeedback = await Feedback.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true },
		)
			.populate("userId", "username displayName avatar")
			.populate("projectId", "name icon");

		res.json({
			success: true,
			message: "Feedback updated successfully",
			data: updatedFeedback,
		});
	},
);

// @route   DELETE /api/v1/feedback/:id
// @access  Private
export const deleteFeedback = asyncHandler(
	async (req: AuthenticatedRequest, _res: Response) => {
		const feedback = await Feedback.findById(req.params.id).populate(
			"projectId",
			"ownerId",
		);

		if (!feedback) {
			throw new NotFoundError("Feedback not found");
		}

		const _project = feedback.projectId as unknown as {
			ownerId: mongoose.Types.ObjectId;
		};

		// Only feedback author or project owner can delete
			throw new ForbiddenError(
				"You do not have permission to delete this feedback",
			);
		}

		await Feedback.findByIdAndDelete(req.params.id);

		await Project.findByIdAndUpdate(feedback.projectId, {
			$inc: { feedbackCount: -1 },
		});

		res.json({
			success: true,
			message: "Feedback deleted successfully",
		});
	},
);

// @route   GET /api/v1/feedback/:id/comments
// @access  Public
export const getFeedbackComments = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const comments = await FeedbackComment.find({ feedbackId: req.params.id })
			.populate("userId", "username displayName avatar")
			.sort({ createdAt: 1 });

		res.json({
			success: true,
			data: comments,
		});
	},
);

// @route   POST /api/v1/feedback/:id/comments
// @access  Private
export const createFeedbackComment = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const feedback = await Feedback.findById(req.params.id).populate(
			"projectId userId",
		);

		if (!feedback) throw new NotFoundError("Feedback not found");

		const comment = await FeedbackComment.create({
			feedbackId: req.params.id,
			userId: req.user._id,
			content: req.body.content,
		});

		// Update feedback comment count
		await Feedback.findByIdAndUpdate(req.params.id, {
			$inc: { commentCount: 1 },
		});

		// Notify feedback author (if not the commenter)
		if (feedback.userId.toString() !== req.user._id) {
			const currentUser = await User.findById(req.user._id);
			await Notification.create({
				userId: feedback.userId,
				type: "feedback_comment",
				title: "New Comment",
				message: `${
					currentUser?.username || "Someone"
				} commented on your feedback`,
				data: {
					feedbackId: feedback._id,
					commentId: comment._id,
				},
			});
		}

		const populatedComment = await FeedbackComment.findById(
			comment._id,
		).populate("userId", "username displayName avatar");

		res.status(201).json({
			success: true,
			message: "Comment created successfully",
			data: populatedComment,
		});
	},
);

// @route   DELETE /api/v1/feedback/:id/comments/:commentId
// @access  Private
export const deleteFeedbackComment = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const comment = await FeedbackComment.findById(req.params.commentId);

		if (!comment) {
			throw new NotFoundError("Comment not found");
		}

		if (comment.userId.toString() !== req.user._id) {
			throw new ForbiddenError(
				"You do not have permission to delete this comment",
			);
		}

		await FeedbackComment.findByIdAndDelete(req.params.commentId);

		await Feedback.findByIdAndUpdate(req.params.id, {
			$inc: { commentCount: -1 },
		});

		res.json({
			success: true,
			message: "Comment deleted successfully",
		});
	},
);

// @route   POST /api/v1/feedback/:id/vote
// @access  Private
export const voteFeedback = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { type } = req.body;

		if (!["up", "down"].includes(type)) {
			throw new BadRequestError("Invalid vote type");
		}

		const feedback = await Feedback.findById(req.params.id);

		if (!feedback) {
			throw new NotFoundError("Feedback not found");
		}

		const existingVote = await FeedbackVote.findOne({
			feedbackId: req.params.id,
			userId: req.user._id,
		});

		if (existingVote) {
			// If same vote, remove it (toggle)
				await FeedbackVote.findByIdAndDelete(existingVote._id);

				// Update feedback vote count
				await Feedback.findByIdAndUpdate(req.params.id, {
					$inc: { [type === "up" ? "upvotes" : "downvotes"]: -1 },
				});

				res.json({
					success: true,
					message: "Vote removed",
				});
				return;
			}

			// If different vote, update it
			existingVote.type = type;
			await existingVote.save();

			await Feedback.findByIdAndUpdate(req.params.id, {
				$inc: {
					[type === "up" ? "upvotes" : "downvotes"]: 1,
					[type === "up" ? "downvotes" : "upvotes"]: -1,
				},
			});

			res.json({
				success: true,
				message: "Vote updated",
			});
			return;
		}

		await FeedbackVote.create({
			feedbackId: req.params.id,
			userId: req.user._id,
			type,
		});

		await Feedback.findByIdAndUpdate(req.params.id, {
			$inc: { [type === "up" ? "upvotes" : "downvotes"]: 1 },
		});

		res.status(201).json({
			success: true,
			message: "Vote added",
		});
	},
);
