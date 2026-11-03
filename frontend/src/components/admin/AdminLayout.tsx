import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, Wrench, Star, MessageSquare,
  LogOut, Menu, ExternalLink, Bell, Sun, Moon, Award, X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useTheme } from "@/hooks/useTheme";
import Logo from "../common/Logo";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/projects", icon: FolderKanban, label: "Projects" },
  { to: "/admin/certificates", icon: Award, label: "Certificates" },
  { to: "/admin/skills", icon: Star, label: "Skills" },
  { to: "/admin/services", icon: Wrench, label: "Services" },
  { to: "/admin/messages", icon: MessageSquare, label: "Messages" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* ── Brand header ────────────────────────────────────── */}
      <div className="p-5 border-b border-border/60">
        <div className="flex items-center gap-3">
          {/* gradient badge */}
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-md flex-shrink-0">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-heading font-bold text-sm leading-tight">Admin Panel</p>
            <p className="text-[11px] text-muted-foreground truncate max-w-[148px]">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "gradient-bg text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={16}
                  className={isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground transition-colors"}
                />
                <span className="flex-1">{item.label}</span>
                {item.label === "Messages" && unreadCount > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer actions ──────────────────────────────────── */}
      <div className="p-3 border-t border-border/60 space-y-0.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <ExternalLink size={16} />
          <span>View Portfolio</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-border/60 bg-card/80 backdrop-blur-sm flex-shrink-0">
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
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 bg-card border-r border-border/60 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border/60 bg-card/70 backdrop-blur-sm flex items-center px-4 gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Open sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* page breadcrumb placeholder — fills space */}
          <div className="flex-1" />

          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Notification bell */}
            <NavLink
              to="/admin/messages"
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              title="Messages"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>

            <div className="w-px h-5 bg-border/60 mx-1" />
            <Logo size="sm" showText={false} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-7 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
