import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, Send, MessageCircle, CheckCircle2, Loader2, ArrowUpRight, MessageSquare } from "lucide-react";
import GithubIcon from "../icons/GithubIcon";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_bxfm748";
const EMAILJS_TEMPLATE_ID = "template_fcgybtl";
const EMAILJS_PUBLIC_KEY = "euVoI1DecyWG12QPs";

const channels = [
  { icon: Mail,          label: "Email",    value: "bekibekinat@gmail.com", href: "mailto:bekibekinat@gmail.com" },
  { icon: Phone,         label: "Phone",    value: "+251 916 020 569",     href: "tel:0916020569" },
  { icon: MessageSquare, label: "WhatsApp", value: "+251 916 020 569",     href: "https://wa.me/251916020569" },
  { icon: MessageCircle, label: "Telegram", value: "@Elios53",             href: "https://t.me/Elios53" },
  { icon: GithubIcon,    label: "GitHub",   value: "Beka-Bayecha",          href: "https://github.com/Beka-Bayecha" },
];

export const Contact = () => {
  const ref = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus("sending");
    let firestoreOk = false;
    let emailOk = false;

    // 1. Save to Firestore
    try {
      await addDoc(collection(db, "messages"), {
        ...form,
        read: false,
        createdAt: serverTimestamp(),
      });
      firestoreOk = true;
    } catch (err) {
      console.error("Firestore error:", err);
    }

    // 2. Send email via EmailJS
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: "bekibekinat@gmail.com",
        },
        EMAILJS_PUBLIC_KEY
      );
      emailOk = true;
    } catch (err) {
      console.error("EmailJS error:", err);
    }

    if (firestoreOk || emailOk) {
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 sm:py-32 bg-slate-50 dark:bg-[#0b0c0e] text-slate-900 dark:text-white relative transition-colors duration-200"
    >
      <div className="container mx-auto px-6 sm:px-10" ref={ref}>
        {/* Section Pre-title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-slate-200 dark:border-white/10 pb-6 flex items-center justify-between"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-400">
            06 / Direct Contact
          </span>
          <span className="text-xs text-slate-500 dark:text-zinc-500 font-mono hidden sm:inline">
            Available for Full-Stack Roles
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Outreach Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
              Let's talk.
            </h2>

            <p className="text-slate-700 dark:text-zinc-300 text-base sm:text-lg leading-relaxed mb-10 font-normal">
              Have an upcoming project or an engineering opportunity? Reach out directly or send a message below.
            </p>

            {/* Direct Channels List */}
            <div className="space-y-4">
              {channels.map((ch) => (
                <a
                  key={ch.label}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-zinc-300 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                      <ch.icon size={17} />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider block font-medium">
                        {ch.label}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-slate-950 dark:group-hover:text-zinc-200 transition-colors">
                        {ch.value}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight size={15} className="text-slate-400 dark:text-zinc-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Clean Functional Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/10 space-y-6 shadow-xl text-slate-900 dark:text-white"
            >
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2 font-medium">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#0b0c0e] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#0b0c0e] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-2 font-medium">
                  Project Scope or Message
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell me about what you are looking to build or achieve..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#0b0c0e] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={status === "sending" || status === "sent"}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black font-semibold text-xs sm:text-sm uppercase tracking-wider dark:hover:bg-zinc-200 transition-colors disabled:opacity-60 shadow-xl"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : status === "sent" ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Message Received!</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Inquiry</span>
                    </>
                  )}
                </button>

                {status === "sent" && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                    Thank you. I will reply to you promptly.
                  </span>
                )}
                {status === "error" && (
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-mono font-medium">
                    Failed to send. Please email bekibekinat@gmail.com directly.
                  </span>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
