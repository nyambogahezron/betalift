import { ProjectCard } from '@/components/project'
import { Avatar, Button, Card } from '@/components/ui'
import { BorderRadius, Colors, Fonts, Spacing } from '@/constants/theme'
import { useAuthStore } from '@/stores/useAuthStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
	ActivityIndicator,
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

type TabType = 'my-projects' | 'joined'

export default function Home() {
	const [activeTab, setActiveTab] = useState<TabType>('my-projects')
	const [refreshing, setRefreshing] = useState(false)

	const { user } = useAuthStore()
	const {
		myProjects,
		joinedProjects,
		pendingInvites,
		fetchMyProjects,
		fetchJoinedProjects,
		fetchProjects,
		isLoading,
	} = useProjectStore()

	useEffect(() => {
		loadData()
	}, [user?.id])

	const loadData = async () => {
		if (!user?.id) return
		await Promise.all([
			fetchProjects(),
			fetchMyProjects(user.id),
			fetchJoinedProjects(user.id),
		])
	}

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		await loadData()
		setRefreshing(false)
	}, [user?.id])

	const showMyProjects = user?.role === 'creator' || user?.role === 'both'

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			{/* Header */}
			<Animated.View
				entering={FadeInDown.duration(600).springify()}
				style={styles.header}
			>
				<View>
					<Text style={styles.greeting}>
						Hello, {user?.displayName || user?.username || 'there'}! 👋
					</Text>
					<Text style={styles.subtitle}>
						{activeTab === 'my-projects'
							? 'Manage your beta projects'
							: 'Projects you are testing'}
					</Text>
				</View>
				<View style={styles.headerActions}>
					<Pressable
						style={styles.headerIconButton}
						onPress={() => router.push('/messages')}
					>
						<Ionicons
							name='chatbubbles-outline'
							size={24}
							color={Colors.text}
						/>
					</Pressable>
					<Pressable
						style={styles.profileButton}
						onPress={() => router.push('/(tabs)/profile')}
					>
						<Avatar
							source={user?.avatar}
							name={user?.displayName || user?.username}
							size='md'
						/>
					</Pressable>
				</View>
			</Animated.View>

			{/* Tab Selector */}
			<Animated.View
				entering={FadeInUp.duration(600).delay(100).springify()}
				style={styles.tabContainer}
			>
				{showMyProjects && (
					<Pressable
						style={[
							styles.tab,
							activeTab === 'my-projects' && styles.tabActive,
						]}
						onPress={() => setActiveTab('my-projects')}
					>
						<Ionicons
							name='rocket'
							size={18}
							color={
								activeTab === 'my-projects'
									? Colors.primary
									: Colors.textTertiary
							}
						/>
						<Text
							style={[
								styles.tabText,
								activeTab === 'my-projects' && styles.tabTextActive,
							]}
						>
							My Projects
						</Text>
						{myProjects.length > 0 && (
							<View style={styles.tabBadge}>
								<Text style={styles.tabBadgeText}>{myProjects.length}</Text>
							</View>
						)}
					</Pressable>
				)}

				<Pressable
					style={[styles.tab, activeTab === 'joined' && styles.tabActive]}
					onPress={() => setActiveTab('joined')}
				>
					<Ionicons
						name='flask'
						size={18}
						color={
							activeTab === 'joined' ? Colors.primary : Colors.textTertiary
						}
					/>
					<Text
						style={[
							styles.tabText,
							activeTab === 'joined' && styles.tabTextActive,
						]}
					>
						Testing
					</Text>
					{joinedProjects.length + pendingInvites.length > 0 && (
						<View style={styles.tabBadge}>
							<Text style={styles.tabBadgeText}>
								{joinedProjects.length + pendingInvites.length}
							</Text>
						</View>
					)}
				</Pressable>
			</Animated.View>

			{/* Content */}
			<ScrollView
				style={styles.content}
				contentContainerStyle={styles.contentContainer}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={Colors.primary}
					/>
				}
			>
				{isLoading && !refreshing ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size='large' color={Colors.primary} />
					</View>
				) : activeTab === 'my-projects' ? (
					<MyProjectsTab projects={myProjects} />
				) : (
					<JoinedProjectsTab
						projects={joinedProjects}
						pendingCount={pendingInvites.length}
					/>
				)}
			</ScrollView>
		</SafeAreaView>
	)
}

