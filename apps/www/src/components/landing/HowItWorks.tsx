import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Users, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Create a Project",
    description: "Set up your workspace, define project goals, and organize your initial tasks.",
    color: "from-primary to-accent",
  },
  {
    number: "02",
    icon: Users,
    title: "Invite Your Team",
    description: "Connect with collaborators, assign roles, and build your dream team.",
    color: "from-accent to-primary",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Collaborate",
    description: "Chat in real-time, share files, manage tasks, and gather feedback seamlessly.",
    color: "from-success to-primary",
  },
];

export const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How it works
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Three Steps to{" "}
            <span className="highlight-box">Success</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From idea to launch. Our streamlined process makes collaboration effortless.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line - Desktop */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-1/2 origin-left"
          />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
                className="relative"
              >
                {/* Card */}
                <div className="glass-card rounded-3xl p-8 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                      <span className="text-xs font-bold text-primary-foreground">{step.number}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Between cards on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-6 -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                    >
                      <ArrowRight className="w-5 h-5 text-primary/40" />
                    </motion.div>
                  </div>
                )}

                {/* Arrow - Between cards on mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
                      transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                      className="rotate-90"
                    >
                      <ArrowRight className="w-5 h-5 text-primary/40" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Ready to start building?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold shadow-button hover:shadow-lg transition-all duration-300"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
