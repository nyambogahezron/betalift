import { GreatVibes_400Regular } from "@expo-google-fonts/great-vibes";
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	Inter_700Bold_Italic,
	useFonts,
} from "@expo-google-fonts/inter";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/theme";
import { queryClient } from "@/queries/queryClient";
import { useAuthStore } from "@/stores/useAuthStore";
import { SocketProvider } from "@/context/SocketContext";
import { usePushNotifications } from '@/hooks/usePushNotifications'
import 'react-native-reanimated'

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
})

SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
	anchor: '(tabs)',
}

export default function Layout() {
	const [isReady, setIsReady] = useState(false)
	const { isAuthenticated, hasSeenOnboarding } = useAuthStore()
	usePushNotifications()

	const [loaded, error] = useFonts({
		'Inter-Regular': Inter_400Regular,
		'Inter-Medium': Inter_500Medium,
		'Inter-SemiBold': Inter_600SemiBold,
		'Inter-Bold': Inter_700Bold,
		'Inter-BoldItalic': Inter_700Bold_Italic,
		'GreatVibes-Regular': GreatVibes_400Regular,
	})
	useEffect(() => {
		async function start() {
			try {
				await SystemUI.setBackgroundColorAsync(Colors.backgroundSecondary)
			} catch (e) {
				console.warn(e)
			} finally {
				setIsReady(true)
			}
		}
		start()
	}, [])

	useEffect(() => {
		if ((loaded || error) && isReady) {
			SplashScreen.hideAsync()
		}
	}, [loaded, error, isReady])

	if (!loaded && !error) {
		return null
	}
	if (!isReady) {
		return null
	}

	return (
		<View style={{ flex: 1 }}>
			<SocketProvider>
				<QueryClientProvider client={queryClient}>
					<GestureHandlerRootView>
						<ThemeProvider value={DarkTheme}>
							<Stack screenOptions={{ headerShown: false }}>
								<Stack.Protected guard={!hasSeenOnboarding}>
									<Stack.Screen name='index' options={{ headerShown: false }} />
								</Stack.Protected>

								<Stack.Protected guard={!isAuthenticated}>
									<Stack.Screen
										name='(auth)'
										options={{ headerShown: false }}
									/>
								</Stack.Protected>

								<Stack.Protected guard={isAuthenticated}>
									<SocketProvider>
										<Stack.Screen
											name='(tabs)'
											options={{ headerShown: false }}
										/>

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

										<Stack.Screen
											name='messages/index'
											options={{ headerShown: false }}
										/>
										<Stack.Screen
											name='messages/[id]'
											options={{ headerShown: false }}
										/>

										<Stack.Screen
											name='user/[id]'
											options={{ headerShown: false }}
										/>
										<Stack.Screen
											name='users/index'
											options={{ headerShown: false }}
										/>

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
									</SocketProvider>
								</Stack.Protected>
							</Stack>
							<StatusBar style='light' />
						</ThemeProvider>
					</GestureHandlerRootView>
				</QueryClientProvider>
			</SocketProvider>
		</View>
	)
}
