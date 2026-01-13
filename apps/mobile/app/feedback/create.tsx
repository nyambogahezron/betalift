import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, {
	FadeInDown,
	FadeInUp,
	FadeOut,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Input } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import type { FeedbackPriority, FeedbackType } from "@/interfaces";
import { useCreateFeedback } from "@/queries/feedbackQueries";
import { useProject } from "@/queries/projectQueries";
import { useAuthStore } from "@/stores/useAuthStore";

type FeedbackFormData = {
	title: string;
	description: string;
	type: FeedbackType;
	priority: FeedbackPriority;
	screenshots: string[];
	stepsToReproduce: string;
};

const FEEDBACK_TYPES: {
	id: FeedbackType;
	label: string;
	icon: keyof typeof Ionicons.glyphMap;
	color: string;
}[] = [
	{ id: "bug", label: "Bug", icon: "bug", color: Colors.error },
	{ id: "feature", label: "Feature", icon: "bulb", color: Colors.primary },
	{
		id: "improvement",
		label: "Improvement",
		icon: "trending-up",
		color: Colors.success,
	},
	{
		id: "other",
		label: "Other",
		icon: "ellipsis-horizontal",
		color: Colors.textSecondary,
	},
];

const PRIORITIES: { id: FeedbackPriority; label: string; color: string }[] = [
	{ id: "low", label: "Low", color: Colors.textSecondary },
	{ id: "medium", label: "Medium", color: Colors.warning },
	{ id: "high", label: "High", color: Colors.error },
	{ id: "critical", label: "Critical", color: "#FF0000" },
];

