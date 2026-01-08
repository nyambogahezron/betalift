import { Button, Input } from '@/components/ui'
import { BorderRadius, Colors, Fonts, Spacing } from '@/constants/theme'
import { ProjectStatus } from '@/interfaces'
import { useProject, useUpdateProject } from '@/queries/projectQueries'
import { useAuthStore } from '@/stores/useAuthStore'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

type ProjectFormData = {
	name: string
	description: string
	icon: string
	screenshots: string[]
	techStack: string[]
	status: ProjectStatus
	links: {
		website?: string
		github?: string
		appStore?: string
		playStore?: string
		testFlight?: string
	}
}

const STATUS_OPTIONS: {
	id: ProjectStatus
	label: string
	description: string
}[] = [
	{ id: 'active', label: 'Active', description: 'Open for testers' },
	{ id: 'beta', label: 'Beta', description: 'In beta testing' },
	{ id: 'paused', label: 'Paused', description: 'Not accepting testers' },
	{ id: 'closed', label: 'Closed', description: 'Project closed' },
]

const SUGGESTED_TECH = [
	'React Native',
	'Flutter',
	'Swift',
	'Kotlin',
	'React',
	'Vue',
	'Angular',
	'Next.js',
	'Node.js',
	'Python',
	'Go',
	'Rust',
	'TypeScript',
	'Firebase',
	'AWS',
	'Docker',
]

