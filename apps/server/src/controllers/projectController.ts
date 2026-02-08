import type { Response } from "express";
import mongoose from "mongoose";
import ENV from "../config/env";
import JoinRequest from "../database/models/joinRequest";
import Notification from "../database/models/notification";
import Project from "../database/models/project";
import ProjectMembership from "../database/models/projectMembership";
import Release from "../database/models/release";
import User from "../database/models/user";
import asyncHandler from "../middleware/asyncHandler";
import type {
	AuthRequest,
	AuthenticatedRequest,
} from "../middleware/authentication";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../utils/errors";

// @route   GET /api/v1/projects
// @access  Public
export const getProjects = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const page = Number.parseInt(req.query.page as string, 10) || 1;
		const limit = Math.min(
			Number.parseInt(req.query.limit as string, 10) || ENV.defaultPageSize,
			ENV.maxPageSize,
		);
		const skip = (page - 1) * limit;

		const search = req.query.search as string;
		const status = req.query.status as string;
		const category = req.query.category as string;
		const ownerId = req.query.ownerId as string;

		const query: {
			isPublic?: boolean;
			$text?: { $search: string };
			status?: string;
			category?: string;
			ownerId?: string;
		} = { isPublic: true };

		if (search) {
			query.$text = { $search: search };
		}

		if (status) {
			query.status = status;
		}

		if (category) {
			query.category = category;
		}

		if (ownerId) {
			query.ownerId = ownerId;
			delete query.isPublic; // Show all projects if filtering by owner
		}

		if (req.query.excludeOwnerId) {
			query.ownerId = { $ne: req.query.excludeOwnerId as string };
		}

		console.log("getProjects Query:", JSON.stringify(query, null, 2));
		console.log("Request Query Params:", req.query);

		const [projects, total] = await Promise.all([
			Project.find(query)
				.populate("ownerId", "username displayName avatar")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit),
			Project.countDocuments(query),
		]);

		res.json({
			success: true,
			data: {
				projects,
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

// @route   GET /api/v1/projects/:id
// @access  Public
export const getProjectById = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const project = await Project.findById(req.params.id).populate(
			"ownerId",
			"username displayName avatar bio stats",
		);

		if (!project) throw new NotFoundError("Project not found");

		res.json({
			success: true,
			data: project,
		});
	},
);

// @route   POST /api/v1/projects
// @access  Private
export const createProject = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const projectData = {
			...req.body,
			ownerId: req.user._id,
		};

		const project = await Project.create(projectData);

		// Create owner membership
		await ProjectMembership.create({
			projectId: project._id,
			userId: req.user._id,
			role: "creator",
			status: "approved",
			joinedAt: new Date(),
		});

		await User.findByIdAndUpdate(req.user._id, {
			$inc: { "stats.projectsCreated": 1 },
		});

		res.status(201).json({
			success: true,
			message: "Project created successfully",
			data: project,
		});
	},
);

// @route   PATCH /api/v1/projects/:id
// @access  Private
export const updateProject = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const project = await Project.findById(req.params.id);

		if (!project) {
			throw new NotFoundError("Project not found");
		}

		// Only owner can update project
		if (project.ownerId.toString() !== req.user._id) {
			throw new ForbiddenError("You are not the owner of this project");
		}

		const updatedProject = await Project.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true },
		);

		res.json({
			success: true,
			message: "Project updated successfully",
			data: updatedProject,
		});
	},
);

// @route   DELETE /api/v1/projects/:id
// @access  Private
export const deleteProject = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const project = await Project.findById(req.params.id);

		if (!project) {
			throw new NotFoundError("Project not found");
		}

		// Only owner can delete project
		if (project.ownerId.toString() !== req.user._id) {
			throw new ForbiddenError("You are not the owner of this project");
		}

		await Project.findByIdAndDelete(req.params.id);

		// Update user stats
		await User.findByIdAndUpdate(req.user._id, {
			$inc: { "stats.projectsCreated": -1 },
		});

		res.json({
			success: true,
			message: "Project deleted successfully",
		});
	},
);

