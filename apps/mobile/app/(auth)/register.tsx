import { Button, Input } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import type { User } from "@/interfaces";
import { useRegister } from "@/queries/authQueries";
import { useAuthStore } from "@/stores/useAuthStore";
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
import Animated, {
	FadeInDown,
	FadeInUp,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
	const [step, setStep] = useState(1);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const { setUser } = useAuthStore();
	const registerMutation = useRegister();

	const validateStep1 = () => {
		const newErrors: Record<string, string> = {};

		if (!username) {
			newErrors.username = "Username is required";
		} else if (username.length < 3) {
			newErrors.username = "Username must be at least 3 characters";
		}

		if (!email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = "Please enter a valid email";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateStep2 = () => {
		const newErrors: Record<string, string> = {};

		if (!password) {
			newErrors.password = "Password is required";
		} else if (password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		if (!acceptedTerms) {
			newErrors.terms = "You must accept the terms and conditions";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = () => {
		if (validateStep1()) {
			setStep(2);
		}
	};

	const handleRegister = async () => {
		if (!validateStep2()) return;

		try {
			const result = await registerMutation.mutateAsync({
				email: email.trim(),
				password,
				username: username.trim(),
			});

			// Store user data in the auth store
			const userData = {
				...result.user,
				id: result.user._id,
				accessToken: result.accessToken,
			};

			setUser(userData as any);

			Alert.alert(
				"Success",
				"Account created successfully! Please check your email to verify your account.",
				[
					{
						text: "OK",
						onPress: () => router.replace("/(tabs)"),
					},
				],
			);
		} catch (error) {
			Alert.alert(
				"Error",
				error instanceof Error
					? error.message
					: "Registration failed. Please try again.",
			);
		}
	};

	const handleSocialSignup = (provider: string) => {
		Alert.alert("Coming Soon", `${provider} signup will be available soon!`);
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
						<Pressable
							style={styles.backButton}
							onPress={() => (step === 1 ? router.back() : setStep(1))}
						>
							<Ionicons name="arrow-back" size={24} color={Colors.text} />
						</Pressable>

						<View style={styles.progressContainer}>
							<View
								style={[
									styles.progressDot,
									step >= 1 && styles.progressDotActive,
								]}
							/>
							<View style={styles.progressLine} />
							<View
								style={[
									styles.progressDot,
									step >= 2 && styles.progressDotActive,
								]}
							/>
						</View>

						<Text style={styles.title}>
							{step === 1 ? "Create Account" : "Almost Done"}
						</Text>
						<Text style={styles.subtitle}>
							{step === 1
								? "Join BetaLift and start your journey"
								: "Set up your password and preferences"}
						</Text>
					</Animated.View>

					{/* Step 1: Basic Info */}
					{step === 1 && (
						<Animated.View
							entering={FadeInUp.duration(600).delay(200).springify()}
							style={styles.form}
						>
							<Input
								label="Username"
								placeholder="Choose a username"
								value={username}
								onChangeText={setUsername}
								autoCapitalize="none"
								autoCorrect={false}
								leftIcon="person-outline"
								error={errors.username}
							/>

							<Input
								label="Email"
								placeholder="Enter your email"
								value={email}
								onChangeText={setEmail}
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
								leftIcon="mail-outline"
								error={errors.email}
							/>

							<Button
								title="Continue"
								onPress={handleNext}
								fullWidth
								size="lg"
								style={styles.continueButton}
								icon={
									<Ionicons
										name="arrow-forward"
										size={20}
										color={Colors.text}
									/>
								}
								iconPosition="right"
							/>

							{/* Divider */}
							<View style={styles.dividerContainer}>
								<View style={styles.dividerLine} />
								<Text style={styles.dividerText}>or sign up with</Text>
								<View style={styles.dividerLine} />
							</View>

							{/* Social Signup */}
							<View style={styles.socialContainer}>
								<Pressable
									style={styles.socialButton}
									onPress={() => handleSocialSignup("Google")}
								>
									<Ionicons name="logo-google" size={24} color={Colors.text} />
								</Pressable>

								<Pressable
									style={styles.socialButton}
									onPress={() => handleSocialSignup("Apple")}
								>
									<Ionicons name="logo-apple" size={24} color={Colors.text} />
								</Pressable>

								<Pressable
									style={styles.socialButton}
									onPress={() => handleSocialSignup("GitHub")}
								>
									<Ionicons name="logo-github" size={24} color={Colors.text} />
								</Pressable>
							</View>
						</Animated.View>
					)}

					{/* Step 2: Password & Terms */}
					{step === 2 && (
						<Animated.View
							entering={FadeInUp.duration(600).springify()}
							style={styles.form}
						>
							<Input
								label="Password"
								placeholder="Create a password"
								value={password}
								onChangeText={setPassword}
								secureTextEntry
								leftIcon="lock-closed-outline"
								error={errors.password}
								hint="At least 6 characters"
							/>

							<Input
								label="Confirm Password"
								placeholder="Confirm your password"
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								secureTextEntry
								leftIcon="lock-closed-outline"
								error={errors.confirmPassword}
							/>

							{/* Terms Checkbox */}
							<Pressable
								style={styles.termsContainer}
								onPress={() => setAcceptedTerms(!acceptedTerms)}
							>
								<View
									style={[
										styles.checkbox,
										acceptedTerms && styles.checkboxChecked,
									]}
								>
									{acceptedTerms && (
										<Ionicons name="checkmark" size={16} color={Colors.text} />
									)}
								</View>
								<Text style={styles.termsText}>
									I agree to the{" "}
									<Text style={styles.termsLink}>Terms of Service</Text> and{" "}
									<Text style={styles.termsLink}>Privacy Policy</Text>
								</Text>
							</Pressable>
							{errors.terms && (
								<Text style={styles.errorText}>{errors.terms}</Text>
							)}

							<Button
								title="Create Account"
								onPress={handleRegister}
								loading={registerMutation.isPending}
								fullWidth
								size="lg"
								style={styles.continueButton}
							/>
						</Animated.View>
					)}

					{/* Footer */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(400).springify()}
						style={styles.footer}
					>
						<Text style={styles.footerText}>Already have an account? </Text>
						<Pressable onPress={() => router.push("/(auth)/login")}>
							<Text style={styles.footerLink}>Sign In</Text>
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
		position: "absolute",
		left: 0,
		top: 0,
		padding: Spacing.sm,
	},
	progressContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: Spacing.lg,
	},
	progressDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: Colors.backgroundTertiary,
	},
	progressDotActive: {
		backgroundColor: Colors.primary,
	},
	progressLine: {
		width: 40,
		height: 2,
		backgroundColor: Colors.backgroundTertiary,
		marginHorizontal: Spacing.xs,
	},
	title: {
		fontSize: 28,
		fontFamily: Fonts.bold,
		color: Colors.text,
		marginBottom: Spacing.xs,
	},
	subtitle: {
		fontSize: 16,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		textAlign: "center",
	},
	form: {
		marginBottom: Spacing.lg,
	},
	roleContainer: {
		marginBottom: Spacing.lg,
	},
	roleLabel: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.text,
		marginBottom: Spacing.sm,
	},
	roleOptions: {
		flexDirection: "row",
		gap: Spacing.sm,
	},
	roleCard: {
		flex: 1,
		padding: Spacing.md,
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.lg,
		borderWidth: 2,
		borderColor: "transparent",
		alignItems: "center",
	},
	roleCardSelected: {
		borderColor: Colors.primary,
		backgroundColor: `${Colors.primary}10`,
	},
	roleIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: Colors.backgroundTertiary,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: Spacing.sm,
	},
	roleIconContainerSelected: {
		backgroundColor: Colors.primary,
	},
	roleTitle: {
		fontSize: 14,
		fontFamily: Fonts.semibold,
		color: Colors.textSecondary,
		marginBottom: 2,
	},
	roleTitleSelected: {
		color: Colors.text,
	},
	roleDescription: {
		fontSize: 11,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		textAlign: "center",
	},
	continueButton: {
		marginTop: Spacing.md,
	},
	dividerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: Spacing.lg,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: Colors.border,
	},
	dividerText: {
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		marginHorizontal: Spacing.md,
	},
	socialContainer: {
		flexDirection: "row",
		justifyContent: "center",
		gap: Spacing.md,
	},
	socialButton: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: Colors.border,
	},
	termsContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: Spacing.sm,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 6,
		borderWidth: 2,
		borderColor: Colors.border,
		alignItems: "center",
		justifyContent: "center",
		marginRight: Spacing.sm,
	},
	checkboxChecked: {
		backgroundColor: Colors.primary,
		borderColor: Colors.primary,
	},
	termsText: {
		flex: 1,
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		lineHeight: 20,
	},
	termsLink: {
		color: Colors.primary,
		fontFamily: Fonts.medium,
	},
	errorText: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.error,
		marginTop: -Spacing.sm,
		marginBottom: Spacing.sm,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: "auto",
	},
	footerText: {
		fontSize: 16,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
	},
	footerLink: {
		fontSize: 16,
		fontFamily: Fonts.semibold,
		color: Colors.primary,
	},
});
