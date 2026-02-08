import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FloatingCard } from "./FloatingCard";
import { PhoneMockup } from "./PhoneMockup";

const floatingCards = [
	{
		claim: "Design system update for Q4 is ready for review",
		status: "true" as const,
		author: "Sarah Design",
		timeAgo: "2h ago",
		sources: ["Figma", "Jira"],
		position: "left-[-8%] top-[5%]",
		delay: 0.5,
	},
	{
		claim: "Backend API latency has increased by 15%",
		status: "misleading" as const,
		author: "DevOps Lead",
		timeAgo: "1h ago",
		description:
			"Actually, latency spike was due to a scheduled load test and has normalized.",
		sources: ["Datadog", "AWS"],
		position: "left-[2%] bottom-[0%]",
		delay: 0.7,
	},
	{
		claim: "Client requested 3 new features for MVP",
		status: "true" as const,
		author: "Product Owner",
		timeAgo: "4h ago",
		sources: ["Email"],
		position: "right-[-8%] top-[5%]",
		delay: 0.6,
	},
	{
		claim: "All critical bugs fixed for release 1.0",
		status: "true" as const,
		author: "QA Team",
		timeAgo: "30m ago",
		sources: ["GitHub", "Linear"],
		position: "right-[2%] bottom-[0%]",
		delay: 0.8,
	},
];

export const Hero = () => {
	const sectionRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});

	const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
	const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

	return (
		<section
			ref={sectionRef}
			className="relative min-h-screen pt-32 pb-20 overflow-hidden"
		>
			{/* Background gradient with parallax */}
			<motion.div
				style={{ y: bgY }}
				className="absolute inset-0 gradient-hero"
			/>

			<motion.div
				style={{ y: glowY }}
				className="absolute bottom-0 left-0 right-0 h-[50%] gradient-glow"
			/>

			<div className="container relative z-10 mx-auto px-4">
				{/* Hero Text */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="text-center max-w-4xl mx-auto mb-8"
				>
					<h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
						Streamline Your <span className="highlight-box">Project</span>{" "}
						Collaboration.
						<br />
						Connect & Manage{" "}
						<span className="highlight-box bg-gradient-to-r from-primary/20 to-accent/20">
							Together
						</span>
					</h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
						className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
					>
						Connect users, manage projects, and facilitate real-time feedback
						and communication with Betalift.
					</motion.p>
				</motion.div>

				{/* Phone and Floating Cards Section */}
				<div className="relative max-w-5xl mx-auto mt-16">
					{/* Floating Cards - Desktop only */}
					<div className="hidden lg:block">
						{floatingCards.map((card, i) => (
							<div key={i} className={`absolute ${card.position} z-20`}>
								<FloatingCard
									claim={card.claim}
									status={card.status}
									author={card.author}
									timeAgo={card.timeAgo}
									description={card.description}
									sources={card.sources}
									animationDelay={card.delay}
								/>
							</div>
						))}
					</div>

					{/* Phone Mockup */}
					<div className="relative z-10">
						<PhoneMockup />
					</div>
				</div>
				{/* CTA Button */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
					className="flex justify-center mt-12"
				>
					<button className="rounded-full px-8 py-4 text-base font-semibold bg-primary text-primary-foreground shadow-button hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
						Get Started
					</button>
				</motion.div>
			</div>
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
		</section>
	);
};
