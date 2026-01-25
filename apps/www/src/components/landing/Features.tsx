import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Users, BookOpen, Zap, Globe, Lock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "User Authentication",
    description: "Secure user profiles and authentication management to keep your projects safe.",
  },
  {
    icon: BookOpen,
    title: "Project Management",
    description: "Create projects, manage memberships, and handle requests seamlessly.",
  },
  {
    icon: Users,
    title: "Feedback System",
    description: "Engage with a robust feedback system featuring comments and voting mechanisms.",
  },
  {
    icon: Zap,
    title: "Real-time Messaging",
    description: "Communicate instantly with team members to keep everyone on the same page.",
  },
  {
    icon: Globe,
    title: "Notifications",
    description: "Stay updated with a comprehensive notification system for all project activities.",
  },
  {
    icon: Lock,
    title: "Analytics & Tracking",
    description: "Gain insights with detailed analytics and engagement tracking for your projects.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      mass: 0.5,
    },
  },
};

export const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Built for{" "}
            <span className="highlight-box">Collaboration</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools designed to help you manage projects with confidence and clarity.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
