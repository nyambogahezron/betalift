import mongoose, { Document, Schema } from 'mongoose'

export interface IConversation extends Document {
	participants: mongoose.Types.ObjectId[]
	lastMessageId?: mongoose.Types.ObjectId
	createdAt: Date
	updatedAt: Date
}

const conversationSchema = new Schema<IConversation>(
	{
		participants: [{
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		}],
		lastMessageId: {
			type: Schema.Types.ObjectId,
			ref: 'Message',
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


conversationSchema.index({ participants: 1 })
conversationSchema.index({ updatedAt: -1 })

export default mongoose.model<IConversation>('Conversation', conversationSchema)
