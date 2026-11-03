import { motion } from "framer-motion";
import CollectionTable, { FieldDef } from "@/components/admin/CollectionTable";
import { useAdminCollection } from "@/hooks/useAdminCollection";
import { Wrench } from "lucide-react";

const fields: FieldDef[] = [
  { key: "order", label: "Order", type: "number", placeholder: "0" },
  {
    key: "icon", label: "Icon", type: "select",
    options: [
      "Globe", "Server", "Smartphone", "Palette",
      "Code2", "Database", "Cloud", "Shield", "Cpu", "Layout", "Terminal",
      "GitBranch", "Layers", "Wifi", "Lock", "BarChart", "Search", "Mail",
      "ShoppingCart", "Video", "Music", "Camera", "FileCode", "Wrench", "Zap",
      "Monitor", "Headphones", "Bot", "Rocket", "Star", "Settings",
    ],
  },
  { key: "title", label: "Title", type: "text", placeholder: "Service title" },
  { key: "desc", label: "Description", type: "textarea", placeholder: "Short description..." },
];

const AdminServices = () => {
  const { data, loading, refresh } = useAdminCollection("services");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3.5"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
          <Wrench size={18} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold">Services</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage the services you offer to clients
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
