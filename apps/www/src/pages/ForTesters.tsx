import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import {
  Star,
  Smartphone,
  MessageSquare,
  Award,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
} from "lucide-react";

const benefits = [
  {
    icon: Smartphone,
    title: "Early Access",
    description: "Be among the first to try exciting new apps before they're released to the public.",
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    description: "Earn badges, build your profile, and become a trusted tester in the community.",
  },
  {
    icon: MessageSquare,
    title: "Direct Impact",
    description: "Your feedback shapes the products. Creators actively listen and implement suggestions.",
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Get credited for your contributions. Great testers are highlighted and appreciated.",
  },
  {
    icon: Clock,
    title: "Flexible Testing",
    description: "Test on your own schedule. There's no pressure—contribute when you have time.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Join a community of fellow testers and creators passionate about building great products.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Sign up and set up your tester profile. Tell creators about your interests and devices.",
  },
  {
    number: "02",
    title: "Discover Projects",
    description: "Browse the discovery feed or search for projects that match your interests.",
  },
  {
    number: "03",
    title: "Join & Test",
    description: "Request to join projects and start testing. Download beta apps and explore.",
  },
  {
    number: "04",
    title: "Submit Feedback",
    description: "Report bugs, suggest features, or share what you love about the product.",
  },
];

const testimonials = [
  {
    quote: "I've tested over 50 apps on Betalift. Some of my favorite apps today are ones I tested in beta!",
    author: "Jamie Rodriguez",
    role: "Power Tester, 150+ Projects",
  },
  {
    quote: "The creators here actually listen. I suggested a feature last month and it's already in the app.",
    author: "Alex Kim",
    role: "Top Contributor",
  },
];

const categories = [
  "Productivity",
  "Health & Fitness",
  "Social",
  "Entertainment",
  "Finance",
  "Education",
  "Gaming",
  "Utilities",
];

const ForTesters = () => {
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
            <span className="inline-block px-4 py-1 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
              For Testers
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
              Discover <span className="highlight-box">Tomorrow's Apps</span> Today
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Get exclusive early access to exciting new apps. Your feedback 
              helps shape the products millions will use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/download"
                className="rounded-full px-8 py-3 bg-success text-white font-semibold hover:bg-success/90 transition-colors"
              >
                Start Testing
              </a>
              <a
                href="#how-it-works"
                className="rounded-full px-8 py-3 bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: "10K+", label: "Active Projects" },
              { value: "50K+", label: "Testers" },
              { value: "1M+", label: "Feedback Submitted" },
              { value: "Free", label: "Always" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-success mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
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
              Why Join as a Tester?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Testing on Betalift is free and rewarding
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
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-display text-2xl font-bold mb-4">
              Explore Projects by Category
            </h2>
            <p className="text-muted-foreground">
              Find apps that match your interests
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {categories.map((category) => (
              <span
                key={category}
                className="px-4 py-2 rounded-full bg-white/80 text-sm font-medium hover:bg-success/10 hover:text-success transition-colors cursor-pointer"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
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
              Start testing in just a few minutes
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
                  <span className="text-5xl font-bold text-success/20 mb-4 block">
                    {step.number}
                  </span>
                  <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 w-6 h-6 text-success/30" />
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success/20 to-primary/20 flex items-center justify-center">
                    <span className="font-bold text-success">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Do */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-success" />
              <h2 className="font-display text-3xl font-bold">
                What You Can Do
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Browse and join projects",
                "Test iOS, Android, and web apps",
                "Submit bug reports",
                "Suggest new features",
                "Rate and review apps",
                "Chat with creators",
                "Track your contributions",
                "Earn tester badges",
                "Get notified of new projects",
                "Build your reputation",
                "Join testing communities",
                "Access exclusive betas",
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
              Ready to Discover Amazing Apps?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of testers already exploring the future of apps. It's completely free!
            </p>
            <a
              href="/download"
              className="inline-block rounded-full px-8 py-3 bg-success text-white font-semibold hover:bg-success/90 transition-colors"
            >
              Start Testing Now
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForTesters;
