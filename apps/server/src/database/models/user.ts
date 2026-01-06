import bcrypt from "bcryptjs";
import mongoose, { type Document, Schema } from "mongoose";
import validator from "validator";

export interface IUserStats {
	projectsCreated: number;
	projectsTested: number;
	feedbackGiven: number;
	feedbackReceived: number;
}

export interface INotificationSettings {
	pushEnabled: boolean;
	emailEnabled: boolean;
	feedbackUpdates: boolean;
	projectInvites: boolean;
	weeklyDigest: boolean;
}

export interface IPrivacySettings {
	profilePublic: boolean;
	showEmail: boolean;
	showStats: boolean;
}

export interface IAppearanceSettings {
	theme: "dark" | "light" | "system";
	language: string;
}

export interface IUserSettings {
	notifications: INotificationSettings;
	privacy: IPrivacySettings;
	appearance: IAppearanceSettings;
}

export interface IUser extends Document {
	email: string;
	password: string;
	username: string;
	displayName?: string;
	avatar?: string;
	bio?: string;
	role: "creator" | "tester" | "both";
	stats: IUserStats;
	settings?: IUserSettings;
	isEmailVerified: boolean;
	emailVerificationToken?: string;
	emailVerificationExpires?: Date;
	resetPasswordToken?: string;
	resetPasswordExpires?: Date;
	refreshToken?: string;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
	generateAuthToken(): string;
	generateRefreshToken(): string;
}

const userStatsSchema = new Schema<IUserStats>(
	{
		projectsCreated: { type: Number, default: 0 },
		projectsTested: { type: Number, default: 0 },
		feedbackGiven: { type: Number, default: 0 },
		feedbackReceived: { type: Number, default: 0 },
	},
	{ _id: false },
);

const notificationSettingsSchema = new Schema<INotificationSettings>(
	{
		pushEnabled: { type: Boolean, default: true },
		emailEnabled: { type: Boolean, default: true },
		feedbackUpdates: { type: Boolean, default: true },
		projectInvites: { type: Boolean, default: true },
		weeklyDigest: { type: Boolean, default: false },
	},
	{ _id: false },
);

const privacySettingsSchema = new Schema<IPrivacySettings>(
	{
		profilePublic: { type: Boolean, default: true },
		showEmail: { type: Boolean, default: false },
		showStats: { type: Boolean, default: true },
	},
	{ _id: false },
);

const appearanceSettingsSchema = new Schema<IAppearanceSettings>(
	{
		theme: {
			type: String,
			enum: ["dark", "light", "system"],
			default: "system",
		},
		language: { type: String, default: "en" },
	},
	{ _id: false },
);

const userSettingsSchema = new Schema<IUserSettings>(
	{
		notifications: { type: notificationSettingsSchema, default: () => ({}) },
		privacy: { type: privacySettingsSchema, default: () => ({}) },
		appearance: { type: appearanceSettingsSchema, default: () => ({}) },
	},
	{ _id: false },
);

const userSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
			validate: {
				validator: (value: string) => validator.isEmail(value),
				message: "Please enter a valid email",
			},
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters"],
			select: false,
		},
		username: {
			type: String,
			required: [true, "Username is required"],
			unique: true,
			trim: true,
			minlength: [3, "Username must be at least 3 characters"],
			maxlength: [30, "Username cannot exceed 30 characters"],
			validate: {
				validator: (value: string) => validator.isAlphanumeric(value),
				message: "Username can only contain letters and numbers",
			},
		},
		displayName: {
			type: String,
			trim: true,
			maxlength: [50, "Display name cannot exceed 50 characters"],
		},
		avatar: {
			type: String,
		},
		bio: {
			type: String,
			maxlength: [500, "Bio cannot exceed 500 characters"],
		},
		role: {
			type: String,
			enum: ["creator", "tester", "both"],
			default: "both",
		},
		stats: {
			type: userStatsSchema,
			default: () => ({}),
		},
		settings: {
			type: userSettingsSchema,
			default: () => ({}),
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		emailVerificationToken: {
			type: String,
			select: false,
		},
		emailVerificationExpires: {
			type: Date,
			select: false,
		},
		resetPasswordToken: {
			type: String,
			select: false,
		},
		resetPasswordExpires: {
			type: Date,
			select: false,
		},
		refreshToken: {
			type: String,
			select: false,
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
				delete ret.password;
				delete ret.refreshToken;
				delete ret.emailVerificationToken;
				delete ret.emailVerificationExpires;
				delete ret.resetPasswordToken;
				delete ret.resetPasswordExpires;
				return ret;
			},
		},
	},
);

// Hash password before saving
userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
	candidatePassword: string,
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

export default mongoose.model<IUser>("User", userSchema);
