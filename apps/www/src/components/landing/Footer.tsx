import { motion, useInView } from "framer-motion";
import { Github, Instagram, Linkedin, Send, Twitter } from "lucide-react";
import { useRef, useState } from "react";

const footerLinks = {
	Product: [
		{ label: "Features", href: "/features" },
		{ label: "For Creators", href: "/for-creators" },
		{ label: "For Testers", href: "/for-testers" },
		{ label: "Pricing", href: "/pricing" },
		{ label: "Download", href: "/download" },
	],
	Company: [
		{ label: "About", href: "/about" },
		{ label: "Blog", href: "/blog" },
		{ label: "Contact", href: "/contact" },
		{ label: "FAQ", href: "/faq" },
	],
	Resources: [
		{ label: "Documentation", href: "/docs" },
		{ label: "Privacy Policy", href: "/privacy" },
		{ label: "Terms of Service", href: "/terms" },
	],
};

const socialLinks = [
	{ icon: Twitter, href: "#", label: "Twitter" },
	{ icon: Github, href: "#", label: "GitHub" },
	{ icon: Linkedin, href: "#", label: "LinkedIn" },
	{ icon: Instagram, href: "#", label: "Instagram" },
];

export const Footer = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-50px" });
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle newsletter signup
		console.log("Newsletter signup:", email);
		setEmail("");
	};

	return (
		<footer ref={ref} className="relative pt-24 pb-8 overflow-hidden">
			{/* Background */}
			<div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/30" />

			<div className="container relative z-10 mx-auto px-4">
				{/* CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.6 }}
					className="glass-card rounded-3xl p-8 md:p-12 mb-16 text-center"
				>
					<h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4">
						Ready to discover the truth?
					</h2>
					<p className="text-muted-foreground mb-8 max-w-xl mx-auto">
						Download Betalift today and join millions who are already making
						better-informed decisions.
					</p>

					{/* App Store Badges */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<motion.a
							href="#"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.98 }}
							className="flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-xl hover:opacity-90 transition-opacity"
						>
							<svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
								<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
							</svg>
							<div className="text-left">
								<p className="text-xs opacity-80">Download on the</p>
								<p className="text-base font-semibold">App Store</p>
							</div>
						</motion.a>

						<motion.a
							href="#"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.98 }}
							className="flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-xl hover:opacity-90 transition-opacity"
						>
							<svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
								<path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
							</svg>
							<div className="text-left">
								<p className="text-xs opacity-80">Get it on</p>
								<p className="text-base font-semibold">Google Play</p>
							</div>
						</motion.a>
					</div>
				</motion.div>

				{/* Footer Content */}
				<div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
					{/* Brand & Newsletter */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="lg:col-span-2"
					>
						<div className="flex items-center gap-2 mb-4">
							<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
								<img
									src="/icon.png"
									alt="Logo"
									className="w-6 h-6 rounded-full"
								/>
							</div>
							<span className="font-display font-bold text-xl text-foreground">
								Betalift
							</span>
						</div>
						<p className="text-muted-foreground mb-6 max-w-sm">
							Join the movement for truth. Get verified information, build media
							literacy, and make better decisions.
						</p>

						{/* Newsletter Form */}
						<form onSubmit={handleSubmit} className="flex gap-2">
							<input
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
							/>
							<button
								type="submit"
								className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
							>
								<Send className="w-4 h-4" />
							</button>
						</form>
					</motion.div>

					{/* Links */}
					{Object.entries(footerLinks).map(([title, links], index) => (
						<motion.div
							key={title}
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
							transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
						>
							<h3 className="font-display font-semibold text-foreground mb-4">
								{title}
							</h3>
							<ul className="space-y-3">
								{links.map((link) => (
									<li key={link.label}>
										<a
											href={link.href}
											className="text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</motion.div>
					))}
				</div>

				{/* Bottom Bar */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={isInView ? { opacity: 1 } : { opacity: 0 }}
					transition={{ duration: 0.6, delay: 0.5 }}
					className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4"
				>
					<p className="text-sm text-muted-foreground">
						© 2025 Betalift. All rights reserved.
					</p>

					{/* Social Links */}
					<div className="flex items-center gap-4">
						{socialLinks.map((social) => (
							<a
								key={social.label}
								href={social.href}
								aria-label={social.label}
								className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
							>
								<social.icon className="w-5 h-5" />
							</a>
						))}
					</div>
				</motion.div>
			</div>
		</footer>
	);
};
