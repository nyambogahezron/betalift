import mongoose, { type Document, Schema } from "mongoose";

export interface IJoinRequest extends Document {
	projectId: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	message?: string;
	status: "pending" | "approved" | "rejected" | "accepted";
	reviewedBy?: mongoose.Types.ObjectId;
	reviewedAt?: Date;
	respondedAt?: Date;
	rejectionReason?: string;
	createdAt: Date;
	updatedAt: Date;
}

const joinRequestSchema = new Schema<IJoinRequest>(
	{
		projectId: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			maxlength: [500, "Message cannot exceed 500 characters"],
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected", "accepted"],
			default: "pending",
		},
		reviewedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		reviewedAt: {
			type: Date,
		},
		respondedAt: {
			type: Date,
		},
		rejectionReason: {
			type: String,
			maxlength: [500, "Rejection reason cannot exceed 500 characters"],
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

joinRequestSchema.index({ projectId: 1, status: 1, createdAt: -1 });
joinRequestSchema.index({ userId: 1, status: 1, createdAt: -1 });
joinRequestSchema.index({ projectId: 1, userId: 1 });

export const JoinRequest = mongoose.model<IJoinRequest>(
	"JoinRequest",
	joinRequestSchema,
);
