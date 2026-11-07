import { ArrowUp, Mail, MessageCircle } from "lucide-react";
import GithubIcon from "../icons/GithubIcon";
import logoEmblem from "@/assets/logo-emblem.png";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-100 dark:bg-[#08090b] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 pt-20 pb-12 transition-colors duration-200">
      <div className="container mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-200 dark:border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black dark:bg-transparent p-1.5 flex items-center justify-center shadow-sm dark:shadow-none flex-shrink-0 transition-colors">
                <img
                  src={logoEmblem}
                  alt="Beka Bayecha Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-wider uppercase text-slate-900 dark:text-white">
                Beka Bayecha
              </span>
            </div>
            <p className="text-slate-600 dark:text-zinc-400 text-sm max-w-sm leading-relaxed font-normal">
              Full-Stack Developer and Information Technology student at Haramaya University.
              Designing and building dependable web applications and scalable digital solutions.
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-mono">
              Based in Ethiopia • Open for remote & contract engagements worldwide.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400 block mb-2 font-medium">
              Navigation
            </span>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider font-semibold">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-slate-600 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Channels */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400 block mb-2 font-medium">
              Direct Contact
            </span>
            <ul className="space-y-2.5 text-xs font-mono text-slate-600 dark:text-zinc-400">
              <li>
                <a
                  href="mailto:bekibekinat@gmail.com"
                  className="hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail size={14} />
                  <span>bekibekinat@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/Elios53"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageCircle size={14} />
                  <span>@Elios53</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Beka-Bayecha"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-2"
                >
                  <GithubIcon size={14} />
                  <span>github.com/Beka-Bayecha</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} Beka Bayecha. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white transition-colors uppercase tracking-wider text-[11px] font-medium"
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
