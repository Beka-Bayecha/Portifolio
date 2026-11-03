import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  FolderKanban, Star, Wrench, MessageSquare,
  Database, CheckCircle, Loader2, Award,
  BookOpen, Zap, ArrowRight, Inbox
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { seedFirestore } from "@/lib/seed";
import { Link } from "react-router-dom";

const stats = [
  {
    label: "Projects",
    col: "projects",
    icon: FolderKanban,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    text: "text-blue-600 dark:text-blue-400",
    link: "/admin/projects",
  },
  {
    label: "Certificates",
    col: "certificates",
    icon: Award,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
    link: "/admin/certificates",
  },
  {
    label: "Skills",
    col: "skills",
    icon: Star,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-500/10 dark:bg-violet-500/15",
    text: "text-violet-600 dark:text-violet-400",
    link: "/admin/skills",
  },
  {
    label: "Services",
    col: "services",
    icon: Wrench,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
    link: "/admin/services",
  },
  {
    label: "Messages",
    col: "messages",
    icon: MessageSquare,
    color: "from-rose-500 to-red-600",
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
    text: "text-rose-600 dark:text-rose-400",
    link: "/admin/messages",
  },
];

const tips = [
  { icon: FolderKanban, text: "Use the sidebar to manage each section of your portfolio." },
  { icon: Zap, text: "Changes are saved to Firestore and reflect on the portfolio instantly." },
  { icon: Inbox, text: "Check Messages to read contact form submissions." },
  { icon: BookOpen, text: "Use the order field to control display order of items." },
];

const Dashboard = () => {
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
    if (!confirm("This will seed all collections with default data. Continue?")) return;
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

  const firstName = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ── Welcome banner ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-7"
      >
        {/* decorative orbs */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Admin Dashboard
          </p>
          <h1 className="font-heading text-2xl font-bold mb-1">
            Welcome back, <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent capitalize">{firstName}</span> 👋
          </h1>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>
      </motion.div>

      {/* ── Stats grid ──────────────────────────────────────── */}
      <div>
        <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.col}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
            >
              <Link
                to={s.link}
                className="group relative flex flex-col gap-4 bg-card border border-border/60 rounded-2xl p-5 card-shadow hover:border-border transition-all duration-300 overflow-hidden block"
              >
                {/* subtle background glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-transparent to-secondary/40 pointer-events-none rounded-2xl" />

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
                  <s.icon size={18} className={s.text} />
                </div>

                <div>
                  <p className="font-heading font-bold text-3xl leading-none mb-1">
                    {loading ? (
                      <span className="inline-block w-8 h-7 rounded bg-secondary animate-pulse" />
                    ) : (
                      counts[s.col] ?? 0
                    )}
                  </p>
                  <p className="text-muted-foreground text-xs font-medium">{s.label}</p>
                </div>

                <ArrowRight
                  size={14}
                  className="absolute bottom-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Bottom row ──────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Quick guide */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45 }}
          className="bg-card border border-border/60 rounded-2xl p-6 card-shadow"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading font-semibold">Quick Guide</h2>
              <p className="text-xs text-muted-foreground mt-0.5">How to manage your portfolio</p>
            </div>

            <button
              onClick={handleSeed}
              disabled={seedStatus === "seeding" || seedStatus === "done"}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 shadow-sm"
            >
              {seedStatus === "seeding" ? (
                <><Loader2 size={12} className="animate-spin" /> Seeding...</>
              ) : seedStatus === "done" ? (
                <><CheckCircle size={12} /> Seeded!</>
              ) : (
                <><Database size={12} /> {totalItems === 0 ? "Seed Default Data" : "Re-seed Data"}</>
              )}
            </button>
          </div>

          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <tip.icon size={13} className="text-foreground/70" />
                </span>
                {tip.text}
              </li>
            ))}
            {!loading && totalItems === 0 && (
              <li className="flex items-start gap-3 text-sm text-orange-500 font-medium mt-1">
                <span className="mt-0.5 text-base">⚠️</span>
                All collections are empty — click <strong>Seed Default Data</strong> to populate them, then your portfolio will show the data.
              </li>
            )}
          </ul>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.45 }}
          className="bg-card border border-border/60 rounded-2xl p-6 card-shadow"
        >
          <div className="mb-5">
            <h2 className="font-heading font-semibold">Quick Access</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Jump to any section</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {stats.map((s) => (
              <Link
                key={s.col}
                to={s.link}
                className="group flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-border/60 hover:border-border bg-background/50 hover:bg-secondary/60 transition-all duration-200"
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.bg} flex-shrink-0`}>
                  <s.icon size={13} className={s.text} />
                </span>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">
                  {s.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
