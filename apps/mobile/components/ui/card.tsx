import { BorderRadius, Colors, Shadows, Spacing } from "@/constants/theme";
import type React from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
	children: React.ReactNode;
	onPress?: () => void;
	style?: ViewStyle;
	variant?: "default" | "elevated" | "outline";
	padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
	children,
	onPress,
	style,
	variant = "default",
	padding = "md",
}: CardProps) {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const handlePressIn = () => {
		if (onPress) {
			scale.value = withSpring(0.98);
		}
	};

	const handlePressOut = () => {
		if (onPress) {
			scale.value = withSpring(1);
		}
	};

	const cardStyles = [
		styles.card,
		styles[`card_${variant}`],
		styles[`padding_${padding}`],
		style,
	];

	if (onPress) {
		return (
			<AnimatedPressable
				style={[cardStyles, animatedStyle]}
				onPress={onPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
			>
				{children}
			</AnimatedPressable>
		);
	}

	return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
	card: {
		borderRadius: BorderRadius.lg,
		overflow: "hidden",
	},

	// Variants
	card_default: {
		backgroundColor: Colors.card,
	},
	card_elevated: {
		backgroundColor: Colors.card,
		...Shadows.md,
	},
	card_outline: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: Colors.border,
	},

	// Padding
	padding_none: {
		padding: 0,
	},
	padding_sm: {
		padding: Spacing.sm,
	},
	padding_md: {
		padding: Spacing.md,
	},
	padding_lg: {
		padding: Spacing.lg,
	},
});
