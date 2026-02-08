import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { motion } from "framer-motion";
import {
	BarChart3,
	Bell,
	Clock,
	GitBranch,
	MessageSquare,
	Rocket,
	Shield,
	Smartphone,
	Star,
	Target,
	Users,
	Zap,
} from "lucide-react";

const creatorFeatures = [
	{
		icon: Rocket,
		title: "Project Posting",
		description:
			"Share your beta projects with detailed descriptions, screenshots, and download links (TestFlight, Play Store, etc.).",
	},
	{
		icon: Users,
		title: "Tester Recruitment",
		description:
			"Attract testers through public listings or manage invite-only access for exclusive testing groups.",
	},
	{
		icon: MessageSquare,
		title: "Structured Feedback",
		description:
			"Collect organized feedback with categories: bugs, features, improvements, and praise.",
	},
	{
		icon: BarChart3,
		title: "Analytics Dashboard",
		description:
			"Track tester engagement, feedback trends, and project health with detailed analytics.",
	},
	{
		icon: GitBranch,
		title: "Release Management",
		description:
			"Manage releases, changelogs, and version history all in one place.",
	},
	{
		icon: Bell,
		title: "Smart Notifications",
		description:
			"Get notified instantly when new feedback arrives or testers join your project.",
	},
];

const testerFeatures = [
	{
		icon: Target,
		title: "Discover Projects",
		description:
			"Browse and join exciting beta projects across categories that match your interests.",
	},
	{
		icon: Star,
		title: "Build Reputation",
		description:
			"Earn badges and build your reputation as a valuable beta tester in the community.",
	},
	{
		icon: Clock,
		title: "Early Access",
		description:
			"Get exclusive early access to apps and features before they're released publicly.",
	},
	{
		icon: MessageSquare,
		title: "Direct Communication",
		description:
			"Chat directly with creators and collaborate on improving their products.",
	},
	{
		icon: Smartphone,
		title: "Cross-Platform",
		description:
			"Test apps on iOS, Android, and web platforms from a single account.",
	},
	{
		icon: Zap,
		title: "Easy Feedback",
		description:
			"Submit feedback quickly with our intuitive forms and screenshot tools.",
	},
];

const platformFeatures = [
	{
		icon: Shield,
		title: "Secure & Private",
		description:
			"Enterprise-grade security with end-to-end encryption and data protection.",
		color: "text-success",
		bgColor: "bg-success/10",
	},
	{
		icon: Smartphone,
		title: "Native Apps",
		description:
			"Beautiful native apps for iOS and Android with full feature parity.",
		color: "text-primary",
		bgColor: "bg-primary/10",
	},
	{
		icon: Zap,
		title: "Lightning Fast",
		description:
			"Optimized for speed with real-time updates and instant notifications.",
		color: "text-warning",
		bgColor: "bg-warning/10",
	},
];

const Features = () => {
	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<ScrollToTop />

			{/* Hero Section */}
			<section className="relative pt-32 pb-20 overflow-hidden">
				<div className="absolute inset-0 gradient-hero" />
				<div className="absolute bottom-0 left-0 right-0 h-[50%] gradient-glow" />

				<div className="container relative z-10 mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center max-w-3xl mx-auto"
					>
						<h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
							Powerful <span className="highlight-box">Features</span>
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground">
							Everything you need to run successful beta testing programs and
							gather actionable feedback.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Platform Features */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
						{platformFeatures.map((feature, i) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
							>
								<div
									className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mx-auto mb-4`}
								>
									<feature.icon className={`w-7 h-7 ${feature.color}`} />
								</div>
								<h3 className="font-display font-bold text-lg mb-2">
									{feature.title}
								</h3>
								<p className="text-muted-foreground text-sm">
									{feature.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Creator Features */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
							For Creators
						</span>
						<h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
							Tools to Launch Better Products
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Get your beta projects in front of real users and gather
							actionable feedback
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{creatorFeatures.map((feature, i) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
							>
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
									<feature.icon className="w-6 h-6 text-primary" />
								</div>
								<h3 className="font-display font-bold text-lg mb-2">
									{feature.title}
								</h3>
								<p className="text-muted-foreground text-sm">
									{feature.description}
								</p>
							</motion.div>
						))}
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mt-10"
					>
						<a
							href="/for-creators"
							className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
						>
							Learn more for creators →
						</a>
					</motion.div>
				</div>
			</section>

			{/* Tester Features */}
			<section className="py-20 bg-secondary/30">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<span className="inline-block px-4 py-1 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
							For Testers
						</span>
						<h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
							Discover & Test Amazing Apps
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Join beta programs, provide valuable feedback, and shape the
							future of products
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{testerFeatures.map((feature, i) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
							>
								<div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
									<feature.icon className="w-6 h-6 text-success" />
								</div>
								<h3 className="font-display font-bold text-lg mb-2">
									{feature.title}
								</h3>
								<p className="text-muted-foreground text-sm">
									{feature.description}
								</p>
							</motion.div>
						))}
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mt-10"
					>
						<a
							href="/for-testers"
							className="inline-flex items-center gap-2 text-success font-medium hover:underline"
						>
							Learn more for testers →
						</a>
					</motion.div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto"
					>
						<h2 className="font-display text-3xl font-bold mb-4">
							Ready to Get Started?
						</h2>
						<p className="text-muted-foreground mb-8">
							Join thousands of creators and testers already using Betalift.
						</p>
						<a
							href="/download"
							className="inline-block rounded-full px-8 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
						>
							Download Now
						</a>
					</motion.div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Features;
