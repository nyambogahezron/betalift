import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
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
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import type { ProjectStatus } from "@/interfaces";
import { useCreateProject } from "@/queries/projectQueries";
import { useAuthStore } from "@/stores/useAuthStore";

type ProjectFormData = {
	name: string;
	description: string;
	icon: string;
	screenshots: string[];
	techStack: string[];
	status: ProjectStatus;
	links: {
		website?: string;
		github?: string;
		appStore?: string;
		playStore?: string;
		testFlight?: string;
	};
};

const STATUS_OPTIONS: {
	id: ProjectStatus;
	label: string;
	description: string;
}[] = [
	{ id: "active", label: "Active", description: "Open for testers" },
	{ id: "beta", label: "Beta", description: "In beta testing" },
	{ id: "paused", label: "Paused", description: "Not accepting testers" },
];

const SUGGESTED_TECH = [
	"React Native",
	"Flutter",
	"Swift",
	"Kotlin",
	"React",
	"Vue",
	"Angular",
	"Next.js",
	"Node.js",
	"Python",
	"Go",
	"Rust",
	"TypeScript",
	"Firebase",
	"AWS",
	"Docker",
];

export default function CreateProject() {
	const [currentStep, setCurrentStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [newTech, setNewTech] = useState("");
	const [formData, setFormData] = useState<ProjectFormData>({
		name: "",
		description: "",
		icon: "",
		screenshots: [],
		techStack: [],
		status: "active",
		links: {},
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof ProjectFormData, string>>
	>({});

	const { user } = useAuthStore();
	const _createProjectMutation = useCreateProject();

	const updateField = <K extends keyof ProjectFormData>(
		field: K,
		value: ProjectFormData[K],
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const pickIcon = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (!result.canceled) {
			updateField("icon", result.assets[0].uri);
		}
	};

	const pickScreenshots = async () => {
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

	const removeScreenshot = (index: number) => {
		updateField(
			"screenshots",
			formData.screenshots.filter((_, i) => i !== index),
		);
	};

	const toggleTech = (tech: string) => {
		if (formData.techStack.includes(tech)) {
			updateField(
				"techStack",
				formData.techStack.filter((t) => t !== tech),
			);
		} else if (formData.techStack.length < 8) {
			updateField("techStack", [...formData.techStack, tech]);
		}
	};

	const addCustomTech = () => {
		const trimmed = newTech.trim();
		if (
			trimmed &&
			!formData.techStack.includes(trimmed) &&
			formData.techStack.length < 8
		) {
			updateField("techStack", [...formData.techStack, trimmed]);
			setNewTech("");
		}
	};

	const validateStep = (step: number): boolean => {
		const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

		if (step === 0) {
			if (!formData.name.trim()) {
				newErrors.name = "Project name is required";
			} else if (formData.name.length < 3) {
				newErrors.name = "Name must be at least 3 characters";
			}

			if (!formData.description.trim()) {
				newErrors.description = "Description is required";
			} else if (formData.description.length < 20) {
				newErrors.description = "Description must be at least 20 characters";
			}

			if (!formData.icon) {
				newErrors.icon = "Project icon is required";
			}
		}

		if (step === 1) {
			if (formData.techStack.length === 0) {
				newErrors.techStack = "Select at least one technology";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const nextStep = () => {
		if (validateStep(currentStep)) {
			setCurrentStep((prev) => Math.min(prev + 1, 2));
		}
	};

	const prevStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const handleSubmit = async () => {
		if (!validateStep(currentStep) || !user) return;

		setIsSubmitting(true);

		try {
			const result = await projectQueries.createProject({
				name: formData.name.trim(),
				description: formData.description.trim(),
				icon: formData.icon,
				screenshots: formData.screenshots,
				techStack: formData.techStack,
				status: formData.status,
				links: formData.links,
				isPublic: true,
			});

			if (result.success && result.data) {
				addProject(result.data);
				Alert.alert(
					"Project Created! 🚀",
					"Your project is now live and ready to receive testers.",
					[
						{
							text: "View Project",
							onPress: () => router.replace("/(tabs)"),
						},
					],
				);
			} else {
				Alert.alert(
					"Error",
					result.error || "Failed to create project. Please try again.",
				);
			}
		} catch {
			Alert.alert("Error", "Failed to create project. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderStep = () => {
		switch (currentStep) {
			case 0:
				return <BasicInfoStep />;
			case 1:
				return <TechStackStep />;
			case 2:
				return <LinksStep />;
			default:
				return null;
		}
	};

	const BasicInfoStep = () => (
		<Animated.View entering={FadeInUp.duration(600).springify()}>
			{/* Project Icon */}
			<View style={styles.iconSection}>
				<Text style={styles.sectionLabel}>Project Icon</Text>
				<Pressable style={styles.iconPicker} onPress={pickIcon}>
					{formData.icon ? (
						<Image
							source={{ uri: formData.icon }}
							style={styles.iconPreview}
							contentFit="cover"
						/>
					) : (
						<>
							<Ionicons
								name="image-outline"
								size={32}
								color={Colors.textTertiary}
							/>
							<Text style={styles.iconPickerText}>Tap to add icon</Text>
						</>
					)}
				</Pressable>
				{errors.icon && <Text style={styles.errorText}>{errors.icon}</Text>}
			</View>

			{/* Project Name */}
			<Input
				label="Project Name"
				placeholder="My Awesome App"
				value={formData.name}
				onChangeText={(text) => updateField("name", text)}
				error={errors.name}
				maxLength={50}
			/>

			{/* Description */}
			<Input
				label="Description"
				placeholder="Describe what your project does and what kind of feedback you need..."
				value={formData.description}
				onChangeText={(text) => updateField("description", text)}
				error={errors.description}
				multiline
				numberOfLines={4}
				style={styles.multilineInput}
				maxLength={500}
			/>

			{/* Screenshots */}
			<View style={styles.screenshotsSection}>
				<Text style={styles.sectionLabel}>
					Screenshots{" "}
					<Text style={styles.optionalLabel}>(optional, max 5)</Text>
				</Text>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.screenshotsRow}
				>
					{formData.screenshots.map((uri, index) => (
						<View key={index} style={styles.screenshotWrapper}>
							<Image
								source={{ uri }}
								style={styles.screenshotImage}
								contentFit="cover"
							/>
							<Pressable
								style={styles.removeButton}
								onPress={() => removeScreenshot(index)}
							>
								<Ionicons name="close-circle" size={24} color={Colors.error} />
							</Pressable>
						</View>
					))}
					{formData.screenshots.length < 5 && (
						<Pressable
							style={styles.addScreenshotButton}
							onPress={pickScreenshots}
						>
							<Ionicons name="add" size={32} color={Colors.primary} />
						</Pressable>
					)}
				</ScrollView>
			</View>
		</Animated.View>
	);

	const TechStackStep = () => (
		<Animated.View entering={FadeInUp.duration(600).springify()}>
			<Text style={styles.sectionLabel}>Tech Stack</Text>
			<Text style={styles.sectionDescription}>
				Select the technologies used in your project (max 8)
			</Text>
			{errors.techStack && (
				<Text style={styles.errorText}>{errors.techStack}</Text>
			)}

			{/* Suggested Tech */}
			<View style={styles.techGrid}>
				{SUGGESTED_TECH.map((tech) => (
					<Pressable
						key={tech}
						style={[
							styles.techChip,
							formData.techStack.includes(tech) && styles.techChipSelected,
						]}
						onPress={() => toggleTech(tech)}
					>
						<Text
							style={[
								styles.techChipText,
								formData.techStack.includes(tech) &&
									styles.techChipTextSelected,
							]}
						>
							{tech}
						</Text>
					</Pressable>
				))}
			</View>

			{/* Custom Tech */}
			<View style={styles.customTechRow}>
				<Input
					placeholder="Add custom technology"
					value={newTech}
					onChangeText={setNewTech}
					style={styles.customTechInput}
					onSubmitEditing={addCustomTech}
				/>
				<Button
					title="Add"
					variant="outline"
					onPress={addCustomTech}
					style={styles.addTechButton}
				/>
			</View>

			{/* Selected Tech */}
			{formData.techStack.length > 0 && (
				<View style={styles.selectedTech}>
					<Text style={styles.selectedLabel}>
						Selected ({formData.techStack.length}/8):
					</Text>
					<View style={styles.selectedChips}>
						{formData.techStack.map((tech) => (
							<View key={tech} style={styles.selectedChip}>
								<Text style={styles.selectedChipText}>{tech}</Text>
								<Pressable onPress={() => toggleTech(tech)}>
									<Ionicons name="close" size={16} color={Colors.text} />
								</Pressable>
							</View>
						))}
					</View>
				</View>
			)}

			{/* Status */}
			<Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>
				Project Status
			</Text>
			<View style={styles.statusOptions}>
				{STATUS_OPTIONS.map((option) => (
					<Pressable
						key={option.id}
						style={[
							styles.statusOption,
							formData.status === option.id && styles.statusOptionSelected,
						]}
						onPress={() => updateField("status", option.id)}
					>
						<View style={styles.statusRadio}>
							{formData.status === option.id && (
								<View style={styles.statusRadioInner} />
							)}
						</View>
						<View>
							<Text
								style={[
									styles.statusLabel,
									formData.status === option.id && styles.statusLabelSelected,
								]}
							>
								{option.label}
							</Text>
							<Text style={styles.statusDescription}>{option.description}</Text>
						</View>
					</Pressable>
				))}
			</View>
		</Animated.View>
	);

	const LinksStep = () => (
		<Animated.View entering={FadeInUp.duration(600).springify()}>
			<Text style={styles.sectionLabel}>Project Links</Text>
			<Text style={styles.sectionDescription}>
				Add links where testers can access your project (all optional)
			</Text>

			<Input
				label="Website"
				placeholder="https://myapp.com"
				value={formData.links.website || ""}
				onChangeText={(text) =>
					updateField("links", { ...formData.links, website: text })
				}
				keyboardType="url"
				leftIcon="globe-outline"
			/>

			<Input
				label="GitHub Repository"
				placeholder="https://github.com/user/repo"
				value={formData.links.github || ""}
				onChangeText={(text) =>
					updateField("links", { ...formData.links, github: text })
				}
				keyboardType="url"
				leftIcon="logo-github"
			/>

			<Input
				label="TestFlight (iOS)"
				placeholder="https://testflight.apple.com/..."
				value={formData.links.testFlight || ""}
				onChangeText={(text) =>
					updateField("links", { ...formData.links, testFlight: text })
				}
				keyboardType="url"
				leftIcon="paper-plane-outline"
			/>

			<Input
				label="Play Store (Android)"
				placeholder="https://play.google.com/store/apps/..."
				value={formData.links.playStore || ""}
				onChangeText={(text) =>
					updateField("links", { ...formData.links, playStore: text })
				}
				keyboardType="url"
				leftIcon="logo-google-playstore"
			/>

			<Input
				label="App Store (iOS)"
				placeholder="https://apps.apple.com/..."
				value={formData.links.appStore || ""}
				onChangeText={(text) =>
					updateField("links", { ...formData.links, appStore: text })
				}
				keyboardType="url"
				leftIcon="logo-apple-appstore"
			/>
		</Animated.View>
	);

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
					<Text style={styles.headerTitle}>Create Project</Text>
					<View style={{ width: 40 }} />
				</Animated.View>

				{/* Progress */}
				<Animated.View
					entering={FadeInDown.duration(600).delay(100).springify()}
					style={styles.progressContainer}
				>
					{[0, 1, 2].map((step) => (
						<View
							key={step}
							style={[
								styles.progressDot,
								currentStep >= step && styles.progressDotActive,
							]}
						/>
					))}
				</Animated.View>

				{/* Step Title */}
				<Animated.View
					entering={FadeInUp.duration(600).delay(150).springify()}
					style={styles.stepHeader}
				>
					<Text style={styles.stepTitle}>
						{currentStep === 0
							? "Basic Info"
							: currentStep === 1
								? "Tech & Status"
								: "Links"}
					</Text>
					<Text style={styles.stepSubtitle}>Step {currentStep + 1} of 3</Text>
				</Animated.View>

				{/* Content */}
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					{renderStep()}
				</ScrollView>

				{/* Navigation Buttons */}
				<Animated.View
					entering={FadeInUp.duration(600).springify()}
					style={styles.navButtons}
				>
					{currentStep > 0 && (
						<Button
							title="Back"
							variant="outline"
							onPress={prevStep}
							style={styles.navButton}
						/>
					)}
					<Button
						title={
							currentStep === 2
								? isSubmitting
									? "Creating..."
									: "Create Project"
								: "Continue"
						}
						onPress={currentStep === 2 ? handleSubmit : nextStep}
						loading={isSubmitting}
						style={
							currentStep === 0
								? { ...styles.navButton, flex: 1 }
								: styles.navButton
						}
					/>
				</Animated.View>
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
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
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
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},

	// Progress
	progressContainer: {
		flexDirection: "row",
		justifyContent: "center",
		gap: Spacing.sm,
		paddingVertical: Spacing.sm,
	},
	progressDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: Colors.backgroundSecondary,
	},
	progressDotActive: {
		backgroundColor: Colors.primary,
		width: 24,
	},

	// Step Header
	stepHeader: {
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
	},
	stepTitle: {
		fontSize: 24,
		fontFamily: Fonts.bold,
		color: Colors.text,
	},
	stepSubtitle: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},

	// Content
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
	sectionDescription: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginBottom: Spacing.md,
	},
	optionalLabel: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
	},
	errorText: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.error,
		marginTop: 4,
	},

	// Icon
	iconSection: {
		alignItems: "center",
		marginBottom: Spacing.lg,
	},
	iconPicker: {
		width: 100,
		height: 100,
		borderRadius: BorderRadius.lg,
		backgroundColor: Colors.backgroundSecondary,
		borderWidth: 2,
		borderColor: Colors.border,
		borderStyle: "dashed",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	iconPreview: {
		width: "100%",
		height: "100%",
	},
	iconPickerText: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		marginTop: 4,
	},

	// Screenshots
	screenshotsSection: {
		marginTop: Spacing.md,
	},
	screenshotsRow: {
		paddingVertical: Spacing.sm,
		gap: Spacing.sm,
	},
	screenshotWrapper: {
		position: "relative",
	},
	screenshotImage: {
		width: 120,
		height: 200,
		borderRadius: BorderRadius.md,
	},
	removeButton: {
		position: "absolute",
		top: -8,
		right: -8,
		backgroundColor: Colors.background,
		borderRadius: 12,
	},
	addScreenshotButton: {
		width: 120,
		height: 200,
		borderRadius: BorderRadius.md,
		backgroundColor: Colors.backgroundSecondary,
		borderWidth: 2,
		borderColor: Colors.border,
		borderStyle: "dashed",
		alignItems: "center",
		justifyContent: "center",
	},

	// Multiline
	multilineInput: {
		height: 100,
		textAlignVertical: "top",
	},

	// Tech Grid
	techGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: Spacing.sm,
	},
	techChip: {
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm,
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.full,
		borderWidth: 1,
		borderColor: "transparent",
	},
	techChipSelected: {
		backgroundColor: `${Colors.primary}20`,
		borderColor: Colors.primary,
	},
	techChipText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
	techChipTextSelected: {
		color: Colors.primary,
	},

	// Custom Tech
	customTechRow: {
		flexDirection: "row",
		gap: Spacing.sm,
		marginTop: Spacing.md,
		alignItems: "flex-end",
	},
	customTechInput: {
		flex: 1,
	},
	addTechButton: {
		minWidth: 70,
	},

	// Selected Tech
	selectedTech: {
		marginTop: Spacing.md,
	},
	selectedLabel: {
		fontSize: 13,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
		marginBottom: Spacing.sm,
	},
	selectedChips: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: Spacing.xs,
	},
	selectedChip: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingHorizontal: Spacing.sm,
		paddingVertical: 4,
		backgroundColor: Colors.primary,
		borderRadius: BorderRadius.full,
	},
	selectedChipText: {
		fontSize: 13,
		fontFamily: Fonts.medium,
		color: Colors.text,
	},

	// Status
	statusOptions: {
		gap: Spacing.sm,
	},
	statusOption: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.md,
		padding: Spacing.md,
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.md,
		borderWidth: 2,
		borderColor: "transparent",
	},
	statusOptionSelected: {
		borderColor: Colors.primary,
		backgroundColor: `${Colors.primary}10`,
	},
	statusRadio: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: Colors.textTertiary,
		alignItems: "center",
		justifyContent: "center",
	},
	statusRadioInner: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: Colors.primary,
	},
	statusLabel: {
		fontSize: 15,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	statusLabelSelected: {
		color: Colors.primary,
	},
	statusDescription: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},

	// Nav Buttons
	navButtons: {
		flexDirection: "row",
		gap: Spacing.sm,
		paddingHorizontal: Spacing.lg,
		paddingTop: Spacing.md,
		paddingBottom: Spacing.xl,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
	},
	navButton: {
		flex: 1,
	},
});
