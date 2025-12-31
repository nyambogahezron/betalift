import mongoose, { Document, Schema } from 'mongoose'

export interface IProjectLinks {
	website?: string
	testFlight?: string
	playStore?: string
	appStore?: string
	github?: string
	discord?: string
	documentation?: string
}

export interface IProject extends Document {
	name: string
	description: string
	shortDescription?: string
	ownerId: mongoose.Types.ObjectId
	status: 'active' | 'beta' | 'closed' | 'paused'
	category?: 'mobile-app' | 'web-app' | 'desktop-app' | 'game' | 'api' | 'other'
	links?: IProjectLinks
	screenshots?: string[]
	icon?: string
	techStack: string[]
	testerCount: number
	feedbackCount: number
	rating?: number
	maxTesters?: number
	isPublic: boolean
	createdAt: Date
	updatedAt: Date
}

const projectLinksSchema = new Schema<IProjectLinks>(
	{
		website: String,
		testFlight: String,
		playStore: String,
		appStore: String,
		github: String,
		discord: String,
		documentation: String,
	},
	{ _id: false }
)

const projectSchema = new Schema<IProject>(
	{
		name: {
			type: String,
			required: [true, 'Project name is required'],
			trim: true,
			maxlength: [100, 'Project name cannot exceed 100 characters'],
		},
		description: {
			type: String,
			required: [true, 'Project description is required'],
			maxlength: [5000, 'Description cannot exceed 5000 characters'],
		},
		shortDescription: {
			type: String,
			maxlength: [200, 'Short description cannot exceed 200 characters'],
		},
		ownerId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		status: {
			type: String,
			enum: ['active', 'beta', 'closed', 'paused'],
			default: 'active',
		},
		category: {
			type: String,
			enum: ['mobile-app', 'web-app', 'desktop-app', 'game', 'api', 'other'],
		},
		links: {
			type: projectLinksSchema,
		},
		screenshots: [
			{
				type: String,
			},
		],
		icon: {
			type: String,
		},
		techStack: [
			{
				type: String,
			},
		],
		testerCount: {
			type: Number,
			default: 0,
		},
		feedbackCount: {
			type: Number,
			default: 0,
		},
		rating: {
			type: Number,
			min: 0,
			max: 5,
		},
		maxTesters: {
			type: Number,
			default: 100,
		},
		isPublic: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: (_: any, ret: any) => {
				ret.id = ret._id.toString()
				delete ret._id
				delete ret.__v
				return ret
			},
		},
	}
)

// Indexes
projectSchema.index({ ownerId: 1 })
projectSchema.index({ status: 1 })
projectSchema.index({ category: 1 })
projectSchema.index({ isPublic: 1 })
projectSchema.index({ createdAt: -1 })
projectSchema.index({ name: 'text', description: 'text' })

export default mongoose.model<IProject>('Project', projectSchema)
