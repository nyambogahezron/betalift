import { Button, Input } from '@/components/ui'
import { Colors, Fonts, Spacing } from '@/constants/theme'
import { useLogin } from '@/queries/authQueries'
import { useAuthStore } from '@/stores/useAuthStore'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{}
	)

	const { setUser } = useAuthStore()
	const loginMutation = useLogin()

	const validate = () => {
		const newErrors: { email?: string; password?: string } = {}

		if (!email) {
			newErrors.email = 'Email is required'
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = 'Please enter a valid email'
		}

		if (!password) {
			newErrors.password = 'Password is required'
		} else if (password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleLogin = async () => {
		if (!validate()) return

		try {
			const result = await loginMutation.mutateAsync({
				email: email.trim(),
				password,
			})

			const userData = {
				...result.user,
				id: result.user._id,
				accessToken: result.accessToken,
			}
			setUser(userData as any)
			router.replace('/(tabs)')
		} catch (error) {
			Alert.alert(
				'Error',
				error instanceof Error
					? error.message
					: 'Invalid credentials. Please try again.'
			)
		}
	}

	const handleSocialLogin = (provider: string) => {
		Alert.alert('Coming Soon', `${provider} login will be available soon!`)
	}

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardView}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps='handled'
				>
					{/* Header */}
					<Animated.View
						entering={FadeInDown.duration(600).springify()}
						style={styles.header}
					>
						<Pressable style={styles.backButton} onPress={() => router.back()}>
							<Ionicons name='arrow-back' size={24} color={Colors.text} />
						</Pressable>

						<View style={styles.logoContainer}>
							<Ionicons name='rocket' size={48} color={Colors.primary} />
						</View>

						<Text style={styles.title}>Welcome Back</Text>
						<Text style={styles.subtitle}>Sign in to continue to BetaLift</Text>
					</Animated.View>

					{/* Form */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(200).springify()}
						style={styles.form}
					>
						<Input
							label='Email'
							placeholder='Enter your email'
							value={email}
							onChangeText={setEmail}
							keyboardType='email-address'
							autoCapitalize='none'
							autoCorrect={false}
							leftIcon='mail-outline'
							error={errors.email}
						/>

						<Input
							label='Password'
							placeholder='Enter your password'
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							leftIcon='lock-closed-outline'
							error={errors.password}
						/>

						<Pressable
							style={styles.forgotPassword}
							onPress={() => router.push('/(auth)/forgot-password')}
						>
							<Text style={styles.forgotPasswordText}>Forgot Password?</Text>
						</Pressable>

						<Button
							title='Sign In'
							onPress={handleLogin}
							loading={loginMutation.isPending}
							fullWidth
							size='lg'
							style={styles.loginButton}
						/>
					</Animated.View>

					{/* Divider */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(300).springify()}
						style={styles.dividerContainer}
					>
						<View style={styles.dividerLine} />
						<Text style={styles.dividerText}>or continue with</Text>
						<View style={styles.dividerLine} />
					</Animated.View>

					{/* Social Login */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(400).springify()}
						style={styles.socialContainer}
					>
						<Pressable
							style={styles.socialButton}
							onPress={() => handleSocialLogin('Google')}
						>
							<Ionicons name='logo-google' size={24} color={Colors.text} />
						</Pressable>

						<Pressable
							style={styles.socialButton}
							onPress={() => handleSocialLogin('Apple')}
						>
							<Ionicons name='logo-apple' size={24} color={Colors.text} />
						</Pressable>

						<Pressable
							style={styles.socialButton}
							onPress={() => handleSocialLogin('GitHub')}
						>
							<Ionicons name='logo-github' size={24} color={Colors.text} />
						</Pressable>
					</Animated.View>

					{/* Footer */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(500).springify()}
						style={styles.footer}
					>
						<Text style={styles.footerText}>Don&apos;t have an account? </Text>
						<Pressable onPress={() => router.push('/(auth)/register')}>
							<Text style={styles.footerLink}>Sign Up</Text>
						</Pressable>
					</Animated.View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
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
		alignItems: 'center',
		marginBottom: Spacing.xl,
	},
	backButton: {
		position: 'absolute',
		left: 0,
		top: 0,
		padding: Spacing.sm,
	},
	logoContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: Spacing.md,
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
	},
	form: {
		marginBottom: Spacing.lg,
	},
	forgotPassword: {
		alignSelf: 'flex-end',
		marginBottom: Spacing.lg,
	},
	forgotPasswordText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.primary,
	},
	loginButton: {
		marginTop: Spacing.sm,
	},
	dividerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: Spacing.lg,
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
		flexDirection: 'row',
		justifyContent: 'center',
		gap: Spacing.md,
		marginBottom: Spacing.xl,
	},
	socialButton: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: Colors.backgroundSecondary,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: Colors.border,
	},
	demoButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: Spacing.sm,
		paddingVertical: Spacing.md,
		paddingHorizontal: Spacing.lg,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.primary,
		borderStyle: 'dashed',
		marginBottom: Spacing.lg,
	},
	demoButtonText: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.primary,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 'auto',
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
})
