import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Link, router, Stack } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	RefreshControl,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import {
	type NotificationType,
	useMarkAllNotificationsAsRead,
	useMarkNotificationAsRead,
	useNotifications,
} from "@/queries/notificationQueries";

export default function NotificationsScreen() {
	const [refreshing, setRefreshing] = useState(false);
	const { data, isLoading, refetch } = useNotifications();
	const markAsReadMutation = useMarkNotificationAsRead();
	const markAllAsReadMutation = useMarkAllNotificationsAsRead();

	const notifications = data?.notifications || [];
	const unreadCount = data?.unreadCount || 0;

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	const handleNotificationPress = (notification: NotificationType) => {
		if (!notification.isRead) {
			markAsReadMutation.mutate(notification.id);
		}
		router.push(`/notifications/${notification.id}`);
	};

	const handleMarkAllRead = () => {
		markAllAsReadMutation.mutate();
	};

	const getIcon = (type: NotificationType["type"]) => {
		switch (type) {
			case "project_invite":
				return { name: "person-add", color: Colors.primary };
			case "project_joined":
				return { name: "enter", color: Colors.success };
			case "feedback_received":
				return { name: "chatbubble", color: Colors.warning };
			case "feedback_comment":
				return { name: "chatbubbles", color: Colors.info };
			case "feedback_status_changed":
				return { name: "git-commit", color: Colors.info };
			case "project_update":
				return { name: "rocket", color: Colors.primary };
			default:
				return { name: "notifications", color: Colors.text };
		}
	};

	const renderItem = ({ item, index }: { item: NotificationType; index: number }) => {
		const icon = getIcon(item.type);

		return (
			<Animated.View
				entering={FadeInDown.duration(400)
					.delay(index * 50)
					.springify()}
			>
				<Pressable
					style={[
						styles.notificationItem,
						!item.isRead && styles.unreadItem,
					]}
					onPress={() => handleNotificationPress(item)}
				>
					<View
						style={[
							styles.iconContainer,
							{ backgroundColor: `${icon.color}15` },
						]}
					>
						<Ionicons name={icon.name as any} size={24} color={icon.color} />
					</View>
					
					<View style={styles.contentContainer}>
						<View style={styles.headerRow}>
							<Text style={styles.title} numberOfLines={1}>
								{item.title}
							</Text>
							<Text style={styles.time}>
								{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
							</Text>
						</View>
						<Text style={styles.message} numberOfLines={2}>
							{item.message}
						</Text>
					</View>

					{!item.isRead && <View style={styles.unreadDot} />}
				</Pressable>
			</Animated.View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen 
				options={{
					headerShown: true,
					title: "Notifications",
					headerShadowVisible: false,
					headerStyle: { backgroundColor: Colors.background },
					headerTintColor: Colors.text,
					headerRight: () => (
						unreadCount > 0 && (
							<Pressable onPress={handleMarkAllRead}>
								<Text style={styles.markAllRead}>Mark all read</Text>
							</Pressable>
						)
					),
				}} 
			/>

			{isLoading && !refreshing ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={Colors.primary} />
				</View>
			) : (
				<FlatList
					data={notifications}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
					contentContainerStyle={styles.listContent}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor={Colors.primary}
						/>
					}
					ListEmptyComponent={
						<View style={styles.emptyContainer}>
							<Ionicons
								name="notifications-off-outline"
								size={64}
								color={Colors.textTertiary}
							/>
							<Text style={styles.emptyText}>No notifications yet</Text>
						</View>
					}
				/>
			)}
		</SafeAreaView>
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
	listContent: {
		padding: Spacing.md,
		gap: Spacing.sm,
	},
	notificationItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: Spacing.md,
		backgroundColor: Colors.card,
		borderRadius: BorderRadius.md,
		marginBottom: Spacing.sm,
	},
	unreadItem: {
		backgroundColor: `${Colors.primary}10`, // Slight tint for unread
		borderLeftWidth: 3,
		borderLeftColor: Colors.primary,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
		marginRight: Spacing.md,
	},
	contentContainer: {
		flex: 1,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},
	title: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		flex: 1,
		marginRight: Spacing.sm,
	},
	time: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
	},
	message: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		lineHeight: 20,
	},
	unreadDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: Colors.primary,
		marginLeft: Spacing.sm,
	},
	markAllRead: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.primary,
	},
	emptyContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 100,
	},
	emptyText: {
		marginTop: Spacing.md,
		fontSize: 16,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
});