export default function EditProject() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const [currentStep, setCurrentStep] = useState(0)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [newTech, setNewTech] = useState('')
	const [formData, setFormData] = useState<ProjectFormData>({
		name: '',
		description: '',
		icon: '',
		screenshots: [],
		techStack: [],
		status: 'active',
		links: {},
	})
	const [errors, setErrors] = useState<
		Partial<Record<keyof ProjectFormData, string>>
	>({})

	const { user } = useAuthStore()
	const { data: project } = useProject(id || '')
	const updateProjectMutation = useUpdateProject()

	// Pre-fill form with project data
	useEffect(() => {
		if (project) {
			setFormData({
				name: project.name,
				description: project.description,
				icon: project.icon || '',
				screenshots: project.screenshots || [],
				techStack: project.techStack || [],
				status: project.status,
				links: project.links || {},
			})
		}
	}, [project])

	const updateField = <K extends keyof ProjectFormData>(
		field: K,
		value: ProjectFormData[K]
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }))
		}
	}

	const pickIcon = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		})

		if (!result.canceled) {
			updateField('icon', result.assets[0].uri)
		}
	}

	const pickScreenshots = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsMultipleSelection: true,
			quality: 0.8,
			selectionLimit: 5 - formData.screenshots.length,
		})

		if (!result.canceled) {
			const newImages = result.assets.map((asset) => asset.uri)
			updateField(
				'screenshots',
				[...formData.screenshots, ...newImages].slice(0, 5)
			)
		}
	}

	const removeScreenshot = (index: number) => {
		updateField(
			'screenshots',
			formData.screenshots.filter((_, i) => i !== index)
		)
	}

	const toggleTech = (tech: string) => {
		if (formData.techStack.includes(tech)) {
			updateField(
				'techStack',
				formData.techStack.filter((t) => t !== tech)
			)
		} else if (formData.techStack.length < 8) {
			updateField('techStack', [...formData.techStack, tech])
		}
	}

	const addCustomTech = () => {
		const trimmed = newTech.trim()
		if (
			trimmed &&
			!formData.techStack.includes(trimmed) &&
			formData.techStack.length < 8
		) {
			updateField('techStack', [...formData.techStack, trimmed])
			setNewTech('')
		}
	}

	const validateStep = (step: number): boolean => {
		const newErrors: Partial<Record<keyof ProjectFormData, string>> = {}

		if (step === 0) {
			if (!formData.name.trim()) {
				newErrors.name = 'Project name is required'
			} else if (formData.name.length < 3) {
				newErrors.name = 'Name must be at least 3 characters'
			}

			if (!formData.description.trim()) {
				newErrors.description = 'Description is required'
			} else if (formData.description.length < 20) {
				newErrors.description = 'Description must be at least 20 characters'
			}

			if (!formData.icon) {
				newErrors.icon = 'Project icon is required'
			}
		}

		if (step === 1) {
			if (formData.techStack.length === 0) {
				newErrors.techStack = 'Select at least one technology'
			}
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const nextStep = () => {
		if (validateStep(currentStep)) {
			setCurrentStep((prev) => Math.min(prev + 1, 2))
		}
	}

	const prevStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0))
	}

	const handleSubmit = async () => {
		if (!validateStep(currentStep) || !user || !project) return

		setIsSubmitting(true)

		try {
			// In real app, this would call an API to update the project
			// For now we just show success
			Alert.alert('Project Updated! ✨', 'Your changes have been saved.', [
				{
					text: 'View Project',
					onPress: () => router.replace(`/project/${id}`),
				},
			])
		} catch {
			Alert.alert('Error', 'Failed to update project. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!project) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.errorContainer}>
					<Ionicons name='alert-circle' size={64} color={Colors.textTertiary} />
					<Text style={styles.errorText}>Project not found</Text>
					<Button
						title='Go Back'
						onPress={() => router.back()}
						style={{ marginTop: Spacing.lg }}
					/>
				</View>
			</SafeAreaView>
		)
	}

	const steps = ['Basic Info', 'Tech Stack', 'Links & Status']

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			{/* Header */}
			<Animated.View
				entering={FadeInDown.duration(500).springify()}
				style={styles.header}
			>
				<Pressable style={styles.closeButton} onPress={() => router.back()}>
					<Ionicons name='close' size={24} color={Colors.text} />
				</Pressable>
				<Text style={styles.headerTitle}>Edit Project</Text>
				<View style={styles.closeButton} />
			</Animated.View>

			{/* Progress */}
			<Animated.View
				entering={FadeInUp.duration(500).delay(100).springify()}
				style={styles.progressContainer}
			>
				{steps.map((step, index) => (
					<React.Fragment key={step}>
						<Pressable
							style={styles.stepItem}
							onPress={() => index < currentStep && setCurrentStep(index)}
						>
							<View
								style={[
									styles.stepCircle,
									index <= currentStep && styles.stepCircleActive,
								]}
							>
								{index < currentStep ? (
									<Ionicons name='checkmark' size={16} color={Colors.text} />
								) : (
									<Text
										style={[
											styles.stepNumber,
											index <= currentStep && styles.stepNumberActive,
										]}
									>
										{index + 1}
									</Text>
								)}
							</View>
							<Text
								style={[
									styles.stepLabel,
									index <= currentStep && styles.stepLabelActive,
								]}
							>
								{step}
							</Text>
						</Pressable>
						{index < steps.length - 1 && (
							<View
								style={[
									styles.stepLine,
									index < currentStep && styles.stepLineActive,
								]}
							/>
						)}
					</React.Fragment>
				))}
			</Animated.View>

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardAvoid}
			>
				<ScrollView
					style={styles.content}
					contentContainerStyle={styles.contentContainer}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps='handled'
				>
					{/* Step 1: Basic Info */}
					{currentStep === 0 && (
						<Animated.View
							entering={FadeInUp.duration(400).springify()}
							style={styles.stepContent}
						>
							<Text style={styles.stepTitle}>Edit Basic Information</Text>
							<Text style={styles.stepSubtitle}>
								Update your project details
							</Text>

							{/* Icon Picker */}
							<View style={styles.iconSection}>
								<Text style={styles.inputLabel}>Project Icon</Text>
								<Pressable
									style={[styles.iconPicker, errors.icon && styles.inputError]}
									onPress={pickIcon}
								>
									{formData.icon ? (
										<Image
											source={{ uri: formData.icon }}
											style={styles.iconPreview}
											contentFit='cover'
										/>
									) : (
										<View style={styles.iconPlaceholder}>
											<Ionicons
												name='camera'
												size={32}
												color={Colors.textTertiary}
											/>
											<Text style={styles.iconPlaceholderText}>
												Tap to select
											</Text>
										</View>
									)}
								</Pressable>
								{errors.icon && (
									<Text style={styles.errorText}>{errors.icon}</Text>
								)}
							</View>

							{/* Project Name */}
							<Input
								label='Project Name'
								placeholder='Enter project name'
								value={formData.name}
								onChangeText={(text) => updateField('name', text)}
								error={errors.name}
								maxLength={50}
							/>

							{/* Description */}
							<Input
								label='Description'
								placeholder='Describe your project and what testers should focus on...'
								value={formData.description}
								onChangeText={(text) => updateField('description', text)}
								error={errors.description}
								multiline
								numberOfLines={4}
								maxLength={500}
								style={styles.descriptionInput}
							/>

							{/* Screenshots */}
							<View style={styles.screenshotsSection}>
								<Text style={styles.inputLabel}>
									Screenshots ({formData.screenshots.length}/5)
								</Text>
								<ScrollView
									horizontal
									showsHorizontalScrollIndicator={false}
									contentContainerStyle={styles.screenshotsContainer}
								>
									{formData.screenshots.map((uri, index) => (
										<View key={index} style={styles.screenshotItem}>
											<Image
												source={{ uri }}
												style={styles.screenshotPreview}
												contentFit='cover'
											/>
											<Pressable
												style={styles.removeScreenshot}
												onPress={() => removeScreenshot(index)}
											>
												<Ionicons
													name='close-circle'
													size={24}
													color={Colors.error}
												/>
											</Pressable>
										</View>
									))}
									{formData.screenshots.length < 5 && (
										<Pressable
											style={styles.addScreenshot}
											onPress={pickScreenshots}
										>
											<Ionicons
												name='add'
												size={32}
												color={Colors.textTertiary}
											/>
										</Pressable>
									)}
								</ScrollView>
							</View>
						</Animated.View>
					)}

					{/* Step 2: Tech Stack */}
					{currentStep === 1 && (
						<Animated.View
							entering={FadeInUp.duration(400).springify()}
							style={styles.stepContent}
						>
							<Text style={styles.stepTitle}>Tech Stack</Text>
							<Text style={styles.stepSubtitle}>
								Update the technologies used ({formData.techStack.length}/8)
							</Text>

							{errors.techStack && (
								<Text style={[styles.errorText, { marginBottom: Spacing.md }]}>
									{errors.techStack}
								</Text>
							)}

							{/* Selected Tech */}
							{formData.techStack.length > 0 && (
								<View style={styles.selectedTech}>
									{formData.techStack.map((tech) => (
										<Pressable
											key={tech}
											style={styles.selectedTechItem}
											onPress={() => toggleTech(tech)}
										>
											<Text style={styles.selectedTechText}>{tech}</Text>
											<Ionicons name='close' size={16} color={Colors.text} />
										</Pressable>
									))}
								</View>
							)}

							{/* Suggested Tech */}
							<Text style={styles.suggestedLabel}>Suggested</Text>
							<View style={styles.techGrid}>
								{SUGGESTED_TECH.filter(
									(t) => !formData.techStack.includes(t)
								).map((tech) => (
									<Pressable
										key={tech}
										style={styles.techItem}
										onPress={() => toggleTech(tech)}
									>
										<Text style={styles.techText}>{tech}</Text>
									</Pressable>
								))}
							</View>

							{/* Add Custom Tech */}
							<View style={styles.addTechContainer}>
								<Input
									placeholder='Add custom technology'
									value={newTech}
									onChangeText={setNewTech}
									style={styles.addTechInput}
									onSubmitEditing={addCustomTech}
								/>
								<Pressable
									style={[
										styles.addTechButton,
										!newTech.trim() && styles.addTechButtonDisabled,
									]}
									onPress={addCustomTech}
									disabled={!newTech.trim()}
								>
									<Ionicons name='add' size={20} color={Colors.text} />
								</Pressable>
							</View>
						</Animated.View>
					)}

					{/* Step 3: Links & Status */}
					{currentStep === 2 && (
						<Animated.View
							entering={FadeInUp.duration(400).springify()}
							style={styles.stepContent}
						>
							<Text style={styles.stepTitle}>Links & Status</Text>
							<Text style={styles.stepSubtitle}>
								Update project links and status
							</Text>

							{/* Status Selection */}
							<Text style={styles.inputLabel}>Project Status</Text>
							<View style={styles.statusGrid}>
								{STATUS_OPTIONS.map((option) => (
									<Pressable
										key={option.id}
										style={[
											styles.statusOption,
											formData.status === option.id &&
												styles.statusOptionActive,
										]}
										onPress={() => updateField('status', option.id)}
									>
										<View style={styles.statusRadio}>
											{formData.status === option.id && (
												<View style={styles.statusRadioInner} />
											)}
										</View>
										<View style={styles.statusContent}>
											<Text style={styles.statusLabel}>{option.label}</Text>
											<Text style={styles.statusDesc}>
												{option.description}
											</Text>
										</View>
									</Pressable>
								))}
							</View>

							{/* Links */}
							<Text style={[styles.inputLabel, { marginTop: Spacing.lg }]}>
								Project Links (optional)
							</Text>

							<Input
								label='Website'
								placeholder='https://yourproject.com'
								value={formData.links.website || ''}
								onChangeText={(text) =>
									updateField('links', { ...formData.links, website: text })
								}
								autoCapitalize='none'
								keyboardType='url'
								leftIcon='globe-outline'
							/>

							<Input
								label='GitHub'
								placeholder='https://github.com/yourproject'
								value={formData.links.github || ''}
								onChangeText={(text) =>
									updateField('links', { ...formData.links, github: text })
								}
								autoCapitalize='none'
								keyboardType='url'
								leftIcon='logo-github'
							/>

							<Input
								label='TestFlight'
								placeholder='https://testflight.apple.com/...'
								value={formData.links.testFlight || ''}
								onChangeText={(text) =>
									updateField('links', { ...formData.links, testFlight: text })
								}
								autoCapitalize='none'
								keyboardType='url'
								leftIcon='paper-plane-outline'
							/>

							<Input
								label='App Store'
								placeholder='https://apps.apple.com/...'
								value={formData.links.appStore || ''}
								onChangeText={(text) =>
									updateField('links', { ...formData.links, appStore: text })
								}
								autoCapitalize='none'
								keyboardType='url'
								leftIcon='logo-apple-appstore'
							/>

							<Input
								label='Play Store'
								placeholder='https://play.google.com/store/apps/...'
								value={formData.links.playStore || ''}
								onChangeText={(text) =>
									updateField('links', { ...formData.links, playStore: text })
								}
								autoCapitalize='none'
								keyboardType='url'
								leftIcon='logo-google-playstore'
							/>
						</Animated.View>
					)}
				</ScrollView>

				{/* Footer Buttons */}
				<Animated.View
					entering={FadeInUp.duration(500).delay(200).springify()}
					style={styles.footer}
				>
					{currentStep > 0 && (
						<Button
							title='Back'
							variant='outline'
							onPress={prevStep}
							style={styles.footerButton}
						/>
					)}
					{currentStep < 2 ? (
						<Button
							title='Next'
							onPress={nextStep}
							style={currentStep === 0 ? { flex: 1 } : styles.footerButton}
						/>
					) : (
						<Button
							title='Save Changes'
							onPress={handleSubmit}
							loading={isSubmitting}
							style={styles.footerButton}
						/>
					)}
				</Animated.View>
			</KeyboardAvoidingView>
		</SafeAreaView>
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
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.md,
	},
	closeButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.card,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	progressContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.md,
	},
	stepItem: {
		alignItems: 'center',
	},
	stepCircle: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: Colors.card,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: Colors.border,
	},
	stepCircleActive: {
		backgroundColor: Colors.primary,
		borderColor: Colors.primary,
	},
	stepNumber: {
		fontSize: 14,
		fontFamily: Fonts.semibold,
		color: Colors.textTertiary,
	},
	stepNumberActive: {
		color: Colors.text,
	},
	stepLabel: {
		fontSize: 11,
		fontFamily: Fonts.medium,
		color: Colors.textTertiary,
		marginTop: 4,
	},
	stepLabelActive: {
		color: Colors.text,
	},
	stepLine: {
		width: 40,
		height: 2,
		backgroundColor: Colors.border,
		marginHorizontal: 4,
		marginBottom: 20,
	},
	stepLineActive: {
		backgroundColor: Colors.primary,
	},
	keyboardAvoid: {
		flex: 1,
	},
	content: {
		flex: 1,
	},
	contentContainer: {
		padding: Spacing.lg,
		paddingBottom: 100,
	},
	stepContent: {},
	stepTitle: {
		fontSize: 24,
		fontFamily: Fonts.bold,
		color: Colors.text,
		marginBottom: 4,
	},
	stepSubtitle: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		marginBottom: Spacing.xl,
	},
	iconSection: {
		marginBottom: Spacing.lg,
	},
	inputLabel: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.text,
		marginBottom: Spacing.sm,
	},
	iconPicker: {
		width: 120,
		height: 120,
		borderRadius: BorderRadius.lg,
		backgroundColor: Colors.card,
		borderWidth: 2,
		borderColor: Colors.border,
		borderStyle: 'dashed',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	inputError: {
		borderColor: Colors.error,
	},
	iconPreview: {
		width: '100%',
		height: '100%',
	},
	iconPlaceholder: {
		alignItems: 'center',
	},
	iconPlaceholderText: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		marginTop: 4,
	},
	errorText: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.error,
		marginTop: 4,
	},
	descriptionInput: {
		height: 100,
		textAlignVertical: 'top',
	},
	screenshotsSection: {
		marginTop: Spacing.md,
	},
	screenshotsContainer: {
		gap: Spacing.sm,
		paddingVertical: Spacing.sm,
	},
	screenshotItem: {
		position: 'relative',
	},
	screenshotPreview: {
		width: 100,
		height: 180,
		borderRadius: BorderRadius.md,
	},
	removeScreenshot: {
		position: 'absolute',
		top: -8,
		right: -8,
		backgroundColor: Colors.background,
		borderRadius: 12,
	},
	addScreenshot: {
		width: 100,
		height: 180,
		borderRadius: BorderRadius.md,
		backgroundColor: Colors.card,
		borderWidth: 2,
		borderColor: Colors.border,
		borderStyle: 'dashed',
		alignItems: 'center',
		justifyContent: 'center',
	},
	selectedTech: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: Spacing.sm,
		marginBottom: Spacing.lg,
	},
	selectedTechItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.primary,
		paddingVertical: 6,
		paddingLeft: 12,
		paddingRight: 8,
		borderRadius: BorderRadius.full,
		gap: 4,
	},
	selectedTechText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.text,
	},
	suggestedLabel: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
		marginBottom: Spacing.sm,
	},
	techGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: Spacing.sm,
		marginBottom: Spacing.lg,
	},
	techItem: {
		backgroundColor: Colors.card,
		paddingVertical: 8,
		paddingHorizontal: 14,
		borderRadius: BorderRadius.full,
		borderWidth: 1,
		borderColor: Colors.border,
	},
	techText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
	addTechContainer: {
		flexDirection: 'row',
		gap: Spacing.sm,
	},
	addTechInput: {
		flex: 1,
	},
	addTechButton: {
		width: 48,
		height: 48,
		borderRadius: BorderRadius.md,
		backgroundColor: Colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	addTechButtonDisabled: {
		backgroundColor: Colors.card,
	},
	statusGrid: {
		gap: Spacing.sm,
	},
	statusOption: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: Spacing.md,
		backgroundColor: Colors.card,
		borderRadius: BorderRadius.md,
		borderWidth: 2,
		borderColor: Colors.border,
	},
	statusOptionActive: {
		borderColor: Colors.primary,
		backgroundColor: `${Colors.primary}15`,
	},
	statusRadio: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: Colors.border,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: Spacing.md,
	},
	statusRadioInner: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: Colors.primary,
	},
	statusContent: {
		flex: 1,
	},
	statusLabel: {
		fontSize: 15,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	statusDesc: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
	footer: {
		flexDirection: 'row',
		padding: Spacing.lg,
		paddingBottom: Spacing.xl,
		gap: Spacing.md,
		borderTopWidth: 1,
		borderTopColor: Colors.border,
		backgroundColor: Colors.background,
	},
	footerButton: {
		flex: 1,
	},
	errorContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: Spacing.xl,
	},
})
