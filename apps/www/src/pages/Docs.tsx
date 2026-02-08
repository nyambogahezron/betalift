import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { motion } from "framer-motion";
import {
	ArrowRight,
	Book,
	Code,
	ExternalLink,
	FileText,
	MessageSquare,
	Rocket,
	Video,
} from "lucide-react";

const quickLinks = [
	{
		icon: Rocket,
		title: "Getting Started",
		description: "New to Betalift? Start here with our beginner's guide.",
		href: "/docs/getting-started",
		color: "text-primary",
		bgColor: "bg-primary/10",
	},
	{
		icon: Book,
		title: "User Guides",
		description: "Detailed guides for creators and testers.",
		href: "/docs/guides",
		color: "text-success",
		bgColor: "bg-success/10",
	},
	{
		icon: Code,
		title: "API Reference",
		description: "Integrate Betalift with your workflow using our API.",
		href: "/docs/api",
		color: "text-warning",
		bgColor: "bg-warning/10",
	},
	{
		icon: MessageSquare,
		title: "FAQ",
		description: "Find answers to commonly asked questions.",
		href: "/faq",
		color: "text-accent",
		bgColor: "bg-accent/10",
	},
];

const creatorDocs = [
	{
		title: "Creating Your First Project",
		href: "/docs/creators/first-project",
	},
	{ title: "Managing Testers", href: "/docs/creators/managing-testers" },
	{ title: "Feedback Collection", href: "/docs/creators/feedback" },
	{ title: "Release Management", href: "/docs/creators/releases" },
	{ title: "Analytics & Reports", href: "/docs/creators/analytics" },
	{ title: "Team Collaboration", href: "/docs/creators/teams" },
];

const testerDocs = [
	{ title: "Finding Projects to Test", href: "/docs/testers/discover" },
	{ title: "Submitting Feedback", href: "/docs/testers/submit-feedback" },
	{ title: "Writing Effective Bug Reports", href: "/docs/testers/bug-reports" },
	{ title: "Building Your Reputation", href: "/docs/testers/reputation" },
	{ title: "Communication with Creators", href: "/docs/testers/communication" },
	{ title: "Tester Best Practices", href: "/docs/testers/best-practices" },
];

const resources = [
	{
		icon: Video,
		title: "Video Tutorials",
		description: "Watch step-by-step video guides on using Betalift features.",
		href: "/docs/videos",
	},
	{
		icon: FileText,
		title: "Changelog",
		description: "See what's new in the latest Betalift updates.",
		href: "/docs/changelog",
	},
	{
		icon: Code,
		title: "Sample Projects",
		description: "Explore example projects to learn best practices.",
		href: "/docs/examples",
	},
];

