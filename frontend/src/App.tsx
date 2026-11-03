import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/context/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/common/LoadingScreen";
import Login from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Dashboard from "./pages/admin/Dashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminServices from "./pages/admin/AdminServices";
import AdminMessages from "./pages/admin/AdminMessages";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = "auto"; };
  }, []);

  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
          ) : (
            <BrowserRouter key="app">
              <Routes>
                {/* Portfolio */}
                <Route path="/" element={<Index />} />

                {/* Admin */}
                <Route path="/admin/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="certificates" element={<AdminCertificates />} />
                  <Route path="skills" element={<AdminSkills />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="messages" element={<AdminMessages />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </AuthProvider>
  );
};

export default App;
