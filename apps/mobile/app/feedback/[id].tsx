import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	RefreshControl,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import type { Feedback, FeedbackStatus, FeedbackType } from "@/interfaces";
import { useProjectFeedback, useVoteFeedback } from "@/queries/feedbackQueries";
import { useProject } from "@/queries/projectQueries";
import { useAuthStore } from "@/stores/useAuthStore";

type FilterType = "all" | FeedbackType;
type FilterStatus = "all" | FeedbackStatus;

const TYPE_FILTERS: { id: FilterType; label: string }[] = [
	{ id: "all", label: "All" },
	{ id: "bug", label: "Bugs" },
	{ id: "feature", label: "Features" },
	{ id: "improvement", label: "Improvements" },
	{ id: "other", label: "Other" },
];

const STATUS_FILTERS: { id: FilterStatus; label: string; color: string }[] = [
	{ id: "all", label: "All", color: Colors.textSecondary },
	{ id: "pending", label: "Pending", color: Colors.textSecondary },
	{ id: "in-progress", label: "In Progress", color: Colors.warning },
	{ id: "resolved", label: "Resolved", color: Colors.success },
	{ id: "closed", label: "Closed", color: Colors.error },
];

export default function FeedbackList() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [selectedType, setSelectedType] = useState<FilterType>("all");
	const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");
	const [refreshing, setRefreshing] = useState(false);
	const [_selectedFeedback, _setSelectedFeedback] = useState<Feedback | null>(
		null,
	);

	const { user } = useAuthStore();
	const { data: project } = useProject(id || "");
	const {
		data: feedbackData,
		isLoading,
		refetch,
	} = useProjectFeedback(id || "", {
		page: 1,
		limit: 50,
	});
	const voteFeedbackMutation = useVoteFeedback();

	const feedbacks = useMemo(() => {
		return feedbackData?.feedback || feedbackData || [];
	}, [feedbackData]);

	const isOwner = project?.ownerId === user?.id;

	const onRefresh = useCallback(async () => {
		if (!id) return;
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	}, [id, refetch]);

	const filteredFeedbacks = useMemo(() => {
		let filtered = feedbacks.filter((f) => f.projectId === id);

		if (selectedType !== "all") {
			filtered = filtered.filter((f) => f.type === selectedType);
		}

		if (selectedStatus !== "all") {
			filtered = filtered.filter((f) => f.status === selectedStatus);
		}

		return filtered.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);
	}, [feedbacks, id, selectedType, selectedStatus]);

	const handleVote = async (feedbackId: string, voteType: "up" | "down") => {
		if (!user?.id) return;
		try {
			await voteFeedbackMutation.mutateAsync({
				feedbackId,
				voteType,
			});
		} catch (_error) {
			// Error already handled by mutation
		}
	};

	const renderFeedbackItem = ({
		item,
		index,
	}: {
		item: Feedback;
		index: number;
	}) => {
		const userVote = item.votes?.find((v) => v.userId === user?.id)?.type;

		return (
			<Animated.View
				entering={FadeInUp.duration(400)
					.delay(index * 50)
					.springify()}
			>
				<Card
					style={styles.feedbackCard}
					onPress={() => router.push(`/feedback/detail/${item.id}`)}
				>
					<View style={styles.feedbackHeader}>
						<View style={styles.badgeRow}>
							<Badge
								label={item.type}
								variant={
									item.type === "bug"
										? "error"
										: item.type === "feature"
											? "purple"
											: "info"
								}
								size="sm"
							/>
							<Badge
								label={item.status}
								variant={
									item.status === "resolved"
										? "success"
										: item.status === "in-progress"
											? "warning"
											: "default"
								}
								size="sm"
							/>
							{item.priority === "critical" && (
								<Badge label="Critical" variant="error" size="sm" />
							)}
						</View>
					</View>

					<Text style={styles.feedbackTitle}>{item.title}</Text>
					<Text style={styles.feedbackDescription} numberOfLines={2}>
						{item.description}
					</Text>

					{/* Screenshots preview */}
					{item.screenshots && item.screenshots.length > 0 && (
						<View style={styles.screenshotsPreview}>
							{item.screenshots.slice(0, 3).map((uri, i) => (
								<Image
									key={i}
									source={{ uri }}
									style={styles.screenshotThumb}
									contentFit="cover"
								/>
							))}
							{item.screenshots.length > 3 && (
								<View style={styles.moreScreenshots}>
									<Text style={styles.moreText}>
										+{item.screenshots.length - 3}
									</Text>
								</View>
							)}
						</View>
					)}

					{/* Footer */}
					<View style={styles.feedbackFooter}>
						<View style={styles.userInfo}>
							<Avatar source={item.userAvatar} name={item.userName} size="sm" />
							<Text style={styles.userName}>{item.userName}</Text>
							<Text style={styles.timeAgo}>
								• {formatTimeAgo(item.createdAt.toISOString())}
							</Text>
						</View>

						<View style={styles.actions}>
							{/* Votes */}
							<Pressable
								style={[
									styles.voteButton,
									userVote === "up" && styles.voteButtonActive,
								]}
								onPress={() => handleVote(item.id, "up")}
							>
								<Ionicons
									name={userVote === "up" ? "arrow-up" : "arrow-up-outline"}
									size={16}
									color={
										userVote === "up" ? Colors.primary : Colors.textTertiary
									}
								/>
								<Text
									style={[
										styles.voteCount,
										userVote === "up" && styles.voteCountActive,
									]}
								>
									{item.upvotes}
								</Text>
							</Pressable>

							<Pressable
								style={[
									styles.voteButton,
									userVote === "down" && styles.voteButtonActive,
								]}
								onPress={() => handleVote(item.id, "down")}
							>
								<Ionicons
									name={
										userVote === "down" ? "arrow-down" : "arrow-down-outline"
									}
									size={16}
									color={
										userVote === "down" ? Colors.error : Colors.textTertiary
									}
								/>
								<Text
									style={[
										styles.voteCount,
										userVote === "down" && { color: Colors.error },
									]}
								>
									{item.downvotes}
								</Text>
							</Pressable>

							{/* Comments */}
							<Pressable style={styles.commentButton}>
								<Ionicons
									name="chatbubble-outline"
									size={16}
									color={Colors.textTertiary}
								/>
								<Text style={styles.commentCount}>{item.commentCount}</Text>
							</Pressable>
						</View>
					</View>
				</Card>
			</Animated.View>
		);
	};

	const ListHeader = (
		<>
			{/* Type Filters */}
			<Animated.View entering={FadeInUp.duration(600).delay(100).springify()}>
				<FlatList
					horizontal
					data={TYPE_FILTERS}
					keyExtractor={(item) => item.id}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.filtersContainer}
					renderItem={({ item }) => (
						<Pressable
							style={[
								styles.filterChip,
								selectedType === item.id && styles.filterChipActive,
							]}
							onPress={() => setSelectedType(item.id)}
						>
							<Text
								style={[
									styles.filterText,
									selectedType === item.id && styles.filterTextActive,
								]}
							>
								{item.label}
							</Text>
						</Pressable>
					)}
				/>
			</Animated.View>

			{/* Status Filters */}
			<Animated.View entering={FadeInUp.duration(600).delay(150).springify()}>
				<FlatList
					horizontal
					data={STATUS_FILTERS}
					keyExtractor={(item) => item.id}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.statusFiltersContainer}
					renderItem={({ item }) => (
						<Pressable
							style={[
								styles.statusChip,
								selectedStatus === item.id && {
									backgroundColor: `${item.color}20`,
									borderColor: item.color,
								},
							]}
							onPress={() => setSelectedStatus(item.id)}
						>
							<View
								style={[styles.statusDot, { backgroundColor: item.color }]}
							/>
							<Text
								style={[
									styles.statusText,
									selectedStatus === item.id && { color: item.color },
								]}
							>
								{item.label}
							</Text>
						</Pressable>
					)}
				/>
			</Animated.View>

			{/* Results count */}
			<Text style={styles.resultsCount}>
				{filteredFeedbacks.length} feedback
				{filteredFeedbacks.length !== 1 ? "s" : ""}
			</Text>
		</>
	);

	const ListEmpty = (
		<Animated.View
			entering={FadeInUp.duration(600).springify()}
			style={styles.emptyContainer}
		>
			<View style={styles.emptyIcon}>
				<Ionicons
					name="chatbubbles-outline"
					size={64}
					color={Colors.textTertiary}
				/>
			</View>
			<Text style={styles.emptyTitle}>No Feedback Yet</Text>
			<Text style={styles.emptyDescription}>
				{isOwner
					? "Your testers haven't submitted any feedback yet."
					: "Be the first to submit feedback for this project!"}
			</Text>
			{!isOwner && (
				<Button
					title="Submit Feedback"
					onPress={() => router.push(`/feedback/create?projectId=${id}`)}
					icon={<Ionicons name="add" size={20} color={Colors.text} />}
					style={styles.emptyButton}
				/>
			)}
		</Animated.View>
	);

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
				<View style={styles.headerTitle}>
					<Text style={styles.headerText}>Feedback</Text>
					{project && (
						<Text style={styles.headerSubtext} numberOfLines={1}>
							{project.name}
						</Text>
					)}
				</View>
				{!isOwner && (
					<Pressable
						style={styles.addButton}
						onPress={() => router.push(`/feedback/create?projectId=${id}`)}
					>
						<Ionicons name="add" size={24} color={Colors.text} />
					</Pressable>
				)}
			</Animated.View>

			{isLoading && !refreshing ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={Colors.primary} />
				</View>
			) : (
				<FlatList
					data={filteredFeedbacks}
					keyExtractor={(item) => item.id}
					renderItem={renderFeedbackItem}
					contentContainerStyle={styles.listContainer}
					showsVerticalScrollIndicator={false}
					ListHeaderComponent={ListHeader}
					ListEmptyComponent={ListEmpty}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor={Colors.primary}
						/>
					}
				/>
			)}

			{/* Feedback Detail Modal would go here */}
		</SafeAreaView>
	);
}

