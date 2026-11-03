import { motion } from "framer-motion";
import CollectionTable, { FieldDef } from "@/components/admin/CollectionTable";
import { useAdminCollection } from "@/hooks/useAdminCollection";
import { SKILL_ICONS } from "@/lib/skillConstants";
import { Star } from "lucide-react";

const fields: FieldDef[] = [
  { key: "order", label: "Order", type: "number", placeholder: "0" },
  { key: "name", label: "Name", type: "text", placeholder: "React" },
  {
    key: "icon", label: "Icon", type: "select",
    options: Object.entries(SKILL_ICONS).map(([key, val]) => `${key}|${val.label}`),
  },
  { key: "category", label: "Category", type: "select", options: ["core", "other"] },
  { key: "tag", label: "Tag / Badge (core only)", type: "text", placeholder: "Core Daily" },
  { key: "summary", label: "Summary (core only)", type: "textarea", placeholder: "Short description for the featured card…" },
  { key: "subSkills", label: "Sub-Skills (core only, press Enter to add)", type: "tags" },
];

const AdminSkills = () => {
  const { data, loading, refresh } = useAdminCollection("skills");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3.5"
      >
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/15 flex items-center justify-center flex-shrink-0">
          <Star size={18} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold">Skills</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your technology skills and tools
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="bg-card border border-border/60 rounded-2xl p-6 card-shadow"
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
