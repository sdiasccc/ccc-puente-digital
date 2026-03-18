import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/components/layout/MainLayout";
import InicioPage from "@/pages/InicioPage";
import PayfitPage from "@/pages/PayfitPage";
import ComunicacionesPage from "@/pages/ComunicacionesPage";
import CursosPage from "@/pages/CursosPage";
import SeguridadITPage from "@/pages/SeguridadITPage";
import PolizaSegurosPage from "@/pages/PolizaSegurosPage";
import BeneficiosPage from "@/pages/BeneficiosPage";
import OrganigramaPage from "@/pages/OrganigramaPage";
import PerfilPage from "@/pages/PerfilPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<InicioPage />} />
            <Route path="/payfit" element={<PayfitPage />} />
            <Route path="/comunicaciones" element={<ComunicacionesPage />} />
            <Route path="/cursos" element={<CursosPage />} />
            <Route path="/seguridad-it" element={<SeguridadITPage />} />
            <Route path="/poliza-seguros" element={<PolizaSegurosPage />} />
            <Route path="/beneficios" element={<BeneficiosPage />} />
            <Route path="/organigrama" element={<OrganigramaPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
