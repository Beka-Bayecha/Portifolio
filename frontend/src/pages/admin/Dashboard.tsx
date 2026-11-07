import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  FolderKanban, Star, Wrench, MessageSquare,
  Database, CheckCircle, Loader2, Award,
  BookOpen, Zap, ArrowRight, Inbox, ShieldCheck
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { seedFirestore } from "@/lib/seed";
import { Link } from "react-router-dom";

const stats = [
  {
    label: "Projects",
    col: "projects",
    icon: FolderKanban,
    link: "/admin/projects",
    desc: "Production platforms & apps",
  },
  {
    label: "Certificates",
    col: "certificates",
    icon: Award,
    link: "/admin/certificates",
    desc: "Academic & professional honors",
  },
  {
    label: "Skills",
    col: "skills",
    icon: Star,
    link: "/admin/skills",
    desc: "Tech stack & proficiencies",
  },
  {
    label: "Services",
    col: "services",
    icon: Wrench,
    link: "/admin/services",
    desc: "Offered engineering services",
  },
  {
    label: "Messages",
    col: "messages",
    icon: MessageSquare,
    link: "/admin/messages",
    desc: "Client inquiries & contact form",
  },
];

const tips = [
  { icon: FolderKanban, text: "Upload real screenshots directly from your gallery when adding projects." },
  { icon: Award, text: "Attach certificate photos and official verification links." },
  { icon: Zap, text: "All updates write directly to Firestore and synchronize in real-time." },
  { icon: Inbox, text: "Check Messages to review inquiries and reply directly via email." },
];

export const Dashboard = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [seedStatus, setSeedStatus] = useState<"idle" | "seeding" | "done" | "error">("idle");

  const loadCounts = () => {
    setLoading(true);
    Promise.all(
      stats.map(async (s) => {
        const snap = await getDocs(collection(db, s.col));
        return [s.col, snap.size] as [string, number];
      })
    ).then((results) => {
      setCounts(Object.fromEntries(results));
      setLoading(false);
    });
  };

  useEffect(() => {
    loadCounts();
  }, []);

  const handleSeed = async () => {
    if (!confirm("This will seed all collections with verified default data. Continue?")) return;
    setSeedStatus("seeding");
    try {
      await seedFirestore();
      setSeedStatus("done");
      loadCounts();
    } catch {
      setSeedStatus("error");
    }
  };

  const totalItems = Object.entries(counts)
    .filter(([k]) => k !== "messages")
    .reduce((a, b) => a + b[1], 0);

  const firstName = user?.email?.split("@")[0] ?? "Admin";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ── Welcome Banner ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111216] p-7 sm:p-9 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                Portfolio Command Center
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, <span className="capitalize">{firstName}</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1 max-w-xl font-normal">
              Manage your engineering showcase, projects gallery, verified credentials, and client outreach in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
                Total Portfolio Records
              </span>
              <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                {loading ? "…" : totalItems}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Overview Cards Grid ────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
            Collection Overview
          </h2>
          <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
            Click any section to inspect or edit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.col}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link
                to={s.link}
                className="group relative flex flex-col justify-between h-full bg-white dark:bg-[#111216] border border-slate-200 dark:border-white/10 rounded-2xl p-5 hover:border-slate-400 dark:hover:border-white/30 transition-all duration-300 shadow-sm block"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-zinc-200 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                      <s.icon size={18} />
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-slate-400 dark:text-zinc-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all"
                    />
                  </div>

                  <p className="font-heading font-black text-3xl text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                    {loading ? (
                      <span className="inline-block w-8 h-8 rounded bg-slate-100 dark:bg-white/5 animate-pulse" />
                    ) : (
                      counts[s.col] ?? 0
                    )}
                  </p>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                    {s.label}
                  </p>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
                  {s.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Operational Tools & Guidelines ─────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Operations Guide */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-white dark:bg-[#111216] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                  Management Guidelines
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
                  Best practices for publishing content
                </p>
              </div>

              <button
                onClick={handleSeed}
                disabled={seedStatus === "seeding" || seedStatus === "done"}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-zinc-200 text-xs font-mono font-medium transition-colors disabled:opacity-60 shadow-sm"
              >
                {seedStatus === "seeding" ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Seeding…
                  </>
                ) : seedStatus === "done" ? (
                  <>
                    <CheckCircle size={12} className="text-emerald-500" /> Synced
                  </>
                ) : (
                  <>
                    <Database size={12} /> Re-seed Defaults
                  </>
                )}
              </button>
            </div>

            <ul className="space-y-3.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-zinc-300">
                  <span className="mt-0.5 w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center flex-shrink-0 text-slate-700 dark:text-zinc-300">
                    <tip.icon size={12} />
                  </span>
                  <span>{tip.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-500">
            <span>Database: Google Cloud Firestore</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck size={13} /> Connected
            </span>
          </div>
        </motion.div>

        {/* Fast Action Shortcuts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.4 }}
          className="bg-white dark:bg-[#111216] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="mb-5">
              <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Quick Shortcuts
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
                Direct access to sections
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats.map((s) => (
                <Link
                  key={s.col}
                  to={s.link}
                  className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all"
                >
                  <span className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-zinc-200 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <s.icon size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors truncate">
                      {s.label}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                      {counts[s.col] ?? 0} published
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-500">
            <span>Portfolio Version: 1.0.0</span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-800 dark:text-zinc-300 hover:underline"
            >
              Preview Live Site →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