export default function CreateFeedback() {
	const { projectId } = useLocalSearchParams<{ projectId: string }>();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState<FeedbackFormData>({
		title: "",
		description: "",
		type: "bug",
		priority: "medium",
		screenshots: [],
		stepsToReproduce: "",
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof FeedbackFormData, string>>
	>({});

	const { user } = useAuthStore();
	const { data: project } = useProject(projectId || "");
	const createFeedbackMutation = useCreateFeedback();

	const updateField = <K extends keyof FeedbackFormData>(
		field: K,
		value: FeedbackFormData[K],
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			Alert.alert(
				"Permission needed",
				"Please grant camera roll permissions to attach screenshots.",
			);
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsMultipleSelection: true,
			quality: 0.8,
			selectionLimit: 5 - formData.screenshots.length,
		});

		if (!result.canceled) {
			const newImages = result.assets.map((asset) => asset.uri);
			updateField(
				"screenshots",
				[...formData.screenshots, ...newImages].slice(0, 5),
			);
		}
	};

	const takePhoto = async () => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync();
		if (status !== "granted") {
			Alert.alert(
				"Permission needed",
				"Please grant camera permissions to take screenshots.",
			);
			return;
		}

		const result = await ImagePicker.launchCameraAsync({
			quality: 0.8,
		});

		if (!result.canceled) {
			updateField(
				"screenshots",
				[...formData.screenshots, result.assets[0].uri].slice(0, 5),
			);
		}
	};

	const removeImage = (index: number) => {
		updateField(
			"screenshots",
			formData.screenshots.filter((_, i) => i !== index),
		);
	};

	const validate = (): boolean => {
		const newErrors: Partial<Record<keyof FeedbackFormData, string>> = {};

		if (!formData.title.trim()) {
			newErrors.title = "Title is required";
		} else if (formData.title.length < 5) {
			newErrors.title = "Title must be at least 5 characters";
		}

		if (!formData.description.trim()) {
			newErrors.description = "Description is required";
		} else if (formData.description.length < 20) {
			newErrors.description = "Description must be at least 20 characters";
		}

		if (formData.type === "bug" && !formData.stepsToReproduce.trim()) {
			newErrors.stepsToReproduce = "Steps to reproduce are required for bugs";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate() || !user || !projectId) return;

		setIsSubmitting(true);

		try {
			// Get device info
			const _deviceInfo = {
				model: Device.modelName || "Unknown",
				os: Platform.OS,
				osVersion: Platform.Version.toString(),
				appVersion: "1.0.0",
			};

			await createFeedbackMutation.mutateAsync({
				projectId,
				feedbackData: {
					title: formData.title.trim(),
					description: formData.description.trim(),
					type: formData.type,
					priority: formData.priority,
					attachments: formData.screenshots,
				},
			});

			Alert.alert(
				"Feedback Submitted! 🎉",
				"Thank you for your feedback. The project owner will review it soon.",
				[
					{
						text: "OK",
						onPress: () => router.back(),
					},
				],
			);
		} catch (error) {
			Alert.alert(
				"Error",
				error instanceof Error
					? error.message
					: "Failed to submit feedback. Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!project) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>Project not found</Text>
					<Button title="Go Back" onPress={() => router.back()} />
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<KeyboardAvoidingView
				style={styles.keyboardView}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				{/* Header */}
				<Animated.View
					entering={FadeInDown.duration(600).springify()}
					style={styles.header}
				>
					<Pressable style={styles.backButton} onPress={() => router.back()}>
						<Ionicons name="close" size={24} color={Colors.text} />
					</Pressable>
					<View style={styles.headerTitle}>
						<Text style={styles.headerText}>Submit Feedback</Text>
						<Text style={styles.headerSubtext} numberOfLines={1}>
							{project.name}
						</Text>
					</View>
					<View style={{ width: 40 }} />
				</Animated.View>

				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					{/* Feedback Type */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(100).springify()}
					>
						<Text style={styles.sectionLabel}>What type of feedback?</Text>
						<View style={styles.typeGrid}>
							{FEEDBACK_TYPES.map((type) => (
								<Pressable
									key={type.id}
									style={[
										styles.typeCard,
										formData.type === type.id && {
											borderColor: type.color,
											backgroundColor: `${type.color}15`,
										},
									]}
									onPress={() => updateField("type", type.id)}
								>
									<Ionicons
										name={type.icon}
										size={24}
										color={
											formData.type === type.id
												? type.color
												: Colors.textTertiary
										}
									/>
									<Text
										style={[
											styles.typeLabel,
											formData.type === type.id && { color: type.color },
										]}
									>
										{type.label}
									</Text>
								</Pressable>
							))}
						</View>
					</Animated.View>

					{/* Title */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(150).springify()}
					>
						<Input
							label="Title"
							placeholder="Brief summary of your feedback"
							value={formData.title}
							onChangeText={(text) => updateField("title", text)}
							error={errors.title}
							maxLength={100}
						/>
					</Animated.View>

					{/* Description */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(200).springify()}
					>
						<Input
							label="Description"
							placeholder="Describe your feedback in detail..."
							value={formData.description}
							onChangeText={(text) => updateField("description", text)}
							error={errors.description}
							multiline
							numberOfLines={4}
							style={styles.multilineInput}
						/>
					</Animated.View>

					{/* Steps to Reproduce (for bugs) */}
					{formData.type === "bug" && (
						<Animated.View
							entering={FadeInUp.duration(400).springify()}
							exiting={FadeOut.duration(300)}
						>
							<Input
								label="Steps to Reproduce"
								placeholder="1. Open the app&#10;2. Navigate to...&#10;3. Click on..."
								value={formData.stepsToReproduce}
								onChangeText={(text) => updateField("stepsToReproduce", text)}
								error={errors.stepsToReproduce}
								multiline
								numberOfLines={4}
								style={styles.multilineInput}
							/>
						</Animated.View>
					)}

					{/* Priority */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(250).springify()}
					>
						<Text style={styles.sectionLabel}>Priority</Text>
						<View style={styles.priorityRow}>
							{PRIORITIES.map((priority) => (
								<Pressable
									key={priority.id}
									style={[
										styles.priorityChip,
										formData.priority === priority.id && {
											borderColor: priority.color,
											backgroundColor: `${priority.color}20`,
										},
									]}
									onPress={() => updateField("priority", priority.id)}
								>
									<View
										style={[
											styles.priorityDot,
											{ backgroundColor: priority.color },
										]}
									/>
									<Text
										style={[
											styles.priorityLabel,
											formData.priority === priority.id && {
												color: priority.color,
											},
										]}
									>
										{priority.label}
									</Text>
								</Pressable>
							))}
						</View>
					</Animated.View>

					{/* Screenshots */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(300).springify()}
					>
						<Text style={styles.sectionLabel}>
							Screenshots{" "}
							<Text style={styles.optionalLabel}>(optional, max 5)</Text>
						</Text>
						<View style={styles.screenshotsContainer}>
							{formData.screenshots.map((uri, index) => (
								<View key={index} style={styles.screenshotWrapper}>
									<Image
										source={{ uri }}
										style={styles.screenshotImage}
										contentFit="cover"
									/>
									<Pressable
										style={styles.removeImageButton}
										onPress={() => removeImage(index)}
									>
										<Ionicons
											name="close-circle"
											size={24}
											color={Colors.error}
										/>
									</Pressable>
								</View>
							))}
							{formData.screenshots.length < 5 && (
								<View style={styles.addImageButtons}>
									<Pressable style={styles.addImageButton} onPress={pickImage}>
										<Ionicons
											name="images-outline"
											size={24}
											color={Colors.primary}
										/>
										<Text style={styles.addImageText}>Gallery</Text>
									</Pressable>
									<Pressable style={styles.addImageButton} onPress={takePhoto}>
										<Ionicons
											name="camera-outline"
											size={24}
											color={Colors.primary}
										/>
										<Text style={styles.addImageText}>Camera</Text>
									</Pressable>
								</View>
							)}
						</View>
					</Animated.View>

					{/* Device Info Notice */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(350).springify()}
					>
						<Card style={styles.infoCard}>
							<Ionicons
								name="information-circle"
								size={20}
								color={Colors.primary}
							/>
							<Text style={styles.infoText}>
								Device information (model, OS version) will be automatically
								included to help diagnose issues.
							</Text>
						</Card>
					</Animated.View>

					{/* Submit Button */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(400).springify()}
						style={styles.submitContainer}
					>
						<Button
							title={isSubmitting ? "Submitting..." : "Submit Feedback"}
							onPress={handleSubmit}
							loading={isSubmitting}
							disabled={isSubmitting}
						/>
					</Animated.View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	keyboardView: {
		flex: 1,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: Spacing.lg,
	},
	errorText: {
		fontSize: 16,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
		marginBottom: Spacing.lg,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
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
		alignItems: "center",
	},
	headerText: {
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	headerSubtext: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: Spacing.lg,
		paddingBottom: Spacing.xxl,
	},

	// Section
	sectionLabel: {
		fontSize: 15,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginBottom: Spacing.sm,
		marginTop: Spacing.md,
	},
	optionalLabel: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
	},

	// Type Grid
	typeGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: Spacing.sm,
	},
	typeCard: {
		flex: 1,
		minWidth: "45%",
		alignItems: "center",
		padding: Spacing.md,
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.md,
		borderWidth: 2,
		borderColor: "transparent",
	},
	typeLabel: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
		marginTop: Spacing.xs,
	},

	// Priority
	priorityRow: {
		flexDirection: "row",
		gap: Spacing.sm,
	},
	priorityChip: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 6,
		paddingVertical: Spacing.sm,
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.md,
		borderWidth: 1,
		borderColor: "transparent",
	},
	priorityDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	priorityLabel: {
		fontSize: 13,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},

	// Multiline Input
	multilineInput: {
		height: 100,
		textAlignVertical: "top",
	},

	// Screenshots
	screenshotsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: Spacing.sm,
	},
	screenshotWrapper: {
		position: "relative",
	},
	screenshotImage: {
		width: 100,
		height: 100,
		borderRadius: BorderRadius.md,
	},
	removeImageButton: {
		position: "absolute",
		top: -8,
		right: -8,
		backgroundColor: Colors.background,
		borderRadius: 12,
	},
	addImageButtons: {
		flexDirection: "row",
		gap: Spacing.sm,
	},
	addImageButton: {
		width: 100,
		height: 100,
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.md,
		borderWidth: 2,
		borderColor: Colors.border,
		borderStyle: "dashed",
		alignItems: "center",
		justifyContent: "center",
	},
	addImageText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
		color: Colors.primary,
		marginTop: 4,
	},

	// Info Card
	infoCard: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: Spacing.sm,
		backgroundColor: `${Colors.primary}10`,
		marginTop: Spacing.lg,
	},
	infoText: {
		flex: 1,
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		lineHeight: 18,
	},

	// Submit
	submitContainer: {
		marginTop: Spacing.xl,
	},
});
