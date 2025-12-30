import { ProjectStatusBadge } from '@/components/ui'
import { BorderRadius, Colors, Fonts, Spacing } from '@/constants/theme'
import type { Project } from '@/interfaces'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface ProjectCardProps {
	project: Project
	variant?: 'default' | 'compact'
}

export function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
	const scale = useSharedValue(1)

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}))

	const handlePressIn = () => {
		scale.value = withSpring(0.98)
	}

	const handlePressOut = () => {
		scale.value = withSpring(1)
	}

	const handlePress = () => {
		router.push(`/project/${project.id}`)
	}

	if (variant === 'compact') {
		return (
			<AnimatedPressable
				style={[styles.compactCard, animatedStyle]}
				onPress={handlePress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
			>
				{project.icon ? (
					<Image source={{ uri: project.icon }} style={styles.compactIcon} />
				) : (
					<View style={styles.compactIconPlaceholder}>
						<Ionicons name='cube-outline' size={24} color={Colors.textTertiary} />
					</View>
				)}
				<View style={styles.compactContent}>
					<Text style={styles.compactName} numberOfLines={1}>
						{project.name}
					</Text>
					<Text style={styles.compactDescription} numberOfLines={1}>
						{project.shortDescription || project.description}
					</Text>
				</View>
				<ProjectStatusBadge status={project.status} />
			</AnimatedPressable>
		)
	}

	return (
		<AnimatedPressable
			style={[styles.card, animatedStyle]}
			onPress={handlePress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
		>
			{/* Project Icon/Image */}
			<View style={styles.imageContainer}>
				{project.screenshots && project.screenshots.length > 0 ? (
					<Image
						source={{ uri: project.screenshots[0] }}
						style={styles.image}
						contentFit='cover'
					/>
				) : (
					<View style={styles.imagePlaceholder}>
						<Ionicons name='image-outline' size={48} color={Colors.textTertiary} />
					</View>
				)}
				<View style={styles.statusBadgeContainer}>
					<ProjectStatusBadge status={project.status} />
				</View>
			</View>

			{/* Content */}
			<View style={styles.content}>
				<View style={styles.header}>
					{project.icon ? (
						<Image source={{ uri: project.icon }} style={styles.icon} />
					) : (
						<View style={styles.iconPlaceholder}>
							<Ionicons name='cube' size={20} color={Colors.primary} />
						</View>
					)}
					<View style={styles.titleContainer}>
						<Text style={styles.name} numberOfLines={1}>
							{project.name}
						</Text>
						{project.creator && (
							<Text style={styles.creator}>by {project.creator.displayName}</Text>
						)}
					</View>
				</View>

				<Text style={styles.description} numberOfLines={2}>
					{project.shortDescription || project.description}
				</Text>

				{/* Tech Stack */}
				{project.techStack.length > 0 && (
					<View style={styles.techStack}>
						{project.techStack.slice(0, 3).map((tech) => (
							<View key={tech} style={styles.techTag}>
								<Text style={styles.techText}>{tech}</Text>
							</View>
						))}
						{project.techStack.length > 3 && (
							<Text style={styles.moreTech}>+{project.techStack.length - 3}</Text>
						)}
					</View>
				)}

				{/* Stats */}
				<View style={styles.stats}>
					<View style={styles.stat}>
						<Ionicons name='people-outline' size={16} color={Colors.textTertiary} />
						<Text style={styles.statText}>{project.testerCount} testers</Text>
					</View>
					<View style={styles.stat}>
						<Ionicons name='chatbubble-outline' size={16} color={Colors.textTertiary} />
						<Text style={styles.statText}>{project.feedbackCount} feedback</Text>
					</View>
				</View>
			</View>
		</AnimatedPressable>
	)
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: Colors.card,
		borderRadius: BorderRadius.lg,
		overflow: 'hidden',
		marginBottom: Spacing.md,
	},
	imageContainer: {
		height: 140,
		position: 'relative',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	imagePlaceholder: {
		width: '100%',
		height: '100%',
		backgroundColor: Colors.backgroundSecondary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	statusBadgeContainer: {
		position: 'absolute',
		top: Spacing.sm,
		right: Spacing.sm,
	},
	content: {
		padding: Spacing.md,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: Spacing.sm,
	},
	icon: {
		width: 36,
		height: 36,
		borderRadius: 8,
	},
	iconPlaceholder: {
		width: 36,
		height: 36,
		borderRadius: 8,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleContainer: {
		flex: 1,
		marginLeft: Spacing.sm,
	},
	name: {
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	creator: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
	},
	description: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		lineHeight: 20,
		marginBottom: Spacing.sm,
	},
	techStack: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: Spacing.xs,
		marginBottom: Spacing.md,
	},
	techTag: {
		backgroundColor: Colors.backgroundTertiary,
		paddingVertical: 2,
		paddingHorizontal: Spacing.sm,
		borderRadius: BorderRadius.sm,
	},
	techText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
		color: Colors.textSecondary,
	},
	moreTech: {
		fontSize: 12,
		fontFamily: Fonts.medium,
		color: Colors.textTertiary,
		alignSelf: 'center',
	},
	stats: {
		flexDirection: 'row',
		gap: Spacing.lg,
	},
	stat: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.xs,
	},
	statText: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
	},

	// Compact variant
	compactCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.card,
		borderRadius: BorderRadius.md,
		padding: Spacing.md,
		marginBottom: Spacing.sm,
	},
	compactIcon: {
		width: 44,
		height: 44,
		borderRadius: 10,
	},
	compactIconPlaceholder: {
		width: 44,
		height: 44,
		borderRadius: 10,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	compactContent: {
		flex: 1,
		marginLeft: Spacing.md,
		marginRight: Spacing.sm,
	},
	compactName: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginBottom: 2,
	},
	compactDescription: {
		fontSize: 13,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
})
