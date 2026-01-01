import { Avatar, Card } from '@/components/ui'
import { BorderRadius, Colors, Fonts, Spacing } from '@/constants/theme'
import { useAuthStore } from '@/stores/useAuthStore'
import { useFeedbackStore } from '@/stores/useFeedbackStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
	Alert,
	Dimensions,
	Pressable,
	StyleSheet,
	Switch,
	Text,
	View,
} from 'react-native'
import Animated, {
	Extrapolation,
	FadeInUp,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Application from 'expo-application'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const HEADER_MAX_HEIGHT = 220
const HEADER_MIN_HEIGHT = 100

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
	const insets = useSafeAreaInsets()
	const scrollY = useSharedValue(0)

	const currentYear = new Date().getFullYear()

	const appVersion = Application.nativeApplicationVersion || '1.0.0'
	const appBuild = Application.nativeBuildVersion || '100'

	const [notificationsEnabled, setNotificationsEnabled] = useState(
		settings.notifications.pushEnabled
	)

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y
		},
	})

	// Animated styles for parallax header
	const headerAnimatedStyle = useAnimatedStyle(() => {
		const height = interpolate(
			scrollY.value,
			[0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
			Extrapolation.CLAMP
		)
		return { height }
	})

	const avatarAnimatedStyle = useAnimatedStyle(() => {
		const scale = interpolate(
			scrollY.value,
			[0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[1, 0.45],
			Extrapolation.CLAMP
		)
		const translateX = interpolate(
			scrollY.value,
			[0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[0, -(SCREEN_WIDTH / 2) + 56],
			Extrapolation.CLAMP
		)
		const translateY = interpolate(
			scrollY.value,
			[0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[0, -50],
			Extrapolation.CLAMP
		)
		return {
			transform: [{ translateX }, { translateY }, { scale }],
		}
	})

	const nameAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[0, 60, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[1, 0.5, 0],
			Extrapolation.CLAMP
		)
		const translateY = interpolate(
			scrollY.value,
			[0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[0, -20],
			Extrapolation.CLAMP
		)
		return { opacity, transform: [{ translateY }] }
	})

	const headerTitleStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[60, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[0, 1],
			Extrapolation.CLAMP
		)
		return { opacity }
	})

	const userStats = {
		projects: myProjects.length,
		testing: joinedProjects.length,
		feedback: feedbacks.filter((f) => f.userId === user?.id).length,
	}

	const handleLogout = () => {
		Alert.alert('Logout', 'Are you sure you want to logout?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Logout',
				style: 'destructive',
				onPress: () => {
					logout()
					router.replace('/(auth)/login')
				},
			},
		])
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
					onPress: () => router.push('/profile/edit'),
				},
				{
					icon: 'chatbubbles-outline',
					label: 'Messages',
					type: 'navigation',
					onPress: () => router.push('/messages'),
				},
				{
					icon: 'settings-outline',
					label: 'Settings',
					type: 'navigation',
					onPress: () => router.push('/profile/settings'),
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
			],
		},
		{
			title: 'Other',
			items: [
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
		<View style={styles.container}>
			{/* Parallax Header */}
			<Animated.View style={[styles.header, headerAnimatedStyle]}>
				<LinearGradient
					colors={[Colors.primary, `${Colors.primary}CC`, Colors.background]}
					style={styles.headerGradient}
				/>

				{/* Nav Bar */}
				<View style={[styles.navBar, { paddingTop: insets.top }]}>
					<View style={styles.navButton} />
					<Animated.Text style={[styles.headerTitle, headerTitleStyle]}>
						{user?.displayName || user?.username}
					</Animated.Text>
					<Pressable
						style={styles.navButton}
						onPress={() => router.push('/profile/settings')}
					>
						<Ionicons name='settings-outline' size={24} color={Colors.text} />
					</Pressable>
				</View>

				{/* Profile Info in Header */}
				<View style={styles.headerContent}>
					<Animated.View style={avatarAnimatedStyle}>
						<Avatar
							source={user?.avatar}
							name={user?.displayName || user?.username}
							size='xl'
						/>
					</Animated.View>
					<Animated.View style={nameAnimatedStyle}>
						<Text style={styles.headerName}>
							{user?.displayName || user?.username}
						</Text>
						<Text style={styles.headerUsername}>@{user?.username}</Text>
					</Animated.View>
				</View>
			</Animated.View>

			<Animated.ScrollView
				style={styles.scrollView}
				contentContainerStyle={[
					styles.scrollContent,
					{ paddingTop: HEADER_MAX_HEIGHT + Spacing.md },
				]}
				showsVerticalScrollIndicator={false}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
			>
				{/* Stats Card */}
				<Animated.View entering={FadeInUp.duration(600).delay(100).springify()}>
					<Card style={styles.statsCard}>
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
						{user?.bio && <Text style={styles.bio}>{user.bio}</Text>}
						<View
							style={[
								styles.roleBadge,
								{ backgroundColor: `${roleBadge.color}20` },
							]}
						>
							<Text style={[styles.roleText, { color: roleBadge.color }]}>
								{roleBadge.label}
							</Text>
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
										itemIndex < section.items.length - 1 &&
											styles.settingsItemBorder,
									]}
									onPress={item.type === 'toggle' ? undefined : item.onPress}
								>
									<View
										style={[
											styles.settingsIconContainer,
											{
												backgroundColor: `${
													item.iconColor || Colors.primary
												}15`,
											},
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
											item.iconColor === Colors.error &&
												styles.settingsLabelDanger,
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
											thumbColor={
												item.value ? Colors.primary : Colors.textTertiary
											}
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
					<Text style={styles.appVersion}>
						BetaLift {appVersion} (Build {appBuild})
					</Text>
					<Text style={styles.appCopyright}>
						© {currentYear} BetaLift. All rights reserved.
					</Text>
				</Animated.View>
			</Animated.ScrollView>
		</View>
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

	// Parallax Header
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
		overflow: 'hidden',
	},
	headerGradient: {
		...StyleSheet.absoluteFillObject,
	},
	navBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: Spacing.md,
		paddingBottom: Spacing.sm,
	},
	navButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	headerContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: Spacing.md,
	},
	headerName: {
		fontSize: 20,
		fontFamily: Fonts.bold,
		color: Colors.text,
		textAlign: 'center',
		marginTop: Spacing.sm,
	},
	headerUsername: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: 'rgba(255,255,255,0.8)',
		textAlign: 'center',
	},

	// Stats Card
	statsCard: {
		marginBottom: Spacing.lg,
	},
	statsContainer: {
		flexDirection: 'row',
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
	bio: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: Spacing.md,
		paddingTop: Spacing.md,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
		lineHeight: 20,
		textAlign: 'center',
	},
	roleBadge: {
		alignSelf: 'center',
		paddingHorizontal: Spacing.sm,
		paddingVertical: 4,
		borderRadius: BorderRadius.sm,
		marginTop: Spacing.md,
	},
	roleText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
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
