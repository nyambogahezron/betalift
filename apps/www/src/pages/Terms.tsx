import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ScrollToTop } from "@/components/landing/ScrollToTop";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: `Welcome to Betalift. By accessing or using our platform, mobile applications, and related services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms").

If you do not agree to these Terms, you may not access or use our Services. We recommend that you print or save a local copy of these Terms for your records.`,
  },
  {
    id: "eligibility",
    title: "Eligibility",
    content: `To use our Services, you must:

- Be at least 13 years of age
- Have the legal capacity to enter into a binding agreement
- Not be prohibited from using the Services under applicable law
- Provide accurate and complete registration information

If you are using the Services on behalf of an organization, you represent that you have authority to bind that organization to these Terms.`,
  },
  {
    id: "accounts",
    title: "User Accounts",
    content: `**Account Creation:**
You must create an account to access most features of our Services. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

**Account Security:**
You agree to immediately notify us of any unauthorized use of your account or any other breach of security. We are not liable for any loss or damage arising from your failure to protect your account.

**Account Termination:**
You may delete your account at any time through the app settings. We reserve the right to suspend or terminate accounts that violate these Terms.`,
  },
  {
    id: "user-conduct",
    title: "User Conduct",
    content: `When using our Services, you agree NOT to:

- Violate any applicable laws or regulations
- Infringe on intellectual property rights of others
- Post false, misleading, or fraudulent content
- Harass, abuse, or threaten other users
- Distribute spam, malware, or harmful content
- Attempt to gain unauthorized access to systems
- Reverse engineer or decompile our software
- Use automated tools to scrape or collect data
- Impersonate other users or entities
- Interfere with the proper functioning of the Services`,
  },
  {
    id: "content",
    title: "User Content",
    content: `**Ownership:**
You retain ownership of content you create and share through our Services ("User Content"). By posting User Content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute such content in connection with operating and promoting our Services.

**Content Standards:**
User Content must not be illegal, offensive, defamatory, or infringing on third-party rights. We reserve the right to remove any content that violates these Terms.

**Feedback:**
If you provide feedback, feature requests, or suggestions, we may use them to improve our Services without obligation to you.`,
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: `**Our Property:**
The Services, including our software, design, logos, and documentation, are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our intellectual property without written permission.

**Trademarks:**
"Betalift" and our logos are trademarks of Betalift Inc. You may not use our trademarks without prior written consent.

**DMCA:**
We respect intellectual property rights. If you believe your work has been copied in a way that constitutes infringement, please contact us at legal@betalift.com with the required information.`,
  },
  {
    id: "payments",
    title: "Payments and Subscriptions",
    content: `**Pricing:**
Some features of our Services require payment. All prices are in USD unless otherwise specified and are subject to change with notice.

**Subscriptions:**
Paid subscriptions automatically renew unless cancelled before the renewal date. You can manage your subscription in your account settings.

**Refunds:**
Refunds may be available in certain circumstances. Please refer to our refund policy or contact support for assistance.

**Taxes:**
You are responsible for any taxes associated with your use of the Services, excluding taxes on our net income.`,
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    content: `THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.

We do not warrant that:
- The Services will be uninterrupted or error-free
- Defects will be corrected
- The Services are free of viruses or harmful components
- Results from using the Services will be accurate or reliable

Some jurisdictions do not allow disclaimer of implied warranties, so some of the above may not apply to you.`,
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, BETALIFT SHALL NOT BE LIABLE FOR:

- Indirect, incidental, special, or consequential damages
- Loss of profits, revenue, data, or business opportunities
- Damages resulting from your use of the Services
- Content posted by other users

Our total liability shall not exceed the amount you paid to us in the twelve (12) months preceding the claim or $100, whichever is greater.`,
  },
  {
    id: "indemnification",
    title: "Indemnification",
    content: `You agree to indemnify and hold harmless Betalift and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from:

- Your use of the Services
- Your violation of these Terms
- Your User Content
- Your violation of any third-party rights`,
  },
  {
    id: "modifications",
    title: "Modifications to Terms",
    content: `We may modify these Terms at any time. When we make changes, we will:

- Update the "Last Updated" date at the top of these Terms
- Notify you of significant changes via email or in-app notification
- Provide reasonable notice before changes take effect

Your continued use of the Services after changes are effective constitutes acceptance of the revised Terms.`,
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.

Any disputes arising from these Terms or your use of the Services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.`,
  },
  {
    id: "contact",
    title: "Contact Information",
    content: `If you have any questions about these Terms, please contact us:

**Email:** legal@betalift.com
**Address:** 123 Innovation Street, Tech City, TC 12345

For support inquiries, please visit our Help Center or email support@betalift.com.`,
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollToTop />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 25, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Table of Contents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-6 mb-12"
            >
              <h2 className="font-display font-bold text-lg mb-4">Table of Contents</h2>
              <nav className="grid sm:grid-cols-2 gap-2">
                {sections.map((section, i) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {i + 1}. {section.title}
                  </a>
                ))}
              </nav>
            </motion.div>

            {/* Sections */}
            <div className="space-y-12">
              {sections.map((section, i) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="scroll-mt-32"
                >
                  <h2 className="font-display text-2xl font-bold mb-4">{section.title}</h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
