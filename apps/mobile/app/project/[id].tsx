import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	Linking,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, {
	Extrapolation,
	FadeInUp,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	Avatar,
	Badge,
	Button,
	Card,
	ProjectStatusBadge,
} from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import { useProjectFeedback } from "@/queries/feedbackQueries";
import { useProject } from "@/queries/projectQueries";
import { useAuthStore } from "@/stores/useAuthStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 100;

export default function ProjectDetail() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [isJoining, setIsJoining] = useState(false);
	const insets = useSafeAreaInsets();
	const scrollY = useSharedValue(0);

	const { user } = useAuthStore();
	const { data: project } = useProject(id || "");
	const { data: feedbackData } = useProjectFeedback(id || "", {
		page: 1,
		limit: 10,
	});

	const projectFeedbacks = useMemo(() => {
		return feedbackData?.feedback || feedbackData || [];
	}, [feedbackData]);

	const isOwner = project?.ownerId === user?.id;
	const isTester = project?.members?.some(
		(m: any) => m.user?._id === user?.id || m.userId === user?.id,
	);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

	useEffect(() => {
		if (id) {
			fetchFeedbacks(id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	// Animated styles for header
	const headerAnimatedStyle = useAnimatedStyle(() => {
		const height = interpolate(
			scrollY.value,
			[0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
			Extrapolation.CLAMP,
		);
		return { height };
	});

	const imageAnimatedStyle = useAnimatedStyle(() => {
		const translateY = interpolate(
			scrollY.value,
			[-100, 0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[-50, 0, 50],
			Extrapolation.CLAMP,
		);
		const scale = interpolate(
			scrollY.value,
			[-100, 0],
			[1.5, 1],
			Extrapolation.CLAMP,
		);
		const opacity = interpolate(
			scrollY.value,
			[0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 50],
			[1, 0],
			Extrapolation.CLAMP,
		);
		return { transform: [{ translateY }, { scale }], opacity };
	});

	const titleAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[
				HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 60,
				HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
			],
			[0, 1],
			Extrapolation.CLAMP,
		);
		return { opacity };
	});

	const navBgStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 50],
			[0, 1],
			Extrapolation.CLAMP,
		);
		return { backgroundColor: `rgba(23, 23, 23, ${opacity})` };
	});

	const handleJoinProject = async () => {
		if (!user?.id || !project) return;

		setIsJoining(true);
		try {
			await joinProject(project.id, user.id);
			Alert.alert(
				"Request Sent!",
				`Your request to join ${project.name} has been submitted. You'll be notified once approved.`,
			);
		} catch {
			Alert.alert("Error", "Failed to join project. Please try again.");
		} finally {
			setIsJoining(false);
		}
	};

	const handleLeaveProject = () => {
		if (!user?.id || !project) return;

		Alert.alert(
			"Leave Project",
			`Are you sure you want to leave ${project.name}?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Leave",
					style: "destructive",
					onPress: async () => {
						await leaveProject(project.id, user.id);
					},
				},
			],
		);
	};

	const openLink = (url: string) => {
		Linking.openURL(url).catch(() => {
			Alert.alert("Error", "Could not open link");
		});
	};

	if (!project) {
		return (
			<View style={[styles.container, { paddingTop: insets.top }]}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={Colors.primary} />
				</View>
			</View>
		);
	}

	const images = project.screenshots?.length
		? project.screenshots
		: [project.icon];

	return (
		<View style={styles.container}>
			{/* Animated Header */}
			<Animated.View style={[styles.header, headerAnimatedStyle]}>
				{/* Image Gallery */}
				<Animated.View style={[styles.imageGallery, imageAnimatedStyle]}>
					<Animated.ScrollView
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						onScroll={(e) => {
							const index = Math.round(
								e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
							);
							setActiveImageIndex(index);
						}}
						scrollEventThrottle={16}
					>
						{images.map((uri, index) => (
							<Image
								key={index}
								source={{ uri }}
								style={styles.galleryImage}
								contentFit="cover"
								transition={300}
							/>
						))}
					</Animated.ScrollView>

					{/* Pagination Dots */}
					{images.length > 1 && (
						<View style={styles.pagination}>
							{images.map((_, index) => (
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

				{/* Gradient Overlay */}
				<View style={styles.gradientOverlay} />

				{/* Navigation Bar */}
				<Animated.View
					style={[
						styles.navBar,
						{ paddingTop: insets.top + Spacing.sm },
						navBgStyle,
					]}
				>
					<Pressable style={styles.navButton} onPress={() => router.back()}>
						<Ionicons name="arrow-back" size={24} color={Colors.text} />
					</Pressable>

					<Animated.Text
						style={[styles.headerTitle, titleAnimatedStyle]}
						numberOfLines={1}
					>
						{project.name}
					</Animated.Text>

					<View style={styles.headerActions}>
						<Pressable style={styles.navButton}>
							<Ionicons name="share-outline" size={22} color={Colors.text} />
						</Pressable>
						{isOwner && (
							<Pressable
								style={styles.navButton}
								onPress={() => router.push(`/project/${id}/edit`)}
							>
								<Ionicons
									name="settings-outline"
									size={22}
									color={Colors.text}
								/>
							</Pressable>
						)}
					</View>
				</Animated.View>
			</Animated.View>

			{/* Scrollable Content */}
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
				{/* Project Info */}
				<Animated.View
					entering={FadeInUp.duration(600).delay(100).springify()}
					style={styles.projectInfo}
				>
					<View style={styles.projectHeader}>
						<Image
							source={{ uri: project.icon }}
							style={styles.projectIcon}
							contentFit="cover"
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
							<Badge key={tech} label={tech} size="sm" />
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
								size="md"
							/>
							<View style={styles.ownerDetails}>
								<Text style={styles.ownerName}>{project.ownerName}</Text>
								<Text style={styles.ownerLabel}>Project Creator</Text>
							</View>
						</View>
						{!isOwner && (
							<Pressable style={styles.messageButton}>
								<Ionicons
									name="chatbubble-outline"
									size={20}
									color={Colors.primary}
								/>
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
						<Ionicons name="people" size={22} color={Colors.primary} />
						<Text style={styles.statValue}>{project.testerCount}</Text>
						<Text style={styles.statLabel}>Testers</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statItem}>
						<Ionicons name="chatbubbles" size={22} color={Colors.success} />
						<Text style={styles.statValue}>{project.feedbackCount}</Text>
						<Text style={styles.statLabel}>Feedback</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statItem}>
						<Ionicons name="star" size={22} color={Colors.warning} />
						<Text style={styles.statValue}>
							{project.rating?.toFixed(1) || "N/A"}
						</Text>
						<Text style={styles.statLabel}>Rating</Text>
					</View>
				</Animated.View>

				{/* Links */}
				{project.links && (
					<Animated.View
						entering={FadeInUp.duration(600).delay(500).springify()}
					>
						<Text style={styles.sectionTitle}>Links</Text>
						<Card style={styles.linksCard}>
							{project.links.website && (
								<Pressable
									style={styles.linkItem}
									onPress={() => openLink(project.links?.website!)}
								>
									<Ionicons
										name="globe-outline"
										size={20}
										color={Colors.primary}
									/>
									<Text style={styles.linkText}>Website</Text>
									<Ionicons
										name="open-outline"
										size={18}
										color={Colors.textTertiary}
									/>
								</Pressable>
							)}
							{project.links.github && (
								<Pressable
									style={styles.linkItem}
									onPress={() => openLink(project.links?.github!)}
								>
									<Ionicons name="logo-github" size={20} color={Colors.text} />
									<Text style={styles.linkText}>GitHub</Text>
									<Ionicons
										name="open-outline"
										size={18}
										color={Colors.textTertiary}
									/>
								</Pressable>
							)}
							{project.links.appStore && (
								<Pressable
									style={styles.linkItem}
									onPress={() => openLink(project.links?.appStore!)}
								>
									<Ionicons
										name="logo-apple-appstore"
										size={20}
										color={Colors.primary}
									/>
									<Text style={styles.linkText}>App Store</Text>
									<Ionicons
										name="open-outline"
										size={18}
										color={Colors.textTertiary}
									/>
								</Pressable>
							)}
							{project.links.playStore && (
								<Pressable
									style={styles.linkItem}
									onPress={() => openLink(project.links?.playStore!)}
								>
									<Ionicons
										name="logo-google-playstore"
										size={20}
										color={Colors.success}
									/>
									<Text style={styles.linkText}>Play Store</Text>
									<Ionicons
										name="open-outline"
										size={18}
										color={Colors.textTertiary}
									/>
								</Pressable>
							)}
							{project.links.testFlight && (
								<Pressable
									style={styles.linkItem}
									onPress={() => openLink(project.links?.testFlight!)}
								>
									<Ionicons
										name="paper-plane-outline"
										size={20}
										color={Colors.primary}
									/>
									<Text style={styles.linkText}>TestFlight</Text>
									<Ionicons
										name="open-outline"
										size={18}
										color={Colors.textTertiary}
									/>
								</Pressable>
							)}
							{/* In-app Links */}
							<View style={styles.linkDivider} />
							<Pressable
								style={styles.linkItem}
								onPress={() => router.push(`/project/${id}/releases`)}
							>
								<Ionicons
									name="rocket-outline"
									size={20}
									color={Colors.warning}
								/>
								<Text style={styles.linkText}>Releases</Text>
								<Ionicons
									name="chevron-forward"
									size={18}
									color={Colors.textTertiary}
								/>
							</Pressable>
							<Pressable
								style={styles.linkItem}
								onPress={() => router.push(`/project/${id}/members`)}
							>
								<Ionicons name="people-outline" size={20} color={Colors.info} />
								<Text style={styles.linkText}>Members</Text>
								<Ionicons
									name="chevron-forward"
									size={18}
									color={Colors.textTertiary}
								/>
							</Pressable>
						</Card>
					</Animated.View>
				)}

				{/* Recent Feedback */}
				{(isOwner || isTester) && projectFeedbacks.length > 0 && (
					<Animated.View
						entering={FadeInUp.duration(600).delay(600).springify()}
					>
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
								onPress={() => router.push(`/feedback/detail/${feedback.id}`)}
							>
								<View style={styles.feedbackHeader}>
									<Badge
										label={feedback.type}
										variant={
											feedback.type === "bug"
												? "error"
												: feedback.type === "feature"
													? "purple"
													: "default"
										}
										size="sm"
									/>
									<Badge
										label={feedback.status}
										variant={
											feedback.status === "resolved"
												? "success"
												: feedback.status === "in-progress"
													? "warning"
													: "default"
										}
										size="sm"
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
				<View style={{ height: 120 }} />
			</Animated.ScrollView>

			{/* Bottom Action */}
			<Animated.View
				entering={FadeInUp.duration(600).delay(300).springify()}
				style={[
					styles.bottomAction,
					{ paddingBottom: insets.bottom + Spacing.md },
				]}
			>
				{isOwner ? (
					<View style={styles.ownerActions}>
						<Button
							title="View Feedback"
							variant="outline"
							onPress={() => router.push(`/feedback/${id}`)}
							style={styles.ownerButton}
							icon={
								<Ionicons name="chatbubbles" size={18} color={Colors.primary} />
							}
						/>
						{/* <Button
							title='Manage Testers'
							onPress={() => router.push(`/project/${id}/testers`)}
							style={styles.ownerButton}
							icon={<Ionicons name='people' size={18} color={Colors.text} />}
						/> */}
						<Button
							title="Manage Testers"
							onPress={() => router.push("/users")}
							style={styles.ownerButton}
							icon={<Ionicons name="people" size={18} color={Colors.text} />}
						/>
					</View>
				) : isTester ? (
					<View style={styles.testerActions}>
						<Button
							title="Leave Project"
							variant="outline"
							onPress={handleLeaveProject}
							style={styles.leaveButton}
						/>
						<Button
							title="Submit Feedback"
							onPress={() => router.push(`/feedback/create?projectId=${id}`)}
							style={styles.feedbackButton}
							icon={<Ionicons name="add" size={20} color={Colors.text} />}
						/>
					</View>
				) : (
					<Button
						title={isJoining ? "Requesting..." : "Request to Join"}
						onPress={handleJoinProject}
						loading={isJoining}
						icon={
							!isJoining && (
								<Ionicons name="enter-outline" size={20} color={Colors.text} />
							)
						}
					/>
				)}
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: Spacing.lg,
	},

	// Header
	header: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
		overflow: "hidden",
	},
	imageGallery: {
		...StyleSheet.absoluteFillObject,
	},
	galleryImage: {
		width: SCREEN_WIDTH,
		height: HEADER_MAX_HEIGHT,
	},
	pagination: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 6,
		position: "absolute",
		bottom: 60,
		left: 0,
		right: 0,
	},
	paginationDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "rgba(255,255,255,0.5)",
	},
	paginationDotActive: {
		backgroundColor: Colors.text,
		width: 20,
	},
	gradientOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.2)",
	},
	navBar: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: Spacing.md,
		paddingBottom: Spacing.sm,
	},
	navButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(0,0,0,0.3)",
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		flex: 1,
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		textAlign: "center",
		marginHorizontal: Spacing.sm,
	},
	headerActions: {
		flexDirection: "row",
		gap: Spacing.xs,
	},

	// Project Info
	projectInfo: {
		marginBottom: Spacing.lg,
	},
	projectHeader: {
		flexDirection: "row",
		alignItems: "center",
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
		flexDirection: "row",
		flexWrap: "wrap",
		gap: Spacing.xs,
		marginTop: Spacing.md,
	},

	// Owner Card
	ownerCard: {
		marginBottom: Spacing.lg,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	ownerInfo: {
		flexDirection: "row",
		alignItems: "center",
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
		alignItems: "center",
		justifyContent: "center",
	},

	// Stats
	statsContainer: {
		flexDirection: "row",
		backgroundColor: Colors.card,
		marginBottom: Spacing.lg,
		borderRadius: BorderRadius.md,
		padding: Spacing.md,
	},
	statItem: {
		flex: 1,
		alignItems: "center",
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
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: Spacing.sm,
	},
	sectionTitle: {
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginBottom: Spacing.sm,
	},
	seeAllText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.primary,
	},

	// Links
	linksCard: {
		marginBottom: Spacing.lg,
		padding: 0,
	},
	linkItem: {
		flexDirection: "row",
		alignItems: "center",
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
	linkDivider: {
		height: 1,
		backgroundColor: Colors.border,
		marginVertical: Spacing.xs,
	},

	// Feedback
	feedbackCard: {
		marginBottom: Spacing.sm,
	},
	feedbackHeader: {
		flexDirection: "row",
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
		position: "absolute",
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
		flexDirection: "row",
		gap: Spacing.sm,
	},
	ownerButton: {
		flex: 1,
	},
	testerActions: {
		flexDirection: "row",
		gap: Spacing.sm,
	},
	leaveButton: {
		flex: 0.4,
	},
	feedbackButton: {
		flex: 0.6,
	},
});
