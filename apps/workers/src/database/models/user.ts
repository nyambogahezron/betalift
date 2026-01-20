import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
	pushTokens: string[];
}

const userSchema = new Schema<IUser>(
	{
		pushTokens: { type: [String], default: [] },
	},
	{ strict: false }, // Allow other fields to exist without validation
);

export default mongoose.model<IUser>("User", userSchema);
