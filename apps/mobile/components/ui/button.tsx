import type React from "react";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	type TextStyle,
	type ViewStyle,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import {
	BorderRadius,
	Colors,
	Fonts,
	Shadows,
	Spacing,
} from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "outline"
	| "ghost"
	| "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
	title: string;
	onPress: () => void;
	variant?: ButtonVariant;
	size?: ButtonSize;
	disabled?: boolean;
	loading?: boolean;
	icon?: React.ReactNode;
	iconPosition?: "left" | "right";
	fullWidth?: boolean;
	style?: ViewStyle;
	textStyle?: TextStyle;
}

export function Button({
	title,
	onPress,
	variant = "primary",
	size = "md",
	disabled = false,
	loading = false,
	icon,
	iconPosition = "left",
	fullWidth = false,
	style,
	textStyle,
}: ButtonProps) {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const handlePressIn = () => {
		scale.value = withSpring(0.96);
	};

	const handlePressOut = () => {
		scale.value = withSpring(1);
	};

	const buttonStyles = [
		styles.button,
		styles[`button_${variant}`],
		styles[`button_${size}`],
		fullWidth && styles.fullWidth,
		disabled && styles.disabled,
		style,
	];

	const textStyles = [
		styles.text,
		styles[`text_${variant}`],
		styles[`text_${size}`],
		disabled && styles.textDisabled,
		textStyle,
	];

	return (
		<AnimatedPressable
			style={[buttonStyles, animatedStyle]}
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={disabled || loading}
		>
			{loading ? (
				<ActivityIndicator
					color={
						variant === "outline" || variant === "ghost"
							? Colors.primary
							: Colors.text
					}
					size="small"
				/>
			) : (
				<>
					{icon && iconPosition === "left" && icon}
					<Text style={textStyles}>{title}</Text>
					{icon && iconPosition === "right" && icon}
				</>
			)}
		</AnimatedPressable>
	);
}

const styles = StyleSheet.create({
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: Spacing.sm,
		borderRadius: BorderRadius.lg,
		...Shadows.sm,
	},
	fullWidth: {
		width: "100%",
	},
	disabled: {
		opacity: 0.5,
	},

	// Variants
	button_primary: {
		backgroundColor: Colors.primary,
	},
	button_secondary: {
		backgroundColor: Colors.backgroundTertiary,
	},
	button_outline: {
		backgroundColor: "transparent",
		borderWidth: 1.5,
		borderColor: Colors.primary,
	},
	button_ghost: {
		backgroundColor: "transparent",
	},
	button_danger: {
		backgroundColor: Colors.error,
	},

	// Sizes
	button_sm: {
		paddingVertical: Spacing.sm,
		paddingHorizontal: Spacing.md,
		minHeight: 36,
	},
	button_md: {
		paddingVertical: Spacing.sm + 4,
		paddingHorizontal: Spacing.lg,
		minHeight: 48,
	},
	button_lg: {
		paddingVertical: Spacing.md,
		paddingHorizontal: Spacing.xl,
		minHeight: 56,
	},

	// Text styles
	text: {
		fontFamily: Fonts.semibold,
	},
	textDisabled: {
		opacity: 0.7,
	},
	text_primary: {
		color: Colors.text,
	},
	text_secondary: {
		color: Colors.text,
	},
	text_outline: {
		color: Colors.primary,
	},
	text_ghost: {
		color: Colors.primary,
	},
	text_danger: {
		color: Colors.text,
	},
	text_sm: {
		fontSize: 14,
	},
	text_md: {
		fontSize: 16,
	},
	text_lg: {
		fontSize: 18,
	},
});