function MyProjectsTab({
	projects,
}: {
	projects: typeof useProjectStore.prototype.myProjects
}) {
	if (projects.length === 0) {
		return (
			<Animated.View
				entering={FadeInUp.duration(600).springify()}
				style={styles.emptyState}
			>
				<View style={styles.emptyIcon}>
					<Ionicons
						name='rocket-outline'
						size={64}
						color={Colors.textTertiary}
					/>
				</View>
				<Text style={styles.emptyTitle}>No Projects Yet</Text>
				<Text style={styles.emptyDescription}>
					Create your first project and start getting valuable feedback from
					beta testers.
				</Text>
				<Button
					title='Create Project'
					onPress={() => router.push('/project/create')}
					icon={<Ionicons name='add' size={20} color={Colors.text} />}
					style={styles.emptyButton}
				/>
			</Animated.View>
		)
	}

	return (
		<Animated.View entering={FadeInUp.duration(600).springify()}>
			{/* Quick Stats */}
			<View style={styles.statsRow}>
				<Card style={styles.statCard}>
					<Ionicons name='cube' size={24} color={Colors.primary} />
					<Text style={styles.statNumber}>{projects.length}</Text>
					<Text style={styles.statLabel}>Projects</Text>
				</Card>
				<Card style={styles.statCard}>
					<Ionicons name='people' size={24} color={Colors.success} />
					<Text style={styles.statNumber}>
						{projects.reduce((sum, p) => sum + p.testerCount, 0)}
					</Text>
					<Text style={styles.statLabel}>Testers</Text>
				</Card>
				<Card style={styles.statCard}>
					<Ionicons name='chatbubbles' size={24} color={Colors.warning} />
					<Text style={styles.statNumber}>
						{projects.reduce((sum, p) => sum + p.feedbackCount, 0)}
					</Text>
					<Text style={styles.statLabel}>Feedback</Text>
				</Card>
			</View>

			{/* Create New Project Button */}
			<Pressable
				style={styles.createProjectButton}
				onPress={() => router.push('/project/create')}
			>
				<Ionicons name='add-circle' size={24} color={Colors.primary} />
				<Text style={styles.createProjectText}>Create New Project</Text>
				<Ionicons
					name='chevron-forward'
					size={20}
					color={Colors.textTertiary}
				/>
			</Pressable>

			{/* Projects List */}
			<Text style={styles.sectionTitle}>Your Projects</Text>
			{projects.map((project, index) => (
				<Animated.View
					key={project.id}
					entering={FadeInUp.duration(400)
						.delay(index * 100)
						.springify()}
				>
					<ProjectCard project={project} />
				</Animated.View>
			))}
		</Animated.View>
	)
}

