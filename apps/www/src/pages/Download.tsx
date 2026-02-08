import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { motion } from "framer-motion";
import {
	Apple,
	CheckCircle,
	Download as DownloadIcon,
	Monitor,
	QrCode,
	Smartphone,
} from "lucide-react";

const features = [
	"Real-time collaboration",
	"Vote and comment system",
	"Instant messaging",
	"Project tracking",
	"Secure user profiles",
	"Push notifications",
];

const Download = () => {
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
							Download <span className="highlight-box">Betalift</span>
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground mb-12">
							Get the app on your favorite platform and start discovering truth
							together.
						</p>
					</motion.div>

					{/* Download Options */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
						{/* iOS */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="glass-card p-8 rounded-3xl text-center group hover:scale-105 transition-transform duration-300"
						>
							<div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center mx-auto mb-6">
								<Apple className="w-8 h-8 text-foreground" />
							</div>
							<h3 className="font-display text-xl font-bold mb-2">iOS App</h3>
							<p className="text-muted-foreground text-sm mb-6">
								Download from the App Store for iPhone and iPad
							</p>
							<button className="w-full rounded-full px-6 py-3 bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
								<DownloadIcon className="w-4 h-4" />
								App Store
							</button>
						</motion.div>

						{/* Android */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="glass-card p-8 rounded-3xl text-center group hover:scale-105 transition-transform duration-300"
						>
							<div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center mx-auto mb-6">
								<Smartphone className="w-8 h-8 text-success" />
							</div>
							<h3 className="font-display text-xl font-bold mb-2">
								Android App
							</h3>
							<p className="text-muted-foreground text-sm mb-6">
								Get it on Google Play for Android devices
							</p>
							<button className="w-full rounded-full px-6 py-3 bg-success text-white font-semibold hover:bg-success/90 transition-colors flex items-center justify-center gap-2">
								<DownloadIcon className="w-4 h-4" />
								Google Play
							</button>
						</motion.div>

						{/* Web App */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="glass-card p-8 rounded-3xl text-center group hover:scale-105 transition-transform duration-300 md:col-span-2 lg:col-span-1"
						>
							<div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
								<Monitor className="w-8 h-8 text-primary" />
							</div>
							<h3 className="font-display text-xl font-bold mb-2">Web App</h3>
							<p className="text-muted-foreground text-sm mb-6">
								Use Betalift directly in your browser
							</p>
							<button className="w-full rounded-full px-6 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
								<Monitor className="w-4 h-4" />
								Open Web App
							</button>
						</motion.div>
					</div>
				</div>
			</section>

			{/* QR Code Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto"
					>
						<div className="grid md:grid-cols-2 gap-8 items-center">
							<div>
								<h2 className="font-display text-3xl font-bold mb-4">
									Scan to Download
								</h2>
								<p className="text-muted-foreground mb-6">
									Point your phone's camera at the QR code to quickly download
									the app on your mobile device.
								</p>
								<ul className="space-y-3">
									{features.map((feature, i) => (
										<motion.li
											key={feature}
											initial={{ opacity: 0, x: -10 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true }}
											transition={{ delay: i * 0.1 }}
											className="flex items-center gap-3 text-foreground/80"
										>
											<CheckCircle className="w-5 h-5 text-success" />
											{feature}
										</motion.li>
									))}
								</ul>
							</div>
							<div className="flex justify-center">
								<div className="w-48 h-48 bg-white rounded-2xl p-4 shadow-lg flex items-center justify-center">
									<QrCode className="w-full h-full text-foreground" />
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* System Requirements */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
							System Requirements
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Make sure your device meets the minimum requirements
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className="glass-card p-6 rounded-2xl"
						>
							<Apple className="w-8 h-8 text-foreground mb-4" />
							<h3 className="font-bold mb-2">iOS</h3>
							<p className="text-sm text-muted-foreground">iOS 14.0 or later</p>
							<p className="text-sm text-muted-foreground">
								iPhone, iPad, iPod touch
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className="glass-card p-6 rounded-2xl"
						>
							<Smartphone className="w-8 h-8 text-success mb-4" />
							<h3 className="font-bold mb-2">Android</h3>
							<p className="text-sm text-muted-foreground">
								Android 8.0 or later
							</p>
							<p className="text-sm text-muted-foreground">2GB RAM minimum</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3 }}
							className="glass-card p-6 rounded-2xl"
						>
							<Monitor className="w-8 h-8 text-primary mb-4" />
							<h3 className="font-bold mb-2">Web</h3>
							<p className="text-sm text-muted-foreground">
								Chrome, Firefox, Safari
							</p>
							<p className="text-sm text-muted-foreground">
								Edge (latest versions)
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Download;
