import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Pencil, Trash2, Save, X, Loader2, AlertCircle, PackageOpen } from "lucide-react";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "tags" | "select" | "toggle";
  options?: string[];
  placeholder?: string;
}

interface Props {
  collectionName: string;
  fields: FieldDef[];
  data: Record<string, unknown>[];
  loading: boolean;
  onRefresh: () => void;
}

const emptyForm = (fields: FieldDef[]) =>
  Object.fromEntries(
    fields.map((f) => [f.key, f.type === "toggle" ? false : f.type === "tags" ? [] : ""])
  );

const CollectionTable = ({ collectionName, fields, data, loading, onRefresh }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAdd = () => {
    setEditId(null);
    setSaveError("");
    setForm(emptyForm(fields));
    setShowForm(true);
  };

  const openEdit = (row: Record<string, unknown>) => {
    setEditId(row.id as string);
    setSaveError("");
    setForm({ ...row });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSaveError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const { id: _id, ...payload } = form;
      payload.order = Number(payload.order ?? data.length);

      if (editId) {
        await updateDoc(doc(db, collectionName, editId), payload);
      } else {
        await addDoc(collection(db, collectionName), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }
      setShowForm(false);
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save. Check Firestore rules.";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, collectionName, id));
      onRefresh();
    } catch (err) {
      alert("Delete failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setDeletingId(null);
    }
  };

  const setField = (key: string, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const inputBase =
    "w-full px-3.5 py-2.5 rounded-xl bg-background border border-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition placeholder:text-muted-foreground/50";

  const renderInput = (field: FieldDef) => {
    const val = form[field.key];

    if (field.type === "textarea")
      return (
        <textarea
          rows={3}
          value={(val as string) ?? ""}
          onChange={(e) => setField(field.key, e.target.value)}
          placeholder={field.placeholder}
          className={`${inputBase} resize-none`}
        />
      );

    if (field.type === "tags") {
      const tags = (val as string[]) || [];
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5 min-h-[28px]">
            {tags.map((t, i) => (
              <span
                key={i}
                className="flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium"
              >
                {t}
                <button
                  type="button"
                  onClick={() => setField(field.key, tags.filter((_, j) => j !== i))}
                  className="w-3.5 h-3.5 rounded flex items-center justify-center hover:bg-indigo-500/20 transition-colors"
                >
                  <X size={9} />
                </button>
              </span>
            ))}
          </div>
          <input
            placeholder="Type a tag and press Enter"
            className={inputBase}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const v = (e.target as HTMLInputElement).value.trim();
                if (v) {
                  setField(field.key, [...tags, v]);
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
        </div>
      );
    }

    if (field.type === "select") {
      const parseOption = (o: string) =>
        o.includes("|")
          ? { key: o.split("|")[0], label: o.split("|")[1] }
          : { key: o, label: o };
      return (
        <select
          value={(val as string) ?? ""}
          onChange={(e) => setField(field.key, e.target.value)}
          className={inputBase}
        >
          <option value="">Select...</option>
          {field.options?.map((o) => {
            const { key, label } = parseOption(o);
            return (
              <option key={key} value={key}>
                {label}
              </option>
            );
          })}
        </select>
      );
    }

    if (field.type === "toggle")
      return (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setField(field.key, !val)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
              val ? "gradient-bg" : "bg-secondary"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                val ? "translate-x-5" : ""
              }`}
            />
          </button>
          <span className="text-sm text-muted-foreground">{val ? "Enabled" : "Disabled"}</span>
        </div>
      );

    return (
      <input
        type={field.type === "number" ? "number" : "text"}
        value={(val as string) ?? ""}
        onChange={(e) => setField(field.key, e.target.value)}
        placeholder={field.placeholder}
        className={inputBase}
      />
    );
  };

  return (
    <div>
      {/* ── Toolbar ──────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${data.length} item${data.length !== 1 ? "s" : ""}`}
        </p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add New
        </button>
      </div>

      {/* ── Table ────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="animate-spin" size={28} />
          <span className="text-sm">Loading data…</span>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground border border-dashed border-border/60 rounded-2xl">
          <PackageOpen size={32} strokeWidth={1.5} />
          <div className="text-center">
            <p className="text-sm font-medium">Nothing here yet</p>
            <p className="text-xs mt-0.5">Click "Add New" above to create the first item.</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50 border-b border-border/60">
                  {fields.slice(0, 3).map((f) => (
                    <th
                      key={f.key}
                      className="text-left px-5 py-3.5 font-semibold text-xs text-muted-foreground uppercase tracking-wider"
                    >
                      {f.label}
                    </th>
                  ))}
                  <th className="text-right px-5 py-3.5 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data.map((row, idx) => (
                  <motion.tr
                    key={row.id as string}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-secondary/30 transition-colors duration-150"
                  >
                    {fields.slice(0, 3).map((f) => (
                      <td key={f.key} className="px-5 py-3.5 max-w-[220px]">
                        {f.type === "toggle" ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              row[f.key]
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${row[f.key] ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                            {row[f.key] ? "Yes" : "No"}
                          </span>
                        ) : f.type === "tags" ? (
                          <div className="flex flex-wrap gap-1">
                            {((row[f.key] as string[]) || []).slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium"
                              >
                                {t}
                              </span>
                            ))}
                            {((row[f.key] as string[]) || []).length > 3 && (
                              <span className="px-2 py-0.5 rounded-md bg-secondary text-muted-foreground text-xs">
                                +{((row[f.key] as string[]) || []).length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="truncate block text-foreground/90">
                            {String(row[f.key] ?? "—")}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(row)}
                          className="p-2 rounded-lg hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id as string)}
                          disabled={deletingId === row.id}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          {deletingId === row.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForm}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative z-10 bg-card border border-border/60 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/60 flex-shrink-0">
                <div>
                  <h3 className="font-heading font-semibold">
                    {editId ? "Edit Item" : "Add New Item"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {editId ? "Update the fields below" : "Fill in the details below"}
                  </p>
                </div>
                <button
                  onClick={closeForm}
                  className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
                {fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-medium mb-1.5 block">{field.label}</label>
                    {renderInput(field)}
                  </div>
                ))}
              </div>

              {/* Error */}
              {saveError && (
                <div className="mx-6 mb-3 flex items-start gap-2 text-sm text-red-500 bg-red-500/10 px-4 py-3 rounded-xl">
                  <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-3 px-6 py-5 border-t border-border/60 flex-shrink-0">
                <button
                  onClick={closeForm}
                  className="flex-1 py-2.5 rounded-xl border border-border/80 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
                >
                  {saving ? (
                    <><Loader2 size={14} className="animate-spin" /> Saving…</>
                  ) : (
                    <><Save size={14} /> Save</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionTable;
