import Project from '../models/project.js'
import ProjectMembership from '../models/projectMembership.js'
import Release from '../models/release.js'
import type { IUser } from '../models/user.js'

export const seedProjects = async (users: IUser[]) => {
	const projects = [
		{
			name: 'FitTrack Pro',
			description: 'A comprehensive fitness tracking app with workout plans, nutrition tracking, and progress analytics',
			ownerId: users[0]?._id,
			category: 'Health & Fitness',
			platform: ['iOS', 'Android'],
			status: 'active',
			visibility: 'public',
			techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Redis'],
			links: {
				repository: 'https://github.com/sarahj/fittrack-pro',
				testflight: 'https://testflight.apple.com/join/fittrack',
			},
			tags: ['fitness', 'health', 'mobile'],
		},
		{
			name: 'TaskMaster',
			description: 'Smart task management with AI-powered prioritization and team collaboration features',
			ownerId: users[2]?._id,
			category: 'Productivity',
			platform: ['Web', 'iOS', 'Android'],
			status: 'active',
			visibility: 'public',
			techStack: ['Vue.js', 'Express', 'MongoDB', 'TensorFlow'],
			links: {
				repository: 'https://github.com/emilyd/taskmaster',
				website: 'https://taskmaster.app',
			},
			tags: ['productivity', 'ai', 'collaboration'],
		},
		{
			name: 'PhotoShare',
			description: 'Privacy-focused photo sharing platform with end-to-end encryption',
			ownerId: users[4]?._id,
			category: 'Social',
			platform: ['Web', 'iOS', 'Android'],
			status: 'active',
			visibility: 'public',
			techStack: ['React', 'Firebase', 'Flutter', 'WebRTC'],
			links: {
				repository: 'https://github.com/jessicam/photoshare',
				playstore: 'https://play.google.com/store/apps/photoshare',
			},
			tags: ['social', 'photos', 'privacy', 'encryption'],
		},
	]

	const createdProjects = []
	for (const projectData of projects) {
		const project = await Project.create(projectData)
		
		// Add owner as admin member
		await ProjectMembership.create({
			projectId: project._id,
			userId: projectData.ownerId,
			role: 'admin',
			status: 'active',
			permissions: ['view', 'edit', 'delete', 'manage_members', 'manage_releases'],
		})
		
		// Add some additional members (testers)
		const additionalMembers = users.filter(u => u._id.toString() !== projectData.ownerId?.toString()).slice(0, 2)
		for (const member of additionalMembers) {
			await ProjectMembership.create({
				projectId: project._id,
				userId: member._id,
				role: 'tester',
				status: 'active',
				permissions: ['view'],
			})
		}
		
		// Create some releases
		const releases = [
			{
				projectId: project._id,
				version: '1.0.0',
				title: 'Initial Release',
				description: 'First public beta release with core features',
				type: 'beta',
				status: 'published',
				platforms: projectData.platform,
				changes: [
					'Core functionality implemented',
					'User authentication',
					'Basic UI/UX',
				],
				knownIssues: ['Performance optimization needed', 'Minor UI glitches'],
			},
			{
				projectId: project._id,
				version: '1.1.0',
				title: 'Feature Update',
				description: 'Added new features based on user feedback',
				type: 'beta',
				status: 'published',
				platforms: projectData.platform,
				changes: [
					'Performance improvements',
					'New dashboard',
					'Bug fixes',
				],
				knownIssues: [],
			},
		]
		
		for (const releaseData of releases) {
			await Release.create(releaseData)
		}
		
		createdProjects.push(project)
	}

	return createdProjects
}
