import mongoose, { type Document, Schema } from "mongoose";

export interface IIpLoginAttempt extends Document {
	ipAddress: string;
	failedAttempts: number;
	firstAttemptAt: Date;
	lastAttemptAt: Date;
	lockedUntil?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const ipLoginAttemptSchema = new Schema<IIpLoginAttempt>(
	{
		ipAddress: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		failedAttempts: {
			type: Number,
			default: 0,
			required: true,
		},
		firstAttemptAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
		lastAttemptAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
		lockedUntil: {
			type: Date,
		},
	},
	{
		timestamps: true,
	},
);

// Index for automatic cleanup of old entries
ipLoginAttemptSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 }); // Auto-delete after 24 hours
ipLoginAttemptSchema.index({ lockedUntil: 1 });

export default mongoose.model<IIpLoginAttempt>(
	"IpLoginAttempt",
	ipLoginAttemptSchema,
);
