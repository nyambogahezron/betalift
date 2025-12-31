import mongoose, { Document, Schema } from 'mongoose'

export interface IFeedbackVote extends Document {
	feedbackId: mongoose.Types.ObjectId
	userId: mongoose.Types.ObjectId
	type: 'up' | 'down'
	createdAt: Date
}

const feedbackVoteSchema = new Schema<IFeedbackVote>(
	{
		feedbackId: {
			type: Schema.Types.ObjectId,
			ref: 'Feedback',
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum: ['up', 'down'],
			required: true,
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

// Ensure a user can only vote once per feedback
feedbackVoteSchema.index({ feedbackId: 1, userId: 1 }, { unique: true })
feedbackVoteSchema.index({ feedbackId: 1 })
feedbackVoteSchema.index({ userId: 1 })

export default mongoose.model<IFeedbackVote>('FeedbackVote', feedbackVoteSchema)
