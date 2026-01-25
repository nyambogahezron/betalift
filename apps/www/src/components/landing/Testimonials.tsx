import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Project Manager",
    avatar: "AJ",
    rating: 5,
    quote: "Betalift has revolutionized how we manage our design sprints. The feedback loop is instantaneous, and keeping everyone aligned has never been easier.",
  },
  {
    name: "Samantha Lee",
    role: "Lead Developer",
    avatar: "SL",
    rating: 5,
    quote: "The real-time messaging and seamless project integration mean I spend less time in meetings and more time coding. It's a game changer.",
  },
  {
    name: "Michael Chen",
    role: "Product Owner",
    avatar: "MC",
    rating: 5,
    quote: "Visibility into project progress is crucial for me. Betalift's analytics and notification system keep me informed without overwhelming me.",
  },
  {
    name: "Emily Davis",
    role: "UX Researcher",
    avatar: "ED",
    rating: 4,
    quote: "I love the community features. Being able to easily gather feedback and vote on ideas helps us prioritize what matters most to our users.",
  },
  {
    name: "David Kim",
    role: "Startup Founder",
    avatar: "DK",
    rating: 5,
    quote: "As a small team, we need efficient tools. Betalift gives us big-company project management capabilities without the complexity.",
  },
];

export const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

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
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Loved by{" "}
            <span className="highlight-box">Thousands</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join the growing community of teams who trust Betalift every day.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:shadow-card-hover transition-all duration-300 hover:-translate-x-5"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full glass-card flex items-center justify-center hover:shadow-card-hover transition-all duration-300 hover:translate-x-5"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 px-8">
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${currentIndex}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300"
              >
                {/* Quote Icon */}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Quote className="w-5 h-5 text-primary" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "text-warning fill-warning"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-primary/30 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
