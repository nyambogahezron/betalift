import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

const faqs = [
	{
		question: "How does Betalift verify claims?",
		answer:
			"Betalift uses a multi-layered verification process. First, our AI pre-screens claims for relevance and identifies key assertions. Then, our community of trained fact-checkers analyzes the claim using multiple trusted sources. Finally, a verdict is reached through consensus, with full transparency on the sources and reasoning used.",
	},
	{
		question: "Is Betalift free to use?",
		answer:
			"Yes! Betalift offers a free tier that includes access to all verified claims, the ability to submit claims for verification, and participation in the community. Premium features like priority verification, advanced analytics, and API access are available with our Pro plan.",
	},
	{
		question: "Who are the fact-checkers?",
		answer:
			"Our fact-checkers include journalists, researchers, academics, and trained community members. All fact-checkers go through a rigorous verification and training process. Their credentials are visible on their profiles, and their track record is publicly available.",
	},
	{
		question: "How long does verification take?",
		answer:
			"Simple claims with readily available sources can be verified in minutes. More complex claims requiring deeper research typically take 24-48 hours. Priority verification for Pro users guarantees results within 4 hours for most claims.",
	},
	{
		question: "Can I trust the verdicts?",
		answer:
			"Our verdicts are based on evidence, not opinion. Every verdict includes links to primary sources, methodology explanations, and dissenting views when applicable. Our accuracy rate, independently audited, is over 98%. You can always review the evidence yourself.",
	},
	{
		question: "How do I become a fact-checker?",
		answer:
			"Anyone can apply to become a community fact-checker! You'll need to complete our training program, pass a certification test, and maintain a high accuracy rating. Experienced fact-checkers can earn rewards and badges for their contributions.",
	},
];

interface AccordionItemProps {
	question: string;
	answer: string;
	isOpen: boolean;
	onClick: () => void;
}

const AccordionItem = ({
	question,
	answer,
	isOpen,
	onClick,
}: AccordionItemProps) => {
	return (
		<div className="glass-card rounded-2xl overflow-hidden">
			<button
				onClick={onClick}
				className="w-full px-6 py-5 flex items-center justify-between text-left"
			>
				<span className="font-display font-semibold text-foreground pr-4">
					{question}
				</span>
				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.2 }}
					className="shrink-0"
				>
					<ChevronDown className="w-5 h-5 text-muted-foreground" />
				</motion.div>
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<p className="px-6 pb-5 text-muted-foreground leading-relaxed">
							{answer}
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export const FAQ = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleItem = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section id="faq" className="relative py-24 overflow-hidden">
			{/* Background */}
			<div className="absolute inset-0 gradient-hero" />

			<div className="container relative z-10 mx-auto px-4">
				{/* Section Header */}
				<motion.div
					ref={ref}
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.6 }}
					className="text-center max-w-2xl mx-auto mb-16"
				>
					<span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
						FAQ
					</span>
					<h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
						Common <span className="highlight-box">Questions</span>
					</h2>
					<p className="text-lg text-muted-foreground">
						Everything you need to know about Betalift and how it works.
					</p>
				</motion.div>

				{/* FAQ Accordion */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="max-w-3xl mx-auto space-y-4"
				>
					{faqs.map((faq, index) => (
						<AccordionItem
							key={index}
							question={faq.question}
							answer={faq.answer}
							isOpen={openIndex === index}
							onClick={() => toggleItem(index)}
						/>
					))}
				</motion.div>

				{/* Still have questions */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="text-center mt-12"
				>
					<p className="text-muted-foreground mb-4">Still have questions?</p>
					<a
						href="#"
						className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
					>
						Contact our support team →
					</a>
				</motion.div>
			</div>
		</section>
	);
};
