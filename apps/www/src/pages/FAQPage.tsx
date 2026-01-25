import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";

const faqCategories = [
  { id: "all", name: "All" },
  { id: "general", name: "General" },
  { id: "creators", name: "For Creators" },
  { id: "testers", name: "For Testers" },
  { id: "account", name: "Account" },
  { id: "billing", name: "Billing" },
  { id: "technical", name: "Technical" },
];

const faqs = [
  {
    category: "general",
    question: "What is Betalift?",
    answer: "Betalift is a collaborative platform that connects software creators with beta testers. Creators can share their projects, recruit testers, and gather valuable feedback, while testers can discover exciting new apps and contribute to their development.",
  },
  {
    category: "general",
    question: "Is Betalift free to use?",
    answer: "Yes! Betalift offers a free tier that includes up to 3 projects and 50 testers per project. For creators who need more features, we offer Pro and Enterprise plans with additional capabilities.",
  },
  {
    category: "general",
    question: "What platforms does Betalift support?",
    answer: "Betalift supports iOS, Android, and web platforms. You can test apps from any of these platforms and manage your projects from our mobile apps and web dashboard.",
  },
  {
    category: "creators",
    question: "How do I post a beta project?",
    answer: "After creating an account, tap the '+' button to create a new project. Fill in your project details, add screenshots, provide download links (TestFlight, Play Store beta, etc.), and choose whether to make it public or invite-only.",
  },
  {
    category: "creators",
    question: "How do I recruit testers?",
    answer: "You can recruit testers by making your project public (visible in our discovery feed), sharing your project link directly, or inviting specific users via email. Testers can also find your project through search.",
  },
  {
    category: "creators",
    question: "Can I limit who can join my project?",
    answer: "Yes! You can set your project to 'invite-only' mode, where only users you explicitly invite can join. You can also review and approve/reject join requests for public projects.",
  },
  {
    category: "creators",
    question: "What types of feedback can I collect?",
    answer: "Betalift supports multiple feedback types: Bug Reports, Feature Requests, Improvements, Praise, Questions, and Other. Each feedback type has customizable fields including priority levels and device information capture.",
  },
  {
    category: "testers",
    question: "How do I find projects to test?",
    answer: "Browse the Discover feed to find public beta projects. You can filter by category, platform, and popularity. You can also search for specific projects or browse featured projects.",
  },
  {
    category: "testers",
    question: "How do I submit feedback?",
    answer: "Once you've joined a project, navigate to the project detail page and tap 'Submit Feedback'. Choose the feedback type, provide details, attach screenshots if needed, and submit. Device information is captured automatically.",
  },
  {
    category: "testers",
    question: "Do I get rewarded for testing?",
    answer: "While Betalift doesn't provide direct monetary rewards, you can build your reputation as a trusted tester, earn badges, and get early access to exciting new apps. Some creators may offer additional incentives.",
  },
  {
    category: "account",
    question: "How do I create an account?",
    answer: "Download the Betalift app or visit our website. Tap 'Sign Up' and choose to register with your email or use social sign-in (Google, Apple). Complete your profile to get started.",
  },
  {
    category: "account",
    question: "Can I be both a creator and a tester?",
    answer: "Absolutely! Your Betalift account lets you create your own projects and join others as a tester. There's no need for separate accounts.",
  },
  {
    category: "account",
    question: "How do I delete my account?",
    answer: "Go to Settings > Account > Delete Account. Note that this action is permanent and will remove all your data, including projects you've created and feedback you've submitted.",
  },
  {
    category: "billing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and for Enterprise plans, we also support invoicing.",
  },
  {
    category: "billing",
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. You'll retain access to premium features until the end of your current billing period.",
  },
  {
    category: "billing",
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee for new subscriptions. If you're not satisfied, contact support within 14 days of your purchase for a full refund.",
  },
  {
    category: "technical",
    question: "How secure is my data?",
    answer: "We use industry-standard encryption (TLS/SSL) for all data transmission and encrypt sensitive data at rest. We also conduct regular security audits and follow best practices for data protection.",
  },
  {
    category: "technical",
    question: "Can I integrate Betalift with other tools?",
    answer: "Pro and Enterprise plans include integrations with popular tools like Slack, Jira, GitHub, and more. Custom integrations are available for Enterprise customers.",
  },
  {
    category: "technical",
    question: "What happens if I exceed my tester limit?",
    answer: "If you reach your plan's tester limit, new testers won't be able to join until you upgrade your plan or remove existing testers. We'll notify you when you're approaching your limit.",
  },
];

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (question: string) => {
    setOpenItems((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    );
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              Frequently Asked <span className="highlight-box">Questions</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Find answers to common questions about Betalift.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/80 backdrop-blur border-0 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFaqs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">No questions found matching your criteria.</p>
              </motion.div>
            ) : (
              filteredFaqs.map((faq, i) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(faq.question)}
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <span className="font-display font-bold pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${
                        openItems.includes(faq.question) ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openItems.includes(faq.question) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-muted-foreground">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto"
          >
            <h2 className="font-display text-3xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-block rounded-full px-8 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQPage;
