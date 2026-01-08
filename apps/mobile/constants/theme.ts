import { Platform } from 'react-native'

export const Colors = {
	primary: '#0096A8',
	primaryDark: '#007A8A',
	primaryLight: '#00B4C8',

	background: '#0D0D0D',
	backgroundSecondary: '#1A1A1A',
	backgroundTertiary: '#262626',
	card: '#1E1E1E',
	cardHover: '#2A2A2A',

	landingBackground: '#F5D4A6',
	landingCard: '#FFE3C1',
	landingAccent: '#D4A574',
	landingText: '#2C2C2C',
	landingTextSecondary: '#5C5C5C',

	text: '#FFFFFF',
	textSecondary: '#A0A0A0',
	textTertiary: '#666666',
	textMuted: '#4A4A4A',

	success: '#10B981',
	warning: '#F59E0B',
	error: '#EF4444',
	info: '#3B82F6',

	bug: '#EF4444',
	feature: '#8B5CF6',
	praise: '#10B981',

	statusOpen: '#3B82F6',
	statusInProgress: '#F59E0B',
	statusResolved: '#10B981',
	statusClosed: '#6B7280',

	projectActive: '#10B981',
	projectClosed: '#6B7280',

	border: '#333333',
	borderLight: '#444444',
	divider: '#2A2A2A',
	overlay: 'rgba(0, 0, 0, 0.7)',

	tint: '#0096A8',
	tabIconDefault: '#666666',
	tabIconSelected: '#0096A8',
	tabBarBackground: '#0D0D0D',

	icon: '#9BA1A6',
}

export const Spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
}

export const FontSizes = {
	xs: 12,
	sm: 14,
	md: 16,
	lg: 18,
	xl: 20,
	xxl: 28,
	xxxl: 36,
}

export const BorderRadius = {
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	full: 9999,
}

export const Shadows = {
	sm: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
	md: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 4,
	},
	lg: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
}

export const Fonts = Platform.select({
	ios: {
		/** iOS `UIFontDescriptorSystemDesignDefault` */
		sans: 'system-ui',
		/** iOS `UIFontDescriptorSystemDesignSerif` */
		serif: 'ui-serif',
		/** iOS `UIFontDescriptorSystemDesignRounded` */
		rounded: 'ui-rounded',
		/** iOS `UIFontDescriptorSystemDesignMonospaced` */
		mono: 'ui-monospace',
		/** Inter Font Family */
		regular: 'Inter-Regular',
		medium: 'Inter-Medium',
		semibold: 'Inter-SemiBold',
		bold: 'Inter-Bold',
		boldItalic: 'Inter-BoldItalic',
		greatVibes: 'GreatVibes-Regular',
	},
	default: {
		sans: 'normal',
		serif: 'serif',
		rounded: 'normal',
		mono: 'monospace',
		regular: 'Inter-Regular',
		medium: 'Inter-Medium',
		semibold: 'Inter-SemiBold',
		bold: 'Inter-Bold',
		boldItalic: 'Inter-BoldItalic',
		greatVibes: 'GreatVibes-Regular',
	},
	web: {
		sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		serif: "Georgia, 'Times New Roman', serif",
		rounded:
			"'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
		mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
		regular: 'Inter-Regular',
		medium: 'Inter-Medium',
		semibold: 'Inter-SemiBold',
		bold: 'Inter-Bold',
		boldItalic: 'Inter-BoldItalic',
		greatVibes: 'GreatVibes-Regular',
	},
})
