import { Colors } from '@/constants/theme'
import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, Text, View, type ViewStyle } from 'react-native'

interface AvatarProps {
	source?: string | null
	name?: string
	size?: 'sm' | 'md' | 'lg' | 'xl'
	style?: ViewStyle
}

export function Avatar({ source, name, size = 'md', style }: AvatarProps) {
	const dimensions = {
		sm: 32,
		md: 40,
		lg: 56,
		xl: 80,
	}

	const fontSize = {
		sm: 12,
		md: 16,
		lg: 22,
		xl: 32,
	}

	const dimension = dimensions[size]

	const getInitials = (name?: string) => {
		if (!name) return '?'
		const parts = name.split(' ')
		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
		}
		return name.substring(0, 2).toUpperCase()
	}

	if (source) {
		return (
			<View style={style}>
				<Image
					source={{ uri: source }}
					style={[
						styles.avatar,
						{ width: dimension, height: dimension, borderRadius: dimension / 2 },
					]}
					contentFit='cover'
				/>
			</View>
		)
	}

	return (
		<View
			style={[
				styles.placeholder,
				{ width: dimension, height: dimension, borderRadius: dimension / 2 },
				style,
			]}
		>
			<Text style={[styles.initials, { fontSize: fontSize[size] }]}>
				{getInitials(name)}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	avatar: {
		backgroundColor: Colors.backgroundTertiary,
	},
	placeholder: {
		backgroundColor: Colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	initials: {
		color: Colors.text,
		fontWeight: '600',
	},
})
