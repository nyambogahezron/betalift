import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	FlatList,
	Image,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import Animated, {
	FadeIn,
	FadeInDown,
	FadeInUp,
	SlideInDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import { useSocket } from "@/context/SocketContext";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Message, User } from "@/interfaces";

export default function ChatScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const insets = useSafeAreaInsets();
	const flatListRef = useRef<FlatList>(null);
	const { socket, isConnected, sendMessage } = useSocket();
	const { user } = useAuthStore();
	const router = useRouter();

	const [conversation, setConversation] = useState<any>(null); // Type any to avoid strict type issues with mapped _id temporarily
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	// Fetch conversation details and messages
	useEffect(() => {
		if (socket && isConnected && id) {
			// Fetch all conversations to find the current one (since we don't have get_conversation_by_id)
			socket.emit('get_conversations', (response: any) => {
				if (response.success) {
					// Map _id and find
					const convs = response.data.map((c: any) => ({ ...c, id: c._id }));
					const currentConv = convs.find((c: any) => c.id === id);
					if (currentConv) {
						setConversation(currentConv);
					}
				}
			});

			// Fetch messages
			socket.emit('get_messages', { conversationId: id, limit: 50, offset: 0 }, (response: any) => {
				if (response.success) {
					const mappedMessages = response.data.map((m: any) => ({
						...m,
						id: m._id, // Map _id to id
						createdAt: new Date(m.createdAt), // Ensure Date object
						senderId: m.senderId === user?.id ? 'me' : m.senderId // Map my ID to 'me' if needed by UI
					})).reverse(); // specific sort might be needed depending on API
					setMessages(mappedMessages);

					// Scroll to bottom
					setTimeout(() => {
						flatListRef.current?.scrollToEnd({ animated: false });
					}, 100);
				}
			});

			// Listen for new messages
			const handleNewMessage = (message: any) => {
				if (message.conversationId === id || message.conversationId === conversation?.id) { // handle both if mapped or not
					const mappedMsg = {
						...message,
						id: message._id,
						createdAt: new Date(message.createdAt),
						senderId: message.senderId === user?.id ? 'me' : message.senderId
					};
					setMessages((prev) => [...prev, mappedMsg]);
					setTimeout(() => {
						flatListRef.current?.scrollToEnd({ animated: true });
					}, 100);
				}
			};

			socket.on('new_message', handleNewMessage);

			return () => {
				socket.off('new_message', handleNewMessage);
			};
		}
	}, [socket, isConnected, id, user?.id]);

	const otherUser = useMemo((): User => {
		if (conversation?.participants) {
			// Find participant that is NOT me
			const other = conversation.participants.find((p: any) => p._id !== user?.id);
			if (other) return { ...other, id: other._id };
			// Fallback if I am the only participant?
			return conversation.participants[0] ? { ...conversation.participants[0], id: conversation.participants[0]._id } : {
				id: "unknown",
				email: "unknown@example.com",
				username: "Unknown",
				role: "tester",
				stats: { projectsCreated: 0, projectsTested: 0, feedbackGiven: 0, feedbackReceived: 0 },
				createdAt: new Date()
			};
		}

		// Placeholder if loading
		return {
			id: "loading",
			email: "",
			username: "Loading...",
			displayName: "Loading...",
			role: "tester",
			stats: { projectsCreated: 0, projectsTested: 0, feedbackGiven: 0, feedbackReceived: 0 },
			createdAt: new Date(),
		};
	}, [conversation, user?.id]);

	const handleSend = () => {
		if (!inputText.trim() && !selectedImage) return;

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

		// Optimistic update handled by socket event? 
		// If we want instant feedback, we can append locally.
		// But since we listen to 'new_message', we might get duplicates if we append locally.
		// For 'me', the socket emits to room, so I receive it.
		// So I will NOT append locally to avoid dupes, assuming fast connection. 
		// Or I can check ID.

		sendMessage(id, inputText.trim(), selectedImage ? "image" : "text", selectedImage ? [{ type: 'image', url: selectedImage }] : []);

		setInputText("");
		setSelectedImage(null);
	};

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 0.8,
		});

		if (!result.canceled) {
			setSelectedImage(result.assets[0].uri);
		}
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const formatDateHeader = (date: Date) => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (days === 0) return "Today";
		if (days === 1) return "Yesterday";
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			month: "short",
			day: "numeric",
		});
	};

	const shouldShowDateHeader = (index: number) => {
		if (index === 0) return true;
		const currentDate = messages[index].createdAt.toDateString();
		const previousDate = messages[index - 1].createdAt.toDateString();
		return currentDate !== previousDate;
	};

	const renderMessage = ({ item, index }: { item: Message; index: number }) => {
		const isMe = item.senderId === "me";
		const showDateHeader = shouldShowDateHeader(index);

		return (
			<View>
				{showDateHeader && (
					<Animated.View
						entering={FadeIn.duration(300)}
						style={styles.dateHeaderContainer}
					>
						<Text style={styles.dateHeaderText}>
							{formatDateHeader(item.createdAt)}
						</Text>
					</Animated.View>
				)}
				<Animated.View
					entering={FadeInUp.duration(200)}
					style={[
						styles.messageRow,
						isMe ? styles.messageRowMe : styles.messageRowOther,
					]}
				>
					{!isMe && (
						<Avatar
							source={otherUser.avatar}
							name={otherUser.displayName || otherUser.username}
							size="sm"
						/>
					)}
					<View
						style={[
							styles.messageBubble,
							isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
						]}
					>
						{item.attachments?.map((attachment) => (
							<Pressable key={attachment.id} style={styles.attachmentContainer}>
								<Image
									source={{ uri: attachment.url }}
									style={styles.attachmentImage}
									resizeMode="cover"
								/>
							</Pressable>
						))}
						{item.content && (
							<Text
								style={[
									styles.messageText,
									isMe ? styles.messageTextMe : styles.messageTextOther,
								]}
							>
								{item.content}
							</Text>
						)}
						<View style={styles.messageFooter}>
							<Text
								style={[
									styles.messageTime,
									isMe ? styles.messageTimeMe : styles.messageTimeOther,
								]}
							>
								{formatTime(item.createdAt)}
							</Text>
							{isMe && (
								<Ionicons
									name={
										(item.readBy?.length || 0) > 1
											? "checkmark-done"
											: "checkmark"
									}
									size={14}
									color={
										(item.readBy?.length || 0) > 1
											? Colors.primary
											: "rgba(255,255,255,0.6)"
									}
									style={styles.readIcon}
								/>
							)}
						</View>
					</View>
				</Animated.View>
			</View>
		);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			keyboardVerticalOffset={0}
		>
			{/* Header */}
			<View style={[styles.header, { paddingTop: insets.top }]}>
				<Pressable style={styles.backButton} onPress={() => router.back()}>
					<Ionicons name="arrow-back" size={24} color={Colors.text} />
				</Pressable>
				<Pressable
					style={styles.userInfo}
					onPress={() => router.push(`/user/${otherUser.id}`)}
				>
					<Avatar
						source={otherUser.avatar}
						name={otherUser.displayName || otherUser.username}
						size="md"
					/>
					<View style={styles.userDetails}>
						<Text style={styles.userName}>
							{otherUser.displayName || otherUser.username}
						</Text>
						<Text style={styles.userStatus}>
							{isTyping ? "typing..." : "Online"}
						</Text>
					</View>
				</Pressable>
				<View style={styles.headerActions}>
					<Pressable
						style={styles.headerAction}
						onPress={() => router.push(`/user/${otherUser.id}`)}
					>
						<Ionicons name="information-circle" size={24} color={Colors.text} />
					</Pressable>
				</View>
			</View>

			{/* Messages */}
			<FlatList
				ref={flatListRef}
				data={messages}
				renderItem={renderMessage}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.messagesList}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={
					isTyping ? (
						<Animated.View
							entering={SlideInDown.duration(200)}
							style={[styles.messageRow, styles.messageRowOther]}
						>
							<Avatar
								source={otherUser.avatar}
								name={otherUser.displayName || otherUser.username}
								size="sm"
							/>
							<View style={[styles.messageBubble, styles.messageBubbleOther]}>
								<View style={styles.typingIndicator}>
									<View style={[styles.typingDot, styles.typingDot1]} />
									<View style={[styles.typingDot, styles.typingDot2]} />
									<View style={[styles.typingDot, styles.typingDot3]} />
								</View>
							</View>
						</Animated.View>
					) : null
				}
			/>

			{/* Selected Image Preview */}
			{selectedImage && (
				<Animated.View
					entering={FadeInDown.duration(200)}
					style={styles.selectedImageContainer}
				>
					<Image
						source={{ uri: selectedImage }}
						style={styles.selectedImage}
						resizeMode="cover"
					/>
					<Pressable
						style={styles.removeImageButton}
						onPress={() => setSelectedImage(null)}
					>
						<Ionicons name="close" size={16} color={Colors.text} />
					</Pressable>
				</Animated.View>
			)}

			{/* Input */}
			<View
				style={[
					styles.inputContainer,
					{ paddingBottom: insets.bottom + Spacing.sm },
				]}
			>
				<Pressable style={styles.attachButton} onPress={handlePickImage}>
					<Ionicons name="add-circle" size={28} color={Colors.primary} />
				</Pressable>
				<View style={styles.inputWrapper}>
					<TextInput
						style={styles.input}
						placeholder="Type a message..."
						placeholderTextColor={Colors.textTertiary}
						value={inputText}
						onChangeText={setInputText}
						multiline
						maxLength={1000}
					/>
					<Pressable style={styles.emojiButton}>
						<Ionicons
							name="happy-outline"
							size={24}
							color={Colors.textTertiary}
						/>
					</Pressable>
				</View>
				<Pressable
					style={[
						styles.sendButton,
						(inputText.trim() || selectedImage) && styles.sendButtonActive,
					]}
					onPress={handleSend}
					disabled={!inputText.trim() && !selectedImage}
				>
					<Ionicons
						name="send"
						size={20}
						color={
							inputText.trim() || selectedImage
								? Colors.text
								: Colors.textTertiary
						}
					/>
				</Pressable>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},

	// Header
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: Spacing.md,
		paddingBottom: Spacing.md,
		backgroundColor: Colors.background,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	backButton: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	userInfo: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		marginLeft: Spacing.xs,
	},
	userDetails: {
		marginLeft: Spacing.sm,
	},
	userName: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	userStatus: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.success,
	},
	headerActions: {
		flexDirection: "row",
	},
	headerAction: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},

	// Messages
	messagesList: {
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.md,
	},
	dateHeaderContainer: {
		alignItems: "center",
		marginVertical: Spacing.md,
	},
	dateHeaderText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
		color: Colors.textTertiary,
		backgroundColor: Colors.backgroundSecondary,
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.xs,
		borderRadius: BorderRadius.full,
	},
	messageRow: {
		flexDirection: "row",
		marginBottom: Spacing.sm,
		alignItems: "flex-end",
		gap: Spacing.xs,
	},
	messageRowMe: {
		justifyContent: "flex-end",
	},
	messageRowOther: {
		justifyContent: "flex-start",
	},
	messageBubble: {
		maxWidth: "75%",
		padding: Spacing.sm,
		borderRadius: BorderRadius.lg,
	},
	messageBubbleMe: {
		backgroundColor: Colors.primary,
		borderBottomRightRadius: 4,
	},
	messageBubbleOther: {
		backgroundColor: Colors.card,
		borderBottomLeftRadius: 4,
	},
	messageText: {
		fontSize: 15,
		fontFamily: Fonts.regular,
		lineHeight: 20,
	},
	messageTextMe: {
		color: Colors.text,
	},
	messageTextOther: {
		color: Colors.text,
	},
	messageFooter: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		marginTop: 4,
	},
	messageTime: {
		fontSize: 10,
		fontFamily: Fonts.regular,
	},
	messageTimeMe: {
		color: "rgba(255,255,255,0.7)",
	},
	messageTimeOther: {
		color: Colors.textTertiary,
	},
	readIcon: {
		marginLeft: 4,
	},

	// Attachments
	attachmentContainer: {
		marginBottom: Spacing.xs,
		borderRadius: BorderRadius.md,
		overflow: "hidden",
	},
	attachmentImage: {
		width: 200,
		height: 150,
		borderRadius: BorderRadius.md,
	},

	// Typing Indicator
	typingIndicator: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingHorizontal: Spacing.xs,
		paddingVertical: Spacing.xs,
	},
	typingDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: Colors.textTertiary,
	},
	typingDot1: {
		opacity: 0.4,
	},
	typingDot2: {
		opacity: 0.6,
	},
	typingDot3: {
		opacity: 0.8,
	},

	// Selected Image
	selectedImageContainer: {
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
	},
	selectedImage: {
		width: 100,
		height: 100,
		borderRadius: BorderRadius.md,
	},
	removeImageButton: {
		position: "absolute",
		top: Spacing.sm,
		left: Spacing.md + 80,
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: Colors.error,
		alignItems: "center",
		justifyContent: "center",
	},

	// Input
	inputContainer: {
		flexDirection: "row",
		alignItems: "flex-end",
		paddingHorizontal: Spacing.md,
		paddingTop: Spacing.sm,
		backgroundColor: Colors.background,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
	},
	attachButton: {
		paddingBottom: 8,
	},
	inputWrapper: {
		flex: 1,
		flexDirection: "row",
		alignItems: "flex-end",
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.lg,
		marginHorizontal: Spacing.sm,
		paddingHorizontal: Spacing.md,
		paddingVertical: Platform.OS === "ios" ? Spacing.sm : 0,
		minHeight: 44,
		maxHeight: 100,
	},
	input: {
		flex: 1,
		fontSize: 16,
		fontFamily: Fonts.regular,
		color: Colors.text,
		paddingVertical: Platform.OS === "android" ? Spacing.sm : 0,
	},
	emojiButton: {
		paddingLeft: Spacing.sm,
		paddingBottom: Platform.OS === "ios" ? 0 : Spacing.sm,
	},
	sendButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: "center",
		justifyContent: "center",
	},
	sendButtonActive: {
		backgroundColor: Colors.primary,
	},
});
