import mongoose, { type Document, Schema } from "mongoose";

export interface IFeedbackComment extends Document {
	feedbackId: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

const feedbackCommentSchema = new Schema<IFeedbackComment>(
	{
		feedbackId: {
			type: Schema.Types.ObjectId,
			ref: "Feedback",
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: [true, "Comment content is required"],
			maxlength: [2000, "Comment cannot exceed 2000 characters"],
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
				ret._id = undefined;
				ret.__v = undefined;
				return ret;
			},
		},
	},
);

feedbackCommentSchema.index({ feedbackId: 1, createdAt: -1 });
feedbackCommentSchema.index({ userId: 1 });

export const FeedbackComment = mongoose.model<IFeedbackComment>(
	"FeedbackComment",
	feedbackCommentSchema,
);