function formatTimeAgo(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (seconds < 60) return "just now";
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
	if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
	if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
	return date.toLocaleDateString();
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
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
		gap: Spacing.md,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		flex: 1,
	},
	headerText: {
		fontSize: 20,
		fontFamily: Fonts.bold,
		color: Colors.text,
	},
	headerSubtext: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
	addButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
	},
	listContainer: {
		paddingHorizontal: Spacing.lg,
		paddingBottom: Spacing.xxl,
	},

	// Filters
	filtersContainer: {
		paddingVertical: Spacing.sm,
		gap: Spacing.sm,
	},
	filterChip: {
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm,
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.full,
	},
	filterChipActive: {
		backgroundColor: Colors.primary,
	},
	filterText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
	filterTextActive: {
		color: Colors.text,
	},
	statusFiltersContainer: {
		paddingBottom: Spacing.md,
		gap: Spacing.sm,
	},
	statusChip: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm - 2,
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.full,
		borderWidth: 1,
		borderColor: "transparent",
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	statusText: {
		fontSize: 13,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
	resultsCount: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		marginBottom: Spacing.sm,
	},

	// Feedback Card
	feedbackCard: {
		marginBottom: Spacing.sm,
	},
	feedbackHeader: {
		marginBottom: Spacing.xs,
	},
	badgeRow: {
		flexDirection: "row",
		gap: Spacing.xs,
	},
	feedbackTitle: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginBottom: 4,
	},
	feedbackDescription: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		lineHeight: 20,
	},
	screenshotsPreview: {
		flexDirection: "row",
		marginTop: Spacing.sm,
		gap: Spacing.xs,
	},
	screenshotThumb: {
		width: 60,
		height: 60,
		borderRadius: BorderRadius.sm,
	},
	moreScreenshots: {
		width: 60,
		height: 60,
		borderRadius: BorderRadius.sm,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: "center",
		justifyContent: "center",
	},
	moreText: {
		fontSize: 14,
		fontFamily: Fonts.semibold,
		color: Colors.textSecondary,
	},
	feedbackFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: Spacing.md,
		paddingTop: Spacing.sm,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	userName: {
		fontSize: 13,
		fontFamily: Fonts.medium,
		color: Colors.text,
	},
	timeAgo: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
	},
	actions: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
	},
	voteButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingHorizontal: Spacing.sm,
		paddingVertical: 4,
		borderRadius: BorderRadius.sm,
	},
	voteButtonActive: {
		backgroundColor: `${Colors.primary}15`,
	},
	voteCount: {
		fontSize: 13,
		fontFamily: Fonts.medium,
		color: Colors.textTertiary,
	},
	voteCountActive: {
		color: Colors.primary,
	},
	commentButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingHorizontal: Spacing.sm,
		paddingVertical: 4,
	},
	commentCount: {
		fontSize: 13,
		fontFamily: Fonts.medium,
		color: Colors.textTertiary,
	},

	// Empty State
	emptyContainer: {
		alignItems: "center",
		paddingTop: 60,
		paddingHorizontal: Spacing.lg,
	},
	emptyIcon: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: "center",
		justifyContent: "center",
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
		textAlign: "center",
		lineHeight: 22,
		marginBottom: Spacing.lg,
	},
	emptyButton: {
		minWidth: 180,
	},
});
