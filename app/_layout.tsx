import { Colors } from '@/constants/theme'
import { GreatVibes_400Regular } from '@expo-google-fonts/great-vibes'
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	Inter_700Bold_Italic,
	useFonts,
} from '@expo-google-fonts/inter'
import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import * as SystemUI from 'expo-system-ui'
import { useEffect } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'

SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
	anchor: '(tabs)',
}

export default function RootLayout() {
	const [loaded, error] = useFonts({
		'Inter-Regular': Inter_400Regular,
		'Inter-Medium': Inter_500Medium,
		'Inter-SemiBold': Inter_600SemiBold,
		'Inter-Bold': Inter_700Bold,
		'Inter-BoldItalic': Inter_700Bold_Italic,
		'GreatVibes-Regular': GreatVibes_400Regular,
	})

	useEffect(() => {
		SystemUI.setBackgroundColorAsync(Colors.background)
	}, [])

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync()
		}
	}, [loaded, error])

	if (!loaded && !error) {
		return null
	}

	return (
		<View style={{ flex: 1 }}>
			<GestureHandlerRootView>
				<ThemeProvider value={DarkTheme}>
					<Stack>
						<Stack.Screen name='index' options={{ headerShown: false }} />
						<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
						<Stack.Screen
							name='modal'
							options={{ presentation: 'modal', title: 'Modal' }}
						/>
					</Stack>
					<StatusBar style='auto' />
				</ThemeProvider>
			</GestureHandlerRootView>
		</View>
	)
}
