import { ProjectCard } from '@/components/project'
import { Avatar, Button, Card } from '@/components/ui'
import { BorderRadius, Colors, Fonts, Spacing } from '@/constants/theme'
import { getProjectsByOwner, getUserById, mockUserEngagements } from '@/data/mockData'
import type { UserAvailability } from '@/interfaces'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useMemo, useState } from 'react'
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View
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

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const HEADER_MAX_HEIGHT = 280
const HEADER_MIN_HEIGHT = 100

type TabType = 'about' | 'projects' | 'activity'

export default function UserProfileScreen() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const insets = useSafeAreaInsets()
	const scrollY = useSharedValue(0)
	const [activeTab, setActiveTab] = useState<TabType>('about')

	// Get user data from centralized mock data
	const user = useMemo(() => {
		const foundUser = getUserById(id || 'u1')
		return foundUser || {
			id: id || 'unknown',
			email: 'unknown@example.com',
			username: 'unknown',
			displayName: 'Unknown User',
			role: 'tester' as const,
			stats: { projectsCreated: 0, projectsTested: 0, feedbackGiven: 0, feedbackReceived: 0 },
			createdAt: new Date(),
		}
	}, [id])
	
	const engagement = useMemo(() => {
		return mockUserEngagements[id || 'u1'] || {
			availability: { status: 'offline' as const },
			skills: [],
			interests: [],
			preferredPlatforms: [],
			testingExperience: 'beginner' as const,
			projectsViewed: [],
			lastActiveAt: new Date(),
		}
	}, [id])
	
	const userProjects = useMemo(() => getProjectsByOwner(id || 'u1'), [id])

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y
		},
	})

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
			[1, 0.5],
			Extrapolation.CLAMP
		)
		const translateX = interpolate(
			scrollY.value,
			[0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[0, -(SCREEN_WIDTH / 2) + 70],
			Extrapolation.CLAMP
		)
		const translateY = interpolate(
			scrollY.value,
			[0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[0, -30],
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
		return { opacity }
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

	const getAvailabilityColor = (status: UserAvailability['status']) => {
		switch (status) {
			case 'available':
				return Colors.success
			case 'busy':
				return Colors.warning
			case 'away':
				return Colors.textTertiary
			case 'offline':
				return Colors.error
		}
	}

	const getExperienceLabel = (exp: string) => {
		switch (exp) {
			case 'beginner':
				return 'Beginner Tester'
			case 'intermediate':
				return 'Intermediate Tester'
			case 'expert':
				return 'Expert Tester'
			default:
				return 'Tester'
		}
	}

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

	const roleBadge = getRoleBadge(user.role)

	const renderAboutTab = () => (
		<Animated.View entering={FadeInUp.duration(400).springify()}>
			{/* Availability Card */}
			<Card style={styles.card}>
				<View style={styles.cardHeader}>
					<Ionicons name="time" size={20} color={Colors.primary} />
					<Text style={styles.cardTitle}>Availability</Text>
					<View
						style={[
							styles.availabilityBadge,
							{ backgroundColor: `${getAvailabilityColor(engagement.availability.status)}15` },
						]}
					>
						<View
							style={[
								styles.availabilityDot,
								{ backgroundColor: getAvailabilityColor(engagement.availability.status) },
							]}
						/>
						<Text
							style={[
								styles.availabilityText,
								{ color: getAvailabilityColor(engagement.availability.status) },
							]}
						>
							{engagement.availability.status.charAt(0).toUpperCase() +
								engagement.availability.status.slice(1)}
						</Text>
					</View>
				</View>
				<View style={styles.availabilityDetails}>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Hours per week</Text>
						<Text style={styles.detailValue}>
							{engagement.availability.hoursPerWeek || 'Not specified'}
						</Text>
					</View>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Timezone</Text>
						<Text style={styles.detailValue}>
							{engagement.availability.timezone || 'Not specified'}
						</Text>
					</View>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Contact preference</Text>
						<Text style={styles.detailValue}>
							{engagement.availability.preferredContactMethod === 'in-app'
								? 'In-App Messaging'
								: engagement.availability.preferredContactMethod || 'Not specified'}
						</Text>
					</View>
				</View>
			</Card>

			{/* Skills & Interests */}
			<Card style={styles.card}>
				<View style={styles.cardHeader}>
					<Ionicons name="sparkles" size={20} color={Colors.warning} />
					<Text style={styles.cardTitle}>Skills</Text>
				</View>
				<View style={styles.tagsContainer}>
					{engagement.skills.map((skill) => (
						<View key={skill} style={styles.skillTag}>
							<Text style={styles.skillTagText}>{skill}</Text>
						</View>
					))}
				</View>

				<View style={[styles.cardHeader, { marginTop: Spacing.lg }]}>
					<Ionicons name="heart" size={20} color={Colors.error} />
					<Text style={styles.cardTitle}>Interests</Text>
				</View>
				<View style={styles.tagsContainer}>
					{engagement.interests.map((interest) => (
						<View key={interest} style={styles.interestTag}>
							<Text style={styles.interestTagText}>{interest}</Text>
						</View>
					))}
				</View>
			</Card>

			{/* Platforms */}
			<Card style={styles.card}>
				<View style={styles.cardHeader}>
					<Ionicons name="phone-portrait" size={20} color={Colors.success} />
					<Text style={styles.cardTitle}>Preferred Platforms</Text>
				</View>
				<View style={styles.platformsRow}>
					{engagement.preferredPlatforms.map((platform) => (
						<View key={platform} style={styles.platformItem}>
							<Ionicons
								name={
									platform === 'ios'
										? 'logo-apple'
										: platform === 'android'
										? 'logo-android'
										: platform === 'web'
										? 'globe'
										: 'desktop'
								}
								size={24}
								color={Colors.text}
							/>
							<Text style={styles.platformText}>
								{platform.charAt(0).toUpperCase() + platform.slice(1)}
							</Text>
						</View>
					))}
				</View>
			</Card>

			{/* Testing Experience */}
			<Card style={styles.card}>
				<View style={styles.cardHeader}>
					<Ionicons name="ribbon" size={20} color={Colors.primary} />
					<Text style={styles.cardTitle}>Testing Experience</Text>
				</View>
				<View style={styles.experienceContainer}>
					<Text style={styles.experienceLevel}>
						{getExperienceLabel(engagement.testingExperience)}
					</Text>
					<View style={styles.experienceBar}>
						<View
							style={[
								styles.experienceFill,
								{
									width:
										engagement.testingExperience === 'beginner'
											? '33%'
											: engagement.testingExperience === 'intermediate'
											? '66%'
											: '100%',
								},
							]}
						/>
					</View>
				</View>
			</Card>
		</Animated.View>
	)

	const renderProjectsTab = () => (
		<Animated.View entering={FadeInUp.duration(400).springify()}>
			{userProjects.length > 0 ? (
				userProjects.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))
			) : (
				<View style={styles.emptyTab}>
					<Ionicons name="cube-outline" size={48} color={Colors.textTertiary} />
					<Text style={styles.emptyTabText}>No projects yet</Text>
				</View>
			)}
		</Animated.View>
	)

	const renderActivityTab = () => (
		<Animated.View entering={FadeInUp.duration(400).springify()}>
			<Card style={styles.card}>
				<View style={styles.cardHeader}>
					<Ionicons name="eye" size={20} color={Colors.primary} />
					<Text style={styles.cardTitle}>Recently Viewed Projects</Text>
				</View>
				{engagement.projectsViewed.length > 0 ? (
					engagement.projectsViewed.map((view, index) => (
						<Pressable
							key={view.projectId}
							style={[
								styles.viewedProject,
								index < engagement.projectsViewed.length - 1 && styles.viewedProjectBorder,
							]}
							onPress={() => router.push(`/project/${view.projectId}`)}
						>
							<View style={styles.viewedProjectInfo}>
								<Text style={styles.viewedProjectName}>Project #{view.projectId}</Text>
								<Text style={styles.viewedProjectDate}>
									{view.viewedAt.toLocaleDateString()}
								</Text>
							</View>
							<Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
						</Pressable>
					))
				) : (
					<Text style={styles.noActivityText}>No recent activity</Text>
				)}
			</Card>

			<Card style={styles.card}>
				<View style={styles.cardHeader}>
					<Ionicons name="stats-chart" size={20} color={Colors.success} />
					<Text style={styles.cardTitle}>Activity Stats</Text>
				</View>
				<View style={styles.activityStats}>
					<View style={styles.activityStatItem}>
						<Text style={styles.activityStatValue}>{user.stats.projectsTested}</Text>
						<Text style={styles.activityStatLabel}>Projects Tested</Text>
					</View>
					<View style={styles.activityStatItem}>
						<Text style={styles.activityStatValue}>{user.stats.feedbackGiven}</Text>
						<Text style={styles.activityStatLabel}>Feedback Given</Text>
					</View>
					<View style={styles.activityStatItem}>
						<Text style={styles.activityStatValue}>
							{Math.round(
								engagement.projectsViewed.reduce((acc, v) => acc + (v.duration || 0), 0) / 60
							)}
							min
						</Text>
						<Text style={styles.activityStatLabel}>Time Spent</Text>
					</View>
				</View>
			</Card>

			<Card style={styles.card}>
				<View style={styles.cardHeader}>
					<Ionicons name="calendar" size={20} color={Colors.warning} />
					<Text style={styles.cardTitle}>Last Active</Text>
				</View>
				<Text style={styles.lastActiveText}>
					{engagement.lastActiveAt.toLocaleDateString('en-US', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}
				</Text>
			</Card>
		</Animated.View>
	)

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
					<Pressable style={styles.navButton} onPress={() => router.back()}>
						<Ionicons name="arrow-back" size={24} color={Colors.text} />
					</Pressable>
					<Animated.Text style={[styles.headerTitle, headerTitleStyle]}>
						{user.displayName || user.username}
					</Animated.Text>
					<Pressable
						style={styles.navButton}
						onPress={() => router.push(`/messages/${user.id}`)}
					>
						<Ionicons name="chatbubble" size={22} color={Colors.text} />
					</Pressable>
				</View>

				{/* Profile Info */}
				<View style={styles.headerContent}>
					<Animated.View style={avatarAnimatedStyle}>
						<Avatar
							source={user.avatar}
							name={user.displayName || user.username}
							size="xl"
						/>
						<View
							style={[
								styles.onlineIndicator,
								{ backgroundColor: getAvailabilityColor(engagement.availability.status) },
							]}
						/>
					</Animated.View>
					<Animated.View style={nameAnimatedStyle}>
						<Text style={styles.headerName}>{user.displayName || user.username}</Text>
						<Text style={styles.headerUsername}>@{user.username}</Text>
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
				<Card style={styles.statsCard}>
					<View style={styles.statsContainer}>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>{user.stats.projectsCreated}</Text>
							<Text style={styles.statLabel}>Created</Text>
						</View>
						<View style={styles.statDivider} />
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>{user.stats.projectsTested}</Text>
							<Text style={styles.statLabel}>Tested</Text>
						</View>
						<View style={styles.statDivider} />
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>{user.stats.feedbackGiven}</Text>
							<Text style={styles.statLabel}>Feedback</Text>
						</View>
					</View>
					{user.bio && <Text style={styles.bio}>{user.bio}</Text>}
					<View style={[styles.roleBadge, { backgroundColor: `${roleBadge.color}20` }]}>
						<Text style={[styles.roleText, { color: roleBadge.color }]}>
							{roleBadge.label}
						</Text>
					</View>
				</Card>

				{/* Message Button */}
				<Button
					title="Send Message"
					onPress={() => router.push(`/messages/${user.id}`)}
					icon={<Ionicons name="chatbubble" size={18} color={Colors.text} />}
					style={styles.messageButton}
				/>

				{/* Tabs */}
				<View style={styles.tabContainer}>
					{(['about', 'projects', 'activity'] as TabType[]).map((tab) => (
						<Pressable
							key={tab}
							style={[styles.tab, activeTab === tab && styles.tabActive]}
							onPress={() => setActiveTab(tab)}
						>
							<Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</Text>
						</Pressable>
					))}
				</View>

				{/* Tab Content */}
				{activeTab === 'about' && renderAboutTab()}
				{activeTab === 'projects' && renderProjectsTab()}
				{activeTab === 'activity' && renderActivityTab()}
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

	// Header
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
		borderRadius: 20,
		backgroundColor: 'rgba(0,0,0,0.2)',
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
		fontSize: 22,
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
	onlineIndicator: {
		position: 'absolute',
		bottom: 4,
		right: 4,
		width: 16,
		height: 16,
		borderRadius: 8,
		borderWidth: 3,
		borderColor: Colors.background,
	},

	// Stats Card
	statsCard: {
		marginBottom: Spacing.md,
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

	messageButton: {
		marginBottom: Spacing.lg,
	},

	// Tabs
	tabContainer: {
		flexDirection: 'row',
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.md,
		padding: 4,
		marginBottom: Spacing.lg,
	},
	tab: {
		flex: 1,
		paddingVertical: Spacing.sm,
		alignItems: 'center',
		borderRadius: BorderRadius.sm,
	},
	tabActive: {
		backgroundColor: Colors.card,
	},
	tabText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
	tabTextActive: {
		color: Colors.text,
	},

	// Cards
	card: {
		marginBottom: Spacing.md,
	},
	cardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.sm,
		marginBottom: Spacing.md,
	},
	cardTitle: {
		flex: 1,
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},

	// Availability
	availabilityBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingHorizontal: Spacing.sm,
		paddingVertical: 4,
		borderRadius: BorderRadius.full,
	},
	availabilityDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	availabilityText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
	},
	availabilityDetails: {
		gap: Spacing.sm,
	},
	detailRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	detailLabel: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
	detailValue: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.text,
	},

	// Tags
	tagsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: Spacing.xs,
	},
	skillTag: {
		backgroundColor: `${Colors.primary}15`,
		paddingHorizontal: Spacing.sm,
		paddingVertical: 4,
		borderRadius: BorderRadius.sm,
	},
	skillTagText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
		color: Colors.primary,
	},
	interestTag: {
		backgroundColor: `${Colors.error}15`,
		paddingHorizontal: Spacing.sm,
		paddingVertical: 4,
		borderRadius: BorderRadius.sm,
	},
	interestTagText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
		color: Colors.error,
	},

	// Platforms
	platformsRow: {
		flexDirection: 'row',
		gap: Spacing.lg,
	},
	platformItem: {
		alignItems: 'center',
		gap: Spacing.xs,
	},
	platformText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},

	// Experience
	experienceContainer: {
		gap: Spacing.sm,
	},
	experienceLevel: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.text,
	},
	experienceBar: {
		height: 8,
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: 4,
		overflow: 'hidden',
	},
	experienceFill: {
		height: '100%',
		backgroundColor: Colors.primary,
		borderRadius: 4,
	},

	// Empty
	emptyTab: {
		alignItems: 'center',
		paddingVertical: Spacing.xxl,
	},
	emptyTabText: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: Spacing.sm,
	},

	// Activity
	viewedProject: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: Spacing.sm,
	},
	viewedProjectBorder: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	viewedProjectInfo: {
		flex: 1,
	},
	viewedProjectName: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.text,
	},
	viewedProjectDate: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
	noActivityText: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		textAlign: 'center',
		paddingVertical: Spacing.md,
	},
	activityStats: {
		flexDirection: 'row',
	},
	activityStatItem: {
		flex: 1,
		alignItems: 'center',
	},
	activityStatValue: {
		fontSize: 20,
		fontFamily: Fonts.bold,
		color: Colors.text,
	},
	activityStatLabel: {
		fontSize: 11,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		textAlign: 'center',
	},
	lastActiveText: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.text,
	},
})
