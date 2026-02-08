import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";

const featuredPost = {
	title: "Introducing Betalift 2.0: A New Era of Beta Testing",
	excerpt:
		"We're excited to announce the biggest update to Betalift yet, featuring a completely redesigned interface, powerful new tools, and enhanced collaboration features.",
	image: "/blog/featured.jpg",
	category: "Product Updates",
	date: "January 20, 2026",
	readTime: "5 min read",
	slug: "betalift-2-0-announcement",
};

const posts = [
	{
		title: "10 Best Practices for Running a Successful Beta Test",
		excerpt:
			"Learn the strategies that top creators use to gather meaningful feedback and build better products.",
		category: "Tips & Guides",
		date: "January 18, 2026",
		readTime: "8 min read",
		slug: "beta-testing-best-practices",
	},
	{
		title: "How to Write Effective Bug Reports as a Tester",
		excerpt:
			"A comprehensive guide to becoming a standout beta tester that creators love working with.",
		category: "For Testers",
		date: "January 15, 2026",
		readTime: "6 min read",
		slug: "effective-bug-reports",
	},
	{
		title: "Case Study: How AppFlow Reduced Launch Bugs by 80%",
		excerpt:
			"Discover how one startup used Betalift to revolutionize their testing process and ship with confidence.",
		category: "Case Studies",
		date: "January 12, 2026",
		readTime: "10 min read",
		slug: "appflow-case-study",
	},
	{
		title: "The Psychology of Great User Feedback",
		excerpt:
			"Understanding what motivates testers and how to create an environment that encourages quality feedback.",
		category: "Insights",
		date: "January 10, 2026",
		readTime: "7 min read",
		slug: "psychology-of-feedback",
	},
	{
		title: "Security Best Practices for Beta Testing",
		excerpt:
			"How to protect your project and testers while maintaining an open and collaborative testing environment.",
		category: "Security",
		date: "January 8, 2026",
		readTime: "5 min read",
		slug: "security-best-practices",
	},
	{
		title: "Building Community Around Your Beta Product",
		excerpt:
			"Turn your testers into advocates and build a community that supports your product long after launch.",
		category: "Community",
		date: "January 5, 2026",
		readTime: "6 min read",
		slug: "building-community",
	},
];

const categories = [
	"All",
	"Product Updates",
	"Tips & Guides",
	"For Testers",
	"Case Studies",
	"Insights",
	"Security",
	"Community",
];

const Blog = () => {
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
							The <span className="highlight-box">Blog</span>
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground">
							Insights, tips, and stories from the world of beta testing and
							product development.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Featured Post */}
			<section className="py-12">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="glass-card rounded-3xl overflow-hidden max-w-5xl mx-auto"
					>
						<div className="grid md:grid-cols-2">
							<div className="h-64 md:h-auto bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
								<span className="text-6xl">📰</span>
							</div>
							<div className="p-8">
								<div className="flex items-center gap-3 mb-4">
									<span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
										{featuredPost.category}
									</span>
									<span className="text-sm text-muted-foreground">
										Featured
									</span>
								</div>
								<h2 className="font-display text-2xl font-bold mb-4">
									{featuredPost.title}
								</h2>
								<p className="text-muted-foreground mb-6">
									{featuredPost.excerpt}
								</p>
								<div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
									<span className="flex items-center gap-1">
										<Calendar className="w-4 h-4" />
										{featuredPost.date}
									</span>
									<span className="flex items-center gap-1">
										<Clock className="w-4 h-4" />
										{featuredPost.readTime}
									</span>
								</div>
								<a
									href={`/blog/${featuredPost.slug}`}
									className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
								>
									Read Article <ArrowRight className="w-4 h-4" />
								</a>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Categories */}
			<section className="py-8">
				<div className="container mx-auto px-4">
					<div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
						{categories.map((category) => (
							<button
								key={category}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
									category === "All"
										? "bg-primary text-primary-foreground"
										: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Blog Posts Grid */}
			<section className="py-12">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{posts.map((post, i) => (
							<motion.article
								key={post.slug}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300"
							>
								<div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
									<Tag className="w-10 h-10 text-primary/50" />
								</div>
								<div className="p-6">
									<span className="inline-block px-3 py-1 rounded-full bg-secondary text-sm font-medium mb-3">
										{post.category}
									</span>
									<h3 className="font-display font-bold text-lg mb-2">
										{post.title}
									</h3>
									<p className="text-muted-foreground text-sm mb-4 line-clamp-2">
										{post.excerpt}
									</p>
									<div className="flex items-center justify-between text-sm text-muted-foreground">
										<span className="flex items-center gap-1">
											<Calendar className="w-4 h-4" />
											{post.date}
										</span>
										<span>{post.readTime}</span>
									</div>
								</div>
							</motion.article>
						))}
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mt-12"
					>
						<button className="rounded-full px-8 py-3 bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors">
							Load More Articles
						</button>
					</motion.div>
				</div>
			</section>

			{/* Newsletter Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto"
					>
						<h2 className="font-display text-3xl font-bold mb-4">
							Subscribe to Our Newsletter
						</h2>
						<p className="text-muted-foreground mb-8">
							Get the latest articles, tips, and updates delivered to your inbox
							weekly.
						</p>
						<form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-4 py-3 rounded-full bg-secondary border-0 focus:ring-2 focus:ring-primary outline-none"
							/>
							<button
								type="submit"
								className="rounded-full px-8 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
							>
								Subscribe
							</button>
						</form>
						<p className="text-xs text-muted-foreground mt-4">
							No spam, unsubscribe anytime.
						</p>
					</motion.div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Blog;
