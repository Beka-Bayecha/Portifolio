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
    key: "category", label: "Category", type: "select",
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
        className="flex items-center gap-3.5"
      >
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center flex-shrink-0">
          <Award size={18} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold">Certificates & Credentials</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage certifications, diplomas, awards and verification links
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
