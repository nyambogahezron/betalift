import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	type LayoutChangeEvent,
	Pressable,
	RefreshControl,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import Animated, {
	FadeInDown,
	FadeInUp,
	FadeOut,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProjectCard } from "@/components/project";
import { Button } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import type { Project } from "@/interfaces";
import { useProjects } from "@/queries/projectQueries";
import { useAuthStore } from "@/stores/useAuthStore";

type FilterCategory = "all" | "web" | "mobile" | "desktop" | "api";
type SortOption = "newest" | "popular" | "trending";

const CATEGORIES: {
	id: FilterCategory;
	label: string;
	icon: keyof typeof Ionicons.glyphMap;
}[] = [
	{ id: "all", label: "All", icon: "apps" },
	{ id: "mobile", label: "Mobile", icon: "phone-portrait" },
	{ id: "web", label: "Web", icon: "globe" },
	{ id: "desktop", label: "Desktop", icon: "desktop" },
	{ id: "api", label: "API", icon: "code-slash" },
];

export default function Explore() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] =
		useState<FilterCategory>("all");
	const [sortBy, setSortBy] = useState<SortOption>("newest");
	const [refreshing, setRefreshing] = useState(false);
	const [headerHeight, setHeaderHeight] = useState(0);

	const { user } = useAuthStore();
	const insets = useSafeAreaInsets();
	const scrollY = useSharedValue(0);

	const {
		data: projects = [] as Project[],
		isLoading,
		refetch,
	} = useProjects();

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

	// Animated style for sticky categories - only show when scrolled past header
	const stickyStyle = useAnimatedStyle(() => {
		const shouldShow = scrollY.value > headerHeight + 60;
		return {
			opacity: shouldShow ? 1 : 0,
			transform: [{ translateY: shouldShow ? 0 : -60 }],
		};
	});

	const onHeaderLayout = (event: LayoutChangeEvent) => {
		setHeaderHeight(event.nativeEvent.layout.height);
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	}, [refetch]);

	// Filter projects that are open for testing and user hasn't created
	const availableProjects = useMemo(() => {
		let filtered = projects.filter(
			(p) => p.status === "active" && p.ownerId !== user?.id,
		);

		// Apply search
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(p) =>
					p.name.toLowerCase().includes(query) ||
					p.description.toLowerCase().includes(query) ||
					p.techStack.some((t) => t.toLowerCase().includes(query)),
			);
		}

		// Apply category filter
		if (selectedCategory !== "all") {
			filtered = filtered.filter((p) => {
				const stack = p.techStack.map((t) => t.toLowerCase());
				switch (selectedCategory) {
					case "mobile":
						return stack.some((t) =>
							[
								"react native",
								"flutter",
								"swift",
								"kotlin",
								"ios",
								"android",
							].includes(t),
						);
					case "web":
						return stack.some((t) =>
							["react", "vue", "angular", "nextjs", "web"].includes(t),
						);
					case "desktop":
						return stack.some((t) =>
							["electron", "tauri", "qt", "desktop"].includes(t),
						);
					case "api":
						return stack.some((t) =>
							["nodejs", "python", "go", "rust", "api", "backend"].includes(t),
						);
					default:
						return true;
				}
			});
		}

		// Apply sorting
		switch (sortBy) {
			case "popular":
				return filtered.sort((a, b) => b.testerCount - a.testerCount);
			case "trending":
				return filtered.sort((a, b) => b.feedbackCount - a.feedbackCount);
			default:
				return filtered.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				);
		}
	}, [projects, searchQuery, selectedCategory, sortBy, user?.id]);

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* Sticky Categories Header */}
			<Animated.View
				style={[
					styles.stickyHeader,
					{ paddingTop: insets.top + Spacing.sm },
					stickyStyle,
				]}
			>
				<FlatList
					horizontal
					data={CATEGORIES}
					keyExtractor={(item) => item.id}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.stickyCategoriesContainer}
					renderItem={({ item }) => (
						<Pressable
							style={[
								styles.categoryChip,
								selectedCategory === item.id && styles.categoryChipActive,
							]}
							onPress={() => setSelectedCategory(item.id)}
						>
							<Ionicons
								name={item.icon}
								size={16}
								color={
									selectedCategory === item.id
										? Colors.text
										: Colors.textSecondary
								}
							/>
							<Text
								style={[
									styles.categoryText,
									selectedCategory === item.id && styles.categoryTextActive,
								]}
							>
								{item.label}
							</Text>
						</Pressable>
					)}
				/>
			</Animated.View>

			{isLoading && !refreshing ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={Colors.primary} />
				</View>
			) : (
				<Animated.FlatList
					data={availableProjects}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.listContainer}
					showsVerticalScrollIndicator={false}
					renderItem={({ item, index }: { item: Project; index: number }) => (
						<Animated.View
							entering={FadeInUp.duration(400)
								.delay(index * 50)
								.springify()}
						>
							<ProjectCard project={item} />
						</Animated.View>
					)}
					ListHeaderComponent={
						<>
							<Animated.View
								entering={FadeInDown.duration(600).springify()}
								style={styles.header}
								onLayout={onHeaderLayout}
							>
								<Text style={styles.headerTitle}>Explore</Text>
								<Text style={styles.headerSubtitle}>
									Discover beta projects to test
								</Text>
							</Animated.View>
							({/* Search Bar */}
							<Animated.View
								entering={FadeInDown.duration(600).springify()}
								style={styles.searchContainer}
							>
								<Ionicons
									name="search"
									size={20}
									color={Colors.textTertiary}
									style={styles.searchIcon}
								/>
								<TextInput
									style={styles.searchInput}
									placeholder="Search projects, tags..."
									placeholderTextColor={Colors.textTertiary}
									value={searchQuery}
									onChangeText={setSearchQuery}
								/>
								{searchQuery.length > 0 && (
									<Pressable onPress={() => setSearchQuery("")}>
										<Ionicons
											name="close-circle"
											size={20}
											color={Colors.textTertiary}
										/>
									</Pressable>
								)}
							</Animated.View>
							{/* Categories - shown in list, will be replaced by sticky when scrolled */}
							<Animated.View
								entering={FadeInUp.duration(600).delay(100).springify()}
								style={styles.categoriesWrapper}
							>
								<FlatList
									horizontal
									data={CATEGORIES}
									keyExtractor={(item) => item.id}
									showsHorizontalScrollIndicator={false}
									contentContainerStyle={styles.categoriesContainer}
									renderItem={({ item }) => (
										<Pressable
											style={[
												styles.categoryChip,
												selectedCategory === item.id &&
													styles.categoryChipActive,
											]}
											onPress={() => setSelectedCategory(item.id)}
										>
											<Ionicons
												name={item.icon}
												size={16}
												color={
													selectedCategory === item.id
														? Colors.text
														: Colors.textSecondary
												}
											/>
											<Text
												style={[
													styles.categoryText,
													selectedCategory === item.id &&
														styles.categoryTextActive,
												]}
											>
												{item.label}
											</Text>
										</Pressable>
									)}
								/>
							</Animated.View>
							{/* Sort Options */}
							<Animated.View
								entering={FadeInUp.duration(600).delay(200).springify()}
								style={styles.sortContainer}
							>
								<Text style={styles.resultsCount}>
									{availableProjects.length} project
									{availableProjects.length !== 1 ? "s" : ""} found
								</Text>
								<View style={styles.sortOptions}>
									{(["newest", "popular", "trending"] as SortOption[]).map(
										(option) => (
											<Pressable
												key={option}
												style={[
													styles.sortOption,
													sortBy === option && styles.sortOptionActive,
												]}
												onPress={() => setSortBy(option)}
											>
												<Text
													style={[
														styles.sortOptionText,
														sortBy === option && styles.sortOptionTextActive,
													]}
												>
													{option.charAt(0).toUpperCase() + option.slice(1)}
												</Text>
											</Pressable>
										),
									)}
								</View>
							</Animated.View>
							)
						</>
					}
					ListEmptyComponent={
						<Animated.View
							entering={FadeInUp.duration(600).springify()}
							exiting={FadeOut.duration(300)}
							style={styles.emptyContainer}
						>
							<View style={styles.emptyIcon}>
								<Ionicons
									name="telescope-outline"
									size={64}
									color={Colors.textTertiary}
								/>
							</View>
							<Text style={styles.emptyTitle}>No Projects Found</Text>
							<Text style={styles.emptyDescription}>
								{searchQuery
									? `No projects match "${searchQuery}". Try different keywords.`
									: "Check back later for new beta projects to test."}
							</Text>
							{searchQuery && (
								<Button
									title="Clear Search"
									variant="outline"
									onPress={() => setSearchQuery("")}
									style={styles.emptyButton}
								/>
							)}
						</Animated.View>
					}
					onScroll={scrollHandler}
					scrollEventThrottle={16}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor={Colors.primary}
						/>
					}
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
	stickyHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
		backgroundColor: Colors.background,
		paddingBottom: Spacing.sm,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 4,
	},
	stickyCategoriesContainer: {
		paddingHorizontal: Spacing.lg,
		gap: Spacing.sm,
	},
	header: {
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.md,
	},
	headerTitle: {
		fontSize: 28,
		fontFamily: Fonts.bold,
		color: Colors.text,
	},
	headerSubtitle: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: 2,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	listContainer: {
		paddingHorizontal: Spacing.lg,
		paddingBottom: Spacing.xxl,
	},

	// Search
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.md,
		paddingHorizontal: Spacing.md,
		marginBottom: Spacing.md,
	},
	searchIcon: {
		marginRight: Spacing.sm,
	},
	searchInput: {
		flex: 1,
		height: 48,
		fontSize: 16,
		fontFamily: Fonts.regular,
		color: Colors.text,
	},

	// Categories
	categoriesWrapper: {
		marginBottom: Spacing.md,
	},
	categoriesContainer: {
		gap: Spacing.sm,
	},
	categoryChip: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm,
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.full,
	},
	categoryChipActive: {
		backgroundColor: Colors.primary,
	},
	categoryText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
	categoryTextActive: {
		color: Colors.text,
	},

	// Sort
	sortContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: Spacing.md,
	},
	resultsCount: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
	sortOptions: {
		flexDirection: "row",
		gap: Spacing.xs,
	},
	sortOption: {
		paddingHorizontal: Spacing.sm,
		paddingVertical: 4,
		borderRadius: BorderRadius.sm,
	},
	sortOptionActive: {
		backgroundColor: `${Colors.primary}20`,
	},
	sortOptionText: {
		fontSize: 13,
		fontFamily: Fonts.medium,
		color: Colors.textTertiary,
	},
	sortOptionTextActive: {
		color: Colors.primary,
	},

	// Empty
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
		minWidth: 150,
	},
});
