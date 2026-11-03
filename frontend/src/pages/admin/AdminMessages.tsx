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

const AdminMessages = () => {
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

  const getInitial = (name?: string) =>
    (name ?? "?")[0]?.toUpperCase() ?? "?";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Page header ────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-heading text-xl font-bold">Messages</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {loading ? "Loading…" : `${data.length} total${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-sm">
            {unreadCount} new
          </span>
        )}
      </div>

      {/* ── States ──────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
          <Loader2 className="animate-spin" size={28} />
          <span className="text-sm">Loading messages…</span>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground border border-dashed border-border/60 rounded-2xl">
          <Inbox size={36} strokeWidth={1.5} />
          <div className="text-center">
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs mt-0.5">Messages from your contact form will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-4">
          {/* ── Message list ──────────────────── */}
          <div className="space-y-2">
            {[...data].reverse().map((msg, i) => (
              <motion.button
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleSelect(msg)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                  selected?.id === msg.id
                    ? "border-indigo-500/50 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-sm"
                    : !msg.read
                    ? "border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500/50 hover:bg-indigo-500/8"
                    : "border-border/60 bg-card hover:border-border hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="relative w-9 h-9 flex-shrink-0">
                      <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {getInitial(msg.name)}
                      </div>
                      {!msg.read && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-background" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm truncate ${!msg.read ? "font-semibold" : "font-medium"}`}>
                          {msg.name}
                        </p>
                        {!msg.read && (
                          <span className="text-[9px] text-white bg-red-500 font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full flex-shrink-0">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                    disabled={deletingId === msg.id}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label="Delete message"
                  >
                    {deletingId === msg.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2 pl-12 leading-relaxed">
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
                transition={{ duration: 0.25 }}
                className="bg-card border border-border/60 rounded-2xl shadow-xl dark:shadow-2xl h-fit sticky top-6"
              >
                {/* Detail header */}
                <div className="flex items-start justify-between p-6 border-b border-border/60">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {getInitial(selected.name)}
                    </div>
                    <div>
                      <p className="font-semibold">{selected.name}</p>
                      <a
                        href={`mailto:${selected.email}`}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Mail size={11} />
                        {selected.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    aria-label="Close"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-6 pt-4">
                  <Clock size={11} />
                  {formatDate(selected.createdAt)}
                </div>

                {/* Message body */}
                <div className="px-6 py-4">
                  <div className="bg-secondary/50 dark:bg-secondary/30 rounded-xl p-4 border border-border/40">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                      {selected.message}
                    </p>
                  </div>
                </div>

                {/* Reply CTA */}
                <div className="px-6 pb-6">
                  <a
                    href={`mailto:${selected.email}?subject=Re: Portfolio Contact`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
                  >
                    <Reply size={14} />
                    Reply via Email
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center gap-3 text-muted-foreground border border-dashed border-border/60 rounded-2xl min-h-[240px]">
                <Mail size={28} strokeWidth={1.5} />
                <div className="text-center">
                  <p className="text-sm font-medium">No message selected</p>
                  <p className="text-xs mt-0.5">Click a message on the left to read it.</p>
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
