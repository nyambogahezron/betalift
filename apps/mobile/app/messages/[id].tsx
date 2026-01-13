import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
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
import {
	getMessagesForConversation,
	getUserById,
	mockConversations,
} from "@/data/mockData";
import type { Message, User } from "@/interfaces";

export default function ChatScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const insets = useSafeAreaInsets();
	const flatListRef = useRef<FlatList>(null);

	// Get conversation and related data from centralized mock data
	const conversation = useMemo(
		() => mockConversations.find((c) => c.id === id),
		[id],
	);

	const otherUser = useMemo((): User => {
		// Try to find user from conversation participants
		if (conversation?.participants?.[0]) {
			return conversation.participants[0];
		}
		// Fallback to getUserById if this is a direct user message
		const userFromId = getUserById(id || "");
		if (userFromId) {
			return userFromId;
		}
		// Default fallback user
		return {
			id: id || "unknown",
			email: "unknown@example.com",
			username: "unknown",
			displayName: "Unknown User",
			role: "tester",
			stats: {
				projectsCreated: 0,
				projectsTested: 0,
				feedbackGiven: 0,
				feedbackReceived: 0,
			},
			createdAt: new Date(),
		};
	}, [id, conversation]);

	const initialMessages = useMemo(
		() => getMessagesForConversation(conversation?.id || id || ""),
		[conversation?.id, id],
	);

	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const [inputText, setInputText] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	useEffect(() => {
		// Scroll to bottom on mount
		setTimeout(() => {
			flatListRef.current?.scrollToEnd({ animated: false });
		}, 100);
	}, []);

	const handleSend = () => {
		if (!inputText.trim() && !selectedImage) return;

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

		const newMessage: Message = {
			id: `m${Date.now()}`,
			conversationId: id,
			senderId: "me",
			content: inputText.trim(),
			type: selectedImage ? "image" : "text",
			createdAt: new Date(),
			readBy: ["me"],
			attachments: selectedImage
				? [
						{
							id: `a${Date.now()}`,
							type: "image",
							url: selectedImage,
							name: "image.jpg",
						},
					]
				: undefined,
		};

		setMessages((prev) => [...prev, newMessage]);
		setInputText("");
		setSelectedImage(null);

		// Scroll to bottom
		setTimeout(() => {
			flatListRef.current?.scrollToEnd({ animated: true });
		}, 100);

		// Simulate typing response
		setIsTyping(true);
		setTimeout(() => {
			setIsTyping(false);
		}, 2000);
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