// @route   GET /api/v1/projects/:id/members
// @access  Public
export const getProjectMembers = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const status = (req.query.status as string) || "approved";

		const memberships = await ProjectMembership.find({
			projectId: req.params.id,
			status,
		}).populate("userId", "username displayName avatar bio stats");

		res.json({
			success: true,
			data: memberships,
		});
	},
);

// @route   GET /api/v1/projects/:id/requests
// @access  Private
export const getProjectJoinRequests = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const project = await Project.findById(req.params.id);

		if (!project) {
			throw new NotFoundError("Project not found");
		}

		// Only owner can view join requests
		if (project.ownerId.toString() !== req.user._id) {
			throw new ForbiddenError("You are not the owner of this project");
		}

		const status = (req.query.status as string) || "pending";

		const joinRequests = await JoinRequest.find({
			projectId: req.params.id,
			status,
		})
			.populate("userId", "username displayName avatar bio stats")
			.sort({ createdAt: -1 });

		res.json({
			success: true,
			data: joinRequests,
		});
	},
);

// @route   POST /api/v1/projects/:id/requests
// @access  Private
export const createJoinRequest = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const project = await Project.findById(req.params.id);

		if (!project) {
			throw new NotFoundError("Project not found");
		}

		// Check if user is already a member
		const existingMembership = await ProjectMembership.findOne({
			projectId: req.params.id,
			userId: req.user._id,
		});

		if (existingMembership) {
			throw new BadRequestError("You are already a member of this project");
		}

		// Check if user already has a pending request
		const existingRequest = await JoinRequest.findOne({
			projectId: req.params.id,
			userId: req.user._id,
			status: "pending",
		});

		if (existingRequest) {
			throw new BadRequestError("You already have a pending join request");
		}

		const joinRequest = await JoinRequest.create({
			projectId: req.params.id,
			userId: req.user._id,
			message: req.body.message,
		});

		// Notify project owner
		const currentUser = await User.findById(req.user._id);
		await Notification.create({
			userId: project.ownerId,
			type: "project_invite",
			title: "New Join Request",
			message: `${currentUser?.username || "Someone"} requested to join ${
				project.name
			}`,
			data: {
				projectId: project._id,
				requestId: joinRequest._id,
			},
		});

		res.status(201).json({
			success: true,
			message: "Join request submitted successfully",
			data: joinRequest,
		});
	},
);

// @route   PATCH /api/v1/projects/:id/requests/:requestId
// @access  Private
export const updateJoinRequest = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { status, rejectionReason } = req.body;

		if (!["approved", "rejected"].includes(status)) {
			throw new BadRequestError("Invalid status");
		}

		const project = await Project.findById(req.params.id);

		if (!project) {
			throw new NotFoundError("Project not found");
		}

		// Only owner can update join requests
		if (project.ownerId.toString() !== req.user._id) {
			throw new ForbiddenError("You are not the owner of this project");
		}

		const joinRequest = await JoinRequest.findById(req.params.requestId);

		if (!joinRequest) {
			throw new NotFoundError("Join request not found");
		}

		if (joinRequest.status !== "pending") {
			throw new BadRequestError("Join request has already been processed");
		}

		joinRequest.status = status;
		joinRequest.reviewedBy = new mongoose.Types.ObjectId(req.user._id);
		joinRequest.reviewedAt = new Date();

		if (status === "rejected" && rejectionReason) {
			joinRequest.rejectionReason = rejectionReason;
		}

		await joinRequest.save();

		// If approved, create membership
		if (status === "approved") {
			await ProjectMembership.create({
				projectId: project._id,
				userId: joinRequest.userId,
				role: "tester",
				status: "approved",
				joinedAt: new Date(),
			});

			// Update project tester count
			await Project.findByIdAndUpdate(project._id, {
				$inc: { testerCount: 1 },
			});

			// Update user stats
			await User.findByIdAndUpdate(joinRequest.userId, {
				$inc: { "stats.projectsTested": 1 },
			});

			// Notify user
			await Notification.create({
				userId: joinRequest.userId,
				type: "project_joined",
				title: "Join Request Approved",
				message: `Your request to join ${project.name} has been approved`,
				data: { projectId: project._id },
			});
		} else {
			// Notify user of rejection
			await Notification.create({
				userId: joinRequest.userId,
				type: "project_invite",
				title: "Join Request Rejected",
				message: `Your request to join ${project.name} was not approved`,
				data: { projectId: project._id, reason: rejectionReason },
			});
		}

		res.json({
			success: true,
			message: `Join request ${status}`,
			data: joinRequest,
		});
	},
);

