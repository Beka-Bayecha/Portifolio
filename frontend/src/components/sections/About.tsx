import { motion } from "framer-motion";
import { Download, GraduationCap, ArrowUpRight, CheckCircle2, Code, Server, Sparkles } from "lucide-react";
import developerImage from "@/assets/dev.jpg";
import { generateResumePDF } from "@/lib/pdfGenerator";

const stats = [
  { icon: GraduationCap, label: "Haramaya University", value: "BSc in IT", sub: "Expected 2026" },
  { icon: Code, label: "Deployed Systems", value: "22+", sub: "Full-Stack Web & Mobile" },
  { icon: Server, label: "Backend APIs", value: "15+", sub: "RESTful & Secure" },
];

const tenets = [
  "Modular React & TypeScript",
  "MySQL & MongoDB Schemas",
  "Secure RESTful APIs",
  "Fast, Responsive Interfaces",
];

export const About = () => {
  return (
    <section
      id="about"
      className="py-24 sm:py-32 bg-white dark:bg-[#0b0c0e] text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-200"
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-slate-200/50 dark:bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-10 relative z-10">
        {/* Section Pre-title / Label with scroll reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-slate-200 dark:border-white/10 pb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white animate-ping" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-400">
              01 / About & Background
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-zinc-500 font-mono hidden sm:inline">
            Haramaya University • Ethiopia
          </span>
        </motion.div>

        {/* Editorial Layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Portrait Photography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 group shadow-2xl">
              <img
                src={developerImage}
                alt="Beka Bayecha - Full-Stack Developer"
                className="w-full h-[460px] sm:h-[540px] object-cover object-center filter grayscale-[0.1] contrast-[1.05] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-85" />

              {/* Photo Caption Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 shadow-xl text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-bold text-sm text-white">Beka Bayecha</p>
                    <p className="text-xs text-zinc-300 font-mono mt-0.5">Full-Stack Developer • IT Student</p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white">
                    <Sparkles size={13} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Education Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 p-6 rounded-2xl bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-white/10 shadow-lg text-slate-900 dark:text-white"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold shadow-md">
                  <GraduationCap size={16} />
                </div>
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  Academic Degree
                </h4>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                Bachelor of Science in Information Technology
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Haramaya University • Focus: Software Engineering & Systems
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: Personal Brand Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Large Editorial Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-slate-900 dark:text-white mb-8"
            >
              Turning complex requirements into clean, dependable software.
            </motion.h2>

            {/* Stats Row with Staggered Scroll Animation */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {stats.map((s, idx) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.1 * idx }}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all group"
                >
                  <p className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white group-hover:scale-105 transition-transform origin-left">
                    {s.value}
                  </p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 mt-0.5">{s.label}</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">{s.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Story Body - Short & Professional */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-4 text-slate-700 dark:text-zinc-300 text-base sm:text-lg leading-relaxed font-normal"
            >
              <p>
                I am a full-stack developer studying Information Technology at{" "}
                <strong className="text-slate-900 dark:text-white font-semibold">Haramaya University</strong>. I specialize in building
                production web applications, scalable backend APIs, and responsive digital platforms.
              </p>
              <p>
                My focus is clean architecture, reliable databases, and intuitive user experiences that deliver real organizational value.
              </p>
            </motion.div>

            {/* Core Tenets Checklist with Scroll Reveals */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-white/10"
            >
              {tenets.map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: 0.05 * idx }}
                  className="flex items-center gap-2.5 text-sm text-slate-800 dark:text-zinc-300"
                >
                  <CheckCircle2 size={16} className="text-slate-900 dark:text-white flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 mt-10 pt-8 border-t border-slate-200 dark:border-white/10"
            >
              <button
                onClick={generateResumePDF}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-98"
              >
                <Download size={15} />
                <span>Download Resume (PDF)</span>
              </button>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/10 transition-all hover:scale-105 active:scale-98"
              >
                <span>Get In Touch</span>
                <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
