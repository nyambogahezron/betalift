import { Avatar, Card } from '@/components/ui'
import { BorderRadius, Colors, Fonts, Spacing } from '@/constants/theme'
import { useAuthStore } from '@/stores/useAuthStore'
import { useFeedbackStore } from '@/stores/useFeedbackStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native'
import Animated, {
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

type SettingsSection = {
	title: string
	items: SettingsItem[]
}

type SettingsItem = {
	icon: keyof typeof Ionicons.glyphMap
	iconColor?: string
	label: string
	type: 'navigation' | 'toggle' | 'action'
	value?: boolean
	onPress?: () => void
	onToggle?: (value: boolean) => void
}

export default function Profile() {
	const { user, settings, updateSettings, logout } = useAuthStore()
	const { myProjects, joinedProjects } = useProjectStore()
	const { feedbacks } = useFeedbackStore()

	const [notificationsEnabled, setNotificationsEnabled] = useState(
		settings.notifications.pushEnabled
	)

	const userStats = {
		projects: myProjects.length,
		testing: joinedProjects.length,
		feedback: feedbacks.filter(f => f.userId === user?.id).length,
	}

	const handleLogout = () => {
		Alert.alert(
			'Logout',
			'Are you sure you want to logout?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Logout',
					style: 'destructive',
					onPress: () => {
						logout()
						router.replace('/(auth)/login')
					},
				},
			]
		)
	}

	const toggleNotifications = (value: boolean) => {
		setNotificationsEnabled(value)
		updateSettings({
			notifications: {
				...settings.notifications,
				pushEnabled: value,
			},
		})
	}

	const settingsSections: SettingsSection[] = [
		{
			title: 'Account',
			items: [
				{
					icon: 'person-circle-outline',
					label: 'Edit Profile',
					type: 'navigation',
					onPress: () => Alert.alert('Coming Soon', 'Edit profile feature coming soon!'),
				},
				{
					icon: 'mail-outline',
					label: 'Email Preferences',
					type: 'navigation',
					onPress: () => Alert.alert('Coming Soon', 'Email preferences feature coming soon!'),
				},
				{
					icon: 'shield-checkmark-outline',
					label: 'Privacy & Security',
					type: 'navigation',
					onPress: () => Alert.alert('Coming Soon', 'Privacy settings feature coming soon!'),
				},
			],
		},
		{
			title: 'Preferences',
			items: [
				{
					icon: 'notifications-outline',
					label: 'Push Notifications',
					type: 'toggle',
					value: notificationsEnabled,
					onToggle: toggleNotifications,
				},
				{
					icon: 'moon-outline',
					label: 'Appearance',
					type: 'navigation',
					onPress: () => Alert.alert('Coming Soon', 'Appearance settings feature coming soon!'),
				},
				{
					icon: 'language-outline',
					label: 'Language',
					type: 'navigation',
					onPress: () => {},
				},
			],
		},
		{
			title: 'Support',
			items: [
				{
					icon: 'help-circle-outline',
					label: 'Help Center',
					type: 'navigation',
					onPress: () => {},
				},
				{
					icon: 'chatbubble-ellipses-outline',
					label: 'Contact Support',
					type: 'navigation',
					onPress: () => {},
				},
				{
					icon: 'star-outline',
					label: 'Rate the App',
					type: 'navigation',
					onPress: () => {},
				},
			],
		},
		{
			title: 'Other',
			items: [
				{
					icon: 'document-text-outline',
					label: 'Terms of Service',
					type: 'navigation',
					onPress: () => {},
				},
				{
					icon: 'lock-closed-outline',
					label: 'Privacy Policy',
					type: 'navigation',
					onPress: () => {},
				},
				{
					icon: 'log-out-outline',
					iconColor: Colors.error,
					label: 'Logout',
					type: 'action',
					onPress: handleLogout,
				},
			],
		},
	]

	const getRoleBadge = (role: string) => {
		switch (role) {
			case 'creator':
				return { label: 'Creator', color: Colors.primary }
			case 'tester':
				return { label: 'Tester', color: Colors.success }
			case 'both':
				return { label: 'Creator & Tester', color: Colors.warning }
			default:
				return { label: 'User', color: Colors.textSecondary }
		}
	}

	const roleBadge = getRoleBadge(user?.role || 'tester')

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<Animated.View
					entering={FadeInDown.duration(600).springify()}
					style={styles.header}
				>
					<Text style={styles.headerTitle}>Profile</Text>
					<Pressable
						style={styles.settingsButton}
						onPress={() => Alert.alert('Coming Soon', 'Settings feature coming soon!')}
					>
						<Ionicons name='settings-outline' size={24} color={Colors.text} />
					</Pressable>
				</Animated.View>

				{/* Profile Card */}
				<Animated.View entering={FadeInUp.duration(600).delay(100).springify()}>
					<Card style={styles.profileCard}>
						<View style={styles.profileMain}>
							<Avatar
								source={user?.avatar}
								name={user?.displayName || user?.username}
								size='xl'
							/>
							<View style={styles.profileInfo}>
								<Text style={styles.displayName}>
									{user?.displayName || user?.username}
								</Text>
								<Text style={styles.username}>@{user?.username}</Text>
								<View
									style={[styles.roleBadge, { backgroundColor: `${roleBadge.color}20` }]}
								>
									<Text style={[styles.roleText, { color: roleBadge.color }]}>
										{roleBadge.label}
									</Text>
								</View>
							</View>
						</View>

						{user?.bio && <Text style={styles.bio}>{user.bio}</Text>}

						{/* Stats */}
						<View style={styles.statsContainer}>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{userStats.projects}</Text>
								<Text style={styles.statLabel}>Projects</Text>
							</View>
							<View style={styles.statDivider} />
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{userStats.testing}</Text>
								<Text style={styles.statLabel}>Testing</Text>
							</View>
							<View style={styles.statDivider} />
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{userStats.feedback}</Text>
								<Text style={styles.statLabel}>Feedback</Text>
							</View>
						</View>
					</Card>
				</Animated.View>

				{/* Settings Sections */}
				{settingsSections.map((section, sectionIndex) => (
					<Animated.View
						key={section.title}
						entering={FadeInUp.duration(600)
							.delay(200 + sectionIndex * 100)
							.springify()}
					>
						<Text style={styles.sectionTitle}>{section.title}</Text>
						<Card style={styles.sectionCard}>
							{section.items.map((item, itemIndex) => (
								<Pressable
									key={item.label}
									style={[
										styles.settingsItem,
										itemIndex < section.items.length - 1 && styles.settingsItemBorder,
									]}
									onPress={item.type === 'toggle' ? undefined : item.onPress}
								>
									<View
										style={[
											styles.settingsIconContainer,
											{ backgroundColor: `${item.iconColor || Colors.primary}15` },
										]}
									>
										<Ionicons
											name={item.icon}
											size={20}
											color={item.iconColor || Colors.primary}
										/>
									</View>
									<Text
										style={[
											styles.settingsLabel,
											item.iconColor === Colors.error && styles.settingsLabelDanger,
										]}
									>
										{item.label}
									</Text>
									{item.type === 'toggle' ? (
										<Switch
											value={item.value}
											onValueChange={item.onToggle}
											trackColor={{
												false: Colors.backgroundSecondary,
												true: `${Colors.primary}50`,
											}}
											thumbColor={item.value ? Colors.primary : Colors.textTertiary}
										/>
									) : (
										<Ionicons
											name='chevron-forward'
											size={20}
											color={Colors.textTertiary}
										/>
									)}
								</Pressable>
							))}
						</Card>
					</Animated.View>
				))}

				{/* App Info */}
				<Animated.View
					entering={FadeInUp.duration(600).delay(600).springify()}
					style={styles.appInfo}
				>
					<Text style={styles.appVersion}>BetaLift v1.0.0</Text>
					<Text style={styles.appCopyright}>© 2025 BetaLift. All rights reserved.</Text>
				</Animated.View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: Spacing.lg,
		paddingBottom: Spacing.xxl,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: Spacing.md,
	},
	headerTitle: {
		fontSize: 28,
		fontFamily: Fonts.bold,
		color: Colors.text,
	},
	settingsButton: {
		padding: Spacing.sm,
	},

	// Profile Card
	profileCard: {
		marginBottom: Spacing.lg,
	},
	profileMain: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	profileInfo: {
		flex: 1,
		marginLeft: Spacing.md,
	},
	displayName: {
		fontSize: 20,
		fontFamily: Fonts.bold,
		color: Colors.text,
	},
	username: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: 2,
	},
	roleBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: Spacing.sm,
		paddingVertical: 4,
		borderRadius: BorderRadius.sm,
		marginTop: Spacing.xs,
	},
	roleText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
	},
	bio: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: Spacing.md,
		lineHeight: 20,
	},

	// Stats
	statsContainer: {
		flexDirection: 'row',
		marginTop: Spacing.lg,
		paddingTop: Spacing.md,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
	},
	statItem: {
		flex: 1,
		alignItems: 'center',
	},
	statNumber: {
		fontSize: 22,
		fontFamily: Fonts.bold,
		color: Colors.text,
	},
	statLabel: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: 2,
	},
	statDivider: {
		width: 1,
		backgroundColor: Colors.border,
	},

	// Section
	sectionTitle: {
		fontSize: 13,
		fontFamily: Fonts.semibold,
		color: Colors.textTertiary,
		textTransform: 'uppercase',
		letterSpacing: 0.5,
		marginBottom: Spacing.sm,
		marginLeft: Spacing.xs,
	},
	sectionCard: {
		padding: 0,
		marginBottom: Spacing.lg,
	},

	// Settings Item
	settingsItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: Spacing.md,
	},
	settingsItemBorder: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	settingsIconContainer: {
		width: 36,
		height: 36,
		borderRadius: BorderRadius.sm,
		alignItems: 'center',
		justifyContent: 'center',
	},
	settingsLabel: {
		flex: 1,
		fontSize: 15,
		fontFamily: Fonts.medium,
		color: Colors.text,
		marginLeft: Spacing.md,
	},
	settingsLabelDanger: {
		color: Colors.error,
	},

	// App Info
	appInfo: {
		alignItems: 'center',
		paddingVertical: Spacing.lg,
	},
	appVersion: {
		fontSize: 13,
		fontFamily: Fonts.medium,
		color: Colors.textTertiary,
	},
	appCopyright: {
		fontSize: 11,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		marginTop: 4,
	},
})
