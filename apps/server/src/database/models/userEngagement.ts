import mongoose, { Document, Schema } from 'mongoose'

export interface IProjectView {
	projectId: mongoose.Types.ObjectId
	viewedAt: Date
	duration?: number
}

export interface IUserAvailability {
	status: 'available' | 'busy' | 'away' | 'offline'
	hoursPerWeek?: number
	timezone?: string
	preferredContactMethod?: 'in-app' | 'email' | 'discord'
}

export interface IUserEngagement extends Document {
	userId: mongoose.Types.ObjectId
	projectsViewed: IProjectView[]
	availability: IUserAvailability
	interests: string[]
	skills: string[]
	preferredPlatforms: ('ios' | 'android' | 'web' | 'desktop')[]
	testingExperience: 'beginner' | 'intermediate' | 'expert'
	lastActiveAt: Date
	createdAt: Date
	updatedAt: Date
}

const projectViewSchema = new Schema<IProjectView>({
	projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
	viewedAt: { type: Date, required: true },
	duration: Number,
}, { _id: false })

const userAvailabilitySchema = new Schema<IUserAvailability>({
	status: {
		type: String,
		enum: ['available', 'busy', 'away', 'offline'],
		default: 'available',
	},
	hoursPerWeek: Number,
	timezone: String,
	preferredContactMethod: {
		type: String,
		enum: ['in-app', 'email', 'discord'],
	},
}, { _id: false })

const userEngagementSchema = new Schema<IUserEngagement>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},
		projectsViewed: [{
			type: projectViewSchema,
		}],
		availability: {
			type: userAvailabilitySchema,
			default: () => ({}),
		},
		interests: [{
			type: String,
		}],
		skills: [{
			type: String,
		}],
		preferredPlatforms: [{
			type: String,
			enum: ['ios', 'android', 'web', 'desktop'],
		}],
		testingExperience: {
			type: String,
			enum: ['beginner', 'intermediate', 'expert'],
			default: 'beginner',
		},
		lastActiveAt: {
			type: Date,
			default: Date.now,
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

userEngagementSchema.index({ lastActiveAt: -1 })
userEngagementSchema.index({ interests: 1 })
userEngagementSchema.index({ skills: 1 })

export default mongoose.model<IUserEngagement>('UserEngagement', userEngagementSchema)
