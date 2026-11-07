import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, AlertCircle,
  PackageOpen, Upload, Image as ImageIcon, Link as LinkIcon, Check, Eye
} from "lucide-react";
import { uploadImageSmart, compressImageFile } from "@/lib/imageUpload";
import churchImg from "@/assets/church.png";
import schoolImg from "@/assets/school.png";
import portImg from "@/assets/port.png";

const PRESET_MAP: Record<string, string> = {
  church: churchImg,
  school: schoolImg,
  port: portImg,
};

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "tags" | "select" | "toggle" | "image";
  options?: string[];
  placeholder?: string;
  helperText?: string;
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
    fields.map((f) => [
      f.key,
      f.type === "toggle" ? false : f.type === "tags" ? [] : "",
    ])
  );

export const CollectionTable = ({
  collectionName,
  fields,
  data,
  loading,
  onRefresh,
}: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Image upload state per field key
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [imageMode, setImageMode] = useState<Record<string, "upload" | "url">>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const openAdd = () => {
    setEditId(null);
    setSaveError("");
    setUploadingField(null);
    setUploadStatus("");
    setForm(emptyForm(fields));
    setShowForm(true);
  };

  const openEdit = (row: Record<string, unknown>) => {
    setEditId(row.id as string);
    setSaveError("");
    setUploadingField(null);
    setUploadStatus("");
    const initialForm = { ...row };
    // If project has imageKey pointing to a preset or url, normalize
    if (!initialForm.imageUrl && initialForm.imageKey) {
      initialForm.imageUrl = initialForm.imageKey;
    }
    setForm(initialForm);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSaveError("");
    setUploadingField(null);
    setUploadStatus("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const { id: _id, ...rawPayload } = form;
      const payload: Record<string, unknown> = {};

      for (const [k, v] of Object.entries(rawPayload)) {
        if (v !== undefined) {
          payload[k] = v;
        }
      }

      payload.order = Number(payload.order ?? data.length);
      if (isNaN(payload.order as number)) {
        payload.order = data.length;
      }

      // If imageUrl exists, keep imageKey in sync for backwards compatibility
      if (payload.imageUrl && !payload.imageKey) {
        payload.imageKey = payload.imageUrl;
      }

      if (editId) {
        delete payload.createdAt;
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
      console.error("Firestore save error:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to save. Check Firestore rules.";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
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

  // Handle file chosen from gallery/device
  const handleFileSelect = async (key: string, file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP, etc.)");
      return;
    }
    setUploadingField(key);
    setUploadStatus("Optimizing image…");
    try {
      // 1. Immediately compress locally using HTML5 Canvas (~20-50ms)
      const compressed = await compressImageFile(file, 1000, 800, 0.8);
      if (compressed.dataUrl) {
        setField(key, compressed.dataUrl);
        if (key === "imageUrl") {
          setField("imageKey", compressed.dataUrl);
        }
      }
      // 2. Clear uploading status immediately so user sees the preview and can save right away!
      setUploadingField(null);
      setUploadStatus("");

      // 3. Attempt cloud upload in background (non-blocking)
      uploadImageSmart(file, collectionName)
        .then((cloudUrl) => {
          if (cloudUrl && cloudUrl.startsWith("http")) {
            setField(key, cloudUrl);
            if (key === "imageUrl") {
              setField("imageKey", cloudUrl);
            }
          }
        })
        .catch((err) => {
          console.warn("Background cloud upload notice:", err);
        });
    } catch (err) {
      console.error("Local image processing fallback:", err);
      // Fallback directly to FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        const raw = e.target?.result as string;
        if (raw) {
          setField(key, raw);
          if (key === "imageUrl") setField("imageKey", raw);
        }
        setUploadingField(null);
        setUploadStatus("");
      };
      reader.onerror = () => {
        setUploadingField(null);
        setUploadStatus("");
      };
      reader.readAsDataURL(file);
    }
  };

  // Resolve image display URL
  const resolveDisplayImage = (val: unknown): string | null => {
    if (typeof val !== "string" || !val) return null;
    if (PRESET_MAP[val]) return PRESET_MAP[val];
    return val;
  };

  const inputBase =
    "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0d0e12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/15 dark:focus:ring-white/20 focus:border-slate-400 dark:focus:border-white/30 transition placeholder:text-slate-400 dark:placeholder:text-zinc-600";

  const renderInput = (field: FieldDef) => {
    const val = form[field.key];

    // Image Upload Component
    if (field.type === "image") {
      const currentImgUrl = resolveDisplayImage(val);
      const mode = imageMode[field.key] || "upload";
      const isUploading = uploadingField === field.key;

      return (
        <div className="space-y-3">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-[#0d0e12] border border-slate-200 dark:border-white/10 w-fit">
            <button
              type="button"
              onClick={() => setImageMode((m) => ({ ...m, [field.key]: "upload" }))}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                mode === "upload"
                  ? "bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm font-semibold"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Upload size={12} />
              Upload from Gallery
            </button>
            <button
              type="button"
              onClick={() => setImageMode((m) => ({ ...m, [field.key]: "url" }))}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                mode === "url"
                  ? "bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm font-semibold"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LinkIcon size={12} />
              Image URL / Preset
            </button>
          </div>

          {/* Current Image Preview Card */}
          {currentImgUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0d0e12] p-3 flex items-center gap-4">
              <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex-shrink-0 relative group">
                <img
                  src={currentImgUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <a
                  href={currentImgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  title="View full image"
                >
                  <Eye size={16} />
                </a>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono font-semibold text-slate-900 dark:text-white truncate">
                  {typeof val === "string" && val.startsWith("data:")
                    ? "Uploaded Local Image (Optimized)"
                    : typeof val === "string" && val.startsWith("http")
                    ? "Remote Cloud Image"
                    : `Preset (${String(val)})`}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                  Ready to publish with this item
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[field.key]?.click()}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-mono font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setField(field.key, "");
                    if (field.key === "imageUrl") setField("imageKey", "");
                  }}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Remove image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ) : null}

          {/* Mode 1: File Upload Dropzone / Gallery Picker */}
          {mode === "upload" && (
            <div>
              <input
                ref={(el) => (fileInputRefs.current[field.key] = el)}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(field.key, file);
                  e.target.value = "";
                }}
              />

              <div
                onClick={() => !isUploading && fileInputRefs.current[field.key]?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileSelect(field.key, file);
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isUploading
                    ? "border-slate-400 dark:border-white/40 bg-slate-50 dark:bg-white/5 cursor-wait"
                    : "border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 bg-slate-50/50 dark:bg-[#0d0e12]/50 hover:bg-slate-50 dark:hover:bg-[#0d0e12]"
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-700 dark:text-zinc-300">
                    <Loader2 size={24} className="animate-spin" />
                    <p className="text-xs font-mono font-medium">{uploadStatus}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-800 dark:text-zinc-300">
                      <ImageIcon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Click to select image from gallery
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                        PNG, JPG, WebP • Auto-compressed for rapid loading
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 2: Direct URL / Preset Key */}
          {mode === "url" && (
            <div className="space-y-2">
              <input
                type="text"
                value={(val as string) ?? ""}
                onChange={(e) => {
                  setField(field.key, e.target.value);
                  if (field.key === "imageUrl") setField("imageKey", e.target.value);
                }}
                placeholder={field.placeholder || "Paste image URL (https://...) or preset (church, school, port)"}
                className={inputBase}
              />
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">Presets:</span>
                {["church", "school", "port"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setField(field.key, k);
                      if (field.key === "imageUrl") setField("imageKey", k);
                    }}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 text-slate-700 dark:text-zinc-300 capitalize"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

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
                className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-white/10 text-xs font-mono font-medium"
              >
                {t}
                <button
                  type="button"
                  onClick={() => setField(field.key, tags.filter((_, j) => j !== i))}
                  className="w-3.5 h-3.5 rounded flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                >
                  <X size={10} />
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
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:focus:ring-white/20 ${
              val ? "bg-slate-900 dark:bg-white" : "bg-slate-200 dark:bg-white/10"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200 shadow-sm ${
                val
                  ? "translate-x-5 bg-white dark:bg-slate-900"
                  : "bg-white dark:bg-zinc-400"
              }`}
            />
          </button>
          <span className="text-xs font-mono font-medium text-slate-700 dark:text-zinc-300">
            {val ? "Enabled" : "Disabled"}
          </span>
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

  // Find image field if present
  const imageField = fields.find((f) => f.type === "image");

  return (
    <div>
      {/* ── Toolbar ──────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold">
          {loading ? "Loading…" : `${data.length} item${data.length !== 1 ? "s" : ""}`}
        </p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs sm:text-sm font-semibold tracking-wide shadow-sm transition-all active:scale-95"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add New Item
        </button>
      </div>

      {/* ── Table ────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500 dark:text-zinc-400">
          <Loader2 className="animate-spin text-slate-900 dark:text-white" size={28} />
          <span className="text-xs font-mono">Loading data…</span>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500 dark:text-zinc-400 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-[#111216]/50">
          <PackageOpen size={32} strokeWidth={1.5} />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Nothing here yet</p>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Click &quot;Add New Item&quot; to publish your first entry.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#111216] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#14151a] border-b border-slate-200 dark:border-white/10">
                  {imageField && (
                    <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider w-16">
                      Visual
                    </th>
                  )}
                  {fields
                    .filter((f) => f.type !== "image")
                    .slice(0, 3)
                    .map((f) => (
                      <th
                        key={f.key}
                        className="text-left px-5 py-3.5 font-mono text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider"
                      >
                        {f.label}
                      </th>
                    ))}
                  <th className="text-right px-5 py-3.5 font-mono text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {data.map((row, idx) => {
                  const imgPreview = imageField
                    ? resolveDisplayImage(row[imageField.key] || row.imageUrl || row.imageKey)
                    : null;

                  return (
                    <motion.tr
                      key={row.id as string}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors duration-150"
                    >
                      {/* Image Thumbnail Column */}
                      {imageField && (
                        <td className="px-5 py-3.5">
                          {imgPreview ? (
                            <div className="w-11 h-8 rounded-lg overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                              <img
                                src={imgPreview}
                                alt="Thumbnail"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-11 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-400">
                              <ImageIcon size={12} />
                            </div>
                          )}
                        </td>
                      )}

                      {/* Regular Field Columns */}
                      {fields
                        .filter((f) => f.type !== "image")
                        .slice(0, 3)
                        .map((f) => (
                          <td key={f.key} className="px-5 py-3.5 max-w-[220px]">
                            {f.type === "toggle" ? (
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
                                  row[f.key]
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-white/10"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    row[f.key] ? "bg-emerald-500" : "bg-slate-400 dark:bg-zinc-500"
                                  }`}
                                />
                                {row[f.key] ? "Active" : "Inactive"}
                              </span>
                            ) : f.type === "tags" ? (
                              <div className="flex flex-wrap gap-1">
                                {((row[f.key] as string[]) || []).slice(0, 3).map((t) => (
                                  <span
                                    key={t}
                                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-zinc-300 border border-slate-200 dark:border-white/10 text-xs font-mono font-medium"
                                  >
                                    {t}
                                  </span>
                                ))}
                                {((row[f.key] as string[]) || []).length > 3 && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400 text-xs font-mono">
                                    +{((row[f.key] as string[]) || []).length - 3}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="truncate block font-medium text-slate-900 dark:text-white">
                                {String(row[f.key] ?? "—")}
                              </span>
                            )}
                          </td>
                        ))}

                      {/* Action buttons */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(row)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition-colors"
                            title="Edit Item"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id as string)}
                            disabled={deletingId === row.id}
                            className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-500 dark:text-zinc-400 hover:text-rose-500 transition-colors"
                            title="Delete Item"
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
                  );
                })}
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
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative z-10 bg-white dark:bg-[#14151a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col text-slate-900 dark:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/10 flex-shrink-0">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    {editId ? "Edit Item" : "Add New Item"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
                    {editId ? "Modify configuration fields below" : "Enter required fields and media"}
                  </p>
                </div>
                <button
                  onClick={closeForm}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
                {fields.map((field) => (
                  <div key={field.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        {field.label}
                      </label>
                      {field.helperText && (
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                          {field.helperText}
                        </span>
                      )}
                    </div>
                    {renderInput(field)}
                  </div>
                ))}
              </div>

              {/* Error */}
              {saveError && (
                <div className="mx-6 mb-3 flex items-start gap-2 text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl">
                  <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-3 px-6 py-5 border-t border-slate-200 dark:border-white/10 flex-shrink-0">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-mono font-semibold uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Save size={14} /> Save Record
                    </>
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
