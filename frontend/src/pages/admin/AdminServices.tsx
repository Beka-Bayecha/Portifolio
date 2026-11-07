import { motion } from "framer-motion";
import CollectionTable, { FieldDef } from "@/components/admin/CollectionTable";
import { useAdminCollection } from "@/hooks/useAdminCollection";
import { Wrench } from "lucide-react";

const fields: FieldDef[] = [
  { key: "order", label: "Display Order", type: "number", placeholder: "0" },
  {
    key: "icon",
    label: "Service Icon",
    type: "select",
    options: [
      "Globe", "Server", "Smartphone", "Palette",
      "Code2", "Database", "Cloud", "Shield", "Cpu", "Layout", "Terminal",
      "GitBranch", "Layers", "Wifi", "Lock", "BarChart", "Search", "Mail",
      "ShoppingCart", "Video", "Music", "Camera", "FileCode", "Wrench", "Zap",
      "Monitor", "Headphones", "Bot", "Rocket", "Star", "Settings",
    ],
  },
  { key: "title", label: "Service Title", type: "text", placeholder: "e.g. Full-Stack Web Architecture" },
  { key: "desc", label: "Scope & Description", type: "textarea", placeholder: "Detailed scope, deliverables, and architecture guarantees…" },
];

export const AdminServices = () => {
  const { data, loading, refresh } = useAdminCollection("services");

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
          <Wrench size={18} />
        </div>
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Engineering Services
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
            Configure solutions, architectural offerings, and delivery standards
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
          collectionName="services"
          fields={fields}
          data={data}
          loading={loading}
          onRefresh={refresh}
        />
      </motion.div>
    </div>
  );
};

export default AdminServices;
