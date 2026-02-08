import { Colors, Fonts } from "@/constants/theme";
import { useAuthStore } from "@/stores/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect } from "react";
import {
	Dimensions,
	Pressable,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, {
	FadeInDown,
	FadeInUp,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function Index() {
	const { setHasSeenOnboarding } = useAuthStore();
	const imageScale = useSharedValue(0.8);
	const circleRotation = useSharedValue(0);

	useEffect(() => {
		imageScale.value = withSpring(1, {
			damping: 10,
			stiffness: 100,
		});

		circleRotation.value = withRepeat(
			withSequence(
				withTiming(5, { duration: 2000 }),
				withTiming(-5, { duration: 2000 }),
			),
			-1,
			true,
		);
	});

	const circleAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${circleRotation.value}deg` }],
	}));

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor={Colors.background} barStyle="light-content" />
			{/* Main Card */}
			<View style={styles.card}>
				<Animated.View
					style={styles.imageContainer}
					entering={FadeInUp.duration(800).springify()}
				>
					<Animated.View
						style={[styles.circleBackground, circleAnimatedStyle]}
					/>
					<Animated.View style={[styles.characterPlaceholder]}>
						<Image
							source={require("@/assets/banner.png")}
							style={{ width: 210, height: 300, borderRadius: 12 }}
						/>
					</Animated.View>
				</Animated.View>

				{/* Content */}
				<Animated.View
					style={styles.content}
					entering={FadeInUp.duration(1000).delay(200).springify()}
				>
					<View style={{ marginBottom: 8 }}>
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
						>
							<Animated.Text
								entering={FadeInUp.duration(1000).delay(300).springify()}
								style={[
									styles.title,
									{ fontFamily: Fonts.greatVibes, fontSize: 36 },
								]}
							>
								Welcome to
							</Animated.Text>
							<Animated.Text
								style={[styles.title, { color: "#0096a8" }]}
								entering={FadeInUp.duration(1000).delay(350).springify()}
							>
								Betalift
							</Animated.Text>
						</View>
					</View>

					<Animated.Text
						style={styles.description}
						entering={FadeInUp.duration(1000).delay(400).springify()}
					>
						Whether youre looking for feedback, collaboration, or just a place
						to showcase your creativity, Betalift is the perfect platform for
						you.
					</Animated.Text>
				</Animated.View>

				{/* Navigation Controls */}
				<Animated.View
					style={styles.controls}
					entering={FadeInDown.duration(800).delay(400).springify()}
				>
					<View style={styles.navigationButtons}>
						<Pressable style={styles.logoButton}>
							<Ionicons name="logo-google" size={24} color="#FFFFFF" />
						</Pressable>

						<Pressable style={styles.logoButton}>
							<Ionicons name="logo-apple" size={24} color="#FFFFFF" />
						</Pressable>
					</View>

					<Pressable
						style={styles.createButton}
						onPress={() => {
							setHasSeenOnboarding(true);
							router.push("/(auth)/register");
						}}
					>
						<Text style={styles.createText}>Create Account</Text>
					</Pressable>
				</Animated.View>

				<Animated.View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						gap: 8,
						marginTop: 16,
					}}
					entering={FadeInDown.duration(800).delay(600).springify()}
				>
					<Text style={{ color: "#2C2C2C", fontFamily: Fonts.medium }}>
						Already have an account?
					</Text>
					<Pressable
						onPress={() => {
							setHasSeenOnboarding(true);
							router.push("/(auth)/login");
						}}
					>
						<Text
							style={{
								color: "#0096a8",
								fontWeight: "600",
								fontFamily: Fonts.bold,
							}}
						>
							Login
						</Text>
					</Pressable>
				</Animated.View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5D4A6",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	card: {
		width: width,
		height: height,
		borderRadius: 30,
		padding: 24,
		justifyContent: "space-between",
	},
	imageContainer: {
		alignItems: "center",
		marginTop: 20,
		marginBottom: 30,
		position: "relative",
		height: 280,
	},
	circleBackground: {
		width: 300,
		height: 300,
		borderRadius: 150,
		backgroundColor: "#D4A574",
		position: "absolute",
		left: -45,
	},
	characterPlaceholder: {
		width: 180,
		height: 280,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1,
	},
	characterEmoji: {
		fontSize: 140,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 8,
	},
	title: {
		fontSize: 30,
		fontWeight: "700",
		fontFamily: Fonts.bold,
		color: "#2C2C2C",
		lineHeight: 38,
	},
	description: {
		fontSize: 14,
		color: "#5C5C5C",
		lineHeight: 20,
		marginTop: 8,
		fontFamily: Fonts.medium,
	},
	controls: {
		backgroundColor: "#FFE3C1",
		borderRadius: 30,
		paddingVertical: 6,
		paddingHorizontal: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 20,
	},
	navigationButtons: {
		flexDirection: "row",
		gap: 12,
	},
	logoButton: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "#B8763D",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
	createButton: {
		backgroundColor: "#0096a8",
		borderRadius: 25,
		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	createText: {
		fontSize: 16,
		color: "#f2f2f2",
		fontWeight: "700",
		fontFamily: Fonts.medium,
	},
});
