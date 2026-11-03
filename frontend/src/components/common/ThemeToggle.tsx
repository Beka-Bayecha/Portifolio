import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, setTheme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border border-slate-300 dark:border-white/20 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white shadow-sm ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <motion.div
        key={isDark ? "sun" : "moon"}
        initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun size={16} strokeWidth={1.8} className="text-white" />
        ) : (
          <Moon size={16} strokeWidth={1.8} className="text-slate-900" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
