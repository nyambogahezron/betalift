import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
	Alert,
	Linking,
	Pressable,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import { useAuthStore } from "@/stores/useAuthStore";

type ThemeOption = "dark" | "light" | "system";

export default function Settings() {
	const { settings, updateSettings } = useAuthStore();

	const [notifications, setNotifications] = useState({
		push: settings.notifications.pushEnabled,
		email: settings.notifications.emailEnabled,
		feedbackUpdates: settings.notifications.feedbackUpdates,
		projectInvites: settings.notifications.projectInvites,
		weeklyDigest: settings.notifications.weeklyDigest,
	});

	const [privacy, setPrivacy] = useState({
		profilePublic: settings.privacy.profilePublic,
		showEmail: settings.privacy.showEmail,
		showStats: settings.privacy.showStats,
	});

	const [theme, setTheme] = useState<ThemeOption>(settings.appearance.theme);

	const themeOptions: {
		id: ThemeOption;
		label: string;
		icon: keyof typeof Ionicons.glyphMap;
	}[] = [
		{ id: "dark", label: "Dark", icon: "moon" },
		{ id: "light", label: "Light", icon: "sunny" },
		{ id: "system", label: "System", icon: "phone-portrait-outline" },
	];

	const updateNotification = (
		key: keyof typeof notifications,
		value: boolean,
	) => {
		setNotifications((prev) => ({ ...prev, [key]: value }));
		updateSettings({
			notifications: {
				...settings.notifications,
				[key === "push"
					? "pushEnabled"
					: key === "email"
						? "emailEnabled"
						: key]: value,
			},
		});
	};

	const updatePrivacy = (key: keyof typeof privacy, value: boolean) => {
		setPrivacy((prev) => ({ ...prev, [key]: value }));
		updateSettings({
			privacy: {
				...settings.privacy,
				[key]: value,
			},
		});
	};

	const updateTheme = (newTheme: ThemeOption) => {
		setTheme(newTheme);
		updateSettings({
			appearance: {
				...settings.appearance,
				theme: newTheme,
			},
		});
	};

	const openLink = (url: string) => {
		Linking.openURL(url).catch(() => {
			Alert.alert("Error", "Could not open link");
		});
	};

	const handleDeleteAccount = () => {
		Alert.alert(
			"Delete Account",
			"Are you sure you want to delete your account? This action cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => {
						Alert.alert(
							"Account Deletion",
							"Please contact support to delete your account.",
						);
					},
				},
			],
		);
	};

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			{/* Header */}
			<Animated.View
				entering={FadeInDown.duration(600).springify()}
				style={styles.header}
			>
				<Pressable style={styles.backButton} onPress={() => router.back()}>
					<Ionicons name="arrow-back" size={24} color={Colors.text} />
				</Pressable>
				<Text style={styles.headerTitle}>Settings</Text>
				<View style={{ width: 40 }} />
			</Animated.View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Appearance */}
				<Animated.View entering={FadeInUp.duration(600).delay(100).springify()}>
					<Text style={styles.sectionTitle}>Appearance</Text>
					<Card style={styles.card}>
						<Text style={styles.settingLabel}>Theme</Text>
						<View style={styles.themeOptions}>
							{themeOptions.map((option) => (
								<Pressable
									key={option.id}
									style={[
										styles.themeOption,
										theme === option.id && styles.themeOptionSelected,
									]}
									onPress={() => updateTheme(option.id)}
								>
									<Ionicons
										name={option.icon}
										size={20}
										color={
											theme === option.id
												? Colors.primary
												: Colors.textSecondary
										}
									/>
									<Text
										style={[
											styles.themeOptionText,
											theme === option.id && styles.themeOptionTextSelected,
										]}
									>
										{option.label}
									</Text>
								</Pressable>
							))}
						</View>
					</Card>
				</Animated.View>

				{/* Notifications */}
				<Animated.View entering={FadeInUp.duration(600).delay(200).springify()}>
					<Text style={styles.sectionTitle}>Notifications</Text>
					<Card style={styles.card}>
						<SettingRow
							icon="notifications-outline"
							label="Push Notifications"
							description="Receive push notifications on your device"
							value={notifications.push}
							onToggle={(value) => updateNotification("push", value)}
						/>
						<View style={styles.divider} />
						<SettingRow
							icon="mail-outline"
							label="Email Notifications"
							description="Receive updates via email"
							value={notifications.email}
							onToggle={(value) => updateNotification("email", value)}
						/>
						<View style={styles.divider} />
						<SettingRow
							icon="chatbubble-outline"
							label="Feedback Updates"
							description="Get notified about feedback on your projects"
							value={notifications.feedbackUpdates}
							onToggle={(value) => updateNotification("feedbackUpdates", value)}
						/>
						<View style={styles.divider} />
						<SettingRow
							icon="people-outline"
							label="Project Invites"
							description="Get notified when invited to test projects"
							value={notifications.projectInvites}
							onToggle={(value) => updateNotification("projectInvites", value)}
						/>
						<View style={styles.divider} />
						<SettingRow
							icon="calendar-outline"
							label="Weekly Digest"
							description="Receive weekly summary of activity"
							value={notifications.weeklyDigest}
							onToggle={(value) => updateNotification("weeklyDigest", value)}
						/>
					</Card>
				</Animated.View>

				{/* Privacy */}
				<Animated.View entering={FadeInUp.duration(600).delay(300).springify()}>
					<Text style={styles.sectionTitle}>Privacy</Text>
					<Card style={styles.card}>
						<SettingRow
							icon="globe-outline"
							label="Public Profile"
							description="Allow others to see your profile"
							value={privacy.profilePublic}
							onToggle={(value) => updatePrivacy("profilePublic", value)}
						/>
						<View style={styles.divider} />
						<SettingRow
							icon="mail-outline"
							label="Show Email"
							description="Display your email on your public profile"
							value={privacy.showEmail}
							onToggle={(value) => updatePrivacy("showEmail", value)}
						/>
						<View style={styles.divider} />
						<SettingRow
							icon="stats-chart-outline"
							label="Show Stats"
							description="Display your activity statistics publicly"
							value={privacy.showStats}
							onToggle={(value) => updatePrivacy("showStats", value)}
						/>
					</Card>
				</Animated.View>

				{/* Support */}
				<Animated.View entering={FadeInUp.duration(600).delay(400).springify()}>
					<Text style={styles.sectionTitle}>Support</Text>
					<Card style={styles.card}>
						<LinkRow
							icon="help-circle-outline"
							label="Help Center"
							onPress={() => openLink("https://betalift.app/help")}
						/>
						<View style={styles.divider} />
						<LinkRow
							icon="chatbubble-ellipses-outline"
							label="Contact Support"
							onPress={() => openLink("mailto:support@betalift.app")}
						/>
						<View style={styles.divider} />
						<LinkRow
							icon="bug-outline"
							label="Report a Bug"
							onPress={() => openLink("mailto:bugs@betalift.app")}
						/>
						<View style={styles.divider} />
						<LinkRow
							icon="star-outline"
							label="Rate the App"
							onPress={() =>
								Alert.alert(
									"Rate Us",
									"Thanks for your support! Rating feature coming soon.",
								)
							}
						/>
					</Card>
				</Animated.View>

				{/* Legal */}
				<Animated.View entering={FadeInUp.duration(600).delay(500).springify()}>
					<Text style={styles.sectionTitle}>Legal</Text>
					<Card style={styles.card}>
						<LinkRow
							icon="document-text-outline"
							label="Terms of Service"
							onPress={() => openLink("https://betalift.app/terms")}
						/>
						<View style={styles.divider} />
						<LinkRow
							icon="shield-checkmark-outline"
							label="Privacy Policy"
							onPress={() => openLink("https://betalift.app/privacy")}
						/>
						<View style={styles.divider} />
						<LinkRow
							icon="information-circle-outline"
							label="Licenses"
							onPress={() =>
								Alert.alert(
									"Open Source",
									"BetaLift uses various open source libraries. See our GitHub for details.",
								)
							}
						/>
					</Card>
				</Animated.View>

				{/* Danger Zone */}
				<Animated.View entering={FadeInUp.duration(600).delay(600).springify()}>
					<Text style={[styles.sectionTitle, { color: Colors.error }]}>
						Danger Zone
					</Text>
					<Card style={{ ...styles.card, ...styles.dangerCard }}>
						<Pressable style={styles.dangerRow} onPress={handleDeleteAccount}>
							<Ionicons name="trash-outline" size={22} color={Colors.error} />
							<View style={styles.dangerInfo}>
								<Text style={styles.dangerLabel}>Delete Account</Text>
								<Text style={styles.dangerDescription}>
									Permanently delete your account and all data
								</Text>
							</View>
							<Ionicons name="chevron-forward" size={20} color={Colors.error} />
						</Pressable>
					</Card>
				</Animated.View>

				{/* App Version */}
				<Animated.View
					entering={FadeInUp.duration(600).delay(700).springify()}
					style={styles.versionContainer}
				>
					<Text style={styles.versionText}>BetaLift v1.0.0</Text>
					<Text style={styles.buildText}>Build 2024.12.30</Text>
				</Animated.View>
			</ScrollView>
		</SafeAreaView>
	);
}

