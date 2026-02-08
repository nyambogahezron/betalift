import { FAQ } from "@/components/landing/FAQ";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { Testimonials } from "@/components/landing/Testimonials";

const Index = () => {
	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<ScrollToTop />
			<Hero />
			<Features />
			<HowItWorks />
			<Testimonials />
			<FAQ />
			<Footer />
		</div>
	);
};

export default Index;
