import { Avatar, Button, Card } from '@/components/ui'
import { BorderRadius, Colors, Fonts, Spacing } from '@/constants/theme'
import { getJoinRequestsForProject } from '@/data/mockData'
import type { JoinRequest } from '@/interfaces'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import {
    FlatList,
    Modal,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native'
import Animated, {
    FadeIn,
    FadeInDown,
    SlideInUp
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ActionModalState = {
	visible: boolean
	request: JoinRequest | null
	action: 'approve' | 'reject' | null
}

export default function JoinRequestsScreen() {
	const { id: projectId } = useLocalSearchParams<{ id: string }>()
	const insets = useSafeAreaInsets()
	
	// Get join requests from centralized mock data
	const initialRequests = useMemo(() => getJoinRequestsForProject(projectId || '1'), [projectId])
	const [requests, setRequests] = useState<JoinRequest[]>(initialRequests)
	const [isLoading, setIsLoading] = useState(false)
	const [refreshing, setRefreshing] = useState(false)
	const [actionModal, setActionModal] = useState<ActionModalState>({
		visible: false,
		request: null,
		action: null,
	})
	const [rejectReason, setRejectReason] = useState('')

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))
		setRefreshing(false)
	}, [])

	const openActionModal = (request: JoinRequest, action: 'approve' | 'reject') => {
		setActionModal({ visible: true, request, action })
		setRejectReason('')
	}

	const closeActionModal = () => {
		setActionModal({ visible: false, request: null, action: null })
		setRejectReason('')
	}

	const handleAction = async () => {
		if (!actionModal.request) return

		setIsLoading(true)
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 800))

		setRequests((prev) =>
			prev.map((r) =>
				r.id === actionModal.request?.id
					? { ...r, status: actionModal.action === 'approve' ? 'approved' : 'rejected' }
					: r
			)
		)
		setIsLoading(false)
		closeActionModal()
	}

	const pendingRequests = requests.filter((r) => r.status === 'pending')
	const processedRequests = requests.filter((r) => r.status !== 'pending')

	const formatDate = (date: Date) => {
		const now = new Date()
		const diff = now.getTime() - date.getTime()
		const days = Math.floor(diff / (1000 * 60 * 60 * 24))

		if (days === 0) return 'Today'
		if (days === 1) return 'Yesterday'
		if (days < 7) return `${days} days ago`
		return date.toLocaleDateString()
	}

	const renderRequest = ({ item, index }: { item: JoinRequest; index: number }) => (
		<Animated.View entering={FadeInDown.duration(400).delay(index * 100).springify()}>
			<Card style={styles.requestCard}>
				<Pressable
					style={styles.userSection}
					onPress={() => router.push(`/user/${item.userId}`)}
				>
					<Avatar
						source={item.user?.avatar}
						name={item.user?.displayName || item.user?.username}
						size="lg"
					/>
					<View style={styles.userInfo}>
						<Text style={styles.userName}>
							{item.user?.displayName || item.user?.username}
						</Text>
						<Text style={styles.userUsername}>@{item.user?.username}</Text>
						<View style={styles.userStats}>
							<View style={styles.statBadge}>
								<Ionicons name="flask" size={12} color={Colors.primary} />
								<Text style={styles.statText}>
									{item.user?.stats.projectsTested} tested
								</Text>
							</View>
							<View style={styles.statBadge}>
								<Ionicons name="chatbubble" size={12} color={Colors.success} />
								<Text style={styles.statText}>
									{item.user?.stats.feedbackGiven} feedback
								</Text>
							</View>
						</View>
					</View>
					<Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
				</Pressable>

				{item.message && (
					<View style={styles.messageSection}>
						<Text style={styles.messageLabel}>Message</Text>
						<Text style={styles.messageText}>{item.message}</Text>
					</View>
				)}

				<View style={styles.footer}>
					<Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
					{item.status === 'pending' ? (
						<View style={styles.actions}>
							<Button
								title="Reject"
								variant="outline"
								size="sm"
								onPress={() => openActionModal(item, 'reject')}
								style={styles.rejectButton}
							/>
							<Button
								title="Approve"
								size="sm"
								onPress={() => openActionModal(item, 'approve')}
								icon={<Ionicons name="checkmark" size={16} color={Colors.text} />}
							/>
						</View>
					) : (
						<View
							style={[
								styles.statusBadge,
								item.status === 'approved'
									? styles.statusApproved
									: styles.statusRejected,
							]}
						>
							<Ionicons
								name={item.status === 'approved' ? 'checkmark-circle' : 'close-circle'}
								size={14}
								color={item.status === 'approved' ? Colors.success : Colors.error}
							/>
							<Text
								style={[
									styles.statusText,
									{
										color:
											item.status === 'approved' ? Colors.success : Colors.error,
									},
								]}
							>
								{item.status === 'approved' ? 'Approved' : 'Rejected'}
							</Text>
						</View>
					)}
				</View>
			</Card>
		</Animated.View>
	)

	const ListHeader = () => (
		<>
			{pendingRequests.length > 0 && (
				<Text style={styles.sectionTitle}>
					Pending Requests ({pendingRequests.length})
				</Text>
			)}
		</>
	)

	const ListEmpty = () => (
		<Animated.View entering={FadeIn.duration(600)} style={styles.emptyContainer}>
			<View style={styles.emptyIcon}>
				<Ionicons name="people-outline" size={64} color={Colors.textTertiary} />
			</View>
			<Text style={styles.emptyTitle}>No Pending Requests</Text>
			<Text style={styles.emptyDescription}>
				When testers request to join your project, they'll appear here.
			</Text>
		</Animated.View>
	)

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* Header */}
			<View style={styles.header}>
				<Pressable style={styles.backButton} onPress={() => router.back()}>
					<Ionicons name="arrow-back" size={24} color={Colors.text} />
				</Pressable>
				<Text style={styles.headerTitle}>Join Requests</Text>
				<View style={styles.headerRight} />
			</View>

			<FlatList
				data={pendingRequests}
				keyExtractor={(item) => item.id}
				renderItem={renderRequest}
				contentContainerStyle={styles.listContainer}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={ListHeader}
				ListEmptyComponent={ListEmpty}
				ListFooterComponent={
					processedRequests.length > 0 ? (
						<View style={styles.processedSection}>
							<Text style={styles.sectionTitle}>
								Processed ({processedRequests.length})
							</Text>
							{processedRequests.map((item, index) => (
								<Animated.View
									key={item.id}
									entering={FadeInDown.duration(400).delay(index * 100)}
								>
									<Card style={{ ...styles.requestCard, ...styles.processedCard }}>
										<View style={styles.userSection}>
											<Avatar
												source={item.user?.avatar}
												name={item.user?.displayName}
												size="md"
											/>
											<View style={styles.userInfo}>
												<Text style={styles.userName}>
													{item.user?.displayName}
												</Text>
												<Text style={styles.userUsername}>
													@{item.user?.username}
												</Text>
											</View>
											<View
												style={[
													styles.statusBadge,
													item.status === 'approved'
														? styles.statusApproved
														: styles.statusRejected,
												]}
											>
												<Text
													style={[
														styles.statusText,
														{
															color:
																item.status === 'approved'
																	? Colors.success
																	: Colors.error,
														},
													]}
												>
													{item.status === 'approved' ? 'Approved' : 'Rejected'}
												</Text>
											</View>
										</View>
									</Card>
								</Animated.View>
							))}
						</View>
					) : null
				}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={Colors.primary}
					/>
				}
			/>

			{/* Action Modal */}
			<Modal
				visible={actionModal.visible}
				transparent
				animationType="fade"
				onRequestClose={closeActionModal}
			>
				<Pressable style={styles.modalOverlay} onPress={closeActionModal}>
					<Animated.View
						entering={SlideInUp.duration(300).springify()}
						style={styles.modalContent}
					>
						<Pressable>
							<View style={styles.modalHeader}>
								<View
									style={[
										styles.modalIcon,
										actionModal.action === 'approve'
											? styles.modalIconApprove
											: styles.modalIconReject,
									]}
								>
									<Ionicons
										name={
											actionModal.action === 'approve'
												? 'checkmark-circle'
												: 'close-circle'
										}
										size={32}
										color={
											actionModal.action === 'approve'
												? Colors.success
												: Colors.error
										}
									/>
								</View>
								<Text style={styles.modalTitle}>
									{actionModal.action === 'approve'
										? 'Approve Request'
										: 'Reject Request'}
								</Text>
								<Text style={styles.modalSubtitle}>
									{actionModal.action === 'approve'
										? `Allow ${actionModal.request?.user?.displayName} to join as a tester?`
										: `Decline ${actionModal.request?.user?.displayName}'s request to join?`}
								</Text>
							</View>

							{actionModal.action === 'reject' && (
								<View style={styles.rejectReasonContainer}>
									<Text style={styles.rejectReasonLabel}>
										Reason (optional)
									</Text>
									<TextInput
										style={styles.rejectReasonInput}
										placeholder="Let them know why..."
										placeholderTextColor={Colors.textTertiary}
										value={rejectReason}
										onChangeText={setRejectReason}
										multiline
										numberOfLines={3}
									/>
								</View>
							)}

							<View style={styles.modalActions}>
								<Button
									title="Cancel"
									variant="outline"
									onPress={closeActionModal}
									style={styles.modalButton}
								/>
								<Button
									title={
										isLoading
											? 'Processing...'
											: actionModal.action === 'approve'
											? 'Approve'
											: 'Reject'
									}
									onPress={handleAction}
									style={
										actionModal.action === 'reject'
											? { ...styles.modalButton, ...styles.rejectActionButton }
											: styles.modalButton
									}
									disabled={isLoading}
								/>
							</View>
						</Pressable>
					</Animated.View>
				</Pressable>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: Spacing.md,
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
	headerTitle: {
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	headerRight: {
		width: 40,
	},
	listContainer: {
		padding: Spacing.lg,
		paddingBottom: Spacing.xxl,
	},
	sectionTitle: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginBottom: Spacing.md,
	},
	requestCard: {
		marginBottom: Spacing.md,
	},
	processedCard: {
		opacity: 0.7,
	},
	userSection: {
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
	userStats: {
		flexDirection: 'row',
		gap: Spacing.sm,
		marginTop: Spacing.xs,
	},
	statBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	statText: {
		fontSize: 11,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
	messageSection: {
		marginTop: Spacing.md,
		paddingTop: Spacing.md,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
	},
	messageLabel: {
		fontSize: 12,
		fontFamily: Fonts.medium,
		color: Colors.textTertiary,
		marginBottom: Spacing.xs,
	},
	messageText: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		lineHeight: 20,
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: Spacing.md,
		paddingTop: Spacing.md,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
	},
	dateText: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
	},
	actions: {
		flexDirection: 'row',
		gap: Spacing.sm,
	},
	rejectButton: {
		borderColor: Colors.error,
	},
	statusBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: Spacing.sm,
		paddingVertical: 4,
		borderRadius: BorderRadius.sm,
	},
	statusApproved: {
		backgroundColor: `${Colors.success}15`,
	},
	statusRejected: {
		backgroundColor: `${Colors.error}15`,
	},
	statusText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
	},
	processedSection: {
		marginTop: Spacing.lg,
	},
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
	},

	// Modal styles
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.6)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: Spacing.lg,
	},
	modalContent: {
		width: '100%',
		maxWidth: 400,
		backgroundColor: Colors.card,
		borderRadius: BorderRadius.lg,
		padding: Spacing.lg,
	},
	modalHeader: {
		alignItems: 'center',
		marginBottom: Spacing.lg,
	},
	modalIcon: {
		width: 64,
		height: 64,
		borderRadius: 32,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: Spacing.md,
	},
	modalIconApprove: {
		backgroundColor: `${Colors.success}15`,
	},
	modalIconReject: {
		backgroundColor: `${Colors.error}15`,
	},
	modalTitle: {
		fontSize: 20,
		fontFamily: Fonts.bold,
		color: Colors.text,
		marginBottom: Spacing.xs,
	},
	modalSubtitle: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		textAlign: 'center',
	},
	rejectReasonContainer: {
		marginBottom: Spacing.lg,
	},
	rejectReasonLabel: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.text,
		marginBottom: Spacing.sm,
	},
	rejectReasonInput: {
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.md,
		padding: Spacing.md,
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.text,
		minHeight: 80,
		textAlignVertical: 'top',
	},
	modalActions: {
		flexDirection: 'row',
		gap: Spacing.md,
	},
	modalButton: {
		flex: 1,
	},
	rejectActionButton: {
		backgroundColor: Colors.error,
	},
})