const Docs = () => {
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
							<span className="highlight-box">Documentation</span>
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground">
							Everything you need to know about using Betalift effectively.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Quick Links */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
						{quickLinks.map((link, i) => (
							<motion.a
								key={link.title}
								href={link.href}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300 block"
							>
								<div
									className={`w-12 h-12 rounded-xl ${link.bgColor} flex items-center justify-center mb-4`}
								>
									<link.icon className={`w-6 h-6 ${link.color}`} />
								</div>
								<h3 className="font-display font-bold text-lg mb-2">
									{link.title}
								</h3>
								<p className="text-muted-foreground text-sm">
									{link.description}
								</p>
							</motion.a>
						))}
					</div>
				</div>
			</section>

			{/* Documentation Sections */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
						{/* For Creators */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="glass-card rounded-3xl p-8"
						>
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
									<Rocket className="w-5 h-5 text-primary" />
								</div>
								<h2 className="font-display text-2xl font-bold">
									For Creators
								</h2>
							</div>
							<ul className="space-y-3">
								{creatorDocs.map((doc) => (
									<li key={doc.title}>
										<a
											href={doc.href}
											className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors group"
										>
											<span className="text-foreground/80 group-hover:text-foreground">
												{doc.title}
											</span>
											<ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
										</a>
									</li>
								))}
							</ul>
							<a
								href="/docs/creators"
								className="inline-flex items-center gap-2 text-primary font-medium mt-4 hover:underline"
							>
								View all creator docs <ExternalLink className="w-4 h-4" />
							</a>
						</motion.div>

						{/* For Testers */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="glass-card rounded-3xl p-8"
						>
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
									<MessageSquare className="w-5 h-5 text-success" />
								</div>
								<h2 className="font-display text-2xl font-bold">For Testers</h2>
							</div>
							<ul className="space-y-3">
								{testerDocs.map((doc) => (
									<li key={doc.title}>
										<a
											href={doc.href}
											className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors group"
										>
											<span className="text-foreground/80 group-hover:text-foreground">
												{doc.title}
											</span>
											<ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-success transition-colors" />
										</a>
									</li>
								))}
							</ul>
							<a
								href="/docs/testers"
								className="inline-flex items-center gap-2 text-success font-medium mt-4 hover:underline"
							>
								View all tester docs <ExternalLink className="w-4 h-4" />
							</a>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Resources */}
			<section className="py-20 bg-secondary/30">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
							Additional Resources
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							More ways to learn and get the most out of Betalift
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
						{resources.map((resource, i) => (
							<motion.a
								key={resource.title}
								href={resource.href}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300 block text-center"
							>
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
									<resource.icon className="w-6 h-6 text-primary" />
								</div>
								<h3 className="font-display font-bold text-lg mb-2">
									{resource.title}
								</h3>
								<p className="text-muted-foreground text-sm">
									{resource.description}
								</p>
							</motion.a>
						))}
					</div>
				</div>
			</section>

			{/* API Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto"
					>
						<div className="grid md:grid-cols-2 gap-8 items-center">
							<div>
								<div className="flex items-center gap-3 mb-4">
									<Code className="w-8 h-8 text-primary" />
									<h2 className="font-display text-2xl font-bold">
										API Reference
									</h2>
								</div>
								<p className="text-muted-foreground mb-6">
									Integrate Betalift into your existing workflow with our
									comprehensive REST API. Available on Pro and Enterprise plans.
								</p>
								<ul className="space-y-2 mb-6">
									<li className="flex items-center gap-2 text-sm">
										<span className="w-2 h-2 rounded-full bg-success" />
										RESTful API with JSON responses
									</li>
									<li className="flex items-center gap-2 text-sm">
										<span className="w-2 h-2 rounded-full bg-success" />
										OAuth 2.0 authentication
									</li>
									<li className="flex items-center gap-2 text-sm">
										<span className="w-2 h-2 rounded-full bg-success" />
										Webhooks for real-time updates
									</li>
									<li className="flex items-center gap-2 text-sm">
										<span className="w-2 h-2 rounded-full bg-success" />
										SDKs for popular languages
									</li>
								</ul>
								<a
									href="/docs/api"
									className="inline-block rounded-full px-6 py-2 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
								>
									View API Docs
								</a>
							</div>
							<div className="bg-foreground/5 rounded-2xl p-6 font-mono text-sm overflow-x-auto">
								<pre className="text-foreground/80">
									{`// Get project feedback
fetch('https://api.betalift.com/v1/projects/123/feedback', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(res => res.json())
.then(data => console.log(data));`}
								</pre>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Help CTA */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto"
					>
						<h2 className="font-display text-3xl font-bold mb-4">
							Can't Find What You're Looking For?
						</h2>
						<p className="text-muted-foreground mb-8">
							Our support team is here to help. Reach out and we'll get back to
							you quickly.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="/contact"
								className="rounded-full px-8 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
							>
								Contact Support
							</a>
							<a
								href="/faq"
								className="rounded-full px-8 py-3 bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
							>
								View FAQ
							</a>
						</div>
					</motion.div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Docs;
