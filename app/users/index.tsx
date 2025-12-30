import { Avatar, Button, Card } from '@/components/ui'
import { BorderRadius, Colors, Fonts, Spacing } from '@/constants/theme'
import { mockUsers } from '@/data/mockData'
import type { User } from '@/interfaces'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import {
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import Animated, {
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type FilterRole = 'all' | 'creator' | 'tester' | 'both'
type SortOption = 'name' | 'feedback' | 'projects' | 'recent'

export default function UsersScreen() {
	const insets = useSafeAreaInsets()
	const [searchQuery, setSearchQuery] = useState('')
	const [filterRole, setFilterRole] = useState<FilterRole>('all')
	const [sortBy, setSortBy] = useState<SortOption>('feedback')
	const [refreshing, setRefreshing] = useState(false)

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		await new Promise((resolve) => setTimeout(resolve, 1000))
		setRefreshing(false)
	}, [])

	const filteredUsers = useMemo(() => {
		let filtered = [...mockUsers]

		// Apply search
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			filtered = filtered.filter(
				(u) =>
					u.displayName?.toLowerCase().includes(query) ||
					u.username.toLowerCase().includes(query) ||
					u.bio?.toLowerCase().includes(query)
			)
		}

		// Apply role filter
		if (filterRole !== 'all') {
			filtered = filtered.filter((u) => u.role === filterRole)
		}

		// Apply sorting
		switch (sortBy) {
			case 'name':
				return filtered.sort((a, b) =>
					(a.displayName || a.username).localeCompare(b.displayName || b.username)
				)
			case 'feedback':
				return filtered.sort((a, b) => b.stats.feedbackGiven - a.stats.feedbackGiven)
			case 'projects':
				return filtered.sort((a, b) => b.stats.projectsTested - a.stats.projectsTested)
			case 'recent':
				return filtered.sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				)
			default:
				return filtered
		}
	}, [searchQuery, filterRole, sortBy])

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

	const renderUser = ({ item, index }: { item: User; index: number }) => {
		const roleBadge = getRoleBadge(item.role)

		return (
			<Animated.View entering={FadeInDown.duration(400).delay(index * 80).springify()}>
				<Pressable onPress={() => router.push(`/user/${item.id}`)}>
					<Card style={styles.userCard}>
						<View style={styles.userHeader}>
							<Avatar
								source={item.avatar}
								name={item.displayName || item.username}
								size="lg"
							/>
							<View style={styles.userInfo}>
								<Text style={styles.userName}>
									{item.displayName || item.username}
								</Text>
								<Text style={styles.userUsername}>@{item.username}</Text>
								<View
									style={[
										styles.roleBadge,
										{ backgroundColor: `${roleBadge.color}15` },
									]}
								>
									<Text style={[styles.roleText, { color: roleBadge.color }]}>
										{roleBadge.label}
									</Text>
								</View>
							</View>
							<Pressable
								style={styles.messageButton}
								onPress={() => router.push(`/messages/${item.id}`)}
							>
								<Ionicons name="chatbubble" size={18} color={Colors.primary} />
							</Pressable>
						</View>

						{item.bio && (
							<Text style={styles.userBio} numberOfLines={2}>
								{item.bio}
							</Text>
						)}

						<View style={styles.statsRow}>
							<View style={styles.statItem}>
								<Ionicons name="rocket" size={16} color={Colors.primary} />
								<Text style={styles.statValue}>{item.stats.projectsCreated}</Text>
								<Text style={styles.statLabel}>Created</Text>
							</View>
							<View style={styles.statDivider} />
							<View style={styles.statItem}>
								<Ionicons name="flask" size={16} color={Colors.success} />
								<Text style={styles.statValue}>{item.stats.projectsTested}</Text>
								<Text style={styles.statLabel}>Tested</Text>
							</View>
							<View style={styles.statDivider} />
							<View style={styles.statItem}>
								<Ionicons name="chatbubbles" size={16} color={Colors.warning} />
								<Text style={styles.statValue}>{item.stats.feedbackGiven}</Text>
								<Text style={styles.statLabel}>Feedback</Text>
							</View>
						</View>
					</Card>
				</Pressable>
			</Animated.View>
		)
	}

	const ListHeader = () => (
		<>
			{/* Search Bar */}
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
					placeholder="Search users..."
					placeholderTextColor={Colors.textTertiary}
					value={searchQuery}
					onChangeText={setSearchQuery}
				/>
				{searchQuery.length > 0 && (
					<Pressable onPress={() => setSearchQuery('')}>
						<Ionicons name="close-circle" size={20} color={Colors.textTertiary} />
					</Pressable>
				)}
			</Animated.View>

			{/* Role Filter */}
			<Animated.View entering={FadeInUp.duration(600).delay(100).springify()}>
				<FlatList
					horizontal
					data={[
						{ id: 'all', label: 'All' },
						{ id: 'creator', label: 'Creators' },
						{ id: 'tester', label: 'Testers' },
						{ id: 'both', label: 'Both' },
					]}
					keyExtractor={(item) => item.id}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.filterContainer}
					renderItem={({ item }) => (
						<Pressable
							style={[
								styles.filterChip,
								filterRole === item.id && styles.filterChipActive,
							]}
							onPress={() => setFilterRole(item.id as FilterRole)}
						>
							<Text
								style={[
									styles.filterText,
									filterRole === item.id && styles.filterTextActive,
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
					{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
				</Text>
				<View style={styles.sortOptions}>
					{(
						[
							{ id: 'feedback', label: 'Feedback' },
							{ id: 'projects', label: 'Projects' },
							{ id: 'name', label: 'Name' },
						] as { id: SortOption; label: string }[]
					).map((option) => (
						<Pressable
							key={option.id}
							style={[
								styles.sortOption,
								sortBy === option.id && styles.sortOptionActive,
							]}
							onPress={() => setSortBy(option.id)}
						>
							<Text
								style={[
									styles.sortOptionText,
									sortBy === option.id && styles.sortOptionTextActive,
								]}
							>
								{option.label}
							</Text>
						</Pressable>
					))}
				</View>
			</Animated.View>
		</>
	)

	const ListEmpty = () => (
		<View style={styles.emptyContainer}>
			<View style={styles.emptyIcon}>
				<Ionicons name="people-outline" size={64} color={Colors.textTertiary} />
			</View>
			<Text style={styles.emptyTitle}>No Users Found</Text>
			<Text style={styles.emptyDescription}>
				{searchQuery
					? `No users match "${searchQuery}". Try different keywords.`
					: 'No users found with the selected filter.'}
			</Text>
			{searchQuery && (
				<Button
					title="Clear Search"
					variant="outline"
					onPress={() => setSearchQuery('')}
					style={styles.emptyButton}
				/>
			)}
		</View>
	)

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* Header */}
			<Animated.View
				entering={FadeInDown.duration(600).springify()}
				style={styles.header}
			>
				<View>
					<Text style={styles.headerTitle}>Community</Text>
					<Text style={styles.headerSubtitle}>Connect with testers & creators</Text>
				</View>
			</Animated.View>

			<FlatList
				data={filteredUsers}
				keyExtractor={(item) => item.id}
				renderItem={renderUser}
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
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
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
	listContainer: {
		paddingHorizontal: Spacing.lg,
		paddingBottom: Spacing.xxl,
	},

	// Search
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
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

	// Filter
	filterContainer: {
		paddingBottom: Spacing.md,
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

	// Sort
	sortContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: Spacing.md,
	},
	resultsCount: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
	sortOptions: {
		flexDirection: 'row',
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

	// User Card
	userCard: {
		marginBottom: Spacing.md,
	},
	userHeader: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	userInfo: {
		flex: 1,
		marginLeft: Spacing.md,
	},
	userName: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	userUsername: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: 2,
	},
	roleBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: Spacing.sm,
		paddingVertical: 2,
		borderRadius: BorderRadius.sm,
		marginTop: Spacing.xs,
	},
	roleText: {
		fontSize: 11,
		fontFamily: Fonts.medium,
	},
	messageButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: `${Colors.primary}15`,
		alignItems: 'center',
		justifyContent: 'center',
	},
	userBio: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginTop: Spacing.md,
		lineHeight: 20,
	},
	statsRow: {
		flexDirection: 'row',
		marginTop: Spacing.md,
		paddingTop: Spacing.md,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
	},
	statItem: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 4,
	},
	statValue: {
		fontSize: 14,
		fontFamily: Fonts.semibold,
		color: Colors.text,
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

	// Empty
	emptyContainer: {
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
		minWidth: 150,
	},
})
