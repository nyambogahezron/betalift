import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ScrollToTop } from "@/components/landing/ScrollToTop";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: `This Privacy Policy explains how Betalift ("we", "us", or "our") collects, uses, shares, and protects your personal information when you use our platform, mobile applications, and related services (collectively, the "Services").

By using our Services, you agree to the collection and use of information in accordance with this policy. If you do not agree with any part of this policy, please do not use our Services.`,
  },
  {
    id: "information-collected",
    title: "Information We Collect",
    content: `We collect several types of information to provide and improve our Services:

**Personal Information:**
- Account information (name, email address, username)
- Profile information (bio, avatar, preferences)
- Payment information (for premium features)
- Communication data (messages, feedback, support inquiries)

**Usage Information:**
- Device information (device type, operating system, browser)
- Log data (IP address, access times, pages viewed)
- App usage data (features used, interactions, session duration)

**Cookies and Tracking:**
- Essential cookies for authentication and security
- Analytics cookies to understand usage patterns
- Preference cookies to remember your settings`,
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: `We use the collected information for various purposes:

- **Provide Services:** To create and manage your account, process transactions, and deliver features
- **Improve Services:** To analyze usage patterns, fix bugs, and develop new features
- **Communicate:** To send service updates, security alerts, and marketing communications (with consent)
- **Security:** To detect and prevent fraud, abuse, and security incidents
- **Legal Compliance:** To comply with legal obligations and enforce our terms`,
  },
  {
    id: "information-sharing",
    title: "Information Sharing",
    content: `We do not sell your personal information. We may share information in the following circumstances:

- **With Your Consent:** When you explicitly authorize sharing
- **Project Members:** Limited profile information with creators/testers in shared projects
- **Service Providers:** With trusted third parties who assist in operating our Services
- **Legal Requirements:** When required by law or to protect rights and safety
- **Business Transfers:** In connection with a merger, acquisition, or sale of assets`,
  },
  {
    id: "data-security",
    title: "Data Security",
    content: `We implement industry-standard security measures to protect your information:

- Encryption of data in transit (TLS/SSL) and at rest
- Regular security audits and vulnerability assessments
- Access controls and authentication requirements
- Secure data backup and disaster recovery
- Employee training on data protection

While we strive to use commercially acceptable means to protect your data, no method of transmission over the Internet or electronic storage is 100% secure.`,
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: `Depending on your location, you may have certain rights regarding your personal information:

- **Access:** Request a copy of your personal data
- **Correction:** Update or correct inaccurate information
- **Deletion:** Request deletion of your personal data
- **Portability:** Receive your data in a portable format
- **Opt-out:** Unsubscribe from marketing communications
- **Restriction:** Limit how we use your data

To exercise these rights, please contact us at privacy@betalift.com.`,
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: `We retain your personal information for as long as necessary to:

- Provide our Services and maintain your account
- Comply with legal obligations
- Resolve disputes and enforce agreements
- Improve and analyze our Services

When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law.`,
  },
  {
    id: "international-transfers",
    title: "International Data Transfers",
    content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place:

- Standard contractual clauses
- Data processing agreements
- Compliance with applicable data protection laws

By using our Services, you consent to the transfer of your information to our facilities and those of third parties with whom we share it.`,
  },
  {
    id: "children-privacy",
    title: "Children's Privacy",
    content: `Our Services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.`,
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by:

- Posting the new Privacy Policy on this page
- Updating the "Last Updated" date
- Sending an email notification for significant changes

We encourage you to review this Privacy Policy periodically for any changes.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy, please contact us:

**Email:** privacy@betalift.com
**Address:** 123 Innovation Street, Tech City, TC 12345
**Data Protection Officer:** dpo@betalift.com`,
  },
];

const Privacy = () => {
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
              Privacy Policy
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

export default Privacy;
