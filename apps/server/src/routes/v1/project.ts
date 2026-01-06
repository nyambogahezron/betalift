import { Router } from "express";
import { z } from "zod";
import {
	createFeedback,
	getFeedback,
} from "../../controllers/feedbackController";
import {
	createJoinRequest,
	createProject,
	createRelease,
	deleteProject,
	deleteRelease,
	getProjectById,
	getProjectJoinRequests,
	getProjectMembers,
	getProjectReleases,
	getProjects,
	getReleaseById,
	updateJoinRequest,
	updateProject,
	updateRelease,
} from "../../controllers/projectController";
import {
	authenticate,
	optionalAuthenticate,
} from "../../middleware/authentication";
import { readLimiter, writeLimiter } from "../../middleware/rateLimiter";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "../../validators/middleware";
import {
	createFeedbackSchema,
	createJoinRequestSchema,
	createProjectSchema,
	createReleaseSchema,
	getFeedbackQuerySchema,
	getProjectsQuerySchema,
	mongoIdSchema,
	updateJoinRequestSchema,
	updateProjectSchema,
	updateReleaseSchema,
} from "../../validators/schemas";

const router = Router();

const idParamSchema = z.object({ id: mongoIdSchema });
const projectIdParamSchema = z.object({ projectId: mongoIdSchema });
const releaseIdParamSchema = z.object({
	id: mongoIdSchema,
	releaseId: mongoIdSchema,
});
const requestIdParamSchema = z.object({
	id: mongoIdSchema,
	requestId: mongoIdSchema,
});

// Project routes
router
	.route("/")
	.get(readLimiter, validateQuery(getProjectsQuerySchema), getProjects)
	.post(
		writeLimiter,
		authenticate,
		validateBody(createProjectSchema),
		createProject,
	);

router
	.route("/:id")
	.get(
		readLimiter,
		optionalAuthenticate,
		validateParams(idParamSchema),
		getProjectById,
	)
	.patch(
		writeLimiter,
		authenticate,
		validateParams(idParamSchema),
		validateBody(updateProjectSchema),
		updateProject,
	)
	.delete(
		writeLimiter,
		authenticate,
		validateParams(idParamSchema),
		deleteProject,
	);

// Project members routes
router.get(
	"/:id/members",
	readLimiter,
	validateParams(idParamSchema),
	getProjectMembers,
);

// Project join requests routes
router.get(
	"/:id/requests",
	readLimiter,
	authenticate,
	validateParams(idParamSchema),
	getProjectJoinRequests,
);
router.post(
	"/:id/requests",
	writeLimiter,
	authenticate,
	validateParams(idParamSchema),
	validateBody(createJoinRequestSchema),
	createJoinRequest,
);
router.patch(
	"/:id/requests/:requestId",
	writeLimiter,
	authenticate,
	validateParams(requestIdParamSchema),
	validateBody(updateJoinRequestSchema),
	updateJoinRequest,
);

// Project releases routes
router.get(
	"/:id/releases",
	readLimiter,
	optionalAuthenticate,
	validateParams(idParamSchema),
	getProjectReleases,
);
router.post(
	"/:id/releases",
	writeLimiter,
	authenticate,
	validateParams(idParamSchema),
	validateBody(createReleaseSchema),
	createRelease,
);

router
	.route("/:id/releases/:releaseId")
	.get(
		readLimiter,
		optionalAuthenticate,
		validateParams(releaseIdParamSchema),
		getReleaseById,
	)
	.patch(
		writeLimiter,
		authenticate,
		validateParams(releaseIdParamSchema),
		validateBody(updateReleaseSchema),
		updateRelease,
	)
	.delete(
		writeLimiter,
		authenticate,
		validateParams(releaseIdParamSchema),
		deleteRelease,
	);

// Project feedback routes
router
	.route("/:projectId/feedback")
	.get(
		readLimiter,
		validateParams(projectIdParamSchema),
		validateQuery(getFeedbackQuerySchema),
		getFeedback,
	)
	.post(
		writeLimiter,
		authenticate,
		validateParams(projectIdParamSchema),
		validateBody(createFeedbackSchema),
		createFeedback,
	);

export default router;
