import mongoose, { type Document, Schema } from "mongoose";

export interface IProjectMembership extends Document {
	projectId: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	role: "creator" | "tester";
	status: "pending" | "approved" | "rejected";
	joinedAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

const projectMembershipSchema = new Schema<IProjectMembership>(
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
		role: {
			type: String,
			enum: ["creator", "tester"],
			default: "tester",
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},
		joinedAt: {
			type: Date,
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

// Ensure a user can only have one membership per project
projectMembershipSchema.index({ projectId: 1, userId: 1 }, { unique: true });
projectMembershipSchema.index({ projectId: 1, status: 1 });
projectMembershipSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IProjectMembership>(
	"ProjectMembership",
	projectMembershipSchema,
);
