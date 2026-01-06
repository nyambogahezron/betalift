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
	.get(validateQuery(getProjectsQuerySchema), getProjects)
	.post(authenticate, validateBody(createProjectSchema), createProject);

router
	.route("/:id")
	.get(optionalAuthenticate, validateParams(idParamSchema), getProjectById)
	.patch(
		authenticate,
		validateParams(idParamSchema),
		validateBody(updateProjectSchema),
		updateProject,
	)
	.delete(authenticate, validateParams(idParamSchema), deleteProject);

// Project members routes
router.get("/:id/members", validateParams(idParamSchema), getProjectMembers);

// Project join requests routes
router.get(
	"/:id/requests",
	authenticate,
	validateParams(idParamSchema),
	getProjectJoinRequests,
);
router.post(
	"/:id/requests",
	authenticate,
	validateParams(idParamSchema),
	validateBody(createJoinRequestSchema),
	createJoinRequest,
);
router.patch(
	"/:id/requests/:requestId",
	authenticate,
	validateParams(requestIdParamSchema),
	validateBody(updateJoinRequestSchema),
	updateJoinRequest,
);

// Project releases routes
router.get(
	"/:id/releases",
	optionalAuthenticate,
	validateParams(idParamSchema),
	getProjectReleases,
);
router.post(
	"/:id/releases",
	authenticate,
	validateParams(idParamSchema),
	validateBody(createReleaseSchema),
	createRelease,
);

router
	.route("/:id/releases/:releaseId")
	.get(
		optionalAuthenticate,
		validateParams(releaseIdParamSchema),
		getReleaseById,
	)
	.patch(
		authenticate,
		validateParams(releaseIdParamSchema),
		validateBody(updateReleaseSchema),
		updateRelease,
	)
	.delete(authenticate, validateParams(releaseIdParamSchema), deleteRelease);

// Project feedback routes
router
	.route("/:projectId/feedback")
	.get(
		validateParams(projectIdParamSchema),
		validateQuery(getFeedbackQuerySchema),
		getFeedback,
	)
	.post(
		authenticate,
		validateParams(projectIdParamSchema),
		validateBody(createFeedbackSchema),
		createFeedback,
	);

export default router;
