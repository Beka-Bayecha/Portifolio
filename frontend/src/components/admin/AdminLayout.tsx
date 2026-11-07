import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, Wrench, Star, MessageSquare,
  LogOut, Menu, ExternalLink, Bell, Sun, Moon, Award, X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useTheme } from "@/hooks/useTheme";
import logoEmblem from "@/assets/logo-emblem.png";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/projects", icon: FolderKanban, label: "Projects" },
  { to: "/admin/certificates", icon: Award, label: "Certificates" },
  { to: "/admin/skills", icon: Star, label: "Skills" },
  { to: "/admin/services", icon: Wrench, label: "Services" },
  { to: "/admin/messages", icon: MessageSquare, label: "Messages" },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadCount = useUnreadMessages();
  const { theme, setTheme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const currentNav = navItems.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-[#111216] text-slate-900 dark:text-white">
      {/* ── Brand header ────────────────────────────────────── */}
      <div className="p-5 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-black dark:bg-transparent p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm dark:shadow-none transition-colors">
            <img
              src={logoEmblem}
              alt="Beka Bayecha Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="font-heading font-bold text-sm leading-tight uppercase tracking-wider text-slate-900 dark:text-white">
              Beka Bayecha
            </p>
            <p className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest mt-0.5 truncate">
              Admin Console
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
          Navigation
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={16}
                  className={
                    isActive
                      ? "text-white dark:text-black"
                      : "text-slate-500 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
                  }
                />
                <span className="flex-1">{item.label}</span>
                {item.label === "Messages" && unreadCount > 0 && (
                  <span
                    className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-rose-500 text-white"
                        : "bg-rose-500 text-white"
                    }`}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User & Footer actions ───────────────────────────── */}
      <div className="p-3 border-t border-slate-200 dark:border-white/10 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate">
          {user?.email}
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
        >
          <ExternalLink size={14} />
          <span>Live Portfolio</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-mono text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-all font-semibold"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0c0e] text-slate-900 dark:text-white flex transition-colors duration-200">
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#111216] flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar overlay ──────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-white dark:bg-[#111216] border-r border-slate-200 dark:border-white/10 lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0b0c0e]/80 backdrop-blur-md flex items-center px-6 gap-4 sticky top-0 z-30 transition-colors">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-zinc-300"
            aria-label="Open sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Section Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 dark:text-zinc-500 uppercase tracking-widest hidden sm:inline">
              Console /
            </span>
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {currentNav?.label ?? "Admin"}
            </span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Notification bell */}
            <NavLink
              to="/admin/messages"
              className="relative p-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm"
              title="Messages"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>

            <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-mono font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white transition-all shadow-sm"
            >
              <span>View Site</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
