import mongoose, { Document, Schema } from 'mongoose'

export interface IMessageAttachment {
	type: 'image' | 'file'
	url: string
	name?: string
	size?: number
}

export interface IMessage extends Document {
	conversationId: mongoose.Types.ObjectId
	senderId: mongoose.Types.ObjectId
	content: string
	type: 'text' | 'image' | 'file'
	attachments?: IMessageAttachment[]
	readBy: mongoose.Types.ObjectId[]
	createdAt: Date
	updatedAt: Date
}

const messageAttachmentSchema = new Schema<IMessageAttachment>({
	type: { type: String, enum: ['image', 'file'], required: true },
	url: { type: String, required: true },
	name: String,
	size: Number,
}, { _id: false })

const messageSchema = new Schema<IMessage>(
	{
		conversationId: {
			type: Schema.Types.ObjectId,
			ref: 'Conversation',
			required: true,
		},
		senderId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: {
			type: String,
			required: [true, 'Message content is required'],
			maxlength: [5000, 'Message cannot exceed 5000 characters'],
		},
		type: {
			type: String,
			enum: ['text', 'image', 'file'],
			default: 'text',
		},
		attachments: [{
			type: messageAttachmentSchema,
		}],
		readBy: [{
			type: Schema.Types.ObjectId,
			ref: 'User',
		}],
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
messageSchema.index({ conversationId: 1, createdAt: -1 })
messageSchema.index({ senderId: 1 })

export default mongoose.model<IMessage>('Message', messageSchema)
