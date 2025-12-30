import { Avatar, Badge, Button, Card, ProjectStatusBadge } from '@/components/ui'
import { BorderRadius, Colors, Fonts, Spacing } from '@/constants/theme'
import { useAuthStore } from '@/stores/useAuthStore'
import { useFeedbackStore } from '@/stores/useFeedbackStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import Animated, {
    FadeInDown,
    FadeInUp
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const IMAGE_HEIGHT = 220

export default function ProjectDetail() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const [activeImageIndex, setActiveImageIndex] = useState(0)
	const [isJoining, setIsJoining] = useState(false)

	const { user } = useAuthStore()
	const { projects, joinedProjects, joinProject, leaveProject } = useProjectStore()
	const { feedbacks, fetchFeedbacks } = useFeedbackStore()

	const project = useMemo(() => projects.find((p) => p.id === id), [projects, id])

	const isOwner = project?.ownerId === user?.id
	const isTester = joinedProjects.some((p) => p.id === id)
	const projectFeedbacks = feedbacks.filter((f) => f.projectId === id)

	useEffect(() => {
		if (id) {
			fetchFeedbacks(id)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])

	const handleJoinProject = async () => {
		if (!user?.id || !project) return

		setIsJoining(true)
		try {
			await joinProject(project.id, user.id)
			Alert.alert(
				'Request Sent!',
				`Your request to join ${project.name} has been submitted. You'll be notified once approved.`
			)
		} catch {
			Alert.alert('Error', 'Failed to join project. Please try again.')
		} finally {
			setIsJoining(false)
		}
	}

	const handleLeaveProject = () => {
		if (!user?.id || !project) return

		Alert.alert(
			'Leave Project',
			`Are you sure you want to leave ${project.name}?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Leave',
					style: 'destructive',
					onPress: async () => {
						await leaveProject(project.id, user.id)
					},
				},
			]
		)
	}

	const openLink = (url: string) => {
		Linking.openURL(url).catch(() => {
			Alert.alert('Error', 'Could not open link')
		})
	}

	if (!project) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size='large' color={Colors.primary} />
				</View>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{/* Header with back button */}
				<Animated.View
					entering={FadeInDown.duration(600).springify()}
					style={styles.header}
				>
					<Pressable style={styles.backButton} onPress={() => router.back()}>
						<Ionicons name='arrow-back' size={24} color={Colors.text} />
					</Pressable>
					<View style={styles.headerActions}>
						<Pressable style={styles.headerAction}>
							<Ionicons name='share-outline' size={22} color={Colors.text} />
						</Pressable>
						{isOwner && (
							<Pressable
								style={styles.headerAction}
								onPress={() => router.push(`/project/${id}/edit`)}
							>
								<Ionicons name='settings-outline' size={22} color={Colors.text} />
							</Pressable>
						)}
					</View>
				</Animated.View>

				{/* Image Gallery */}
				<Animated.View
					entering={FadeInUp.duration(600).delay(100).springify()}
					style={styles.imageGallery}
				>
					<ScrollView
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						onScroll={(e) => {
							const index = Math.round(
								e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - Spacing.lg * 2)
							)
							setActiveImageIndex(index)
						}}
						scrollEventThrottle={16}
					>
						{(project.screenshots?.length ? project.screenshots : [project.icon]).map(
							(uri, index) => (
								<Image
									key={index}
									source={{ uri }}
									style={styles.galleryImage}
									contentFit='cover'
									transition={300}
								/>
							)
						)}
					</ScrollView>

					{/* Pagination Dots */}
					{(project.screenshots?.length || 0) > 1 && (
						<View style={styles.pagination}>
							{project.screenshots?.map((_, index) => (
								<View
									key={index}
									style={[
										styles.paginationDot,
										activeImageIndex === index && styles.paginationDotActive,
									]}
								/>
							))}
						</View>
					)}
				</Animated.View>

				{/* Project Info */}
				<Animated.View
					entering={FadeInUp.duration(600).delay(200).springify()}
					style={styles.projectInfo}
				>
					<View style={styles.projectHeader}>
						<Image
							source={{ uri: project.icon }}
							style={styles.projectIcon}
							contentFit='cover'
						/>
						<View style={styles.projectTitleContainer}>
							<Text style={styles.projectName}>{project.name}</Text>
							<ProjectStatusBadge status={project.status} />
						</View>
					</View>

					<Text style={styles.projectDescription}>{project.description}</Text>

					{/* Tech Stack */}
					<View style={styles.techStack}>
						{project.techStack.map((tech) => (
							<Badge key={tech} label={tech} size='sm' />
						))}
					</View>
				</Animated.View>

				{/* Owner Info */}
				<Animated.View entering={FadeInUp.duration(600).delay(300).springify()}>
					<Card style={styles.ownerCard}>
						<View style={styles.ownerInfo}>
							<Avatar
								source={project.ownerAvatar}
								name={project.ownerName}
								size='md'
							/>
							<View style={styles.ownerDetails}>
								<Text style={styles.ownerName}>{project.ownerName}</Text>
								<Text style={styles.ownerLabel}>Project Creator</Text>
							</View>
						</View>
						{!isOwner && (
							<Pressable style={styles.messageButton}>
								<Ionicons name='chatbubble-outline' size={20} color={Colors.primary} />
							</Pressable>
						)}
					</Card>
				</Animated.View>

				{/* Stats */}
				<Animated.View
					entering={FadeInUp.duration(600).delay(400).springify()}
					style={styles.statsContainer}
				>
					<View style={styles.statItem}>
						<Ionicons name='people' size={22} color={Colors.primary} />
						<Text style={styles.statValue}>{project.testerCount}</Text>
						<Text style={styles.statLabel}>Testers</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statItem}>
						<Ionicons name='chatbubbles' size={22} color={Colors.success} />
						<Text style={styles.statValue}>{project.feedbackCount}</Text>
						<Text style={styles.statLabel}>Feedback</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statItem}>
						<Ionicons name='star' size={22} color={Colors.warning} />
						<Text style={styles.statValue}>{project.rating?.toFixed(1) || 'N/A'}</Text>
						<Text style={styles.statLabel}>Rating</Text>
					</View>
				</Animated.View>

				{/* Links */}
				{project.links && (
					<Animated.View entering={FadeInUp.duration(600).delay(500).springify()}>
						<Text style={styles.sectionTitle}>Links</Text>
						<Card style={styles.linksCard}>
							{project.links.website && (
								<Pressable
									style={styles.linkItem}
									onPress={() => openLink(project.links!.website!)}
								>
									<Ionicons name='globe-outline' size={20} color={Colors.primary} />
									<Text style={styles.linkText}>Website</Text>
									<Ionicons name='open-outline' size={18} color={Colors.textTertiary} />
								</Pressable>
							)}
							{project.links.github && (
								<Pressable
									style={styles.linkItem}
									onPress={() => openLink(project.links!.github!)}
								>
									<Ionicons name='logo-github' size={20} color={Colors.text} />
									<Text style={styles.linkText}>GitHub</Text>
									<Ionicons name='open-outline' size={18} color={Colors.textTertiary} />
								</Pressable>
							)}
							{project.links.appStore && (
								<Pressable
									style={styles.linkItem}
									onPress={() => openLink(project.links!.appStore!)}
								>
									<Ionicons name='logo-apple-appstore' size={20} color={Colors.primary} />
									<Text style={styles.linkText}>App Store</Text>
									<Ionicons name='open-outline' size={18} color={Colors.textTertiary} />
								</Pressable>
							)}
							{project.links.playStore && (
								<Pressable
									style={styles.linkItem}
									onPress={() => openLink(project.links!.playStore!)}
								>
									<Ionicons name='logo-google-playstore' size={20} color={Colors.success} />
									<Text style={styles.linkText}>Play Store</Text>
									<Ionicons name='open-outline' size={18} color={Colors.textTertiary} />
								</Pressable>
							)}
							{project.links.testFlight && (
								<Pressable
									style={styles.linkItem}
									onPress={() => openLink(project.links!.testFlight!)}
								>
									<Ionicons name='paper-plane-outline' size={20} color={Colors.primary} />
									<Text style={styles.linkText}>TestFlight</Text>
									<Ionicons name='open-outline' size={18} color={Colors.textTertiary} />
								</Pressable>
							)}
						</Card>
					</Animated.View>
				)}

				{/* Recent Feedback */}
				{(isOwner || isTester) && projectFeedbacks.length > 0 && (
					<Animated.View entering={FadeInUp.duration(600).delay(600).springify()}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Recent Feedback</Text>
							<Pressable onPress={() => router.push(`/feedback/${id}`)}>
								<Text style={styles.seeAllText}>See All</Text>
							</Pressable>
						</View>
						{projectFeedbacks.slice(0, 3).map((feedback) => (
							<Card
								key={feedback.id}
								style={styles.feedbackCard}
								onPress={() => router.push(`/feedback/${feedback.id}`)}
							>
								<View style={styles.feedbackHeader}>
									<Badge
										label={feedback.type}
										variant={
											feedback.type === 'bug'
												? 'error'
												: feedback.type === 'feature'
													? 'purple'
													: 'default'
										}
										size='sm'
									/>
									<Badge
										label={feedback.status}
										variant={
											feedback.status === 'resolved'
												? 'success'
												: feedback.status === 'in-progress'
													? 'warning'
													: 'default'
										}
										size='sm'
									/>
								</View>
								<Text style={styles.feedbackTitle} numberOfLines={1}>
									{feedback.title}
								</Text>
								<Text style={styles.feedbackDescription} numberOfLines={2}>
									{feedback.description}
								</Text>
							</Card>
						))}
					</Animated.View>
				)}

				{/* Spacer for bottom action */}
				<View style={{ height: 100 }} />
			</ScrollView>

			{/* Bottom Action */}
			<Animated.View
				entering={FadeInUp.duration(600).delay(300).springify()}
				style={styles.bottomAction}
			>
				{isOwner ? (
					<View style={styles.ownerActions}>
						<Button
							title='View Feedback'
							variant='outline'
							onPress={() => router.push(`/feedback/${id}`)}
							style={styles.ownerButton}
							icon={<Ionicons name='chatbubbles' size={18} color={Colors.primary} />}
						/>
						<Button
							title='Manage Testers'
							onPress={() => router.push(`/project/${id}/testers`)}
							style={styles.ownerButton}
							icon={<Ionicons name='people' size={18} color={Colors.text} />}
						/>
					</View>
				) : isTester ? (
					<View style={styles.testerActions}>
						<Button
							title='Leave Project'
							variant='outline'
							onPress={handleLeaveProject}
							style={styles.leaveButton}
						/>
						<Button
							title='Submit Feedback'
							onPress={() => router.push(`/feedback/create?projectId=${id}`)}
							style={styles.feedbackButton}
							icon={<Ionicons name='add' size={20} color={Colors.text} />}
						/>
					</View>
				) : (
					<Button
						title={isJoining ? 'Requesting...' : 'Request to Join'}
						onPress={handleJoinProject}
						loading={isJoining}
						icon={
							!isJoining && (
								<Ionicons name='enter-outline' size={20} color={Colors.text} />
							)
						}
					/>
				)}
			</Animated.View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	scrollView: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerActions: {
		flexDirection: 'row',
		gap: Spacing.sm,
	},
	headerAction: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: 'center',
		justifyContent: 'center',
	},

	// Image Gallery
	imageGallery: {
		marginHorizontal: Spacing.lg,
		marginBottom: Spacing.lg,
		borderRadius: BorderRadius.lg,
		overflow: 'hidden',
	},
	galleryImage: {
		width: SCREEN_WIDTH - Spacing.lg * 2,
		height: IMAGE_HEIGHT,
	},
	pagination: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 6,
		position: 'absolute',
		bottom: 12,
		left: 0,
		right: 0,
	},
	paginationDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: 'rgba(255,255,255,0.5)',
	},
	paginationDotActive: {
		backgroundColor: Colors.text,
		width: 20,
	},

	// Project Info
	projectInfo: {
		paddingHorizontal: Spacing.lg,
		marginBottom: Spacing.lg,
	},
	projectHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: Spacing.md,
	},
	projectIcon: {
		width: 56,
		height: 56,
		borderRadius: BorderRadius.md,
	},
	projectTitleContainer: {
		flex: 1,
		marginLeft: Spacing.md,
	},
	projectName: {
		fontSize: 24,
		fontFamily: Fonts.bold,
		color: Colors.text,
		marginBottom: 4,
	},
	projectDescription: {
		fontSize: 15,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		lineHeight: 22,
	},
	techStack: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: Spacing.xs,
		marginTop: Spacing.md,
	},

	// Owner Card
	ownerCard: {
		marginHorizontal: Spacing.lg,
		marginBottom: Spacing.lg,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	ownerInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	ownerDetails: {
		marginLeft: Spacing.md,
	},
	ownerName: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	ownerLabel: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
	messageButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: `${Colors.primary}15`,
		alignItems: 'center',
		justifyContent: 'center',
	},

	// Stats
	statsContainer: {
		flexDirection: 'row',
		backgroundColor: Colors.card,
		marginHorizontal: Spacing.lg,
		marginBottom: Spacing.lg,
		borderRadius: BorderRadius.md,
		padding: Spacing.md,
	},
	statItem: {
		flex: 1,
		alignItems: 'center',
	},
	statValue: {
		fontSize: 20,
		fontFamily: Fonts.bold,
		color: Colors.text,
		marginTop: 4,
	},
	statLabel: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
	statDivider: {
		width: 1,
		backgroundColor: Colors.border,
	},

	// Section
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: Spacing.lg,
		marginBottom: Spacing.sm,
	},
	sectionTitle: {
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		paddingHorizontal: Spacing.lg,
		marginBottom: Spacing.sm,
	},
	seeAllText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.primary,
	},

	// Links
	linksCard: {
		marginHorizontal: Spacing.lg,
		marginBottom: Spacing.lg,
		padding: 0,
	},
	linkItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: Spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	linkText: {
		flex: 1,
		fontSize: 15,
		fontFamily: Fonts.medium,
		color: Colors.text,
		marginLeft: Spacing.md,
	},

	// Feedback
	feedbackCard: {
		marginHorizontal: Spacing.lg,
		marginBottom: Spacing.sm,
	},
	feedbackHeader: {
		flexDirection: 'row',
		gap: Spacing.xs,
		marginBottom: Spacing.xs,
	},
	feedbackTitle: {
		fontSize: 15,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginBottom: 4,
	},
	feedbackDescription: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		lineHeight: 18,
	},

	// Bottom Action
	bottomAction: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: Colors.background,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
		paddingHorizontal: Spacing.lg,
		paddingTop: Spacing.md,
		paddingBottom: Spacing.xl,
	},
	ownerActions: {
		flexDirection: 'row',
		gap: Spacing.sm,
	},
	ownerButton: {
		flex: 1,
	},
	testerActions: {
		flexDirection: 'row',
		gap: Spacing.sm,
	},
	leaveButton: {
		flex: 0.4,
	},
	feedbackButton: {
		flex: 0.6,
	},
})
