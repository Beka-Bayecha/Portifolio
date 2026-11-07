import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trash2, Mail, X, Clock, Inbox, Reply } from "lucide-react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminCollection } from "@/hooks/useAdminCollection";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read?: boolean;
  createdAt?: { seconds: number };
}

export const AdminMessages = () => {
  const { data, loading, refresh } = useAdminCollection<Message>("messages", "createdAt");
  const [selected, setSelected] = useState<Message | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSelect = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) {
      try {
        await updateDoc(doc(db, "messages", msg.id), { read: true });
        refresh();
      } catch (error) {
        console.error("Failed to mark message as read:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    setDeletingId(id);
    await deleteDoc(doc(db, "messages", id));
    setDeletingId(null);
    if (selected?.id === id) setSelected(null);
    refresh();
  };

  const formatDate = (ts?: { seconds: number }) => {
    if (!ts) return "—";
    return new Date(ts.seconds * 1000).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const unreadCount = data.filter((m) => !m.read).length;
  const getInitial = (name?: string) => (name ?? "?")[0]?.toUpperCase() ?? "?";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Page Header ────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Messages & Inquiries
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
            {loading ? "Loading…" : `${data.length} total • ${unreadCount} unread`}
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            {unreadCount} New
          </span>
        )}
      </div>

      {/* ── States ──────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500 dark:text-zinc-400">
          <Loader2 className="animate-spin text-slate-900 dark:text-white" size={28} />
          <span className="text-xs font-mono">Loading messages…</span>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500 dark:text-zinc-400 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#111216]">
          <Inbox size={36} strokeWidth={1.5} />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900 dark:text-white">No messages yet</p>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Contact form inquiries from clients will show up here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-5 items-start">
          {/* ── Message list ──────────────────── */}
          <div className="space-y-2.5">
            {[...data].reverse().map((msg, i) => (
              <motion.button
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleSelect(msg)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                  selected?.id === msg.id
                    ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-white/10 shadow-sm"
                    : !msg.read
                    ? "border-slate-300 dark:border-white/20 bg-white dark:bg-[#14151a] shadow-sm hover:border-slate-400"
                    : "border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#111216] hover:bg-white dark:hover:bg-[#14151a]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-9 h-9 flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs shadow-sm">
                        {getInitial(msg.name)}
                      </div>
                      {!msg.read && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-[#111216]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm truncate text-slate-900 dark:text-white ${!msg.read ? "font-bold" : "font-medium"}`}>
                          {msg.name}
                        </p>
                        {!msg.read && (
                          <span className="text-[9px] text-white bg-rose-500 font-mono font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full flex-shrink-0">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono truncate">{msg.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg.id);
                    }}
                    disabled={deletingId === msg.id}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                    aria-label="Delete message"
                  >
                    {deletingId === msg.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-300 mt-2.5 line-clamp-2 pl-12 leading-relaxed">
                  {msg.message}
                </p>
              </motion.button>
            ))}
          </div>

          {/* ── Detail panel ──────────────────── */}
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 14 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#111216] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl h-fit sticky top-24 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-base shadow-sm">
                      {getInitial(selected.name)}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-base text-slate-900 dark:text-white">
                        {selected.name}
                      </p>
                      <a
                        href={`mailto:${selected.email}`}
                        className="text-xs font-mono text-slate-600 dark:text-zinc-400 hover:underline flex items-center gap-1.5 mt-0.5"
                      >
                        <Mail size={12} />
                        {selected.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                    aria-label="Close"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-zinc-400 px-6 pt-4">
                  <Clock size={12} />
                  <span>Received {formatDate(selected.createdAt)}</span>
                </div>

                {/* Message body */}
                <div className="px-6 py-4">
                  <div className="bg-slate-50 dark:bg-[#0d0e12] rounded-xl p-5 border border-slate-200 dark:border-white/10">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-900 dark:text-white font-sans">
                      {selected.message}
                    </p>
                  </div>
                </div>

                {/* Reply CTA */}
                <div className="px-6 pb-6">
                  <a
                    href={`mailto:${selected.email}?subject=Re: Portfolio Inquiry - Beka Bayecha`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm"
                  >
                    <Reply size={14} />
                    Reply via Email
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-zinc-500 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl min-h-[260px] bg-white dark:bg-[#111216]">
                <Mail size={28} strokeWidth={1.5} />
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">No message selected</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                    Select any message on the left to review its content.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
