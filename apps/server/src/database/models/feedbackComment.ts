import mongoose, { Document, Schema } from 'mongoose'

export interface IFeedbackComment extends Document {
	feedbackId: mongoose.Types.ObjectId
	userId: mongoose.Types.ObjectId
	content: string
	createdAt: Date
	updatedAt: Date
}

const feedbackCommentSchema = new Schema<IFeedbackComment>(
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
		content: {
			type: String,
			required: [true, 'Comment content is required'],
			maxlength: [2000, 'Comment cannot exceed 2000 characters'],
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
feedbackCommentSchema.index({ feedbackId: 1, createdAt: -1 })
feedbackCommentSchema.index({ userId: 1 })

export default mongoose.model<IFeedbackComment>('FeedbackComment', feedbackCommentSchema)
