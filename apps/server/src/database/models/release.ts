import mongoose, { type Document, Schema } from "mongoose";

export interface IRelease extends Document {
	projectId: mongoose.Types.ObjectId;
	version: string;
	title: string;
	description?: string;
	changelog?: string;
	releaseNotes?: string;
	type?: "major" | "minor" | "patch" | "beta" | "alpha";
	status?: "draft" | "beta" | "published" | "archived";
	fileSize?: number;
	buildNumber?: string;
	minOsVersion?: string;
	downloadUrl?: string;
	testFlightUrl?: string;
	playStoreUrl?: string;
	appStoreUrl?: string;
	publishedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const releaseSchema = new Schema<IRelease>(
	{
		projectId: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: true,
		},
		version: {
			type: String,
			required: [true, "Version is required"],
			trim: true,
		},
		title: {
			type: String,
			required: [true, "Release title is required"],
			trim: true,
			maxlength: [200, "Title cannot exceed 200 characters"],
		},
		description: {
			type: String,
			maxlength: [2000, "Description cannot exceed 2000 characters"],
		},
		changelog: {
			type: String,
			maxlength: [5000, "Changelog cannot exceed 5000 characters"],
		},
		releaseNotes: {
			type: String,
			maxlength: [5000, "Release notes cannot exceed 5000 characters"],
		},
		type: {
			type: String,
			enum: ["major", "minor", "patch", "beta", "alpha"],
			default: "minor",
		},
		status: {
			type: String,
			enum: ["draft", "beta", "published", "archived"],
			default: "draft",
		},
		fileSize: {
			type: Number,
		},
		buildNumber: {
			type: String,
		},
		minOsVersion: {
			type: String,
		},
		downloadUrl: {
			type: String,
		},
		testFlightUrl: {
			type: String,
		},
		playStoreUrl: {
			type: String,
		},
		appStoreUrl: {
			type: String,
		},
		publishedAt: {
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

releaseSchema.index({ projectId: 1, createdAt: -1 });
releaseSchema.index({ projectId: 1, status: 1 });
releaseSchema.index({ projectId: 1, version: 1 }, { unique: true });

export default mongoose.model<IRelease>("Release", releaseSchema);
