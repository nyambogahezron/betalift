import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { motion } from "framer-motion";
import { Globe, Heart, Shield, Target, Users, Zap } from "lucide-react";

const stats = [
	{ value: "10K+", label: "Beta Projects" },
	{ value: "50K+", label: "Active Testers" },
	{ value: "1M+", label: "Feedback Submitted" },
	{ value: "98%", label: "Satisfaction Rate" },
];

const values = [
	{
		icon: Target,
		title: "Mission Driven",
		description:
			"We believe every great product deserves early feedback. Our mission is to bridge creators and testers worldwide.",
	},
	{
		icon: Users,
		title: "Community First",
		description:
			"We foster a collaborative environment where creators and testers work together to build better products.",
	},
	{
		icon: Zap,
		title: "Innovation",
		description:
			"We constantly push boundaries to provide cutting-edge tools for beta testing and feedback collection.",
	},
	{
		icon: Heart,
		title: "Passion",
		description:
			"We're passionate about helping creators succeed and testers discover amazing new products early.",
	},
	{
		icon: Globe,
		title: "Global Reach",
		description:
			"Our platform connects creators and testers from every corner of the world, 24/7.",
	},
	{
		icon: Shield,
		title: "Trust & Security",
		description:
			"We prioritize security and build trust through transparent practices and data protection.",
	},
];

const team = [
	{ name: "Alex Chen", role: "Founder & CEO", image: "/team/alex.jpg" },
	{ name: "Sarah Johnson", role: "CTO", image: "/team/sarah.jpg" },
	{ name: "Mike Williams", role: "Head of Product", image: "/team/mike.jpg" },
	{ name: "Emily Davis", role: "Head of Community", image: "/team/emily.jpg" },
];

const About = () => {
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
							About <span className="highlight-box">Betalift</span>
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground">
							We're on a mission to revolutionize how software is tested and
							improved through the power of community-driven feedback.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{stats.map((stat, i) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="glass-card rounded-2xl p-6 text-center"
							>
								<div className="text-3xl md:text-4xl font-bold text-primary mb-2">
									{stat.value}
								</div>
								<div className="text-sm text-muted-foreground">
									{stat.label}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Our Story Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto"
					>
						<h2 className="font-display text-3xl font-bold mb-6 text-center">
							Our Story
						</h2>
						<div className="prose prose-lg max-w-none text-muted-foreground">
							<p className="mb-4">
								Betalift was born from a simple observation: software creators
								often struggle to find quality beta testers, while enthusiastic
								early adopters search for exciting new projects to try.
							</p>
							<p className="mb-4">
								Founded in 2024, we set out to create a platform that bridges
								this gap. We believe that the best products are built through
								collaboration, and the best feedback comes from passionate users
								who genuinely care.
							</p>
							<p>
								Today, Betalift powers thousands of beta testing programs
								worldwide, helping creators launch better products and testers
								discover the next big thing before anyone else.
							</p>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Values Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
							Our Values
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							The principles that guide everything we do
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{values.map((value, i) => (
							<motion.div
								key={value.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
							>
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
									<value.icon className="w-6 h-6 text-primary" />
								</div>
								<h3 className="font-display font-bold text-lg mb-2">
									{value.title}
								</h3>
								<p className="text-muted-foreground text-sm">
									{value.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Team Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
							Meet the Team
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							The passionate people behind Betalift
						</p>
					</motion.div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
						{team.map((member, i) => (
							<motion.div
								key={member.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="text-center"
							>
								<div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mx-auto mb-4 flex items-center justify-center">
									<span className="text-3xl md:text-4xl font-bold text-primary">
										{member.name.charAt(0)}
									</span>
								</div>
								<h3 className="font-display font-bold">{member.name}</h3>
								<p className="text-sm text-muted-foreground">{member.role}</p>
							</motion.div>
						))}
					</div>
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
							Join Our Journey
						</h2>
						<p className="text-muted-foreground mb-8">
							Be part of the community that's shaping the future of software
							development.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="/download"
								className="rounded-full px-8 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
							>
								Get Started
							</a>
							<a
								href="/contact"
								className="rounded-full px-8 py-3 bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
							>
								Contact Us
							</a>
						</div>
					</motion.div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default About;