function JoinedProjectsTab({
	projects,
	pendingCount,
}: {
	projects: typeof useProjectStore.prototype.joinedProjects
	pendingCount: number
}) {
	if (projects.length === 0 && pendingCount === 0) {
		return (
			<Animated.View
				entering={FadeInUp.duration(600).springify()}
				style={styles.emptyState}
			>
				<View style={styles.emptyIcon}>
					<Ionicons
						name='flask-outline'
						size={64}
						color={Colors.textTertiary}
					/>
				</View>
				<Text style={styles.emptyTitle}>No Projects to Test</Text>
				<Text style={styles.emptyDescription}>
					Explore and join beta projects to start testing and providing
					feedback.
				</Text>
				<Button
					title='Explore Projects'
					onPress={() => router.push('/(tabs)/explore')}
					icon={<Ionicons name='compass' size={20} color={Colors.text} />}
					style={styles.emptyButton}
				/>
			</Animated.View>
		)
	}

	return (
		<Animated.View entering={FadeInUp.duration(600).springify()}>
			{/* Pending Requests */}
			{pendingCount > 0 && (
				<Card style={styles.pendingCard}>
					<View style={styles.pendingContent}>
						<View style={styles.pendingIconContainer}>
							<Ionicons name='time' size={24} color={Colors.warning} />
						</View>
						<View style={styles.pendingTextContainer}>
							<Text style={styles.pendingTitle}>Pending Requests</Text>
							<Text style={styles.pendingDescription}>
								{pendingCount} project{pendingCount > 1 ? 's' : ''} awaiting
								approval
							</Text>
						</View>
					</View>
				</Card>
			)}

			{/* Active Projects */}
			{projects.length > 0 && (
				<>
					<Text style={styles.sectionTitle}>Active Testing</Text>
					{projects.map((project, index) => (
						<Animated.View
							key={project.id}
							entering={FadeInUp.duration(400)
								.delay(index * 100)
								.springify()}
						>
							<ProjectCard project={project} variant='compact' />
						</Animated.View>
					))}
				</>
			)}

			{/* Browse More */}
			<Pressable
				style={styles.browseMoreButton}
				onPress={() => router.push('/(tabs)/explore')}
			>
				<Text style={styles.browseMoreText}>Browse More Projects</Text>
				<Ionicons name='arrow-forward' size={20} color={Colors.primary} />
			</Pressable>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.md,
	},
	greeting: {
		fontSize: 24,
		fontFamily: Fonts.bold,
		color: Colors.text,
	},
	subtitle: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: 2,
	},
	profileButton: {
		padding: 2,
	},
	headerActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.sm,
	},
	headerIconButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: Colors.surface,
		justifyContent: 'center',
		alignItems: 'center',
	},
	tabContainer: {
		flexDirection: 'row',
		paddingHorizontal: Spacing.lg,
		gap: Spacing.sm,
		marginBottom: Spacing.md,
	},
	tab: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: Spacing.xs,
		paddingVertical: Spacing.sm + 2,
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.md,
	},
	tabActive: {
		backgroundColor: `${Colors.primary}15`,
	},
	tabText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textTertiary,
	},
	tabTextActive: {
		color: Colors.primary,
	},
	tabBadge: {
		backgroundColor: Colors.primary,
		paddingHorizontal: 6,
		paddingVertical: 1,
		borderRadius: 10,
		minWidth: 20,
		alignItems: 'center',
	},
	tabBadgeText: {
		fontSize: 11,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	content: {
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: Spacing.lg,
		paddingBottom: Spacing.xxl,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 100,
	},

	// Empty state
	emptyState: {
		alignItems: 'center',
		paddingTop: 60,
		paddingHorizontal: Spacing.lg,
	},
	emptyIcon: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: Spacing.lg,
	},
	emptyTitle: {
		fontSize: 20,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginBottom: Spacing.sm,
	},
	emptyDescription: {
		fontSize: 15,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		textAlign: 'center',
		lineHeight: 22,
		marginBottom: Spacing.lg,
	},
	emptyButton: {
		minWidth: 180,
	},

	// Stats
	statsRow: {
		flexDirection: 'row',
		gap: Spacing.sm,
		marginBottom: Spacing.lg,
	},
	statCard: {
		flex: 1,
		alignItems: 'center',
		padding: Spacing.md,
	},
	statNumber: {
		fontSize: 24,
		fontFamily: Fonts.bold,
		color: Colors.text,
		marginTop: Spacing.xs,
	},
	statLabel: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},

	// Create project button
	createProjectButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.card,
		borderRadius: BorderRadius.md,
		padding: Spacing.md,
		marginBottom: Spacing.lg,
		borderWidth: 1,
		borderColor: Colors.border,
		borderStyle: 'dashed',
	},
	createProjectText: {
		flex: 1,
		fontSize: 15,
		fontFamily: Fonts.medium,
		color: Colors.primary,
		marginLeft: Spacing.sm,
	},

	// Section
	sectionTitle: {
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginBottom: Spacing.md,
	},

	// Pending card
	pendingCard: {
		marginBottom: Spacing.lg,
		backgroundColor: `${Colors.warning}10`,
		borderWidth: 1,
		borderColor: `${Colors.warning}30`,
	},
	pendingContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	pendingIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: `${Colors.warning}20`,
		alignItems: 'center',
		justifyContent: 'center',
	},
	pendingTextContainer: {
		flex: 1,
		marginLeft: Spacing.md,
	},
	pendingTitle: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	pendingDescription: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},

	// Browse more
	browseMoreButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: Spacing.sm,
		paddingVertical: Spacing.md,
		marginTop: Spacing.md,
	},
	browseMoreText: {
		fontSize: 15,
		fontFamily: Fonts.medium,
		color: Colors.primary,
	},
})
