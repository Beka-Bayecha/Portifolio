import { useState } from "react";
import { motion } from "framer-motion";
import CollectionTable, { FieldDef } from "@/components/admin/CollectionTable";
import { useAdminCollection } from "@/hooks/useAdminCollection";
import { patchProjectGithubUrls } from "@/lib/seed";
import { Loader2, GitBranch, FolderKanban, CheckCircle } from "lucide-react";

const fields: FieldDef[] = [
  { key: "order", label: "Display Order", type: "number", placeholder: "0" },
  { key: "title", label: "Project Title", type: "text", placeholder: "e.g. Shino Church Platform" },
  { key: "subtitle", label: "Subtitle / Role", type: "text", placeholder: "e.g. Enterprise Administration Platform" },
  {
    key: "imageUrl",
    label: "Project Image / Screenshot",
    type: "image",
    helperText: "Upload image from gallery or device",
  },
  { key: "description", label: "Description", type: "textarea", placeholder: "Short description of the system…" },
  { key: "tech", label: "Technologies (press Enter to add)", type: "tags" },
  { key: "liveUrl", label: "Live URL", type: "text", placeholder: "https://..." },
  { key: "githubUrl", label: "GitHub URL", type: "text", placeholder: "https://github.com/bekibayecha/..." },
  { key: "upcoming", label: "Upcoming / In Development", type: "toggle" },
];

const AdminProjects = () => {
  const { data, loading, refresh } = useAdminCollection("projects");
  const [patching, setPatching] = useState(false);
  const [patchDone, setPatchDone] = useState(false);

  const handlePatch = async () => {
    setPatching(true);
    try {
      await patchProjectGithubUrls();
      setPatchDone(true);
      refresh();
      setTimeout(() => setPatchDone(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setPatching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center flex-shrink-0 shadow-sm">
            <FolderKanban size={18} />
          </div>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Projects Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
              Add screenshots from gallery, configure live links & tech stacks
            </p>
          </div>
        </div>

        <button
          onClick={handlePatch}
          disabled={patching}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14151a] text-slate-800 dark:text-zinc-200 text-xs font-mono font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors disabled:opacity-60 flex-shrink-0 shadow-sm"
        >
          {patching ? (
            <Loader2 size={13} className="animate-spin" />
          ) : patchDone ? (
            <CheckCircle size={13} className="text-emerald-500" />
          ) : (
            <GitBranch size={13} />
          )}
          {patchDone ? "GitHub URLs updated!" : "Sync GitHub URLs"}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="bg-white dark:bg-[#111216] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
      >
        <CollectionTable
          collectionName="projects"
          fields={fields}
          data={data}
          loading={loading}
          onRefresh={refresh}
        />
      </motion.div>
    </div>
  );
};

export default AdminProjects;
