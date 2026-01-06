import mongoose, { Document, Schema } from 'mongoose'

export interface IJoinRequest extends Document {
	projectId: mongoose.Types.ObjectId
	userId: mongoose.Types.ObjectId
	message?: string
	status: 'pending' | 'approved' | 'rejected' | 'accepted'
	reviewedBy?: mongoose.Types.ObjectId
	reviewedAt?: Date
	respondedAt?: Date
	rejectionReason?: string
	createdAt: Date
	updatedAt: Date
}

const joinRequestSchema = new Schema<IJoinRequest>(
	{
		projectId: {
			type: Schema.Types.ObjectId,
			ref: 'Project',
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		message: {
			type: String,
			maxlength: [500, 'Message cannot exceed 500 characters'],
		},
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected', 'accepted'],
			default: 'pending',
		},
		reviewedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		reviewedAt: {
			type: Date,
		},
		respondedAt: {
			type: Date,
		},
		rejectionReason: {
			type: String,
			maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
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


joinRequestSchema.index({ projectId: 1, status: 1, createdAt: -1 })
joinRequestSchema.index({ userId: 1, status: 1, createdAt: -1 })
joinRequestSchema.index({ projectId: 1, userId: 1 })

export default mongoose.model<IJoinRequest>('JoinRequest', joinRequestSchema)
