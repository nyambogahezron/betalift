import { Router } from 'express'
import {
	getProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
	getProjectMembers,
	getProjectJoinRequests,
	createJoinRequest,
	updateJoinRequest,
	getProjectReleases,
	createRelease,
	getReleaseById,
	updateRelease,
	deleteRelease,
} from '../../controllers/project'
import { getFeedback, createFeedback } from '../../controllers/feedback'
import {
	authenticate,
	optionalAuthenticate,
} from '../../middleware/authentication'
import { validateParams, validateQuery, validateBody } from '../../validators/middleware'
import { z } from 'zod'
import {
	mongoIdSchema,
	getProjectsQuerySchema,
	getFeedbackQuerySchema,
	createProjectSchema,
	updateProjectSchema,
	createJoinRequestSchema,
	updateJoinRequestSchema,
	createReleaseSchema,
	updateReleaseSchema,
	createFeedbackSchema,
} from '../../validators/schemas'

const router = Router()

const idParamSchema = z.object({ id: mongoIdSchema })
const projectIdParamSchema = z.object({ projectId: mongoIdSchema })
const releaseIdParamSchema = z.object({ id: mongoIdSchema, releaseId: mongoIdSchema })
const requestIdParamSchema = z.object({ id: mongoIdSchema, requestId: mongoIdSchema })

// Project routes
router.get('/', validateQuery(getProjectsQuerySchema), getProjects)
router.post('/', authenticate, validateBody(createProjectSchema), createProject)
router.get('/:id', optionalAuthenticate, validateParams(idParamSchema), getProjectById)
router.patch('/:id', authenticate, validateParams(idParamSchema), validateBody(updateProjectSchema), updateProject)
router.delete('/:id', authenticate, validateParams(idParamSchema), deleteProject)

// Project members routes
router.get('/:id/members', validateParams(idParamSchema), getProjectMembers)

// Project join requests routes
router.get(
	'/:id/requests',
	authenticate,
	validateParams(idParamSchema),
	getProjectJoinRequests
)
router.post('/:id/requests', authenticate, validateParams(idParamSchema), validateBody(createJoinRequestSchema), createJoinRequest)
router.patch('/:id/requests/:requestId', authenticate, validateParams(requestIdParamSchema), validateBody(updateJoinRequestSchema), updateJoinRequest)

// Project releases routes
router.get(
	'/:id/releases',
	optionalAuthenticate,
	validateParams(idParamSchema),
	getProjectReleases
)
router.post('/:id/releases', authenticate, validateParams(idParamSchema), validateBody(createReleaseSchema), createRelease)
router.get('/:id/releases/:releaseId', optionalAuthenticate, validateParams(releaseIdParamSchema), getReleaseById)
router.patch('/:id/releases/:releaseId', authenticate, validateParams(releaseIdParamSchema), validateBody(updateReleaseSchema), updateRelease)
router.delete('/:id/releases/:releaseId', authenticate, validateParams(releaseIdParamSchema), deleteRelease)

// Project feedback routes
router.get('/:projectId/feedback', validateParams(projectIdParamSchema), validateQuery(getFeedbackQuerySchema), getFeedback)
router.post('/:projectId/feedback', authenticate, validateParams(projectIdParamSchema), validateBody(createFeedbackSchema), createFeedback)

export default router
