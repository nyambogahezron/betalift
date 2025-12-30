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
} from '../../../controllers/project'
import { getFeedback, createFeedback } from '../../../controllers/feedback'
import {
	authenticate,
	optionalAuthenticate,
} from '../../../middleware/authentication'
import {
	idValidation,
	paginationValidation,
} from '../../../middleware/validation'

const router = Router()

// Project routes
router.get('/', paginationValidation(), getProjects)
router.post('/', authenticate, createProject)
router.get('/:id', optionalAuthenticate, idValidation(), getProjectById)
router.patch('/:id', authenticate, idValidation(), updateProject)
router.delete('/:id', authenticate, idValidation(), deleteProject)

// Project members routes
router.get('/:id/members', idValidation(), getProjectMembers)

// Project join requests routes
router.get(
	'/:id/requests',
	authenticate,
	idValidation(),
	getProjectJoinRequests
)
router.post('/:id/requests', authenticate, idValidation(), createJoinRequest)
router.patch('/:id/requests/:requestId', authenticate, updateJoinRequest)

// Project releases routes
router.get(
	'/:id/releases',
	optionalAuthenticate,
	idValidation(),
	getProjectReleases
)
router.post('/:id/releases', authenticate, idValidation(), createRelease)
router.get('/:id/releases/:releaseId', optionalAuthenticate, getReleaseById)
router.patch('/:id/releases/:releaseId', authenticate, updateRelease)
router.delete('/:id/releases/:releaseId', authenticate, deleteRelease)

// Project feedback routes
router.get('/:projectId/feedback', paginationValidation(), getFeedback)
router.post('/:projectId/feedback', authenticate, createFeedback)

export default router
