import { Avatar, Badge, Button, Card } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import { getProjectById, getUserById, mockMemberships } from "@/data/mockData";
import { useAuthStore } from "@/stores/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
	Alert,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, {
	FadeInDown,
	FadeInUp,
	SlideInRight,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MemberRole = "all" | "creator" | "tester";

export default function ProjectMembersScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const insets = useSafeAreaInsets();
	const { user } = useAuthStore();

	const [selectedRole, setSelectedRole] = useState<MemberRole>("all");

	const project = useMemo(() => getProjectById(id), [id]);

	const owner = useMemo(
		() => (project ? getUserById(project.ownerId) : undefined),
		[project],
	);

	// Get all members for this project
	const projectMembers = useMemo(() => {
		const memberships = mockMemberships
			.filter((m) => m.projectId === id && m.status === "approved")
			.map((m) => ({
				...m,
				user: getUserById(m.userId),
			}))
			.filter((m) => m.user);

		return memberships;
	}, [id]);

	// Filter members by role
	const filteredMembers = useMemo(() => {
		if (selectedRole === "all") return projectMembers;
		return projectMembers.filter((m) => m.role === selectedRole);
	}, [projectMembers, selectedRole]);

	const isOwner = project?.ownerId === user?.id;

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const handleRemoveMember = (_memberId: string, memberName: string) => {
		Alert.alert(
			"Remove Member",
			`Are you sure you want to remove ${memberName} from this project?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: () => {
						// In real app, this would call an API
						Alert.alert(
							"Success",
							`${memberName} has been removed from the project.`,
						);
					},
				},
			],
		);
	};

	const handleMessageMember = (userId: string) => {
		router.push(`/messages/${userId}`);
	};

	const handleViewProfile = (userId: string) => {
		router.push(`/user/${userId}`);
	};

	const roleFilters: { key: MemberRole; label: string }[] = [
		{ key: "all", label: "All" },
		{ key: "creator", label: "Creators" },
		{ key: "tester", label: "Testers" },
	];

	if (!project) {
		return (
			<View style={[styles.container, { paddingTop: insets.top }]}>
				<View style={styles.errorContainer}>
					<Ionicons name="alert-circle" size={64} color={Colors.textTertiary} />
					<Text style={styles.errorText}>Project not found</Text>
					<Button
						title="Go Back"
						onPress={() => router.back()}
						style={{ marginTop: Spacing.lg }}
					/>
				</View>
			</View>
		);
	}

	const stats = {
		total: projectMembers.length + 1, // +1 for owner
		creators: projectMembers.filter((m) => m.role === "creator").length,
		testers: projectMembers.filter((m) => m.role === "tester").length,
	};

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* Header */}
			<Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
				<View style={styles.headerContent}>
					<Pressable style={styles.backButton} onPress={() => router.back()}>
						<Ionicons name="arrow-back" size={24} color={Colors.text} />
					</Pressable>
					<View style={styles.headerTitleContainer}>
						<Text style={styles.headerTitle}>Team Members</Text>
						<Text style={styles.headerSubtitle}>{project.name}</Text>
					</View>
					{isOwner && (
						<Pressable
							style={styles.addButton}
							onPress={() => router.push(`/project/${id}/invite`)}
						>
							<Ionicons name="person-add" size={20} color={Colors.primary} />
						</Pressable>
					)}
				</View>
			</Animated.View>

			<ScrollView
				style={styles.content}
				contentContainerStyle={styles.contentContainer}
				showsVerticalScrollIndicator={false}
			>
				{/* Stats Card */}
				<Animated.View entering={FadeInUp.duration(300).delay(100)}>
					<Card style={styles.statsCard}>
						<View style={styles.statsRow}>
							<View style={styles.statItem}>
								<View
									style={[
										styles.statIcon,
										{ backgroundColor: `${Colors.primary}20` },
									]}
								>
									<Ionicons name="people" size={20} color={Colors.primary} />
								</View>
								<Text style={styles.statValue}>{stats.total}</Text>
								<Text style={styles.statLabel}>Total</Text>
							</View>
							<View style={styles.statDivider} />
							<View style={styles.statItem}>
								<View
									style={[
										styles.statIcon,
										{ backgroundColor: `${Colors.success}20` },
									]}
								>
									<Ionicons
										name="code-slash"
										size={20}
										color={Colors.success}
									/>
								</View>
								<Text style={styles.statValue}>{stats.creators}</Text>
								<Text style={styles.statLabel}>Creators</Text>
							</View>
							<View style={styles.statDivider} />
							<View style={styles.statItem}>
								<View
									style={[
										styles.statIcon,
										{ backgroundColor: `${Colors.info}20` },
									]}
								>
									<Ionicons name="bug" size={20} color={Colors.info} />
								</View>
								<Text style={styles.statValue}>{stats.testers}</Text>
								<Text style={styles.statLabel}>Testers</Text>
							</View>
						</View>
					</Card>
				</Animated.View>

				{/* Owner Section */}
				{owner && (
					<Animated.View entering={FadeInUp.duration(300).delay(150)}>
						<Text style={styles.sectionTitle}>Project Owner</Text>
						<Card style={styles.ownerCard}>
							<Pressable
								style={styles.ownerContent}
								onPress={() => handleViewProfile(owner.id)}
							>
								<Avatar
									source={owner.avatar}
									name={owner.displayName || owner.username}
									size="lg"
								/>
								<View style={styles.ownerInfo}>
									<View style={styles.ownerNameRow}>
										<Text style={styles.ownerName}>
											{owner.displayName || owner.username}
										</Text>
										<Badge label="Owner" variant="warning" />
									</View>
									<Text style={styles.ownerEmail}>{owner.email}</Text>
									<Text style={styles.ownerJoined}>
										Created {formatDate(project.createdAt)}
									</Text>
								</View>
								<Ionicons
									name="chevron-forward"
									size={20}
									color={Colors.textTertiary}
								/>
							</Pressable>
						</Card>
					</Animated.View>
				)}

				{/* Role Filter */}
				<Animated.View entering={FadeInUp.duration(300).delay(200)}>
					<Text style={styles.sectionTitle}>
						Members ({projectMembers.length})
					</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={styles.filterScroll}
						contentContainerStyle={styles.filterContainer}
					>
						{roleFilters.map((filter) => (
							<Pressable
								key={filter.key}
								style={[
									styles.filterChip,
									selectedRole === filter.key && styles.filterChipActive,
								]}
								onPress={() => setSelectedRole(filter.key)}
							>
								<Text
									style={[
										styles.filterChipText,
										selectedRole === filter.key && styles.filterChipTextActive,
									]}
								>
									{filter.label}
								</Text>
							</Pressable>
						))}
					</ScrollView>
				</Animated.View>

				{/* Members List */}
				{filteredMembers.length === 0 ? (
					<Animated.View
						entering={FadeInUp.duration(300).delay(250)}
						style={styles.emptyState}
					>
						<Ionicons
							name="people-outline"
							size={48}
							color={Colors.textTertiary}
						/>
						<Text style={styles.emptyText}>
							{selectedRole === "all"
								? "No members yet"
								: `No ${selectedRole}s yet`}
						</Text>
					</Animated.View>
				) : (
					<View style={styles.membersList}>
						{filteredMembers.map((member, index) => (
							<Animated.View
								key={member.id}
								entering={SlideInRight.duration(300).delay(250 + index * 50)}
							>
								<Card style={styles.memberCard}>
									<Pressable
										style={styles.memberContent}
										onPress={() => handleViewProfile(member.userId)}
									>
										<Avatar
											source={member.user?.avatar}
											name={
												member.user?.displayName ||
												member.user?.username ||
												"User"
											}
											size="md"
										/>
										<View style={styles.memberInfo}>
											<View style={styles.memberNameRow}>
												<Text style={styles.memberName}>
													{member.user?.displayName || member.user?.username}
												</Text>
												<Badge
													label={member.role}
													variant={
														member.role === "creator" ? "success" : "default"
													}
												/>
											</View>
											<Text style={styles.memberEmail}>
												{member.user?.email}
											</Text>
											<Text style={styles.memberJoined}>
												Joined {formatDate(member.joinedAt)}
											</Text>
										</View>
									</Pressable>
									<View style={styles.memberActions}>
										<Pressable
											style={styles.actionButton}
											onPress={() => handleMessageMember(member.userId)}
										>
											<Ionicons
												name="chatbubble-outline"
												size={18}
												color={Colors.primary}
											/>
										</Pressable>
										{isOwner && (
											<Pressable
												style={[styles.actionButton, styles.removeButton]}
												onPress={() =>
													handleRemoveMember(
														member.id,
														member.user?.displayName ||
															member.user?.username ||
															"User",
													)
												}
											>
												<Ionicons name="close" size={18} color={Colors.error} />
											</Pressable>
										)}
									</View>
								</Card>
							</Animated.View>
						))}
					</View>
				)}

				{/* CTA for Owner */}
				{isOwner && (
					<Animated.View entering={FadeInUp.duration(300).delay(400)}>
						<Card style={styles.ctaCard}>
							<LinearGradient
								colors={[Colors.primaryDark, Colors.primary]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={styles.ctaGradient}
							>
								<Ionicons name="person-add" size={32} color={Colors.text} />
								<Text style={styles.ctaTitle}>Grow Your Team</Text>
								<Text style={styles.ctaSubtitle}>
									Review pending join requests or invite more testers to your
									project.
								</Text>
								<Button
									title="View Requests"
									variant="outline"
									onPress={() => router.push(`/project/${id}/requests`)}
									style={styles.ctaButton}
								/>
							</LinearGradient>
						</Card>
					</Animated.View>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	header: {
		paddingBottom: Spacing.lg,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: Spacing.md,
		paddingTop: Spacing.md,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: BorderRadius.full,
		backgroundColor: Colors.card,
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitleContainer: {
		flex: 1,
		marginLeft: Spacing.md,
	},
	headerTitle: {
		fontSize: 20,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	headerSubtitle: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: 2,
	},
	addButton: {
		width: 40,
		height: 40,
		borderRadius: BorderRadius.full,
		backgroundColor: Colors.card,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		flex: 1,
	},
	contentContainer: {
		padding: Spacing.md,
		paddingBottom: Spacing.xxl,
	},
	statsCard: {
		padding: Spacing.lg,
		marginBottom: Spacing.lg,
	},
	statsRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
	},
	statItem: {
		alignItems: "center",
		flex: 1,
	},
	statIcon: {
		width: 40,
		height: 40,
		borderRadius: BorderRadius.full,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: Spacing.sm,
	},
	statValue: {
		fontSize: 24,
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
		height: 40,
		backgroundColor: Colors.border,
	},
	sectionTitle: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginBottom: Spacing.sm,
		marginTop: Spacing.md,
	},
	ownerCard: {
		overflow: "hidden",
	},
	ownerContent: {
		flexDirection: "row",
		alignItems: "center",
		padding: Spacing.md,
	},
	ownerInfo: {
		flex: 1,
		marginLeft: Spacing.md,
	},
	ownerNameRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
	},
	ownerName: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	ownerEmail: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: 2,
	},
	ownerJoined: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		marginTop: 4,
	},
	filterScroll: {
		marginBottom: Spacing.md,
	},
	filterContainer: {
		gap: Spacing.sm,
	},
	filterChip: {
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm,
		borderRadius: BorderRadius.full,
		backgroundColor: Colors.card,
		borderWidth: 1,
		borderColor: Colors.border,
	},
	filterChipActive: {
		backgroundColor: Colors.primary,
		borderColor: Colors.primary,
	},
	filterChipText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
	filterChipTextActive: {
		color: Colors.text,
	},
	membersList: {
		gap: Spacing.sm,
	},
	memberCard: {
		overflow: "hidden",
	},
	memberContent: {
		flexDirection: "row",
		alignItems: "center",
		padding: Spacing.md,
	},
	memberInfo: {
		flex: 1,
		marginLeft: Spacing.md,
	},
	memberNameRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
	},
	memberName: {
		fontSize: 15,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	memberEmail: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: 2,
	},
	memberJoined: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		marginTop: 4,
	},
	memberActions: {
		flexDirection: "row",
		gap: Spacing.sm,
		paddingHorizontal: Spacing.md,
		paddingBottom: Spacing.md,
	},
	actionButton: {
		width: 36,
		height: 36,
		borderRadius: BorderRadius.full,
		backgroundColor: `${Colors.primary}15`,
		justifyContent: "center",
		alignItems: "center",
	},
	removeButton: {
		backgroundColor: `${Colors.error}15`,
	},
	emptyState: {
		alignItems: "center",
		paddingVertical: Spacing.xxl,
	},
	emptyText: {
		fontSize: 16,
		fontFamily: Fonts.medium,
		color: Colors.textTertiary,
		marginTop: Spacing.md,
	},
	ctaCard: {
		marginTop: Spacing.lg,
		overflow: "hidden",
		padding: 0,
	},
	ctaGradient: {
		padding: Spacing.xl,
		alignItems: "center",
	},
	ctaTitle: {
		fontSize: 20,
		fontFamily: Fonts.bold,
		color: Colors.text,
		marginTop: Spacing.md,
	},
	ctaSubtitle: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.text,
		opacity: 0.8,
		textAlign: "center",
		marginTop: Spacing.sm,
		marginBottom: Spacing.lg,
	},
	ctaButton: {
		borderColor: Colors.text,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: Spacing.xl,
	},
	errorText: {
		fontSize: 18,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
		marginTop: Spacing.md,
	},
});
