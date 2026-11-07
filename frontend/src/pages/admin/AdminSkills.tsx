import { motion } from "framer-motion";
import CollectionTable, { FieldDef } from "@/components/admin/CollectionTable";
import { useAdminCollection } from "@/hooks/useAdminCollection";
import { SKILL_ICONS } from "@/lib/skillConstants";
import { Star } from "lucide-react";

const fields: FieldDef[] = [
  { key: "order", label: "Display Order", type: "number", placeholder: "0" },
  { key: "name", label: "Skill Name", type: "text", placeholder: "e.g. React" },
  {
    key: "icon",
    label: "Technology Icon",
    type: "select",
    options: Object.entries(SKILL_ICONS).map(([key, val]) => `${key}|${val.label}`),
  },
  { key: "category", label: "Display Category", type: "select", options: ["core", "other"] },
  { key: "tag", label: "Pillar Tag (Core only)", type: "text", placeholder: "e.g. Core Daily, Primary Stack" },
  { key: "summary", label: "Summary Description", type: "textarea", placeholder: "Short summary for the architectural pillar card…" },
  { key: "subSkills", label: "Related Sub-Skills (press Enter to add)", type: "tags" },
];

export const AdminSkills = () => {
  const { data, loading, refresh } = useAdminCollection("skills");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3.5 pb-2 border-b border-slate-200 dark:border-white/10"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center flex-shrink-0 shadow-sm">
          <Star size={18} />
        </div>
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Technical Skills & Pillars
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
            Manage your core architectural stacks, tools, frameworks, and proficiencies
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="bg-white dark:bg-[#111216] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
      >
        <CollectionTable
          collectionName="skills"
          fields={fields}
          data={data}
          loading={loading}
          onRefresh={refresh}
        />
      </motion.div>
    </div>
  );
};

export default AdminSkills;
