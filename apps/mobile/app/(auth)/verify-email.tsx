import { Button, Input } from "@/components/ui";
import { Colors, FontSizes, Spacing } from "@/constants/theme";
import { useVerifyEmail } from "@/queries/authQueries";
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

export default function VerifyEmail() {
	const [token, setToken] = useState("");
	const [error, setError] = useState("");
	const verifyEmailMutation = useVerifyEmail();

	const handleVerify = async () => {
		if (!token.trim()) {
			setError("Verification code is required");
			return;
		}

		setError("");

		try {
			await verifyEmailMutation.mutateAsync({ token: token.trim() });
			Alert.alert(
				"Success",
				"Email verified successfully! You can now login.",
				[
					{
						text: "OK",
						onPress: () => router.replace("/(auth)/login"),
					},
				],
			);
		} catch (error) {
			setError(error instanceof Error ? error.message : "Verification failed");
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
							<Ionicons name="mail-outline" size={64} color={Colors.primary} />
						</View>

						<Text style={styles.title}>Verify Your Email</Text>
						<Text style={styles.subtitle}>
							Enter the verification code sent to your email
						</Text>
					</Animated.View>

					{/* Form */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(200).springify()}
						style={styles.form}
					>
						<Input
							label="Verification Code"
							placeholder="Enter verification code"
							value={token}
							onChangeText={(text) => {
								setToken(text);
								setError("");
							}}
							autoCapitalize="none"
							error={error}
							leftIcon="key-outline"
						/>

						<Button
							title="Verify Email"
							onPress={handleVerify}
							loading={verifyEmailMutation.isPending}
							style={styles.button}
						/>
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
