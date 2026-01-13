import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import Animated, {
	Extrapolation,
	FadeInUp,
	interpolate,
	SlideInUp,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Card } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import type { Feedback } from "@/interfaces";
import {
	useCreateComment,
	useFeedback,
	useFeedbackComments,
	useVoteFeedback,
} from "@/queries/feedbackQueries";
import { useAuthStore } from "@/stores/useAuthStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 80;

export default function FeedbackDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const insets = useSafeAreaInsets();
	const scrollY = useSharedValue(0);
	const [commentText, setCommentText] = useState("");
	const [imageModalVisible, setImageModalVisible] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const { user } = useAuthStore();
	const { data: feedback, isLoading } = useFeedback(id || "");
	const { data: commentsData } = useFeedbackComments(id || "");
	const createCommentMutation = useCreateComment();
	const voteFeedbackMutation = useVoteFeedback();

	const comments = useMemo(() => {
		return commentsData?.comments || commentsData || [];
	}, [commentsData]);

	const feedbackUser = useMemo(() => {
		return (
			feedback?.user || {
				id: "unknown",
				username: "unknown",
				displayName: "Unknown User",
				email: "unknown@example.com",
				role: "tester" as const,
				stats: {
					projectsCreated: 0,
					projectsTested: 0,
					feedbackGiven: 0,
					feedbackReceived: 0,
				},
				createdAt: new Date(),
			}
		);
	}, [feedback]);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

	const headerAnimatedStyle = useAnimatedStyle(() => {
		const height = interpolate(
			scrollY.value,
			[0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
			Extrapolation.CLAMP,
		);
		return { height };
	});

	const headerTitleStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[20, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[0, 1],
			Extrapolation.CLAMP,
		);
		return { opacity };
	});

	const getTypeIcon = (type: Feedback["type"]) => {
		switch (type) {
			case "bug":
				return "bug";
			case "feature":
				return "bulb";
			case "improvement":
				return "trending-up";
			case "praise":
				return "heart";
			default:
				return "chatbubble";
		}
	};

	const getTypeColor = (type: Feedback["type"]) => {
		switch (type) {
			case "bug":
				return Colors.error;
			case "feature":
				return Colors.primary;
			case "improvement":
				return Colors.warning;
			case "praise":
				return Colors.success;
			default:
				return Colors.textSecondary;
		}
	};

	const getStatusColor = (status: Feedback["status"]) => {
		switch (status) {
			case "open":
			case "pending":
				return Colors.textSecondary;
			case "in-progress":
				return Colors.warning;
			case "resolved":
				return Colors.success;
			case "closed":
				return Colors.error;
			default:
				return Colors.textSecondary;
		}
	};

	const getPriorityColor = (priority?: string) => {
		switch (priority) {
			case "critical":
				return Colors.error;
			case "high":
				return Colors.warning;
			case "medium":
				return Colors.primary;
			case "low":
				return Colors.textTertiary;
			default:
				return Colors.textSecondary;
		}
	};

	const handleVote = async (voteType: "up" | "down") => {
		if (!user?.id || !feedback) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		try {
			await voteFeedbackMutation.mutateAsync({
				feedbackId: feedback.id,
				voteType,
			});
		} catch (error) {
			console.error("Error voting:", error);
		}
	};

	const handleAddComment = async () => {
		if (!commentText.trim() || !feedback) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		try {
			await createCommentMutation.mutateAsync({
				feedbackId: feedback.id,
				content: commentText.trim(),
			});
			setCommentText("");
		} catch (error) {
			console.error("Error adding comment:", error);
		}
	};

	const openImageModal = (index: number) => {
		setSelectedImageIndex(index);
		setImageModalVisible(true);
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit",
		});
	};

	if (isLoading) {
		return (
			<View style={[styles.container, styles.centerContent]}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	if (!feedback) {
		return (
			<View style={[styles.container, styles.centerContent]}>
				<Text style={styles.errorText}>Feedback not found</Text>
			</View>
		);
	}

	const typeColor = getTypeColor(feedback.type);
	const statusColor = getStatusColor(feedback.status);

	return (
		<View style={styles.container}>
			{/* Header */}
			<Animated.View style={[styles.header, headerAnimatedStyle]}>
				<LinearGradient
					colors={[`${typeColor}30`, Colors.background]}
					style={styles.headerGradient}
				/>
				<View style={[styles.navBar, { paddingTop: insets.top }]}>
					<Pressable style={styles.navButton} onPress={() => router.back()}>
						<Ionicons name="arrow-back" size={24} color={Colors.text} />
					</Pressable>
					<Animated.Text
						style={[styles.headerTitle, headerTitleStyle]}
						numberOfLines={1}
					>
						{feedback.title}
					</Animated.Text>
					<Pressable style={styles.navButton}>
						<Ionicons
							name="ellipsis-horizontal"
							size={22}
							color={Colors.text}
						/>
					</Pressable>
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
				{/* Type & Status Badges */}
				<Animated.View
					entering={FadeInUp.duration(300).delay(100)}
					style={styles.badges}
				>
					<View
						style={[styles.typeBadge, { backgroundColor: `${typeColor}15` }]}
					>
						<Ionicons
							name={getTypeIcon(feedback.type) as any}
							size={16}
							color={typeColor}
						/>
						<Text style={[styles.typeBadgeText, { color: typeColor }]}>
							{feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
						</Text>
					</View>
					<View
						style={[
							styles.statusBadge,
							{ backgroundColor: `${statusColor}15` },
						]}
					>
						<View
							style={[styles.statusDot, { backgroundColor: statusColor }]}
						/>
						<Text style={[styles.statusBadgeText, { color: statusColor }]}>
							{(feedback.status || "pending").replace("-", " ")}
						</Text>
					</View>
					{feedback.priority && (
						<View
							style={[
								styles.priorityBadge,
								{ backgroundColor: `${getPriorityColor(feedback.priority)}15` },
							]}
						>
							<Ionicons
								name="flag"
								size={14}
								color={getPriorityColor(feedback.priority)}
							/>
							<Text
								style={[
									styles.priorityText,
									{ color: getPriorityColor(feedback.priority) },
								]}
							>
								{feedback.priority}
							</Text>
						</View>
					)}
				</Animated.View>

				{/* Title */}
				<Animated.View entering={FadeInUp.duration(300).delay(150)}>
					<Text style={styles.title}>{feedback.title}</Text>
				</Animated.View>

				{/* Author Info */}
				<Animated.View
					entering={FadeInUp.duration(300).delay(200)}
					style={styles.authorCard}
				>
					<Pressable
						style={styles.authorInfo}
						onPress={() => router.push(`/user/${feedbackUser.id}`)}
					>
						<Avatar
							source={feedbackUser.avatar}
							name={feedbackUser.displayName || feedbackUser.username}
							size="md"
						/>
						<View style={styles.authorDetails}>
							<Text style={styles.authorName}>
								{feedbackUser.displayName || feedbackUser.username}
							</Text>
							<Text style={styles.authorDate}>
								{formatDate(feedback.createdAt)}
							</Text>
						</View>
					</Pressable>
				</Animated.View>

				{/* Description */}
				<Animated.View entering={FadeInUp.duration(300).delay(250)}>
					<Card style={styles.descriptionCard}>
						<Text style={styles.description}>{feedback.description}</Text>
					</Card>
				</Animated.View>

				{/* Screenshots */}
				{feedback.screenshots && feedback.screenshots.length > 0 && (
					<Animated.View entering={FadeInUp.duration(300).delay(300)}>
						<Text style={styles.sectionTitle}>Screenshots</Text>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							style={styles.screenshotsScroll}
						>
							{feedback.screenshots.map((uri: string, index: number) => (
								<Pressable key={index} onPress={() => openImageModal(index)}>
									<Image
										source={{ uri }}
										style={styles.screenshot}
										contentFit="cover"
									/>
								</Pressable>
							))}
						</ScrollView>
					</Animated.View>
				)}

				{/* Device Info */}
				{feedback.deviceInfo && (
					<Animated.View entering={FadeInUp.duration(300).delay(350)}>
						<Card style={styles.deviceCard}>
							<View style={styles.deviceHeader}>
								<Ionicons
									name="phone-portrait"
									size={20}
									color={Colors.primary}
								/>
								<Text style={styles.deviceTitle}>Device Information</Text>
							</View>
							<View style={styles.deviceGrid}>
								<View style={styles.deviceItem}>
									<Text style={styles.deviceLabel}>Platform</Text>
									<Text style={styles.deviceValue}>
										{feedback.deviceInfo.platform === "ios" ? "iOS" : "Android"}
									</Text>
								</View>
								<View style={styles.deviceItem}>
									<Text style={styles.deviceLabel}>OS Version</Text>
									<Text style={styles.deviceValue}>
										{feedback.deviceInfo.osVersion}
									</Text>
								</View>
								<View style={styles.deviceItem}>
									<Text style={styles.deviceLabel}>Device</Text>
									<Text style={styles.deviceValue}>
										{feedback.deviceInfo.deviceModel}
									</Text>
								</View>
								<View style={styles.deviceItem}>
									<Text style={styles.deviceLabel}>App Version</Text>
									<Text style={styles.deviceValue}>
										{feedback.deviceInfo.appVersion}
									</Text>
								</View>
							</View>
						</Card>
					</Animated.View>
				)}

				{/* Votes */}
				<Animated.View entering={FadeInUp.duration(300).delay(400)}>
					<Card style={styles.votesCard}>
						<View style={styles.votesRow}>
							<Pressable
								style={styles.voteButton}
								onPress={() => handleVote("up")}
							>
								<Ionicons name="arrow-up" size={24} color={Colors.success} />
								<Text style={[styles.voteCount, { color: Colors.success }]}>
									{feedback.upvotes || 0}
								</Text>
							</Pressable>
							<View style={styles.voteDivider} />
							<Pressable
								style={styles.voteButton}
								onPress={() => handleVote("down")}
							>
								<Ionicons name="arrow-down" size={24} color={Colors.error} />
								<Text style={[styles.voteCount, { color: Colors.error }]}>
									{feedback.downvotes || 0}
								</Text>
							</Pressable>
						</View>
					</Card>
				</Animated.View>

				{/* Comments Section */}
				<Animated.View entering={FadeInUp.duration(300).delay(450)}>
					<View style={styles.commentsHeader}>
						<Ionicons name="chatbubbles" size={20} color={Colors.primary} />
						<Text style={styles.commentsTitle}>
							Comments ({comments.length})
						</Text>
					</View>

					{comments.map((comment: any, _index: number) => (
						<Card key={comment.id} style={styles.commentCard}>
							<View style={styles.commentHeader}>
								<Pressable
									style={styles.commentAuthor}
									onPress={() => router.push(`/user/${comment.user.id}`)}
								>
									<Avatar
										source={comment.user.avatar}
										name={comment.user.displayName || comment.user.username}
										size="sm"
									/>
									<View>
										<Text style={styles.commentAuthorName}>
											{comment.user.id === "demo"
												? "You"
												: comment.user.displayName || comment.user.username}
										</Text>
										<Text style={styles.commentDate}>
											{formatDate(comment.createdAt)}
										</Text>
									</View>
								</Pressable>
							</View>
							<Text style={styles.commentText}>{comment.content}</Text>
						</Card>
					))}
				</Animated.View>

				{/* Spacer for input */}
				<View style={{ height: 100 }} />
			</Animated.ScrollView>

			{/* Comment Input */}
			<Animated.View
				entering={SlideInUp.duration(300)}
				style={[
					styles.commentInputContainer,
					{ paddingBottom: insets.bottom + Spacing.sm },
				]}
			>
				<TextInput
					style={styles.commentInput}
					placeholder="Add a comment..."
					placeholderTextColor={Colors.textTertiary}
					value={commentText}
					onChangeText={setCommentText}
					multiline
				/>
				<Pressable
					style={[
						styles.sendButton,
						!commentText.trim() && styles.sendButtonDisabled,
					]}
					onPress={handleAddComment}
					disabled={!commentText.trim()}
				>
					<Ionicons
						name="send"
						size={20}
						color={commentText.trim() ? Colors.text : Colors.textTertiary}
					/>
				</Pressable>
			</Animated.View>

			{/* Image Modal */}
			<Modal
				visible={imageModalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setImageModalVisible(false)}
			>
				<View style={styles.imageModalContainer}>
					<Pressable
						style={styles.imageModalClose}
						onPress={() => setImageModalVisible(false)}
					>
						<Ionicons name="close" size={28} color={Colors.text} />
					</Pressable>
					{feedback.screenshots && (
						<Image
							source={{ uri: feedback.screenshots[selectedImageIndex] }}
							style={styles.fullScreenImage}
							contentFit="contain"
						/>
					)}
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	centerContent: {
		justifyContent: "center",
		alignItems: "center",
	},
	errorText: {
		fontSize: 16,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
	header: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
		overflow: "hidden",
	},
	headerGradient: {
		...StyleSheet.absoluteFillObject,
	},
	navBar: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: Spacing.md,
		height: "100%",
	},
	navButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		flex: 1,
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		textAlign: "center",
		marginHorizontal: Spacing.sm,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: Spacing.lg,
		paddingBottom: Spacing.xxl,
	},
	badges: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: Spacing.sm,
		marginBottom: Spacing.md,
	},
	typeBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.xs,
		borderRadius: BorderRadius.full,
	},
	typeBadgeText: {
		fontSize: 13,
		fontFamily: Fonts.semibold,
		textTransform: "capitalize",
	},
	statusBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.xs,
		borderRadius: BorderRadius.full,
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	statusBadgeText: {
		fontSize: 13,
		fontFamily: Fonts.medium,
		textTransform: "capitalize",
	},
	priorityBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.xs,
		borderRadius: BorderRadius.full,
	},
	priorityText: {
		fontSize: 13,
		fontFamily: Fonts.medium,
		textTransform: "capitalize",
	},
	title: {
		fontSize: 24,
		fontFamily: Fonts.bold,
		color: Colors.text,
		marginBottom: Spacing.md,
	},
	authorCard: {
		marginBottom: Spacing.lg,
	},
	authorInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.md,
	},
	authorDetails: {
		flex: 1,
	},
	authorName: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	authorDate: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
	},
	descriptionCard: {
		marginBottom: Spacing.lg,
	},
	description: {
		fontSize: 15,
		fontFamily: Fonts.regular,
		color: Colors.text,
		lineHeight: 24,
	},
	sectionTitle: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginBottom: Spacing.sm,
	},
	screenshotsScroll: {
		marginBottom: Spacing.lg,
	},
	screenshot: {
		width: 120,
		height: 200,
		borderRadius: BorderRadius.md,
		marginRight: Spacing.sm,
	},
	deviceCard: {
		marginBottom: Spacing.lg,
	},
	deviceHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
		marginBottom: Spacing.md,
	},
	deviceTitle: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	deviceGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: Spacing.md,
	},
	deviceItem: {
		width: "45%",
	},
	deviceLabel: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		marginBottom: 2,
	},
	deviceValue: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.text,
	},
	votesCard: {
		marginBottom: Spacing.lg,
	},
	votesRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	voteButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: Spacing.sm,
		paddingVertical: Spacing.sm,
	},
	voteCount: {
		fontSize: 18,
		fontFamily: Fonts.bold,
	},
	voteDivider: {
		width: 1,
		height: 30,
		backgroundColor: Colors.border,
	},
	commentsHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
		marginBottom: Spacing.md,
	},
	commentsTitle: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	commentCard: {
		marginBottom: Spacing.sm,
	},
	commentHeader: {
		marginBottom: Spacing.sm,
	},
	commentAuthor: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
	},
	commentAuthorName: {
		fontSize: 14,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	commentDate: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
	},
	commentText: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.text,
		lineHeight: 20,
	},
	commentInputContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		alignItems: "flex-end",
		gap: Spacing.sm,
		paddingHorizontal: Spacing.lg,
		paddingTop: Spacing.sm,
		backgroundColor: Colors.background,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
	},
	commentInput: {
		flex: 1,
		minHeight: 44,
		maxHeight: 100,
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.lg,
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm,
		fontSize: 15,
		fontFamily: Fonts.regular,
		color: Colors.text,
	},
	sendButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
	},
	sendButtonDisabled: {
		backgroundColor: Colors.backgroundSecondary,
	},
	imageModalContainer: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.95)",
		justifyContent: "center",
		alignItems: "center",
	},
	imageModalClose: {
		position: "absolute",
		top: 60,
		right: 20,
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 10,
	},
	fullScreenImage: {
		width: SCREEN_WIDTH,
		height: SCREEN_WIDTH * 1.5,
	},
});
