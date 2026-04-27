import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppStore } from "@/stores/useAppStore";
import MainLayout from "@/components/layout/MainLayout";
import LoginPage from "@/pages/LoginPage";
import InicioPage from "@/pages/InicioPage";
import PayfitPage from "@/pages/PayfitPage";
import ComunicacionesPage from "@/pages/ComunicacionesPage";
import CursosPage from "@/pages/CursosPage";
import SeguridadITPage from "@/pages/SeguridadITPage";

import BeneficiosPage from "@/pages/BeneficiosPage";
import SolicitudBeneficioPage from "@/pages/SolicitudBeneficioPage";
import OrganigramaPage from "@/pages/OrganigramaPage";
import PerfilPage from "@/pages/PerfilPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function NonEmployeeGuard({ children }: { children: React.ReactNode }) {
  const role = useAppStore((s) => s.currentUser.role);
  if (role === 'employee') return <Navigate to="/perfil" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AuthGuard><MainLayout /></AuthGuard>}>
            <Route path="/" element={<InicioPage />} />
            <Route path="/payfit" element={<PayfitPage />} />
            <Route path="/comunicaciones" element={<ComunicacionesPage />} />
            <Route path="/cursos" element={<CursosPage />} />
            <Route path="/seguridad-it" element={<SeguridadITPage />} />
            <Route path="/beneficios" element={<BeneficiosPage />} />
            <Route path="/beneficios/solicitud" element={<SolicitudBeneficioPage />} />
            <Route path="/organigrama" element={<OrganigramaPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/admin" element={<NonEmployeeGuard><AdminPage /></NonEmployeeGuard>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