// Helper components
function SettingRow({
	icon,
	label,
	description,
	value,
	onToggle,
}: {
	icon: keyof typeof Ionicons.glyphMap;
	label: string;
	description: string;
	value: boolean;
	onToggle: (value: boolean) => void;
}) {
	return (
		<View style={styles.settingRow}>
			<Ionicons name={icon} size={22} color={Colors.textSecondary} />
			<View style={styles.settingInfo}>
				<Text style={styles.settingRowLabel}>{label}</Text>
				<Text style={styles.settingDescription}>{description}</Text>
			</View>
			<Switch
				value={value}
				onValueChange={onToggle}
				trackColor={{
					false: Colors.backgroundTertiary,
					true: `${Colors.primary}50`,
				}}
				thumbColor={value ? Colors.primary : Colors.textTertiary}
			/>
		</View>
	);
}

function LinkRow({
	icon,
	label,
	onPress,
}: {
	icon: keyof typeof Ionicons.glyphMap;
	label: string;
	onPress: () => void;
}) {
	return (
		<Pressable style={styles.linkRow} onPress={onPress}>
			<Ionicons name={icon} size={22} color={Colors.textSecondary} />
			<Text style={styles.linkLabel}>{label}</Text>
			<Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
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
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: Spacing.lg,
		paddingBottom: Spacing.xxl,
	},
	sectionTitle: {
		fontSize: 14,
		fontFamily: Fonts.semibold,
		color: Colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 0.5,
		marginTop: Spacing.lg,
		marginBottom: Spacing.sm,
		marginLeft: Spacing.xs,
	},
	card: {
		padding: Spacing.md,
	},
	settingLabel: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
		marginBottom: Spacing.sm,
	},
	themeOptions: {
		flexDirection: "row",
		gap: Spacing.sm,
	},
	themeOption: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: Spacing.xs,
		paddingVertical: Spacing.sm,
		paddingHorizontal: Spacing.md,
		borderRadius: BorderRadius.md,
		backgroundColor: Colors.backgroundSecondary,
		borderWidth: 2,
		borderColor: "transparent",
	},
	themeOptionSelected: {
		borderColor: Colors.primary,
		backgroundColor: `${Colors.primary}15`,
	},
	themeOptionText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
	themeOptionTextSelected: {
		color: Colors.primary,
	},
	settingRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: Spacing.xs,
	},
	settingInfo: {
		flex: 1,
		marginLeft: Spacing.md,
		marginRight: Spacing.sm,
	},
	settingRowLabel: {
		fontSize: 15,
		fontFamily: Fonts.medium,
		color: Colors.text,
	},
	settingDescription: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: 2,
	},
	divider: {
		height: 1,
		backgroundColor: Colors.border,
		marginVertical: Spacing.sm,
	},
	linkRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: Spacing.sm,
	},
	linkLabel: {
		flex: 1,
		fontSize: 15,
		fontFamily: Fonts.medium,
		color: Colors.text,
		marginLeft: Spacing.md,
	},
	dangerCard: {
		borderWidth: 1,
		borderColor: `${Colors.error}30`,
		backgroundColor: `${Colors.error}05`,
	},
	dangerRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: Spacing.xs,
	},
	dangerInfo: {
		flex: 1,
		marginLeft: Spacing.md,
	},
	dangerLabel: {
		fontSize: 15,
		fontFamily: Fonts.semibold,
		color: Colors.error,
	},
	dangerDescription: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: 2,
	},
	versionContainer: {
		alignItems: "center",
		marginTop: Spacing.xl,
		marginBottom: Spacing.lg,
	},
	versionText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
	buildText: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		marginTop: 2,
	},
});
