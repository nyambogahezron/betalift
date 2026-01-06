import mongoose, { type Document, Schema } from "mongoose";

export type NotificationType =
	| "project_invite"
	| "project_joined"
	| "feedback_received"
	| "feedback_comment"
	| "feedback_status_changed"
	| "project_update";

export interface INotification extends Document {
	userId: mongoose.Types.ObjectId;
	type: NotificationType;
	title: string;
	message: string;
	data?: Record<string, unknown>;
	isRead: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: [
				"project_invite",
				"project_joined",
				"feedback_received",
				"feedback_comment",
				"feedback_status_changed",
				"project_update",
			],
			required: true,
		},
		title: {
			type: String,
			required: [true, "Notification title is required"],
			maxlength: [200, "Title cannot exceed 200 characters"],
		},
		message: {
			type: String,
			required: [true, "Notification message is required"],
			maxlength: [500, "Message cannot exceed 500 characters"],
		},
		data: {
			type: Schema.Types.Mixed,
		},
		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: (
				_doc: Document,
				ret: Record<string, unknown> & { _id: unknown },
			) => {
				ret.id = (ret._id as { toString(): string }).toString();
				delete ret._id;
				delete ret.__v;
				return ret;
			},
		},
	},
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<INotification>(
	"Notification",
	notificationSchema,
);
