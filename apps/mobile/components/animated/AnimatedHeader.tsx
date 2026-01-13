import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { ReactNode } from "react";
import {
	Dimensions,
	Pressable,
	StyleSheet,
	View,
	type ViewStyle,
} from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	type SharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";
import { Colors, Fonts, Spacing } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface AnimatedHeaderProps {
	scrollY: SharedValue<number>;
	headerHeight?: number;
	minHeaderHeight?: number;
	title?: string;
	showBackButton?: boolean;
	rightActions?: ReactNode;
	headerImage?: ReactNode;
	headerContent?: ReactNode;
	stickyContent?: ReactNode;
	stickyOffset?: number;
	style?: ViewStyle;
}

export default function AnimatedHeader({
	scrollY,
	headerHeight = 250,
	minHeaderHeight = 90,
	title,
	showBackButton = true,
	rightActions,
	headerImage,
	headerContent,
	stickyContent,
	stickyOffset = 0,
	style,
}: AnimatedHeaderProps) {
	const scrollDistance = headerHeight - minHeaderHeight;

	// Animated styles for the main header container
	const headerAnimatedStyle = useAnimatedStyle(() => {
		const height = interpolate(
			scrollY.value,
			[0, scrollDistance],
			[headerHeight, minHeaderHeight],
			Extrapolation.CLAMP,
		);
		return { height };
	});

	// Animated styles for the header image/background
	const imageAnimatedStyle = useAnimatedStyle(() => {
		const translateY = interpolate(
			scrollY.value,
			[-100, 0, scrollDistance],
			[-50, 0, scrollDistance * 0.5],
			Extrapolation.CLAMP,
		);
		const scale = interpolate(
			scrollY.value,
			[-100, 0],
			[1.5, 1],
			Extrapolation.CLAMP,
		);
		const opacity = interpolate(
			scrollY.value,
			[0, scrollDistance * 0.7],
			[1, 0],
			Extrapolation.CLAMP,
		);
		return {
			transform: [{ translateY }, { scale }],
			opacity,
		};
	});

	// Animated styles for header content (fades out on scroll)
	const contentAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[0, scrollDistance * 0.5],
			[1, 0],
			Extrapolation.CLAMP,
		);
		const translateY = interpolate(
			scrollY.value,
			[0, scrollDistance * 0.5],
			[0, -20],
			Extrapolation.CLAMP,
		);
		return { opacity, transform: [{ translateY }] };
	});

	// Animated styles for the collapsed title
	const collapsedTitleStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[scrollDistance * 0.7, scrollDistance],
			[0, 1],
			Extrapolation.CLAMP,
		);
		return { opacity };
	});

	// Animated styles for navigation buttons background
	const navButtonsBgStyle = useAnimatedStyle(() => {
		const backgroundColor = interpolate(
			scrollY.value,
			[0, scrollDistance * 0.5],
			[0, 1],
			Extrapolation.CLAMP,
		);
		return {
			backgroundColor: `rgba(23, 23, 23, ${backgroundColor})`,
		};
	});

	return (
		<Animated.View style={[styles.header, style, headerAnimatedStyle]}>
			{/* Background/Image Layer */}
			{headerImage && (
				<Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
					{headerImage}
				</Animated.View>
			)}

			{/* Gradient Overlay */}
			<View style={styles.gradientOverlay} />

			{/* Navigation Bar */}
			<Animated.View style={[styles.navBar, navButtonsBgStyle]}>
				{showBackButton && (
					<Pressable style={styles.navButton} onPress={() => router.back()}>
						<Ionicons name="arrow-back" size={24} color={Colors.text} />
					</Pressable>
				)}

				{title && (
					<Animated.Text
						style={[styles.collapsedTitle, collapsedTitleStyle]}
						numberOfLines={1}
					>
						{title}
					</Animated.Text>
				)}

				<View style={styles.rightActionsContainer}>{rightActions}</View>
			</Animated.View>

			{/* Header Content (visible when expanded) */}
			{headerContent && (
				<Animated.View style={[styles.headerContent, contentAnimatedStyle]}>
					{headerContent}
				</Animated.View>
			)}

			{/* Sticky Content */}
			{stickyContent && (
				<View style={[styles.stickyContainer, { bottom: stickyOffset }]}>
					{stickyContent}
				</View>
			)}
		</Animated.View>
	);
}

interface StickyHeaderProps {
	scrollY: SharedValue<number>;
	threshold: number;
	children: ReactNode;
	style?: ViewStyle;
}

export function StickyHeader({
	scrollY,
	threshold,
	children,
	style,
}: StickyHeaderProps) {
	const stickyStyle = useAnimatedStyle(() => {
		const translateY = interpolate(
			scrollY.value,
			[threshold - 10, threshold],
			[-60, 0],
			Extrapolation.CLAMP,
		);
		const opacity = interpolate(
			scrollY.value,
			[threshold - 10, threshold],
			[0, 1],
			Extrapolation.CLAMP,
		);
		return {
			transform: [{ translateY }],
			opacity,
		};
	});

	return (
		<Animated.View style={[styles.stickyHeader, style, stickyStyle]}>
			{children}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	header: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
		overflow: "hidden",
	},
	imageContainer: {
		...StyleSheet.absoluteFillObject,
	},
	gradientOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.3)",
	},
	navBar: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: Spacing.md,
		paddingTop: 50,
		paddingBottom: Spacing.sm,
	},
	navButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(0,0,0,0.3)",
		alignItems: "center",
		justifyContent: "center",
	},
	collapsedTitle: {
		flex: 1,
		fontSize: 18,
		fontFamily: Fonts.semibold,
		color: Colors.text,
		textAlign: "center",
		marginHorizontal: Spacing.sm,
	},
	rightActionsContainer: {
		flexDirection: "row",
		gap: Spacing.xs,
	},
	headerContent: {
		flex: 1,
		justifyContent: "flex-end",
		paddingHorizontal: Spacing.lg,
		paddingBottom: Spacing.lg,
	},
	stickyContainer: {
		position: "absolute",
		left: 0,
		right: 0,
	},
	stickyHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 99,
		backgroundColor: Colors.background,
		borderBottomWidth: 1,
		borderBottomColor: Colors.border,
	},
});
