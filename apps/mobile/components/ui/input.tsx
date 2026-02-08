import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	type TextInputProps,
	View,
	type ViewStyle,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

interface InputProps extends TextInputProps {
	label?: string;
	error?: string;
	hint?: string;
	leftIcon?: keyof typeof Ionicons.glyphMap;
	rightIcon?: keyof typeof Ionicons.glyphMap;
	onRightIconPress?: () => void;
	containerStyle?: ViewStyle;
}

export function Input({
	label,
	error,
	hint,
	leftIcon,
	rightIcon,
	onRightIconPress,
	containerStyle,
	secureTextEntry,
	...props
}: InputProps) {
	const [isFocused, setIsFocused] = useState(false);
	const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
	const borderColor = useSharedValue(Colors.border);

	const animatedBorderStyle = useAnimatedStyle(() => ({
		borderColor: borderColor.value,
	}));

	const handleFocus = () => {
		setIsFocused(true);
		borderColor.value = withTiming(Colors.primary, { duration: 200 });
		props.onFocus?.({} as any);
	};

	const handleBlur = () => {
		setIsFocused(false);
		borderColor.value = withTiming(error ? Colors.error : Colors.border, {
			duration: 200,
		});
		props.onBlur?.({} as any);
	};

	const togglePasswordVisibility = () => {
		setIsPasswordVisible(!isPasswordVisible);
	};

	const showPasswordToggle = secureTextEntry !== undefined;
	const actualRightIcon = showPasswordToggle
		? isPasswordVisible
			? "eye-off-outline"
			: "eye-outline"
		: rightIcon;

	return (
		<View style={[styles.container, containerStyle]}>
			{label && <Text style={styles.label}>{label}</Text>}

			<Animated.View
				style={[
					styles.inputContainer,
					animatedBorderStyle,
					error && styles.inputError,
				]}
			>
				{leftIcon && (
					<Ionicons
						name={leftIcon}
						size={20}
						color={isFocused ? Colors.primary : Colors.textTertiary}
						style={styles.leftIcon}
					/>
				)}

				<TextInput
					style={[styles.input, leftIcon && styles.inputWithLeftIcon]}
					placeholderTextColor={Colors.textTertiary}
					onFocus={handleFocus}
					onBlur={handleBlur}
					secureTextEntry={showPasswordToggle ? !isPasswordVisible : false}
					{...props}
				/>

				{actualRightIcon && (
					<Pressable
						onPress={
							showPasswordToggle ? togglePasswordVisibility : onRightIconPress
						}
						style={styles.rightIconButton}
					>
						<Ionicons
							name={actualRightIcon}
							size={20}
							color={Colors.textTertiary}
						/>
					</Pressable>
				)}
			</Animated.View>

			{error && <Text style={styles.error}>{error}</Text>}
			{hint && !error && <Text style={styles.hint}>{hint}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: Spacing.md,
	},
	label: {
		fontSize: 14,
		fontFamily: Fonts.medium,
		color: Colors.text,
		marginBottom: Spacing.xs,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.backgroundSecondary,
		borderRadius: BorderRadius.md,
		borderWidth: 1.5,
		borderColor: Colors.border,
	},
	inputError: {
		borderColor: Colors.error,
	},
	input: {
		flex: 1,
		paddingVertical: Spacing.sm + 4,
		paddingHorizontal: Spacing.md,
		fontSize: 16,
		fontFamily: Fonts.regular,
		color: Colors.text,
	},
	inputWithLeftIcon: {
		paddingLeft: 0,
	},
	leftIcon: {
		marginLeft: Spacing.md,
	},
	rightIconButton: {
		padding: Spacing.sm,
		marginRight: Spacing.xs,
	},
	error: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.error,
		marginTop: Spacing.xs,
	},
	hint: {
		fontSize: 12,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
		marginTop: Spacing.xs,
	},
});
