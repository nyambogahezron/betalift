import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card } from "@/components/ui";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import { useDeleteNotification, useNotification } from "@/queries/notificationQueries";

export default function NotificationDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const deleteMutation = useDeleteNotification();
	const { data: notification, isLoading } = useNotification(id!);

	const handleDelete = () => {
		if (id) {
			deleteMutation.mutate(id, {
				onSuccess: () => {
					router.back();
				},
			});
		}
	};

	if (isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<Stack.Screen options={{ title: 'Details' }} />
				<View style={styles.center}>
					<ActivityIndicator size="large" color={Colors.primary} />
				</View>
			</SafeAreaView>
		);
	}

    if (!notification) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ title: 'Details' }} />
                <View style={styles.center}>
                    <Text style={styles.errorText}>Notification not found</Text>
                </View>
            </SafeAreaView>
        )
    }

	return (
		<SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Details', presentation: 'modal' }} />
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.header}>
					<Ionicons
						name="notifications-circle"
						size={64}
						color={Colors.primary}
					/>
					<Text style={styles.date}>
						{format(new Date(notification.createdAt), "PPP p")}
					</Text>
				</View>

				<Card style={styles.card}>
					<Text style={styles.title}>{notification.title}</Text>
					<Text style={styles.message}>{notification.message}</Text>
				</Card>

				{/* Context Actions based on type could go here */}
                {/* e.g. "View Project" button if type is project_invite */}
                
				<View style={styles.actions}>
					<Button
						title="Delete Notification"
						variant="outline"
						onPress={handleDelete}
                        style={{ borderColor: Colors.error }}
                        textStyle={{ color: Colors.error }}
						icon={<Ionicons name="trash-outline" size={20} color={Colors.error} />}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
	content: {
		padding: Spacing.lg,
	},
	header: {
		alignItems: "center",
		marginBottom: Spacing.xl,
	},
	date: {
		marginTop: Spacing.sm,
		fontSize: 14,
		fontFamily: Fonts.regular,
		color: Colors.textTertiary,
	},
	card: {
		padding: Spacing.lg,
		marginBottom: Spacing.xl,
	},
	title: {
		fontSize: 20,
		fontFamily: Fonts.bold,
		color: Colors.text,
		marginBottom: Spacing.md,
	},
	message: {
		fontSize: 16,
		fontFamily: Fonts.regular,
		color: Colors.textSecondary,
		lineHeight: 24,
	},
	actions: {
		gap: Spacing.md,
	},
    errorText: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontFamily: Fonts.medium
    }
});
