import { Button, Input } from '@/components/ui'
import { Colors, FontSizes, Spacing } from '@/constants/theme'
import { useResetPassword } from '@/queries/authQueries'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
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

export default function ResetPassword() {
	const params = useLocalSearchParams<{ token?: string }>()
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [errors, setErrors] = useState<{
		password?: string
		confirmPassword?: string
	}>({})
	const resetPasswordMutation = useResetPassword()

	const validate = () => {
		const newErrors: { password?: string; confirmPassword?: string } = {}

		if (!password) {
			newErrors.password = 'Password is required'
		} else if (password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters'
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = 'Please confirm your password'
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async () => {
		if (!validate()) return

		if (!params.token) {
			Alert.alert('Error', 'Invalid or missing reset token')
			return
		}

		try {
			await resetPasswordMutation.mutateAsync({
				token: params.token,
				password,
			})
			Alert.alert(
				'Success',
				'Password reset successfully! You can now login with your new password.',
				[
					{
						text: 'OK',
						onPress: () => router.replace('/(auth)/login'),
					},
				]
			)
		} catch (error) {
			Alert.alert('Error', error instanceof Error ? error.message : 'Failed to reset password')
		}
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

						<View style={styles.iconContainer}>
							<Ionicons
								name='shield-checkmark-outline'
								size={64}
								color={Colors.primary}
							/>
						</View>

						<Text style={styles.title}>Reset Password</Text>
						<Text style={styles.subtitle}>
							Enter your new password below
						</Text>
					</Animated.View>

					{/* Form */}
					<Animated.View
						entering={FadeInUp.duration(600).delay(200).springify()}
						style={styles.form}
					>
						<Input
							label='New Password'
							placeholder='Enter new password'
							value={password}
							onChangeText={(text) => {
								setPassword(text)
								if (errors.password) {
									setErrors({ ...errors, password: undefined })
								}
							}}
							secureTextEntry
							autoCapitalize='none'
							error={errors.password}
							leftIcon='lock-closed-outline'
						/>

						<Input
							label='Confirm Password'
							placeholder='Confirm new password'
							value={confirmPassword}
							onChangeText={(text) => {
								setConfirmPassword(text)
								if (errors.confirmPassword) {
									setErrors({ ...errors, confirmPassword: undefined })
								}
							}}
							secureTextEntry
							autoCapitalize='none'
							error={errors.confirmPassword}
							leftIcon='lock-closed-outline'
						/>

						<Button
							title='Reset Password'
							onPress={handleSubmit}
							loading={resetPasswordMutation.isPending}
							style={styles.button}
						/>
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
		alignSelf: 'flex-start',
		padding: Spacing.sm,
		marginBottom: Spacing.lg,
	},
	iconContainer: {
		marginBottom: Spacing.lg,
	},
	title: {
		fontSize: FontSizes.xxl,
		fontWeight: '700',
		color: Colors.text,
		marginBottom: Spacing.sm,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: FontSizes.md,
		color: Colors.textSecondary,
		textAlign: 'center',
		lineHeight: 22,
	},
	form: {
		gap: Spacing.md,
	},
	button: {
		marginTop: Spacing.md,
	},
})
