import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Card, Input } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import { useAuthStore } from "@/stores/useAuthStore";

type Role = "creator" | "tester" | "both";

export default function EditProfile() {
	const { user, updateProfile } = useAuthStore();

	const [displayName, setDisplayName] = useState(user?.displayName || "");
	const [username, setUsername] = useState(user?.username || "");
	const [bio, setBio] = useState(user?.bio || "");
	const [avatar, setAvatar] = useState(user?.avatar || "");
	const [role, setRole] = useState<Role>(user?.role || "both");
	const [isSaving, setIsSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const roles: {
		id: Role;
		label: string;
		description: string;
		icon: keyof typeof Ionicons.glyphMap;
	}[] = [
		{
			id: "creator",
			label: "Creator",
			description: "Post projects and receive feedback",
			icon: "rocket-outline",
		},
		{
			id: "tester",
			label: "Tester",
			description: "Test projects and give feedback",
			icon: "flask-outline",
		},
		{
			id: "both",
			label: "Both",
			description: "Create and test projects",
			icon: "git-merge-outline",
		},
	];

	const pickAvatar = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			Alert.alert(
				"Permission needed",
				"Please grant camera roll permissions to change your avatar.",
			);
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (!result.canceled) {
			setAvatar(result.assets[0].uri);
		}
	};

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!displayName.trim()) {
			newErrors.displayName = "Display name is required";
		} else if (displayName.length < 2) {
			newErrors.displayName = "Display name must be at least 2 characters";
		}

		if (!username.trim()) {
			newErrors.username = "Username is required";
		} else if (username.length < 3) {
			newErrors.username = "Username must be at least 3 characters";
		} else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			newErrors.username =
				"Username can only contain letters, numbers, and underscores";
		}

		if (bio.length > 160) {
			newErrors.bio = "Bio must be 160 characters or less";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = async () => {
		if (!validate()) return;

		setIsSaving(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 800));

			updateProfile({
				displayName: displayName.trim(),
				username: username.trim(),
				bio: bio.trim(),
				avatar: avatar || undefined,
				role,
			});

			Alert.alert(
				"Profile Updated",
				"Your profile has been updated successfully.",
				[{ text: "OK", onPress: () => router.back() }],
			);
		} catch {
			Alert.alert("Error", "Failed to update profile. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<KeyboardAvoidingView
				style={styles.keyboardView}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				{/* Header */}
				<Animated.View
					entering={FadeInDown.duration(600).springify()}
					style={styles.header}
				>
					<Pressable style={styles.backButton} onPress={() => router.back()}>
						<Ionicons name="close" size={24} color={Colors.text} />
					</Pressable>
					<Text style={styles.headerTitle}>Edit Profile</Text>
					<Pressable
						style={styles.saveButton}
						onPress={handleSave}
						disabled={isSaving}
					>
						<Text
							style={[
								styles.saveButtonText,
								isSaving && styles.saveButtonDisabled,
							]}
						>
							{isSaving ? "Saving..." : "Save"}
						</Text>
					</Pressable>
				</Animated.View>

				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					{/* Avatar Section */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(100).springify()}
						style={styles.avatarSection}
					>
						<Pressable onPress={pickAvatar} style={styles.avatarContainer}>
							<Avatar
								source={avatar}
								name={displayName || username}
								size="xl"
							/>
							<View style={styles.avatarEditBadge}>
								<Ionicons name="camera" size={16} color={Colors.text} />
							</View>
						</Pressable>
						<Text style={styles.avatarHint}>Tap to change photo</Text>
					</Animated.View>

					{/* Form */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(200).springify()}
					>
						<Input
							label="Display Name"
							placeholder="Your display name"
							value={displayName}
							onChangeText={setDisplayName}
							error={errors.displayName}
							leftIcon="person-outline"
							maxLength={50}
						/>

						<Input
							label="Username"
							placeholder="your_username"
							value={username}
							onChangeText={(text) => setUsername(text.toLowerCase())}
							error={errors.username}
							leftIcon="at"
							autoCapitalize="none"
							maxLength={30}
						/>

						<Input
							label="Bio"
							placeholder="Tell us about yourself..."
							value={bio}
							onChangeText={setBio}
							error={errors.bio}
							multiline
							numberOfLines={3}
							maxLength={160}
							style={styles.bioInput}
						/>
						<Text style={styles.charCount}>{bio.length}/160</Text>
					</Animated.View>

					{/* Role Selection */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(300).springify()}
					>
						<Text style={styles.sectionTitle}>Your Role</Text>
						<Text style={styles.sectionDescription}>
							Choose how you want to use BetaLift
						</Text>

						{roles.map((roleOption) => (
							<Card
								key={roleOption.id}
								style={
									role === roleOption.id
										? { ...styles.roleCard, ...styles.roleCardSelected }
										: styles.roleCard
								}
								onPress={() => setRole(roleOption.id)}
							>
								<View style={styles.roleContent}>
									<View
										style={[
											styles.roleIcon,
											role === roleOption.id && styles.roleIconSelected,
										]}
									>
										<Ionicons
											name={roleOption.icon}
											size={24}
											color={
												role === roleOption.id
													? Colors.primary
													: Colors.textSecondary
											}
										/>
									</View>
									<View style={styles.roleInfo}>
										<Text
											style={[
												styles.roleLabel,
												role === roleOption.id && styles.roleLabelSelected,
											]}
										>
											{roleOption.label}
										</Text>
										<Text style={styles.roleDescription}>
											{roleOption.description}
										</Text>
									</View>
									<View style={styles.roleRadio}>
										{role === roleOption.id && (
											<View style={styles.roleRadioInner} />
										)}
									</View>
								</View>
							</Card>
						))}
					</Animated.View>

					{/* Email (read-only) */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(400).springify()}
					>
						<Text style={styles.sectionTitle}>Account</Text>
						<Card style={styles.emailCard}>
							<View style={styles.emailRow}>
								<Ionicons
									name="mail-outline"
									size={20}
									color={Colors.textSecondary}
								/>
								<View style={styles.emailInfo}>
									<Text style={styles.emailLabel}>Email</Text>
									<Text style={styles.emailValue}>{user?.email}</Text>
								</View>
								<View style={styles.verifiedBadge}>
									<Ionicons
										name="checkmark-circle"
										size={16}
										color={Colors.success}
									/>
									<Text style={styles.verifiedText}>Verified</Text>
								</View>
							</View>
						</Card>
					</Animated.View>

					{/* Save Button (Mobile) */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(500).springify()}
						style={styles.bottomButton}
					>
						<Button
							title={isSaving ? "Saving..." : "Save Changes"}
							onPress={handleSave}
							loading={isSaving}
							fullWidth
						/>
					</Animated.View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	keyboardView: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	backButton: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	saveButton: {
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.xs,
	},
	saveButtonText: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.primary,
	},
	saveButtonDisabled: {
		opacity: 0.5,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: Spacing.lg,
		paddingBottom: Spacing.xxl,
	},
	avatarSection: {
		alignItems: "center",
		marginBottom: Spacing.xl,
	},
	avatarContainer: {
		position: "relative",
	},
	avatarEditBadge: {
		position: "absolute",
		bottom: 0,
		right: 0,
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 3,
		borderColor: Colors.background,
	},
	avatarHint: {
		marginTop: Spacing.sm,
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
	bioInput: {
		height: 80,
		textAlignVertical: "top",
	},
	charCount: {
		textAlign: "right",
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		marginTop: -Spacing.sm,
		marginBottom: Spacing.md,
	},
	sectionTitle: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginTop: Spacing.lg,
		marginBottom: Spacing.xs,
	},
	sectionDescription: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginBottom: Spacing.md,
	},
	roleCard: {
		marginBottom: Spacing.sm,
		borderWidth: 2,
		borderColor: "transparent",
	},
	roleCardSelected: {
		borderColor: Colors.primary,
		backgroundColor: `${Colors.primary}10`,
	},
	roleContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	roleIcon: {
		width: 48,
		height: 48,
		borderRadius: BorderRadius.md,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: "center",
		justifyContent: "center",
		marginRight: Spacing.md,
	},
	roleIconSelected: {
		backgroundColor: `${Colors.primary}20`,
	},
	roleInfo: {
		flex: 1,
	},
	roleLabel: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginBottom: 2,
	},
	roleLabelSelected: {
		color: Colors.primary,
	},
	roleDescription: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
	roleRadio: {
		width: 22,
		height: 22,
		borderRadius: 11,
		borderWidth: 2,
		borderColor: Colors.border,
		alignItems: "center",
		justifyContent: "center",
	},
	roleRadioInner: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: Colors.primary,
	},
	emailCard: {
		marginTop: Spacing.sm,
	},
	emailRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	emailInfo: {
		flex: 1,
		marginLeft: Spacing.md,
	},
	emailLabel: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
	emailValue: {
		fontSize: 15,
		fontFamily: Fonts.medium,
		color: Colors.text,
	},
	verifiedBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: `${Colors.success}20`,
		paddingHorizontal: Spacing.sm,
		paddingVertical: Spacing.xs,
		borderRadius: BorderRadius.full,
	},
	verifiedText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
		color: Colors.success,
		marginLeft: 4,
	},
	bottomButton: {
		marginTop: Spacing.xl,
	},
});