// @route   GET /api/v1/projects/:id/releases
// @access  Public
export const getProjectReleases = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const project = await Project.findById(req.params.id);

		if (!project) {
			throw new NotFoundError("Project not found");
		}

		const status = req.query.status as string;

		const query: {
			projectId?: string;
			status?: string;
		} = { projectId: req.params.id };

		// Only show published releases to non-owners
		if (!req.user || req.user._id !== project.ownerId.toString()) {
			query.status = "published";
		} else if (status) {
			query.status = status;
		}

		const releases = await Release.find(query).sort({ createdAt: -1 });

		res.json({
			success: true,
			data: releases,
		});
	},
);

// @route   POST /api/v1/projects/:id/releases
// @access  Private
export const createRelease = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const project = await Project.findById(req.params.id);

		if (!project) {
			throw new NotFoundError("Project not found");
		}

		// Only owner can create releases
		if (project.ownerId.toString() !== req.user._id) {
			throw new ForbiddenError("You are not the owner of this project");
		}

		const release = await Release.create({
			...req.body,
			projectId: req.params.id,
		});

		res.status(201).json({
			success: true,
			message: "Release created successfully",
			data: release,
		});
	},
);

// @route   GET /api/v1/projects/:id/releases/:releaseId
// @access  Public
export const getReleaseById = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const release = await Release.findById(req.params.releaseId).populate(
			"projectId",
			"name icon ownerId",
		);

		if (!release) {
			throw new NotFoundError("Release not found");
		}

		const project = release.projectId as unknown as {
			ownerId: mongoose.Types.ObjectId;
		};

		if (
			!req.user ||
			(req.user._id !== project.ownerId.toString() &&
				release.status !== "published")
		) {
			throw new ForbiddenError("You do not have access to this release");
		}

		res.json({
			success: true,
			data: release,
		});
	},
);

// @route   PATCH /api/v1/projects/:id/releases/:releaseId
// @access  Private
export const updateRelease = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const project = await Project.findById(req.params.id);

		if (!project) throw new NotFoundError("Project not found");

		// Only owner can update releases
		if (project.ownerId.toString() !== req.user._id) {
			throw new ForbiddenError("You are not the owner of this project");
		}

		const release = await Release.findByIdAndUpdate(
			req.params.releaseId,
			req.body,
			{ new: true, runValidators: true },
		);

		if (!release) throw new NotFoundError("Release not found");

		res.json({
			success: true,
			message: "Release updated successfully",
			data: release,
		});
	},
);

// @route   DELETE /api/v1/projects/:id/releases/:releaseId
// @access  Private
export const deleteRelease = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const project = await Project.findById(req.params.id);

		if (!project) throw new NotFoundError("Project not found");

		if (project.ownerId.toString() !== req.user._id) {
			throw new ForbiddenError("You are not the owner of this project");
		}

		const release = await Release.findByIdAndDelete(req.params.releaseId);

		if (!release) throw new NotFoundError("Release not found");

		res.json({
			success: true,
			message: "Release deleted successfully",
		});
	},
);
