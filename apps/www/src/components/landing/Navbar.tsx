import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string, navigate: ReturnType<typeof useNavigate>, location: ReturnType<typeof useLocation>) => {
  e.preventDefault();
  
  // If not on home page, navigate to home first
  if (location.pathname !== "/") {
    navigate("/");
    setTimeout(() => {
      if (href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 100);
    return;
  }
  
  if (href === "#") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-6 left-1/2 z-50 w-[90%] max-w-4xl"
      >
        <nav className="glass-nav rounded-full px-4 py-2 flex items-center justify-between relative">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="Betalift Logo" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-display font-bold text-lg text-foreground">Betalift</span>
          </div>

          {/* Nav Links - Desktop - Centered */}
          <div className="hidden md:flex items-center gap-1 bg-secondary/50 rounded-full px-2 py-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href, navigate, location)}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-white/50"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <button 
            onClick={() => navigate("/download")}
            className="hidden md:block rounded-full px-6 py-2 text-sm font-medium bg-primary text-primary-foreground shadow-button hover:bg-primary/90 transition-colors"
          >
            Download
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[75%] max-w-sm bg-background/95 backdrop-blur-xl z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <img src="/icon.png" alt="Betalift Logo" className="w-8 h-8 rounded-lg object-contain" />
                    <span className="font-display font-bold text-lg text-foreground">Betalift</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={(e) => {
                        handleSmoothScroll(e, link.href, navigate, location);
                        setIsOpen(false);
                      }}
                      className="px-4 py-3 text-lg font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>

                <div className="mt-auto">
                  <button 
                    onClick={() => {
                      navigate("/download");
                      setIsOpen(false);
                    }}
                    className="w-full rounded-full px-6 py-3 text-base font-semibold bg-primary text-primary-foreground shadow-button hover:bg-primary/90 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
