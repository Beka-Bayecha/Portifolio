import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Sparkles,
  Layers,
  Loader2,
} from "lucide-react";
import { SKILL_ICONS } from "@/lib/skillConstants";
import { useCollection } from "@/hooks/useCollection";

// ── Firestore shape ───────────────────────────────────────────────
interface FirestoreSkill {
  id: string;
  order: number;
  name: string;
  /** Key into SKILL_ICONS, e.g. "react", "nodejs", "mysql" */
  icon: string;
  category: "core" | "other";
  /** Optional rich-text fields for core featured cards */
  tag?: string;
  summary?: string;
  subSkills?: string[];
}

// Dark brand colors that look bad on dark backgrounds — swap to slate
const DARK_COLORS = new Set([
  "#000000", "#181717", "#092E20", "#2D3748", "#010101",
]);

// ── Skeleton ──────────────────────────────────────────────────────
const SkillSkeleton = () => (
  <div className="p-7 rounded-2xl bg-white dark:bg-[#111217] border border-slate-200 dark:border-white/10 animate-pulse">
    <div className="flex items-center justify-between mb-5">
      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-white/5" />
      <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-white/5" />
    </div>
    <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/5 mb-2" />
    <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-white/5 mb-3" />
    <div className="h-4 w-full rounded bg-slate-200 dark:bg-white/5 mb-2" />
    <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-white/5" />
  </div>
);

export const Skills = () => {
  const { data: skills, loading, error } = useCollection<FirestoreSkill>("skills");
  const [showAll, setShowAll] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const coreSkills = skills.filter((s) => s.category === "core");
  const otherSkills = skills.filter((s) => s.category === "other");

  return (
    <section
      id="skills"
      className="py-24 sm:py-32 bg-slate-50 dark:bg-[#090a0d] text-slate-900 dark:text-white relative border-t border-slate-200 dark:border-white/5 overflow-hidden transition-colors duration-200"
    >
      {/* Ambient radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] bg-slate-200/50 dark:bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-10 relative z-10">
        {/* ── Section Header ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-14 border-b border-slate-200 dark:border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-400">
                02 / Technical Stack
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Languages & Expertise
            </h2>
          </div>
          <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base max-w-sm leading-relaxed font-normal">
            Primary languages, runtime architectures, and databases I engineer with daily.
          </p>
        </motion.div>

        {/* ── Core Skills Grid ────────────────── */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {[0, 1, 2, 3, 4, 5].map((i) => <SkillSkeleton key={i} />)}
          </div>
        ) : coreSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 dark:text-zinc-500 mb-10">
            <Loader2 size={28} strokeWidth={1.5} />
            <p className="text-sm font-mono text-center">
              {error ? `Error: ${error}` : "No skills added yet. Add them from the admin dashboard."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {coreSkills.map((skill, idx) => {
              const iconEntry = SKILL_ICONS[skill.icon];
              const Icon = iconEntry?.icon;
              const rawColor = iconEntry?.color ?? "#6366f1";
              const brandColor = DARK_COLORS.has(rawColor) ? "#334155" : rawColor;
              const isHovered = hoveredId === skill.id;

              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: 0.06 * idx }}
                  onMouseEnter={() => setHoveredId(skill.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative p-7 rounded-2xl bg-white dark:bg-[#111217] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 transition-all duration-300 hover:-translate-y-1.5 shadow-lg dark:shadow-2xl flex flex-col justify-between overflow-hidden"
                >
                  {/* Ambient hover glow */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 80% 20%, ${brandColor}15, transparent 65%)`,
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon + tag row */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          boxShadow: isHovered ? `0 0 20px ${brandColor}33` : "none",
                        }}
                      >
                        {Icon && (
                          <Icon
                            size={24}
                            color={isHovered ? brandColor : undefined}
                            className={isHovered ? "" : "text-slate-800 dark:text-zinc-200 transition-colors"}
                          />
                        )}
                      </div>
                      {skill.tag && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                          {skill.tag}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-slate-950 dark:group-hover:text-zinc-100 transition-colors">
                      {skill.name}
                    </h3>

                    {/* Summary */}
                    {skill.summary && (
                      <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed font-normal mb-5">
                        {skill.summary}
                      </p>
                    )}
                  </div>

                  {/* Sub-skill pills */}
                  {skill.subSkills && skill.subSkills.length > 0 && (
                    <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-1.5">
                      {skill.subSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-zinc-300 border border-slate-200 dark:border-white/5 transition-colors font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Expand / collapse toggle ─────────── */}
        {otherSkills.length > 0 && (
          <div className="flex justify-center mb-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white dark:bg-[#14161d] hover:bg-slate-100 dark:hover:bg-[#1a1c24] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 active:scale-98"
            >
              <Sparkles size={14} className="text-emerald-500 animate-pulse" />
              <span>
                {showAll
                  ? "Collapse Tech Stack"
                  : `View Full Stack & Tooling (${otherSkills.length}+ Technologies)`}
              </span>
              <motion.div animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={14} />
              </motion.div>
            </button>
          </div>
        )}

        {/* ── Other skills expandable drawer ───── */}
        <AnimatePresence>
          {showAll && otherSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#0e0f14] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl mb-12">
                <div className="mb-8 pb-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-zinc-400 block font-medium">
                      Extended Capabilities
                    </span>
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mt-1">
                      Full Technology Ecosystem
                    </h3>
                  </div>
                  <Layers size={18} className="text-slate-400 dark:text-zinc-500 hidden sm:block" />
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {otherSkills.map((skill, idx) => {
                    const iconEntry = SKILL_ICONS[skill.icon];
                    const Icon = iconEntry?.icon;
                    const rawColor = iconEntry?.color ?? "#6366f1";
                    const brandColor = DARK_COLORS.has(rawColor) ? "#334155" : rawColor;

                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.07] border border-slate-200 dark:border-white/5 transition-all flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-200/70 dark:bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                          {Icon && <Icon size={16} color={brandColor} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {skill.name}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Academic footer bar ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#111217] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md text-slate-900 dark:text-white"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold shadow-sm">
              <Sparkles size={15} />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                Academic IT Curriculum @ Haramaya University
              </p>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-mono mt-0.5">
                Data Structures, Relational Database Modeling, System Design & Networks
              </p>
            </div>
          </div>

          <a
            href="#certificates"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-800 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white underline decoration-slate-400 dark:decoration-white/30 underline-offset-4 transition-colors font-medium"
          >
            <span>View Academic Credentials</span>
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
