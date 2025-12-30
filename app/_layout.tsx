import { Colors } from '@/constants/theme'
import { useAuthStore } from '@/stores/useAuthStore'
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
import { Stack, useRouter, useSegments } from 'expo-router'
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
	const { isAuthenticated, hasSeenOnboarding } = useAuthStore()
	const segments = useSegments()
	const router = useRouter()

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

	// Auth guard effect
	useEffect(() => {
		if (!loaded) return

		const inAuthGroup = segments[0] === '(auth)'
		const currentRoute = segments[0]
		const inOnboarding = !currentRoute || currentRoute === undefined

		if (isAuthenticated) {
			// If user is authenticated and tries to access auth pages or onboarding, redirect to tabs
			if (inAuthGroup || inOnboarding) {
				router.replace('/(tabs)')
			}
		} else {
			// If user is not authenticated
			if (!hasSeenOnboarding && !inOnboarding && !inAuthGroup) {
				// Show onboarding if they haven't seen it and not in auth/onboarding
				router.replace('/')
			}
		}
	}, [isAuthenticated, hasSeenOnboarding, segments, loaded])

	if (!loaded && !error) {
		return null
	}

	return (
		<View style={{ flex: 1 }}>
			<GestureHandlerRootView>
				<ThemeProvider value={DarkTheme}>
					<Stack>
						<Stack.Screen name='index' options={{ headerShown: false }} />
						<Stack.Screen name='(auth)' options={{ headerShown: false }} />
						<Stack.Screen name='(tabs)' options={{ headerShown: false }} />

						{/* Project screens */}
						<Stack.Screen
							name='project/[id]'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='project/create'
							options={{
								headerShown: false,
								presentation: 'modal',
							}}
						/>

						{/* Feedback screens */}
						<Stack.Screen
							name='feedback/[id]'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='feedback/create'
							options={{
								headerShown: false,
								presentation: 'modal',
							}}
						/>
						<Stack.Screen
							name='feedback/detail/[id]'
							options={{ headerShown: false }}
						/>

						{/* Messages screens */}
						<Stack.Screen
							name='messages/index'
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='messages/[id]'
							options={{ headerShown: false }}
						/>

						{/* User screens */}
						<Stack.Screen name='user/[id]' options={{ headerShown: false }} />
						<Stack.Screen name='users/index' options={{ headerShown: false }} />

						{/* Profile screens */}
						<Stack.Screen
							name='profile/edit'
							options={{
								headerShown: false,
								presentation: 'modal',
							}}
						/>
						<Stack.Screen
							name='profile/settings'
							options={{ headerShown: false }}
						/>
					</Stack>
					<StatusBar style='light' />
				</ThemeProvider>
			</GestureHandlerRootView>
		</View>
	)
}
