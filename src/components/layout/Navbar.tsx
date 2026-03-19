import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import brandLogo from "@/assets/potterwiki-logo.png";

const navLinks = [
  // { label: "Home", href: "/" },
  // { label: "Quizlet", href: "/quizlet" },
  // { label: "This or That", href: "/this-or-that" },
  { label: "Quizzes", href: "/quizzes" },
  // { label: "Polls", href: "/#polls" },
];

const linkClass =
  "relative text-sm font-medium text-foreground/70 hover:text-accent transition-colors duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left";

const mobileLinkClass = "text-foreground/70 hover:text-accent transition-colors font-medium text-base";

const isHash = (href: string) => href.includes("#");

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-[0_4px_30px_-10px_hsla(0,0%,0%,0.5)]"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl md:text-2xl font-bold tracking-wider">
          <span className="inline-flex items-center gap-2">
            <img
              src={brandLogo}
              alt="Potterwiki"
              className="h-8 w-8 rounded-md object-cover ring-1 ring-border/40"
            />
            <span className="text-gradient-gold">Potter</span>
            <span className="text-foreground/90">wiki</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks?.map((link) =>
            isHash(link?.href) ? (
              <a key={link?.label} href={link?.href} className={linkClass}>
                {link?.label}
              </a>
            ) : (
              <Link key={link?.label} to={link?.href} className={linkClass}>
                {link?.label}
              </Link>
            )
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground/80 hover:text-accent transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
          >
            <div className="flex flex-col items-center gap-5 py-8">
              {navLinks?.map((link) =>
                isHash(link?.href) ? (
                  <a
                    key={link?.label}
                    href={link?.href}
                    onClick={() => setMobileOpen(false)}
                    className={mobileLinkClass}
                  >
                    {link?.label}
                  </a>
                ) : (
                  <Link
                    key={link?.label}
                    to={link?.href}
                    onClick={() => setMobileOpen(false)}
                    className={mobileLinkClass}
                  >
                    {link?.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
