import { Button, Card } from '@/components/ui'
import { BorderRadius, Colors, Fonts, Spacing } from '@/constants/theme'
import { getReleasesForProject } from '@/data/mockData'
import type { Release } from '@/interfaces'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useMemo, useState } from 'react'
import {
    Pressable,
    Share,
    StyleSheet,
    Text,
    View
} from 'react-native'
import Animated, {
    Extrapolation,
    FadeInUp,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const HEADER_MAX_HEIGHT = 200
const HEADER_MIN_HEIGHT = 100

// Simple Markdown renderer
function renderMarkdown(text: string) {
	const lines = text.split('\n')
	const elements: React.ReactNode[] = []

	lines.forEach((line, index) => {
		const key = `line-${index}`

		// Headers
		if (line.startsWith('## ')) {
			elements.push(
				<Text key={key} style={styles.markdownH2}>
					{line.replace('## ', '')}
				</Text>
			)
		} else if (line.startsWith('### ')) {
			elements.push(
				<Text key={key} style={styles.markdownH3}>
					{line.replace('### ', '')}
				</Text>
			)
		}
		// Horizontal rule
		else if (line.startsWith('---')) {
			elements.push(<View key={key} style={styles.markdownHr} />)
		}
		// List items
		else if (line.startsWith('- ')) {
			const content = line.replace('- ', '')
			// Check for bold text
			const boldRegex = /\*\*(.*?)\*\*/g
			const parts = content.split(boldRegex)
			
			elements.push(
				<View key={key} style={styles.markdownListItem}>
					<Text style={styles.markdownBullet}>•</Text>
					<Text style={styles.markdownListText}>
						{parts.map((part, i) => 
							i % 2 === 1 ? (
								<Text key={i} style={styles.markdownBold}>{part}</Text>
							) : (
								part
							)
						)}
					</Text>
				</View>
			)
		}
		// Numbered list
		else if (/^\d+\.\s/.test(line)) {
			const number = line.match(/^(\d+)\./)?.[1]
			const content = line.replace(/^\d+\.\s/, '')
			elements.push(
				<View key={key} style={styles.markdownListItem}>
					<Text style={styles.markdownNumber}>{number}.</Text>
					<Text style={styles.markdownListText}>{content}</Text>
				</View>
			)
		}
		// Regular paragraph
		else if (line.trim() !== '') {
			elements.push(
				<Text key={key} style={styles.markdownParagraph}>
					{line}
				</Text>
			)
		}
		// Empty line (spacer)
		else {
			elements.push(<View key={key} style={styles.markdownSpacer} />)
		}
	})

	return elements
}

export default function ReleaseDetailScreen() {
	const { id: projectId, releaseId } = useLocalSearchParams<{
		id: string
		releaseId: string
	}>()
	const insets = useSafeAreaInsets()
	const scrollY = useSharedValue(0)
	const [copiedLink, setCopiedLink] = useState(false)

	// Get release from centralized mock data
	const release = useMemo(() => {
		const releases = getReleasesForProject(projectId || '1')
		return releases.find(r => r.id === releaseId) || releases[0] || {
			id: releaseId || 'unknown',
			projectId: projectId || '1',
			version: '0.0.0',
			title: 'Unknown Release',
			createdAt: new Date(),
		}
	}, [projectId, releaseId])

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y
		},
	})

	const headerAnimatedStyle = useAnimatedStyle(() => {
		const height = interpolate(
			scrollY.value,
			[0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
			Extrapolation.CLAMP
		)
		return { height }
	})

	const titleAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[0, 40, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[1, 0.5, 0],
			Extrapolation.CLAMP
		)
		const scale = interpolate(
			scrollY.value,
			[0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[1, 0.8],
			Extrapolation.CLAMP
		)
		return { opacity, transform: [{ scale }] }
	})

	const headerTitleStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[40, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
			[0, 1],
			Extrapolation.CLAMP
		)
		return { opacity }
	})

	const getStatusColor = (status: Release['status']) => {
		switch (status) {
			case 'published':
				return Colors.success
			case 'beta':
				return Colors.warning
			case 'draft':
				return Colors.textTertiary
			case 'archived':
				return Colors.error
			default:
				return Colors.textSecondary
		}
	}

	const formatFileSize = (bytes?: number) => {
		if (!bytes) return 'N/A'
		const mb = bytes / (1024 * 1024)
		return `${mb.toFixed(1)} MB`
	}

	const handleCopyLink = async () => {
		if (release.downloadUrl) {
			await Clipboard.setStringAsync(release.downloadUrl)
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
			setCopiedLink(true)
			setTimeout(() => setCopiedLink(false), 2000)
		}
	}

	const handleShare = async () => {
		try {
			await Share.share({
				message: `Check out ${release.title} (v${release.version})!\n\nDownload: ${release.downloadUrl}`,
			})
		} catch (error) {
			console.error(error)
		}
	}

	const handleDownload = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
		// In a real app, this would trigger the download
	}

	const statusColor = getStatusColor(release.status)

	return (
		<View style={styles.container}>
			{/* Parallax Header */}
			<Animated.View style={[styles.header, headerAnimatedStyle]}>
				<LinearGradient
					colors={[Colors.primary, `${Colors.primary}99`, Colors.background]}
					style={styles.headerGradient}
				/>

				{/* Nav Bar */}
				<View style={[styles.navBar, { paddingTop: insets.top }]}>
					<Pressable style={styles.navButton} onPress={() => router.back()}>
						<Ionicons name="arrow-back" size={24} color={Colors.text} />
					</Pressable>
					<Animated.Text style={[styles.headerTitle, headerTitleStyle]}>
						v{release.version}
					</Animated.Text>
					<Pressable style={styles.navButton} onPress={handleShare}>
						<Ionicons name="share-outline" size={22} color={Colors.text} />
					</Pressable>
				</View>

				{/* Release Info */}
				<Animated.View style={[styles.headerContent, titleAnimatedStyle]}>
					<View style={styles.versionBadge}>
						<Text style={styles.versionText}>{release.version}</Text>
					</View>
					<Text style={styles.releaseTitle}>{release.title}</Text>
					<View
						style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}
					>
						<Ionicons
							name={
								release.status === 'published'
									? 'checkmark-circle'
									: release.status === 'beta'
									? 'flask'
									: 'create'
							}
							size={14}
							color={statusColor}
						/>
						<Text style={[styles.statusText, { color: statusColor }]}>
							{(release.status || 'draft').charAt(0).toUpperCase() + (release.status || 'draft').slice(1)}
						</Text>
					</View>
				</Animated.View>
			</Animated.View>

			<Animated.ScrollView
				style={styles.scrollView}
				contentContainerStyle={[
					styles.scrollContent,
					{ paddingTop: HEADER_MAX_HEIGHT + Spacing.md },
				]}
				showsVerticalScrollIndicator={false}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
			>
				{/* Quick Info */}
				<Animated.View entering={FadeInUp.duration(300)}>
					<Card style={styles.infoCard}>
						<View style={styles.infoGrid}>
							<View style={styles.infoItem}>
								<Ionicons
									name="calendar"
									size={18}
									color={Colors.textTertiary}
								/>
								<Text style={styles.infoLabel}>Released</Text>
								<Text style={styles.infoValue}>
									{release.publishedAt?.toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric',
									}) || 'Not yet'}
								</Text>
							</View>
							<View style={styles.infoItem}>
								<Ionicons
									name="document"
									size={18}
									color={Colors.textTertiary}
								/>
								<Text style={styles.infoLabel}>Size</Text>
								<Text style={styles.infoValue}>
									{formatFileSize(release.fileSize)}
								</Text>
							</View>
							<View style={styles.infoItem}>
								<Ionicons
									name="construct"
									size={18}
									color={Colors.textTertiary}
								/>
								<Text style={styles.infoLabel}>Build</Text>
								<Text style={styles.infoValue}>
									{release.buildNumber || 'N/A'}
								</Text>
							</View>
							<View style={styles.infoItem}>
								<Ionicons
									name="phone-portrait"
									size={18}
									color={Colors.textTertiary}
								/>
								<Text style={styles.infoLabel}>Min OS</Text>
								<Text style={styles.infoValue}>
									{release.minOsVersion || 'N/A'}
								</Text>
							</View>
						</View>
					</Card>
				</Animated.View>

				{/* Download Section */}
				{release.downloadUrl && (
					<Animated.View entering={FadeInUp.duration(300).delay(100)}>
						<Card style={styles.downloadCard}>
							<Text style={styles.downloadTitle}>Download</Text>
							<View style={styles.downloadActions}>
								<Button
									title="Download"
									onPress={handleDownload}
									icon={
										<Ionicons
											name="download"
											size={18}
											color={Colors.text}
										/>
									}
									style={styles.downloadButton}
								/>
								<Pressable
									style={styles.copyButton}
									onPress={handleCopyLink}
								>
									<Ionicons
										name={copiedLink ? 'checkmark' : 'copy-outline'}
										size={20}
										color={copiedLink ? Colors.success : Colors.text}
									/>
								</Pressable>
							</View>
							{copiedLink && (
								<Text style={styles.copiedText}>Link copied!</Text>
							)}
						</Card>
					</Animated.View>
				)}

				{/* Release Notes */}
				<Animated.View entering={FadeInUp.duration(300).delay(200)}>
					<Card style={styles.notesCard}>
						<View style={styles.notesHeader}>
							<Ionicons
								name="document-text"
								size={20}
								color={Colors.primary}
							/>
							<Text style={styles.notesTitle}>Release Notes</Text>
						</View>
						<View style={styles.notesContent}>
							{renderMarkdown(release.releaseNotes || '')}
						</View>
					</Card>
				</Animated.View>

				{/* Changelog Quick View */}
				{release.changelog && Array.isArray(release.changelog) && release.changelog.length > 0 && (
					<Animated.View entering={FadeInUp.duration(300).delay(300)}>
						<Card style={styles.changelogCard}>
							<View style={styles.changelogHeader}>
								<Ionicons
									name="list"
									size={20}
									color={Colors.success}
								/>
								<Text style={styles.changelogTitle}>Quick Changelog</Text>
							</View>
							{(release.changelog as string[]).map((item: string, index: number) => (
								<View key={index} style={styles.changelogItem}>
									<Ionicons
										name="checkmark-circle"
										size={16}
										color={Colors.success}
									/>
									<Text style={styles.changelogText}>{item}</Text>
								</View>
							))}
						</Card>
					</Animated.View>
				)}
			</Animated.ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: Spacing.lg,
		paddingBottom: Spacing.xxl,
	},

	// Header
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
		overflow: 'hidden',
	},
	headerGradient: {
		...StyleSheet.absoluteFillObject,
	},
	navBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: Spacing.md,
		paddingBottom: Spacing.sm,
	},
	navButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'rgba(0,0,0,0.2)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	headerContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: Spacing.md,
	},
	versionBadge: {
		backgroundColor: 'rgba(255,255,255,0.2)',
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.xs,
		borderRadius: BorderRadius.full,
		marginBottom: Spacing.sm,
	},
	versionText: {
		fontSize: 14,
		fontFamily: Fonts.bold,
		color: Colors.text,
	},
	releaseTitle: {
		fontSize: 20,
		fontFamily: Fonts.bold,
		color: Colors.text,
		textAlign: 'center',
		marginBottom: Spacing.sm,
	},
	statusBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: Spacing.sm,
		paddingVertical: 4,
		borderRadius: BorderRadius.full,
	},
	statusText: {
		fontSize: 12,
		fontFamily: Fonts.semibold,
	},

	// Info Card
	infoCard: {
		marginBottom: Spacing.md,
	},
	infoGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	infoItem: {
		width: '50%',
		alignItems: 'center',
		paddingVertical: Spacing.sm,
	},
	infoLabel: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		marginTop: 4,
	},
	infoValue: {
		fontSize: 14,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginTop: 2,
	},

	// Download Card
	downloadCard: {
		marginBottom: Spacing.md,
	},
	downloadTitle: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginBottom: Spacing.md,
	},
	downloadActions: {
		flexDirection: 'row',
		gap: Spacing.sm,
	},
	downloadButton: {
		flex: 1,
	},
	copyButton: {
		width: 48,
		height: 48,
		borderRadius: BorderRadius.md,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	copiedText: {
		fontSize: 12,
		fontFamily: Fonts.medium,
		color: Colors.success,
		textAlign: 'center',
		marginTop: Spacing.sm,
	},

	// Notes Card
	notesCard: {
		marginBottom: Spacing.md,
	},
	notesHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.sm,
		marginBottom: Spacing.md,
		paddingBottom: Spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
	notesTitle: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	notesContent: {},

	// Markdown Styles
	markdownH2: {
		fontSize: 18,
		fontFamily: Fonts.bold,
		color: Colors.text,
		marginTop: Spacing.md,
		marginBottom: Spacing.sm,
	},
	markdownH3: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		marginTop: Spacing.md,
		marginBottom: Spacing.sm,
	},
	markdownParagraph: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		lineHeight: 20,
		marginBottom: Spacing.xs,
	},
	markdownListItem: {
		flexDirection: 'row',
		marginBottom: Spacing.xs,
		paddingLeft: Spacing.sm,
	},
	markdownBullet: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.primary,
		width: 20,
	},
	markdownNumber: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.primary,
		width: 24,
	},
	markdownListText: {
		flex: 1,
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		lineHeight: 20,
	},
	markdownBold: {
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	markdownHr: {
		height: 1,
		backgroundColor: Colors.border,
		marginVertical: Spacing.md,
	},
	markdownSpacer: {
		height: Spacing.xs,
	},

	// Changelog Card
	changelogCard: {
		marginBottom: Spacing.md,
	},
	changelogHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.sm,
		marginBottom: Spacing.md,
	},
	changelogTitle: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.text,
	},
	changelogItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: Spacing.sm,
		marginBottom: Spacing.sm,
	},
	changelogText: {
		flex: 1,
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		lineHeight: 20,
	},
})
