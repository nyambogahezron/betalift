import { Button, Card } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import { getReleasesForProject } from "@/data/mockData";
import type { Release } from "@/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FilterType = "all" | "published" | "beta" | "draft";

export default function ReleasesScreen() {
	const { id: projectId } = useLocalSearchParams<{ id: string }>();
	const insets = useSafeAreaInsets();
	const [filter, setFilter] = useState<FilterType>("all");

	// Get releases from centralized mock data
	const releases = useMemo(
		() => getReleasesForProject(projectId || "1"),
		[projectId],
	);

	const filteredReleases = releases.filter((release) => {
		if (filter === "all") return true;
		return release.status === filter;
	});

	const getStatusColor = (status: Release["status"]) => {
		switch (status) {
			case "published":
				return Colors.success;
			case "beta":
				return Colors.warning;
			case "draft":
				return Colors.textTertiary;
			case "archived":
				return Colors.error;
			default:
				return Colors.textSecondary;
		}
	};

	const getStatusIcon = (status: Release["status"]) => {
		switch (status) {
			case "published":
				return "checkmark-circle";
			case "beta":
				return "flask";
			case "draft":
				return "create";
			case "archived":
				return "archive";
			default:
				return "ellipse";
		}
	};

	const formatFileSize = (bytes?: number) => {
		if (!bytes) return "N/A";
		const mb = bytes / (1024 * 1024);
		return `${mb.toFixed(1)} MB`;
	};

	const formatDate = (date?: Date) => {
		if (!date) return "Not published";
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const renderRelease = ({ item, index }: { item: Release; index: number }) => {
		const statusColor = getStatusColor(item.status);
		const statusIcon = getStatusIcon(item.status);
		const isLatest = index === 0 && item.status === "published";

		return (
			<Animated.View entering={FadeInDown.duration(300).delay(index * 50)}>
				<Pressable
					onPress={() =>
						router.push(`/project/${projectId}/releases/${item.id}`)
					}
				>
					<Card style={styles.releaseCard}>
						<View style={styles.releaseHeader}>
							<View style={styles.versionContainer}>
								<Text style={styles.version}>{item.version}</Text>
								{isLatest && (
									<View style={styles.latestBadge}>
										<Text style={styles.latestBadgeText}>Latest</Text>
									</View>
								)}
							</View>
							<View
								style={[
									styles.statusBadge,
									{ backgroundColor: `${statusColor}15` },
								]}
							>
								<Ionicons
									name={statusIcon as any}
									size={14}
									color={statusColor}
								/>
								<Text style={[styles.statusText, { color: statusColor }]}>
									{(item.status || "draft").charAt(0).toUpperCase() +
										(item.status || "draft").slice(1)}
								</Text>
							</View>
						</View>

						<Text style={styles.releaseTitle}>{item.title}</Text>

						<View style={styles.releaseInfo}>
							<View style={styles.releaseInfoItem}>
								<Ionicons
									name="calendar-outline"
									size={14}
									color={Colors.textTertiary}
								/>
								<Text style={styles.releaseInfoText}>
									{formatDate(item.publishedAt || item.createdAt)}
								</Text>
							</View>
							{item.fileSize && (
								<View style={styles.releaseInfoItem}>
									<Ionicons
										name="document-outline"
										size={14}
										color={Colors.textTertiary}
									/>
									<Text style={styles.releaseInfoText}>
										{formatFileSize(item.fileSize)}
									</Text>
								</View>
							)}
							{item.buildNumber && (
								<View style={styles.releaseInfoItem}>
									<Ionicons
										name="construct-outline"
										size={14}
										color={Colors.textTertiary}
									/>
									<Text style={styles.releaseInfoText}>
										Build {item.buildNumber}
									</Text>
								</View>
							)}
						</View>

						<View style={styles.releaseFooter}>
							<Ionicons
								name="chevron-forward"
								size={20}
								color={Colors.textTertiary}
							/>
						</View>
					</Card>
				</Pressable>
			</Animated.View>
		);
	};

	const filterOptions: { key: FilterType; label: string }[] = [
		{ key: "all", label: "All" },
		{ key: "published", label: "Published" },
		{ key: "beta", label: "Beta" },
		{ key: "draft", label: "Draft" },
	];

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={[styles.header, { paddingTop: insets.top }]}>
				<View style={styles.headerTop}>
					<Pressable style={styles.backButton} onPress={() => router.back()}>
						<Ionicons name="arrow-back" size={24} color={Colors.text} />
					</Pressable>
					<Text style={styles.title}>Releases</Text>
					<Pressable style={styles.addButton}>
						<Ionicons name="add" size={24} color={Colors.primary} />
					</Pressable>
				</View>

				{/* Filter Tabs */}
				<View style={styles.filterContainer}>
					{filterOptions.map((option) => (
						<Pressable
							key={option.key}
							style={[
								styles.filterChip,
								filter === option.key && styles.filterChipActive,
							]}
							onPress={() => setFilter(option.key)}
						>
							<Text
								style={[
									styles.filterChipText,
									filter === option.key && styles.filterChipTextActive,
								]}
							>
								{option.label}
							</Text>
						</Pressable>
					))}
				</View>
			</View>

			{filteredReleases.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Ionicons
						name="rocket-outline"
						size={64}
						color={Colors.textTertiary}
					/>
					<Text style={styles.emptyTitle}>No releases yet</Text>
					<Text style={styles.emptySubtitle}>
						Create your first release to share your app with testers
					</Text>
					<Button
						title="Create Release"
						onPress={() => {}}
						icon={<Ionicons name="add" size={18} color={Colors.text} />}
						style={styles.emptyButton}
					/>
				</View>
			) : (
				<FlatList
					data={filteredReleases}
					renderItem={renderRelease}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.listContent}
					showsVerticalScrollIndicator={false}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},

	// Header
	header: {
		backgroundColor: Colors.background,
		paddingHorizontal: Spacing.lg,
		paddingBottom: Spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	headerTop: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: Spacing.md,
	},
	backButton: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		marginLeft: -Spacing.sm,
	},
	title: {
		fontSize: 20,
		fontFamily: Fonts.bold,
		color: Colors.text,
	},
	addButton: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		marginRight: -Spacing.sm,
	},

	// Filter
	filterContainer: {
		flexDirection: "row",
		gap: Spacing.sm,
	},
	filterChip: {
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.xs,
		borderRadius: BorderRadius.full,
		backgroundColor: Colors.backgroundSecondary,
	},
	filterChipActive: {
		backgroundColor: Colors.primary,
	},
	filterChipText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
	filterChipTextActive: {
		color: Colors.text,
	},

	// List
	listContent: {
		padding: Spacing.lg,
	},

	// Release Card
	releaseCard: {
		marginBottom: Spacing.md,
	},
	releaseHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: Spacing.xs,
	},
	versionContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
	},
	version: {
		fontSize: 18,
		fontFamily: Fonts.bold,
		color: Colors.text,
	},
	latestBadge: {
		backgroundColor: Colors.primary,
		paddingHorizontal: Spacing.sm,
		paddingVertical: 2,
		borderRadius: BorderRadius.sm,
	},
	latestBadgeText: {
		fontSize: 10,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	statusBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingHorizontal: Spacing.sm,
		paddingVertical: 4,
		borderRadius: BorderRadius.sm,
	},
	statusText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
	},
	releaseTitle: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
		marginBottom: Spacing.md,
	},
	releaseInfo: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: Spacing.md,
	},
	releaseInfoItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	releaseInfoText: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
	},
	releaseFooter: {
		position: "absolute",
		right: Spacing.md,
		bottom: Spacing.md,
	},

	// Empty
	emptyContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: Spacing.xl,
	},
	emptyTitle: {
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginTop: Spacing.md,
	},
	emptySubtitle: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		textAlign: "center",
		marginTop: Spacing.xs,
	},
	emptyButton: {
		marginTop: Spacing.lg,
	},
});
