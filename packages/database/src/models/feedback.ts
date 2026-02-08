import mongoose, { type Document, Schema } from "mongoose";

export interface IDeviceInfo {
	platform?: "ios" | "android" | "web";
	model?: string;
	os?: string;
	osVersion?: string;
	deviceModel?: string;
	appVersion?: string;
	screenSize?: string;
}

export interface IFeedback extends Document {
	projectId: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	type: "bug" | "feature" | "improvement" | "praise" | "question" | "other";
	priority?: "low" | "medium" | "high" | "critical";
	title: string;
	description: string;
	screenshots?: string[];
	stepsToReproduce?: string;
	deviceInfo?: IDeviceInfo;
	status:
		| "pending"
		| "open"
		| "in-progress"
		| "resolved"
		| "closed"
		| "wont-fix";
	upvotes: number;
	downvotes: number;
	commentCount: number;
	resolvedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const deviceInfoSchema = new Schema<IDeviceInfo>(
	{
		platform: { type: String, enum: ["ios", "android", "web"] },
		model: String,
		os: String,
		osVersion: String,
		deviceModel: String,
		appVersion: String,
		screenSize: String,
	},
	{ _id: false },
);

const feedbackSchema = new Schema<IFeedback>(
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
		type: {
			type: String,
			enum: ["bug", "feature", "improvement", "praise", "question", "other"],
			required: true,
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high", "critical"],
			default: "medium",
		},
		title: {
			type: String,
			required: [true, "Feedback title is required"],
			trim: true,
			maxlength: [200, "Title cannot exceed 200 characters"],
		},
		description: {
			type: String,
			required: [true, "Feedback description is required"],
			maxlength: [5000, "Description cannot exceed 5000 characters"],
		},
		screenshots: [
			{
				type: String,
			},
		],
		stepsToReproduce: {
			type: String,
			maxlength: [2000, "Steps cannot exceed 2000 characters"],
		},
		deviceInfo: {
			type: deviceInfoSchema,
		},
		status: {
			type: String,
			enum: [
				"pending",
				"open",
				"in-progress",
				"resolved",
				"closed",
				"wont-fix",
			],
			default: "pending",
		},
		upvotes: {
			type: Number,
			default: 0,
		},
		downvotes: {
			type: Number,
			default: 0,
		},
		commentCount: {
			type: Number,
			default: 0,
		},
		resolvedAt: {
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
				ret._id = undefined;
				ret.__v = undefined;
				return ret;
			},
		},
	},
);

feedbackSchema.index({ projectId: 1, createdAt: -1 });
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ type: 1 });
feedbackSchema.index({ priority: 1 });
feedbackSchema.index({ title: "text", description: "text" });

export const Feedback = mongoose.model<IFeedback>("Feedback", feedbackSchema);
