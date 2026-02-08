import { HapticTab } from "@/components/haptic-tab";
import { Colors, Fonts } from "@/constants/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.primary,
				tabBarInactiveTintColor: Colors.textTertiary,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarStyle: styles.tabBar,
				tabBarLabelStyle: styles.tabBarLabel,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "home" : "home-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: "Explore",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "compass" : "compass-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "person" : "person-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}

const styles = StyleSheet.create({
	tabBar: {
		backgroundColor: Colors.backgroundSecondary,
		height: Platform.OS === "ios" ? 88 : 68,
		paddingTop: 8,
		paddingBottom: Platform.OS === "ios" ? 28 : 8,
		borderColor: "transparent",
		borderWidth: 0,
	},
	tabBarLabel: {
		fontFamily: Fonts.medium,
		fontSize: 11,
		marginTop: 2,
	},
});
