import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import {
  Award,
  ExternalLink,
  GraduationCap,
  X,
  Loader2,
} from "lucide-react";
import { useCollection } from "@/hooks/useCollection";

export interface Certificate {
  id: string;
  order: number;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  category?: string;
  skills?: string[];
  featured?: boolean;
  description?: string;
}

export const Certificates = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { data: certificates, loading, error } = useCollection<Certificate>("certificates");
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <section
      id="certificates"
      className="py-24 sm:py-32 bg-white dark:bg-[#0e0f13] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/5 relative transition-colors duration-200"
    >
      <div className="container mx-auto px-6 sm:px-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-slate-200 dark:border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-400 block mb-2">
              05 / Education & Credentials
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Academic & Certifications
            </h2>
          </div>
          <p className="text-slate-600 dark:text-zinc-400 text-sm max-w-sm">
            Academic degree from Haramaya University and verified professional certifications.
          </p>
        </motion.div>

        {/* Education Hero Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-14 p-8 sm:p-10 rounded-2xl bg-slate-50 dark:bg-[#14151a] border border-slate-200 dark:border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-md dark:shadow-xl text-slate-900 dark:text-white"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold shadow-md">
                <GraduationCap size={20} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-zinc-400 font-medium">
                  Academic Foundation
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Haramaya University
                </h3>
              </div>
            </div>
            <p className="text-slate-700 dark:text-zinc-300 text-base max-w-2xl mt-2 leading-relaxed font-normal">
              Bachelor of Science in Information Technology (Expected 2026). Focused on software engineering, database systems, and full-stack development.
            </p>
          </div>

          <div className="flex items-center gap-6 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/10 pt-6 lg:pt-0 lg:pl-10 text-sm">
            <div>
              <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider block font-medium">
                Degree
              </span>
              <span className="font-bold text-slate-900 dark:text-white">BSc in IT</span>
            </div>
            <div>
              <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider block font-medium">
                Academic Honors
              </span>
              <span className="font-bold text-slate-900 dark:text-white">Dean's List</span>
            </div>
          </div>
        </motion.div>

        {/* Certifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400 dark:text-zinc-500">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm font-mono">Loading certificates…</span>
          </div>
        ) : certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 dark:text-zinc-500">
            <Award size={32} strokeWidth={1.5} />
            <p className="text-sm font-mono text-center">
              {error ? `Error: ${error}` : "No certificates added yet. Add them from the admin dashboard."}
            </p>
          </div>
        ) : (
        <div className="space-y-4">
          {certificates.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.05 * idx }}
              onClick={() => setSelectedCert(cert)}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-[#14151a] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group shadow-sm hover:shadow-md"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200/70 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-zinc-400 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors flex-shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-slate-950 dark:group-hover:text-zinc-200 transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 font-mono mt-0.5">
                    {cert.issuer} • Issued {cert.issueDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-14 sm:ml-0">
                {cert.credentialUrl && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-400 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                    <span>Verify Credential</span>
                    <ExternalLink size={13} />
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>

      {/* Credential Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-[#14151a] border border-slate-200 dark:border-white/10 rounded-2xl p-8 text-slate-900 dark:text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center mb-6 shadow-md">
                <Award size={22} />
              </div>

              <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest block mb-1 font-medium">
                {selectedCert.issuer}
              </span>
              <h3 className="font-heading font-bold text-2xl mb-4 text-slate-900 dark:text-white">
                {selectedCert.title}
              </h3>

              <p className="text-slate-700 dark:text-zinc-300 text-sm leading-relaxed mb-6 font-normal">
                {selectedCert.description}
              </p>

              {selectedCert.skills && (
                <div className="mb-6">
                  <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-2 font-medium">
                    Verified Competencies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCert.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded text-xs font-mono bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-zinc-300 border border-slate-200 dark:border-white/10 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-white/10">
                {selectedCert.credentialUrl && (
                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider text-center dark:hover:bg-zinc-200 transition-colors shadow-md"
                  >
                    View Official Certification
                  </a>
                )}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="py-3 px-5 rounded-full border border-slate-300 dark:border-white/20 text-slate-800 dark:text-zinc-300 hover:bg-slate-100 dark:hover:text-white text-xs uppercase tracking-wider transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
