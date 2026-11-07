import { motion } from "framer-motion";
import CollectionTable, { FieldDef } from "@/components/admin/CollectionTable";
import { useAdminCollection } from "@/hooks/useAdminCollection";
import { Award } from "lucide-react";

const fields: FieldDef[] = [
  { key: "order", label: "Display Order", type: "number", placeholder: "0" },
  { key: "title", label: "Certificate Title", type: "text", placeholder: "e.g. Meta Front-End Developer" },
  { key: "issuer", label: "Issuing Organization", type: "text", placeholder: "e.g. Meta, Coursera, Haramaya University" },
  { key: "issueDate", label: "Issue Date / Year", type: "text", placeholder: "e.g. May 2024 or 2024" },
  {
    key: "imageUrl",
    label: "Certificate Image / Badge",
    type: "image",
    helperText: "Upload diploma, badge, or credential photo from gallery",
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: ["Full Stack", "Frontend", "Backend & Cloud", "Database", "Professional"],
  },
  { key: "credentialId", label: "Credential ID (Optional)", type: "text", placeholder: "e.g. META-FE-892410" },
  { key: "credentialUrl", label: "Credential / Verification URL", type: "text", placeholder: "https://..." },
  { key: "skills", label: "Skills Covered (press Enter to add)", type: "tags" },
  { key: "featured", label: "Featured Badge", type: "toggle" },
  { key: "description", label: "Description / Highlights", type: "textarea", placeholder: "Key skills, course topics, or notable achievements..." },
];

const AdminCertificates = () => {
  const { data, loading, refresh } = useAdminCollection("certificates");

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
          <Award size={18} />
        </div>
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Certificates & Credentials
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
            Upload certificate photos from gallery, manage credentials and verify links
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
          collectionName="certificates"
          fields={fields}
          data={data}
          loading={loading}
          onRefresh={refresh}
        />
      </motion.div>
    </div>
  );
};

export default AdminCertificates;
