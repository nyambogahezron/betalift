import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { motion } from "framer-motion";
import {
	ArrowRight,
	BarChart3,
	CheckCircle,
	GitBranch,
	MessageSquare,
	Rocket,
	Shield,
	Users,
} from "lucide-react";

const benefits = [
	{
		icon: Users,
		title: "Access a Global Tester Pool",
		description:
			"Connect with thousands of enthusiastic testers ready to try your beta product and provide valuable feedback.",
	},
	{
		icon: MessageSquare,
		title: "Structured Feedback Collection",
		description:
			"Gather organized feedback with categories, priorities, and device information automatically captured.",
	},
	{
		icon: BarChart3,
		title: "Actionable Analytics",
		description:
			"Understand trends, identify common issues, and make data-driven decisions with our analytics dashboard.",
	},
	{
		icon: GitBranch,
		title: "Release Management",
		description:
			"Manage versions, changelogs, and rollouts. Notify testers when new builds are available.",
	},
	{
		icon: Shield,
		title: "Control & Privacy",
		description:
			"Choose public or invite-only access. Protect your intellectual property while gathering feedback.",
	},
	{
		icon: Rocket,
		title: "Ship with Confidence",
		description:
			"Identify and fix bugs before launch. Release products your users will love.",
	},
];

const steps = [
	{
		number: "01",
		title: "Create Your Project",
		description:
			"Sign up and create your first beta project. Add screenshots, descriptions, and download links.",
	},
	{
		number: "02",
		title: "Invite or Recruit Testers",
		description:
			"Make your project public to attract testers, or invite specific users directly.",
	},
	{
		number: "03",
		title: "Collect Feedback",
		description:
			"Testers submit bugs, feature requests, and suggestions through our structured forms.",
	},
	{
		number: "04",
		title: "Iterate & Improve",
		description:
			"Review feedback, prioritize issues, and release updates. Track progress over time.",
	},
];

const testimonials = [
	{
		quote:
			"Betalift helped us find 47 bugs before launch. Our users never saw them. That's priceless.",
		author: "Sarah Chen",
		role: "Founder, AppFlow",
	},
	{
		quote:
			"The structured feedback system saved us hours of back-and-forth. Every report is actionable.",
		author: "Marcus Johnson",
		role: "Lead Developer, TechStart",
	},
];

const ForCreators = () => {
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
						<span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
							For Creators
						</span>
						<h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
							Ship Better Products with{" "}
							<span className="highlight-box">Real Feedback</span>
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground mb-8">
							Connect with thousands of testers, collect structured feedback,
							and launch products your users will love.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="/download"
								className="rounded-full px-8 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
							>
								Start Free Trial
							</a>
							<a
								href="/pricing"
								className="rounded-full px-8 py-3 bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
							>
								View Pricing
							</a>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
							Why Creators Choose Betalift
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Everything you need to run successful beta testing programs
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{benefits.map((benefit, i) => (
							<motion.div
								key={benefit.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
							>
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
									<benefit.icon className="w-6 h-6 text-primary" />
								</div>
								<h3 className="font-display font-bold text-lg mb-2">
									{benefit.title}
								</h3>
								<p className="text-muted-foreground text-sm">
									{benefit.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className="py-20 bg-secondary/30">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
							How It Works
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Get started in minutes and start collecting feedback today
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
						{steps.map((step, i) => (
							<motion.div
								key={step.number}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="relative"
							>
								<div className="glass-card rounded-2xl p-6 h-full">
									<span className="text-5xl font-bold text-primary/20 mb-4 block">
										{step.number}
									</span>
									<h3 className="font-display font-bold text-lg mb-2">
										{step.title}
									</h3>
									<p className="text-muted-foreground text-sm">
										{step.description}
									</p>
								</div>
								{i < steps.length - 1 && (
									<ArrowRight className="hidden lg:block absolute top-1/2 -right-4 w-6 h-6 text-primary/30" />
								)}
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
						{testimonials.map((testimonial, i) => (
							<motion.div
								key={testimonial.author}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="glass-card rounded-2xl p-8"
							>
								<p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
										<span className="font-bold text-primary">
											{testimonial.author.charAt(0)}
										</span>
									</div>
									<div>
										<p className="font-bold">{testimonial.author}</p>
										<p className="text-sm text-muted-foreground">
											{testimonial.role}
										</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Features Checklist */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto"
					>
						<h2 className="font-display text-3xl font-bold mb-8 text-center">
							What You Get
						</h2>
						<div className="grid md:grid-cols-2 gap-4">
							{[
								"Unlimited feedback collection",
								"Custom feedback forms",
								"Real-time notifications",
								"Analytics dashboard",
								"Tester management",
								"Release management",
								"Priority support",
								"Team collaboration",
								"Integrations (Slack, Jira)",
								"Export & reports",
								"Custom branding (Pro)",
								"API access (Enterprise)",
							].map((feature) => (
								<div key={feature} className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
									<span>{feature}</span>
								</div>
							))}
						</div>
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
							Ready to Improve Your Product?
						</h2>
						<p className="text-muted-foreground mb-8">
							Join thousands of creators using Betalift. Start your 14-day free
							trial today.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="/download"
								className="rounded-full px-8 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
							>
								Start Free Trial
							</a>
							<a
								href="/features"
								className="rounded-full px-8 py-3 bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
							>
								Explore Features
							</a>
						</div>
					</motion.div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default ForCreators;
