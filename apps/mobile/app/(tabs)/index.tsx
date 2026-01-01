import { ProjectCard } from '@/components/project'
import { Avatar, Button, Card } from '@/components/ui'
import { BorderRadius, Colors, Fonts, Spacing } from '@/constants/theme'
import { mockConversations } from '@/data/mockData'
import { Conversation, Project } from '@/interfaces'
import { useAuthStore } from '@/stores/useAuthStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

type TabType = 'my-projects' | 'joined'

function shortenUsername(username: string) {
	const name = username.split(' ')[0]

	if (name.length > 10) {
		return name.slice(0, 10) + '...'
	}
	return name
}

function Budge({
	count,
	containerStyles,
	budgeStyles,
}: {
	count: number
	containerStyles?: ViewStyle
	budgeStyles?: TextStyle
}) {
	return (
		<View
			style={[
				{
					backgroundColor: Colors.primary,
					borderRadius: 10,
					paddingHorizontal: 6,
					paddingVertical: 1,
					minWidth: 20,
					alignItems: 'center',
					position: 'absolute',
					top: -8,
					right: -8,
				},
				containerStyles,
			]}
		>
			<Text
				style={[
					{
						fontSize: 11,
						fontFamily: Fonts.semibold,
						color: Colors.text,
					},
					budgeStyles,
				]}
			>
				{count}
			</Text>
		</View>
	)
}

export default function Home() {
	const [activeTab, setActiveTab] = useState<TabType>('my-projects')
	const [refreshing, setRefreshing] = useState(false)
	const [conversations] = useState<Conversation[]>(mockConversations)

	const totalUnread = conversations.reduce(
		(acc, conv) => acc + conv.unreadCount,
		0
	)

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

	const loadData = useCallback(async () => {
		if (!user?.id) return
		await Promise.all([
			fetchProjects(),
			fetchMyProjects(user.id),
			fetchJoinedProjects(user.id),
		])
	}, [user?.id, fetchProjects, fetchMyProjects, fetchJoinedProjects])

	useEffect(() => {
		loadData()
	}, [loadData])

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		await loadData()
		setRefreshing(false)
	}, [loadData])

	const showMyProjects = user?.role === 'creator' || user?.role === 'both'

	return (
		<SafeAreaView style={[styles.container]}>
			{/* Header */}
			<Animated.View
				entering={FadeInDown.duration(600).springify()}
				style={styles.header}
			>
				<View>
					<Text style={styles.greeting}>
						Hello,{' '}
						{user?.displayName
							? shortenUsername(user.displayName)
							: user?.username
							? shortenUsername(user.username)
							: 'there'}
						! 👋
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
						<Budge
							count={totalUnread}
							containerStyles={{
								marginRight: 10,
								position: 'absolute',
								top: 0,
								right: -5,
								zIndex: 10,
							}}
						/>
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
							name={
								user?.displayName
									? shortenUsername(user.displayName)
									: user?.username
									? shortenUsername(user.username)
									: undefined
							}
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
					<Text
						style={[
							styles.tabText,
							activeTab === 'joined' && styles.tabTextActive,
						]}
					>
						Joined Projects
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

			{/* FAB Button - only show on My Projects tab */}
			{showMyProjects && activeTab === 'my-projects' && (
				<Pressable
					style={styles.fab}
					onPress={() => router.push('/project/create')}
				>
					<Ionicons name='add' size={28} color={Colors.text} />
				</Pressable>
			)}
		</SafeAreaView>
	)
}

function MyProjectsTab({ projects }: { projects: Project[] }) {
	return (
		<FlatList
			data={projects}
			scrollEnabled={false}
			keyExtractor={(item: Project) => item.id}
			contentContainerStyle={styles.flatListContent}
			renderItem={({ item, index }: { item: Project; index: number }) => (
				<Animated.View
					entering={FadeInUp.duration(400)
						.delay(index * 100)
						.springify()}
				>
					<ProjectCard project={item} />
				</Animated.View>
			)}
			ListHeaderComponent={() => (
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
								{projects.reduce(
									(sum: number, p: Project) => sum + p.testerCount,
									0
								)}
							</Text>
							<Text style={styles.statLabel}>Testers</Text>
						</Card>
						<Card style={styles.statCard}>
							<Ionicons name='chatbubbles' size={24} color={Colors.warning} />
							<Text style={styles.statNumber}>
								{projects.reduce(
									(sum: number, p: Project) => sum + p.feedbackCount,
									0
								)}
							</Text>
							<Text style={styles.statLabel}>Feedback</Text>
						</Card>
					</View>

					{/* Projects List */}
					<Text style={styles.sectionTitle}>Your Projects</Text>
				</Animated.View>
			)}
			ListEmptyComponent={() => (
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
			)}
		/>
	)
}

function JoinedProjectsTab({
	projects,
	pendingCount,
}: {
	projects: Project[]
	pendingCount: number
}) {
	return (
		<FlatList
			data={projects}
			keyExtractor={(item: Project) => item.id}
			scrollEnabled={false}
			contentContainerStyle={styles.flatListContent}
			renderItem={({ item, index }: { item: Project; index: number }) => (
				<Animated.View
					entering={FadeInUp.duration(400)
						.delay(index * 100)
						.springify()}
				>
					<ProjectCard project={item} variant='compact' />
				</Animated.View>
			)}
			ListHeaderComponent={() => (
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
					<Text style={styles.sectionTitle}>Active Testing</Text>
				</Animated.View>
			)}
			ListEmptyComponent={() => (
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
			)}
		/>
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
		position: 'relative',
		width: 44,
		height: 44,
		borderRadius: 22,
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
		marginBottom: -Spacing.xxl - 10,
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

	fab: {
		position: 'absolute',
		bottom: Spacing.xl,
		right: Spacing.lg,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: Colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 5,
		shadowColor: Colors.primary,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3,
	},

	flatListContent: {
		paddingBottom: Spacing.lg,
	},

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
