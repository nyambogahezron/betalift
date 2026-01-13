import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { BorderRadius, Colors, Fonts, Spacing } from "@/constants/theme";
import type {
	FeedbackPriority,
	FeedbackStatus,
	FeedbackType,
} from "@/interfaces";

type BadgeVariant =
	| "default"
	| "success"
	| "warning"
	| "error"
	| "info"
	| "purple";
type BadgeSize = "sm" | "md";

interface BadgeProps {
	label: string;
	variant?: BadgeVariant;
	size?: BadgeSize;
	style?: ViewStyle;
}

export function Badge({
	label,
	variant = "default",
	size = "md",
	style,
}: BadgeProps) {
	return (
		<View
			style={[
				styles.badge,
				styles[`badge_${variant}`],
				styles[`badge_${size}`],
				style,
			]}
		>
			<Text
				style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`]]}
			>
				{label}
			</Text>
		</View>
	);
}

// Helper functions for common badge types
export function StatusBadge({ status }: { status: FeedbackStatus }) {
	const config: Record<
		FeedbackStatus,
		{ label: string; variant: BadgeVariant }
	> = {
		pending: { label: "Pending", variant: "default" },
		open: { label: "Open", variant: "info" },
		"in-progress": { label: "In Progress", variant: "warning" },
		resolved: { label: "Resolved", variant: "success" },
		closed: { label: "Closed", variant: "default" },
		"wont-fix": { label: "Won't Fix", variant: "default" },
	};

	const { label, variant } = config[status];
	return <Badge label={label} variant={variant} size="sm" />;
}

export function TypeBadge({ type }: { type: FeedbackType }) {
	const config: Record<FeedbackType, { label: string; variant: BadgeVariant }> =
		{
			bug: { label: "🐛 Bug", variant: "error" },
			feature: { label: "✨ Feature", variant: "purple" },
			improvement: { label: "💡 Improvement", variant: "info" },
			praise: { label: "🎉 Praise", variant: "success" },
			question: { label: "❓ Question", variant: "info" },
			other: { label: "📝 Other", variant: "default" },
		};

	const { label, variant } = config[type];
	return <Badge label={label} variant={variant} size="sm" />;
}

export function PriorityBadge({ priority }: { priority: FeedbackPriority }) {
	const config: Record<
		FeedbackPriority,
		{ label: string; variant: BadgeVariant }
	> = {
		low: { label: "Low", variant: "default" },
		medium: { label: "Medium", variant: "warning" },
		high: { label: "High", variant: "error" },
		critical: { label: "Critical", variant: "error" },
	};

	const { label, variant } = config[priority];
	return <Badge label={label} variant={variant} size="sm" />;
}

export function ProjectStatusBadge({
	status,
}: {
	status: "active" | "beta" | "closed" | "paused";
}) {
	const config: Record<string, { label: string; variant: BadgeVariant }> = {
		active: { label: "Active", variant: "success" },
		beta: { label: "Beta", variant: "info" },
		closed: { label: "Closed", variant: "default" },
		paused: { label: "Paused", variant: "warning" },
	};

	const { label, variant } = config[status];
	return <Badge label={label} variant={variant} size="sm" />;
}

const styles = StyleSheet.create({
	badge: {
		alignSelf: "flex-start",
		borderRadius: BorderRadius.full,
	},

	// Variants
	badge_default: {
		backgroundColor: Colors.backgroundTertiary,
	},
	badge_success: {
		backgroundColor: `${Colors.success}20`,
	},
	badge_warning: {
		backgroundColor: `${Colors.warning}20`,
	},
	badge_error: {
		backgroundColor: `${Colors.error}20`,
	},
	badge_info: {
		backgroundColor: `${Colors.info}20`,
	},
	badge_purple: {
		backgroundColor: "#8B5CF620",
	},

	// Sizes
	badge_sm: {
		paddingVertical: 2,
		paddingHorizontal: Spacing.sm,
	},
	badge_md: {
		paddingVertical: 4,
		paddingHorizontal: Spacing.sm + 4,
	},

	// Text
	text: {
		fontFamily: Fonts.medium,
	},
	text_default: {
		color: Colors.textSecondary,
	},
	text_success: {
		color: Colors.success,
	},
	text_warning: {
		color: Colors.warning,
	},
	text_error: {
		color: Colors.error,
	},
	text_info: {
		color: Colors.info,
	},
	text_purple: {
		color: "#8B5CF6",
	},
	text_sm: {
		fontSize: 11,
	},
	text_md: {
		fontSize: 13,
	},
});
