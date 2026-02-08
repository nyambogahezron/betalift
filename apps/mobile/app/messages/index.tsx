import { Avatar } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import { useSocket } from "@/context/SocketContext";
import type { Conversation } from "@/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MessagesScreen() {
	const insets = useSafeAreaInsets();
	const [searchQuery, setSearchQuery] = useState("");
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { socket, isConnected } = useSocket();
	const router = useRouter();

	useEffect(() => {
		if (socket && isConnected) {
			setIsLoading(true);
			socket.emit("get_conversations", (response: any) => {
				if (response.success) {
					const mappedConversations = response.data.map((c: any) => ({
						...c,
						id: c._id || c.id,
					}));
					setConversations(mappedConversations);
				} else {
					console.error("Failed to fetch conversations:", response.message);
				}
				setIsLoading(false);
			});

			// Listen for updates
			socket.on("conversations_list", (response: any) => {
				if (response.success) {
					const mappedConversations = response.data.map((c: any) => ({
						...c,
						id: c._id || c.id,
					}));
					setConversations(mappedConversations);
				}
			});

			// Listen for new messages to update conversation list (if backend pushes full list or update)
			socket.on("new_message", () => {
				socket.emit("get_conversations", (response: any) => {
					if (response.success) {
						const mappedConversations = response.data.map((c: any) => ({
							...c,
							id: c._id || c.id,
						}));
						setConversations(mappedConversations);
					}
				});
			});
		}

		return () => {
			if (socket) {
				socket.off("conversations_list");
				socket.off("new_message");
			}
		};
	}, [socket, isConnected]);

	const filteredConversations = conversations.filter((conv) => {
		const otherUser = conv.participants[0];
		const searchLower = searchQuery.toLowerCase();
		return (
			otherUser.displayName?.toLowerCase().includes(searchLower) ||
			otherUser.username.toLowerCase().includes(searchLower) ||
			conv.lastMessage?.content.toLowerCase().includes(searchLower)
		);
	});

	const formatTime = (dateString: string | Date) => {
		const date = new Date(dateString);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (days === 0) {
			return date.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			});
		} else if (days === 1) {
			return "Yesterday";
		} else if (days < 7) {
			return date.toLocaleDateString("en-US", { weekday: "short" });
		} else {
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});
		}
	};

	const renderConversation = ({
		item,
		index,
	}: {
		item: Conversation;
		index: number;
	}) => {
		const otherUser = item.participants[0];
		const isUnread = item.unreadCount > 0;
		const isSentByMe = item.lastMessage?.senderId === "me"; // Logic might need adjustment based on real user ID

		return (
			<Animated.View entering={FadeInDown.duration(300).delay(index * 50)}>
				<Pressable
					style={styles.conversationItem}
					onPress={() => router.push(`/messages/${item.id}`)} // Use id (mapped from _id)
				>
					<View style={styles.avatarContainer}>
						<Avatar
							source={otherUser.avatar}
							name={otherUser.displayName || otherUser.username}
							size="lg"
						/>
						{/* Online indicator - could be based on user status */}
						<View style={[styles.onlineIndicator, styles.onlineActive]} />
					</View>

					<View style={styles.conversationContent}>
						<View style={styles.conversationHeader}>
							<Text
								style={[
									styles.conversationName,
									isUnread && styles.conversationNameUnread,
								]}
								numberOfLines={1}
							>
								{otherUser.displayName || otherUser.username}
							</Text>
							<Text
								style={[
									styles.conversationTime,
									isUnread && styles.conversationTimeUnread,
								]}
							>
								{item.lastMessage && formatTime(item.lastMessage.createdAt)}
							</Text>
						</View>
						<View style={styles.messagePreviewRow}>
							{isSentByMe && (
								<Ionicons
									name="checkmark-done"
									size={16}
									color={Colors.primary}
									style={styles.sentIcon}
								/>
							)}
							<Text
								style={[
									styles.messagePreview,
									isUnread && styles.messagePreviewUnread,
								]}
								numberOfLines={2}
							>
								{item.lastMessage?.content}
							</Text>
							{isUnread && (
								<View style={styles.unreadBadge}>
									<Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
								</View>
							)}
						</View>
					</View>
				</Pressable>
			</Animated.View>
		);
	};

	const totalUnread = conversations.reduce(
		(acc, conv) => acc + conv.unreadCount,
		0,
	);

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
				<View style={styles.headerTop}>
					<Text style={styles.title}>Messages</Text>
					{totalUnread > 0 && (
						<View style={styles.headerBadge}>
							<Text style={styles.headerBadgeText}>{totalUnread} new</Text>
						</View>
					)}
				</View>
				<View style={styles.searchContainer}>
					<Ionicons
						name="search"
						size={20}
						color={Colors.textTertiary}
						style={styles.searchIcon}
					/>
					<TextInput
						style={styles.searchInput}
						placeholder="Search conversations..."
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
				</View>
			</View>

			{filteredConversations.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Ionicons
						name="chatbubbles-outline"
						size={64}
						color={Colors.textTertiary}
					/>
					<Text style={styles.emptyTitle}>
						{searchQuery ? "No results found" : "No messages yet"}
					</Text>
					<Text style={styles.emptySubtitle}>
						{searchQuery
							? "Try a different search term"
							: "Start a conversation by visiting a user profile"}
					</Text>
				</View>
			) : (
				<FlatList
					data={filteredConversations}
					renderItem={renderConversation}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.listContent}
					showsVerticalScrollIndicator={false}
					ItemSeparatorComponent={() => <View style={styles.separator} />}
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
		marginBottom: Spacing.md,
	},
	title: {
		fontSize: 28,
		fontFamily: Fonts.bold,
		color: Colors.text,
	},
	headerBadge: {
		backgroundColor: Colors.primary,
		paddingHorizontal: Spacing.sm,
		paddingVertical: 2,
		borderRadius: BorderRadius.full,
		marginLeft: Spacing.sm,
	},
	headerBadgeText: {
		fontSize: 12,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.md,
		paddingHorizontal: Spacing.md,
	},
	searchIcon: {
		marginRight: Spacing.sm,
	},
	searchInput: {
		flex: 1,
		height: 44,
		fontSize: 16,
		fontFamily: Fonts.regular,
		color: Colors.text,
	},

	// List
	listContent: {
		padding: Spacing.lg,
	},
	separator: {
		height: 1,
		backgroundColor: Colors.border,
		marginVertical: Spacing.xs,
	},

	// Conversation Item
	conversationItem: {
		flexDirection: "row",
		paddingVertical: Spacing.sm,
	},
	avatarContainer: {
		position: "relative",
		marginRight: Spacing.md,
	},
	onlineIndicator: {
		position: "absolute",
		bottom: 2,
		right: 2,
		width: 14,
		height: 14,
		borderRadius: 7,
		borderWidth: 2,
		borderColor: Colors.background,
		backgroundColor: Colors.textTertiary,
	},
	onlineActive: {
		backgroundColor: Colors.success,
	},
	conversationContent: {
		flex: 1,
		justifyContent: "center",
	},
	conversationHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 4,
	},
	conversationName: {
		flex: 1,
		fontSize: 16,
		fontFamily: Fonts.medium,
		color: Colors.text,
		marginRight: Spacing.sm,
	},
	conversationNameUnread: {
		fontFamily: Fonts.bold,
	},
	conversationTime: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
	},
	conversationTimeUnread: {
		color: Colors.primary,
		fontFamily: Fonts.medium,
	},
	messagePreviewRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	sentIcon: {
		marginRight: 4,
	},
	messagePreview: {
		flex: 1,
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		lineHeight: 20,
	},
	messagePreviewUnread: {
		color: Colors.text,
		fontFamily: Fonts.medium,
	},
	unreadBadge: {
		backgroundColor: Colors.primary,
		minWidth: 20,
		height: 20,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 6,
		marginLeft: Spacing.sm,
	},
	unreadBadgeText: {
		fontSize: 11,
		fontFamily: Fonts.bold,
		color: Colors.text,
	},

	// Empty State
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
});
