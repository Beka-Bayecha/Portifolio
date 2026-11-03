import { motion } from "framer-motion";
import { ExternalLink, BookOpen, Loader2, Clock } from "lucide-react";
import GithubIcon from "../icons/GithubIcon";
import churchImage from "@/assets/church.png";
import schoolImage from "@/assets/school.png";
import portfolioImage from "@/assets/port.png";
import { useCollection } from "@/hooks/useCollection";

// ── Types ──────────────────────────────────────────────────────────
interface FirestoreProject {
  id: string;
  order: number;
  title: string;
  description: string;
  tech: string[];
  imageKey: string;
  liveUrl: string;
  githubUrl: string;
  upcoming: boolean;
  subtitle?: string;
}

// ── Image map ─────────────────────────────────────────────────────
const IMAGE_MAP: Record<string, string> = {
  church: churchImage,
  school: schoolImage,
  port: portfolioImage,
};

// ── Loading skeleton ──────────────────────────────────────────────
const ProjectSkeleton = ({ idx }: { idx: number }) => {
  const isEven = idx % 2 === 1;
  return (
    <div className={`grid lg:grid-cols-12 gap-8 lg:gap-14 items-center ${isEven ? "" : ""}`}>
      <div className="lg:col-span-7 animate-pulse">
        <div className="aspect-[16/10] rounded-2xl bg-slate-200 dark:bg-white/5" />
      </div>
      <div className="lg:col-span-5 space-y-4 animate-pulse">
        <div className="h-3 w-24 rounded bg-slate-200 dark:bg-white/5" />
        <div className="h-7 w-3/4 rounded bg-slate-200 dark:bg-white/5" />
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-white/5" />
        <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-white/5" />
        <div className="flex gap-2 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 rounded-full bg-slate-200 dark:bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Projects = () => {
  const { data: projects, loading, error } = useCollection<FirestoreProject>("projects");

  return (
    <section
      id="work"
      className="py-24 sm:py-32 bg-slate-50 dark:bg-[#0b0c0e] text-slate-900 dark:text-white relative transition-colors duration-200"
    >
      <div className="container mx-auto px-6 sm:px-10">
        {/* ── Section Header ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-20 border-b border-slate-200 dark:border-white/10 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-400 block mb-3">
              04 / Selected Work
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Featured Projects
            </h2>
          </div>
          <p className="text-slate-600 dark:text-zinc-400 text-sm max-w-sm leading-relaxed font-normal">
            Selected full-stack web applications and production platforms.
          </p>
        </motion.div>

        {/* ── Content ─────────────────────────── */}
        {loading ? (
          <div className="space-y-24 sm:space-y-32">
            {[0, 1, 2].map((i) => (
              <ProjectSkeleton key={i} idx={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400 dark:text-zinc-500">
            <Loader2 size={32} strokeWidth={1.5} />
            <p className="text-sm font-mono">
              {error ? `Error: ${error}` : "No projects added yet. Add them from the admin dashboard."}
            </p>
          </div>
        ) : (
          <div className="space-y-24 sm:space-y-32">
            {projects.map((project, idx) => {
              const isEven = idx % 2 === 1;
              const imageSrc = IMAGE_MAP[project.imageKey] ?? undefined;
              const technologies = project.tech ?? [];

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center"
                >
                  {/* ── Visual ──────────────────── */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className={`lg:col-span-7 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                  >
                    <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#16171d] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
                      {imageSrc ? (
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={imageSrc}
                            alt={project.title}
                            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity" />
                        </div>
                      ) : (
                        /* Browser chrome mockup for projects without an image */
                        <div className="relative aspect-[16/10] bg-slate-50 dark:bg-[#121318] flex flex-col justify-between">
                          <div className="px-4 py-3 bg-slate-100 dark:bg-[#0d0e12] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-600 inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-600 inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-600 inline-block" />
                            </div>
                            <span className="px-3 py-0.5 rounded-full bg-slate-200/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-[11px] font-mono text-slate-700 dark:text-zinc-400">
                              {project.liveUrl || "coming soon"}
                            </span>
                            <span className="w-10" />
                          </div>
                          <div className="p-8 sm:p-10 flex flex-col justify-center items-center text-center my-auto">
                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white mb-4 group-hover:scale-110 transition-transform shadow-sm">
                              <BookOpen size={30} />
                            </div>
                            <h4 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white mb-2">
                              {project.title}
                            </h4>
                            {project.subtitle && (
                              <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm max-w-md font-mono">
                                {project.subtitle}
                              </p>
                            )}
                          </div>
                          <div className="px-6 py-2.5 bg-slate-100 dark:bg-[#0d0e12] border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-500">
                            <span>Status: In Active Engineering</span>
                            <span>Portfolio Project</span>
                          </div>
                        </div>
                      )}

                      {/* Index badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md text-slate-900 dark:text-white font-mono text-xs border border-slate-200 dark:border-white/10 shadow-md">
                        {String(idx + 1).padStart(2, "0")}
                      </div>

                      {/* Upcoming badge */}
                      {project.upcoming && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white font-mono text-xs shadow-md">
                          <Clock size={11} />
                          Coming Soon
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* ── Details ─────────────────── */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className={`lg:col-span-5 ${isEven ? "lg:order-1" : "lg:order-2"}`}
                  >
                    {project.subtitle && (
                      <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 block mb-2 uppercase tracking-wider font-medium">
                        {project.subtitle}
                      </span>
                    )}

                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                      {project.title}
                    </h3>

                    <p className="text-slate-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    {technologies.length > 0 && (
                      <div className="mb-8">
                        <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5 font-medium">
                          Technologies Used:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {technologies.map((t) => (
                            <span
                              key={t}
                              className="px-3 py-1 rounded-full text-xs font-mono bg-white dark:bg-white/5 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 transition-colors shadow-sm font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                      {project.liveUrl && !project.upcoming && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider dark:hover:bg-zinc-200 transition-all shadow-md hover:scale-105 active:scale-98"
                        >
                          <span>Launch Project</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white font-semibold text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/10 transition-all hover:scale-105 active:scale-98"
                        >
                          <GithubIcon size={14} />
                          <span>Source Code</span>
                        </a>
                      )}
                      {project.upcoming && (
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider border border-amber-200 dark:border-amber-500/20">
                          <Clock size={12} />
                          In Development
                        </span>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
