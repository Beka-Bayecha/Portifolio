import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ["home", "about", "skills", "services", "work", "certificates", "contact"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 140) {
          const matched = navLinks.find((l) => l.href === `#${sections[i]}`);
          if (matched) setActive(matched.label);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-[#0b0c0e]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 py-4 shadow-lg text-slate-900 dark:text-white"
          : "bg-transparent py-6 text-white"
      }`}
    >
      <div className="container mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Brand / Monogram */}
        <a href="#home" className="group flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-heading font-black text-xs flex items-center justify-center tracking-wider transition-transform group-hover:scale-105 shadow-sm">
            BB
          </div>
          <div className="flex flex-col">
            <span
              className={`font-heading font-bold text-sm sm:text-base tracking-wider uppercase transition-colors ${
                scrolled
                  ? "text-slate-900 dark:text-white"
                  : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              }`}
            >
              Beka Bayecha
            </span>
            <span
              className={`text-[10px] font-medium tracking-widest uppercase ${
                scrolled
                  ? "text-slate-500 dark:text-zinc-400"
                  : "text-zinc-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              }`}
            >
              Full-Stack Developer
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-xs font-semibold uppercase tracking-widest transition-colors relative py-1 ${
                  active === link.label
                    ? scrolled
                      ? "text-slate-950 dark:text-white font-bold"
                      : "text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    : scrolled
                    ? "text-slate-600 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white"
                    : "text-zinc-200 hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                }`}
              >
                {link.label}
                {active === link.label && (
                  <motion.span
                    layoutId="navbar-active-line"
                    className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full ${
                      scrolled ? "bg-slate-950 dark:bg-white" : "bg-white"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Theme Toggle & CTA */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-300 dark:border-white/15">
            <ThemeToggle
              className={!scrolled ? "bg-black/50 border-white/30 text-white backdrop-blur-sm hover:bg-black/70" : ""}
            />

            <a
              href="#contact"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                scrolled
                  ? "border-slate-300 dark:border-white/20 text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black"
                  : "border-white/30 text-white bg-black/40 backdrop-blur-sm hover:bg-white hover:text-black shadow-md"
              }`}
            >
              <span>Let's Talk</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* Mobile Controls (Theme Toggle & Hamburger) */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle
            className={!scrolled ? "bg-black/50 border-white/30 text-white backdrop-blur-sm hover:bg-black/70" : ""}
          />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            className={`p-2 transition-colors ${
              scrolled
                ? "text-slate-900 dark:text-white"
                : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            }`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 top-0 left-0 w-full bg-slate-50 dark:bg-[#0b0c0e] text-slate-900 dark:text-white z-40 flex flex-col justify-between px-8 py-24"
          >
            {/* Top Close Bar */}
            <div className="flex justify-between items-center pb-6 border-b border-slate-200 dark:border-white/10">
              <span className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Menu
              </span>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Links List */}
            <div className="flex flex-col gap-5 my-auto">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * idx }}
                  onClick={() => setMobileOpen(false)}
                  className={`font-heading text-2xl font-extrabold uppercase tracking-tight transition-colors ${
                    active === link.label
                      ? "text-slate-950 dark:text-white font-bold"
                      : "text-slate-500 dark:text-zinc-500 hover:text-slate-950 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            {/* Mobile Footer CTA */}
            <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col gap-4">
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-semibold text-center text-sm uppercase tracking-wider shadow-lg"
              >
                Start a Conversation
              </a>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-500 font-mono">
                <span>bekibekinat@gmail.com</span>
                <span>Haramaya, ET</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
