import { useState } from "react";
import { motion } from "framer-motion";
import CollectionTable, { FieldDef } from "@/components/admin/CollectionTable";
import { useAdminCollection } from "@/hooks/useAdminCollection";
import { patchProjectGithubUrls } from "@/lib/seed";
import { Loader2, GitBranch, FolderKanban, CheckCircle } from "lucide-react";

const fields: FieldDef[] = [
  { key: "order", label: "Order", type: "number", placeholder: "0" },
  { key: "title", label: "Title", type: "text", placeholder: "Project title" },
  { key: "subtitle", label: "Subtitle", type: "text", placeholder: "e.g. Enterprise Administration Platform" },
  { key: "description", label: "Description", type: "textarea", placeholder: "Short description..." },
  { key: "tech", label: "Tech Stack (press Enter to add)", type: "tags" },
  { key: "imageKey", label: "Image Key", type: "select", options: ["church", "school", "port"] },
  { key: "liveUrl", label: "Live URL", type: "text", placeholder: "https://..." },
  { key: "githubUrl", label: "GitHub URL", type: "text", placeholder: "https://github.com/..." },
  { key: "upcoming", label: "Upcoming / Coming Soon", type: "toggle" },
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
        className="flex items-start justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 flex items-center justify-center flex-shrink-0">
            <FolderKanban size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold">Projects</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your portfolio projects
            </p>
          </div>
        </div>

        <button
          onClick={handlePatch}
          disabled={patching}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/80 bg-card text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-60 flex-shrink-0"
        >
          {patching ? (
            <Loader2 size={13} className="animate-spin" />
          ) : patchDone ? (
            <CheckCircle size={13} className="text-emerald-500" />
          ) : (
            <GitBranch size={13} />
          )}
          {patchDone ? "GitHub URLs updated!" : "Fix GitHub URLs"}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="bg-card border border-border/60 rounded-2xl p-6 card-shadow"
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
