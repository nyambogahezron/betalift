import { Button, Input } from "@/components/ui";
import { Colors, FontSizes, Spacing } from "@/constants/theme";
import { useForgotPassword } from "@/queries/authQueries";
import { Ionicons } from "@expo/vector-icons";
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

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const forgotPasswordMutation = useForgotPassword();

	const handleSubmit = async () => {
		if (!email.trim()) {
			setError("Email is required");
			return;
		}

		if (!/\S+@\S+\.\S+/.test(email)) {
			setError("Please enter a valid email");
			return;
		}

		setError("");

		try {
			await forgotPasswordMutation.mutateAsync({ email: email.trim() });
			Alert.alert(
				"Success",
				"If an account exists with that email, a password reset link has been sent.",
				[
					{
						text: "OK",
						onPress: () => router.back(),
					},
				],
			);
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "Failed to send reset email",
			);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardView}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					{/* Header */}
					<Animated.View
						entering={FadeInDown.duration(600).springify()}
						style={styles.header}
					>
						<Pressable style={styles.backButton} onPress={() => router.back()}>
							<Ionicons name="arrow-back" size={24} color={Colors.text} />
						</Pressable>

						<View style={styles.iconContainer}>
							<Ionicons
								name="lock-closed-outline"
								size={64}
								color={Colors.primary}
							/>
						</View>

						<Text style={styles.title}>Forgot Password?</Text>
						<Text style={styles.subtitle}>
							Enter your email address and we&apos;ll send you a link to reset
							your password
						</Text>
					</Animated.View>

					{/* Form */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(200).springify()}
						style={styles.form}
					>
						<Input
							label="Email"
							placeholder="Enter your email"
							value={email}
							onChangeText={(text) => {
								setEmail(text);
								setError("");
							}}
							keyboardType="email-address"
							autoCapitalize="none"
							error={error}
							leftIcon="mail-outline"
						/>

						<Button
							title="Send Reset Link"
							onPress={handleSubmit}
							loading={forgotPasswordMutation.isPending}
							style={styles.button}
						/>

						<Pressable
							onPress={() => router.back()}
							disabled={forgotPasswordMutation.isPending}
							style={styles.backToLoginButton}
						>
							<Text style={styles.backToLoginText}>Back to Login</Text>
						</Pressable>
					</Animated.View>
				</ScrollView>
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
	scrollContent: {
		flexGrow: 1,
		padding: Spacing.lg,
	},
	header: {
		alignItems: "center",
		marginBottom: Spacing.xl,
	},
	backButton: {
		alignSelf: "flex-start",
		padding: Spacing.sm,
		marginBottom: Spacing.lg,
	},
	iconContainer: {
		marginBottom: Spacing.lg,
	},
	title: {
		fontSize: FontSizes.xxl,
		fontWeight: "700",
		color: Colors.text,
		marginBottom: Spacing.sm,
		textAlign: "center",
	},
	subtitle: {
		fontSize: FontSizes.md,
		color: Colors.textSecondary,
		textAlign: "center",
		lineHeight: 22,
		paddingHorizontal: Spacing.md,
	},
	form: {
		gap: Spacing.md,
	},
	button: {
		marginTop: Spacing.md,
	},
	backToLoginButton: {
		alignItems: "center",
		marginTop: Spacing.lg,
	},
	backToLoginText: {
		color: Colors.primary,
		fontSize: FontSizes.md,
		fontWeight: "600",
	},
});
