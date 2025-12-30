import { Platform } from 'react-native'

export const Colors = {
	text: '#ECEDEE',
	background: '#F5D4A6',
	tint: '#fff',
	icon: '#9BA1A6',
	tabIconDefault: '#9BA1A6',
	tabIconSelected: '#fff',
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
