import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Plus,
  Minus,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Database,
  Smartphone,
  Zap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  overview: string;
  icon: typeof Code2;
  deliverables: string[];
  techStack: string[];
  whyItMatters: string;
}

const servicesList: ServiceItem[] = [
  {
    id: "fullstack",
    number: "01",
    title: "Full-Stack Web Development",
    tagline: "End-to-End Scalable Systems",
    overview:
      "Architecting full-stack digital platforms from database schema design to responsive client interfaces.",
    icon: Layers,
    deliverables: [
      "Custom Management Platforms & Portals",
      "Dynamic Single-Page Applications",
      "CI/CD Pipelines & Cloud Deployment",
      "Strict Modular TypeScript Architecture",
    ],
    techStack: ["React 18", "TypeScript", "Node.js", "Express", "Tailwind CSS"],
    whyItMatters: "Cohesive architectural vision from server to client.",
  },
  {
    id: "frontend",
    number: "02",
    title: "Modern Frontend Engineering",
    tagline: "High-Fidelity Interfaces",
    overview:
      "Crafting pixel-perfect, accessible client interfaces with fluid interactions and sub-second load times.",
    icon: Code2,
    deliverables: [
      "Reusable Component Systems",
      "Framer Motion Gesture Controls",
      "Mobile-First Responsive Layouts",
      "SEO & Accessibility Standards",
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    whyItMatters: "An exceptional UI builds immediate user trust.",
  },
  {
    id: "backend",
    number: "03",
    title: "Backend Services & RESTful APIs",
    tagline: "Secure Server Architectures",
    overview:
      "Engineering resilient, documented RESTful APIs with strict input sanitization and cryptographic auth.",
    icon: Cpu,
    deliverables: [
      "RESTful API Endpoints & Route Guards",
      "JWT Authentication & Token Rotation",
      "Role-Based Access Control (RBAC)",
      "Webhooks & Third-Party Integrations",
    ],
    techStack: ["Node.js", "Express", "REST APIs", "JWT", "Bcrypt"],
    whyItMatters: "Dependable servers that handle concurrency safely.",
  },
  {
    id: "database",
    number: "04",
    title: "Database Architecture",
    tagline: "Normalized Schemas & Indexing",
    overview:
      "Designing normalized MySQL schemas and high-throughput MongoDB document collections.",
    icon: Database,
    deliverables: [
      "Normalized MySQL (InnoDB) Schemas",
      "MongoDB & Firestore Collections",
      "Query Indexing Strategies",
      "Automated Migrations & Backups",
    ],
    techStack: ["MySQL", "MongoDB", "Firestore", "SQL Indexing"],
    whyItMatters: "Clean schemas guarantee long-term query speed.",
  },
  {
    id: "mobile",
    number: "05",
    title: "Cross-Platform Mobile Apps",
    tagline: "Native-Feel iOS & Android",
    overview:
      "Building performant cross-platform mobile tools using React Native with offline data caching.",
    icon: Smartphone,
    deliverables: [
      "Cross-Platform Native Apps",
      "Offline Storage & State Sync",
      "Biometric Authentication",
      "Fluid Touch Interactions",
    ],
    techStack: ["React Native", "TypeScript", "Redux", "SQLite"],
    whyItMatters: "Unified codebase reaching both iOS and Android.",
  },
  {
    id: "performance",
    number: "06",
    title: "Performance & Optimization",
    tagline: "Sub-Second Speeds & Audits",
    overview:
      "Auditing and optimizing codebases for speed, security, and continuous production reliability.",
    icon: Zap,
    deliverables: [
      "Lighthouse 95+ Performance Audits",
      "Code-Splitting & Tree-Shaking",
      "Security Audits & Vulnerability Patches",
      "Continuous Deployment on Vercel",
    ],
    techStack: ["Vercel", "Lighthouse", "Git", "Vite Analyzer"],
    whyItMatters: "Fast platforms convert and retain users longer.",
  },
];

const guarantees = [
  {
    icon: Zap,
    title: "Sub-Second Performance",
    desc: "Optimized bundle splitting and indexed queries.",
  },
  {
    icon: ShieldCheck,
    title: "Defensive Security",
    desc: "Strict OWASP validation and role-based guards.",
  },
  {
    icon: Code2,
    title: "Clean Architecture",
    desc: "Strict TypeScript interfaces and modular design.",
  },
  {
    icon: Sparkles,
    title: "Clear Communication",
    desc: "Direct updates and dependable production delivery.",
  },
];

export const Services = () => {
  const [openServiceId, setOpenServiceId] = useState<string>("fullstack");

  const toggleService = (id: string) => {
    setOpenServiceId((prev) => (prev === id ? "" : id));
  };

  return (
    <section
      id="services"
      className="py-24 sm:py-32 bg-white dark:bg-[#0c0d10] text-slate-900 dark:text-white relative border-t border-slate-200 dark:border-white/5 transition-colors duration-200"
    >
      {/* Subtle Ambient Radial Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] bg-slate-200/50 dark:bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-10 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-slate-200 dark:border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-400 block mb-3">
              03 / Capabilities & Architecture
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Services & Expertise
            </h2>
          </div>
          <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base max-w-sm leading-relaxed font-normal">
            Pragmatic software engineering delivered with modern standards and production reliability.
          </p>
        </motion.div>

        {/* Modern Editorial Accordion Showcase */}
        <div className="space-y-4 mb-20">
          {servicesList.map((service, idx) => {
            const isOpen = openServiceId === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: 0.05 * idx }}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? "bg-slate-50 dark:bg-[#13151b] border-slate-300 dark:border-white/20 shadow-xl"
                    : "bg-white dark:bg-[#0f1014] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 hover:bg-slate-50/50 dark:hover:bg-[#121317]"
                }`}
              >
                {/* Accordion Row Header */}
                <button
                  onClick={() => toggleService(service.id)}
                  className="w-full p-6 sm:p-8 flex items-center justify-between gap-6 text-left group transition-colors"
                >
                  <div className="flex items-center gap-6 sm:gap-8 flex-1 min-w-0">
                    {/* Index Number */}
                    <span
                      className={`font-mono text-sm sm:text-base font-bold transition-colors ${
                        isOpen
                          ? "text-slate-950 dark:text-white"
                          : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-900 dark:group-hover:text-zinc-300"
                      }`}
                    >
                      {service.number}
                    </span>

                    {/* Service Title & Tagline */}
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-heading text-lg sm:text-2xl font-bold tracking-tight transition-colors ${
                          isOpen
                            ? "text-slate-950 dark:text-white"
                            : "text-slate-800 dark:text-zinc-300 group-hover:text-slate-950 dark:group-hover:text-white"
                        }`}
                      >
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-500 mt-1 font-mono hidden sm:block">
                        {service.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                      isOpen
                        ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-md"
                        : "bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-zinc-400 group-hover:bg-slate-200 dark:group-hover:bg-white/15 group-hover:text-slate-950 dark:group-hover:text-white"
                    }`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                {/* Expanded Detailed Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 sm:px-8 sm:pb-10 pt-2 border-t border-slate-200 dark:border-white/10">
                        <div className="grid lg:grid-cols-12 gap-8 items-start pt-6">
                          {/* Left Column: Scope & Value */}
                          <div className="lg:col-span-6 space-y-6">
                            <div>
                              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 block mb-2 font-medium">
                                Scope & Approach
                              </span>
                              <p className="text-slate-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed font-normal">
                                {service.overview}
                              </p>
                            </div>

                            {/* Why it matters */}
                            <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1 font-medium">
                                Core Value
                              </span>
                              <p className="text-xs text-slate-800 dark:text-zinc-300 leading-relaxed italic">
                                "{service.whyItMatters}"
                              </p>
                            </div>

                            {/* Tech Stack */}
                            <div>
                              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 block mb-2.5 font-medium">
                                Technologies
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {service.techStack.map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-3 py-1 rounded-full text-xs font-mono bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-white/10 font-medium"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Deliverables Checklist */}
                          <div className="lg:col-span-6 flex flex-col justify-between h-full bg-slate-100/80 dark:bg-[#171922] p-6 sm:p-7 rounded-xl border border-slate-200 dark:border-white/10">
                            <div>
                              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 block mb-3 font-medium">
                                Deliverables
                              </span>
                              <div className="space-y-3 mb-6">
                                {service.deliverables.map((d) => (
                                  <div key={d} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-zinc-200">
                                    <CheckCircle2 size={16} className="text-slate-900 dark:text-white mt-0.5 flex-shrink-0" />
                                    <span>{d}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Direct Action */}
                            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                              <span className="text-xs font-mono text-slate-600 dark:text-zinc-400">
                                Ready to build?
                              </span>
                              <a
                                href="#contact"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider dark:hover:bg-zinc-200 transition-colors shadow-sm"
                              >
                                <span>Inquire Now</span>
                                <ArrowUpRight size={13} />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Engineering Guarantees Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="p-8 sm:p-10 rounded-2xl bg-slate-50 dark:bg-[#111216] border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl text-slate-900 dark:text-white"
        >
          <div className="mb-8 flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-zinc-400 block font-medium">
                Standard On Every Project
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Engineering Guarantees
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-zinc-500 hidden sm:inline">
              100% Transparency • Zero Compromises
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((g) => (
              <div key={g.title} className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-slate-200/80 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white mb-3">
                  <g.icon size={18} />
                </div>
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">{g.title}</h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">{g.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
