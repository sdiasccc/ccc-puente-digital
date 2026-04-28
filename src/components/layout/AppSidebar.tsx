import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import {
  Home,
  Clock,
  Megaphone,
  GraduationCap,
  Gift,
  Network,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const allNavItems = [
  { label: 'Inicio', icon: Home, path: '/', employeeAllowed: true },
  { label: 'Payfit', icon: Clock, path: '/payfit', employeeAllowed: true },
  { label: 'Comunicaciones', icon: Megaphone, path: '/comunicaciones', employeeAllowed: true },
  { label: 'Cursos obligatorios', icon: GraduationCap, path: '/cursos', employeeAllowed: true },
  { label: 'Beneficios sociales', icon: Gift, path: '/beneficios', employeeAllowed: true },
  { label: 'Organigrama', icon: Network, path: '/organigrama', employeeAllowed: true },
];

export default function AppSidebar() {
  const { sidebarOpen, currentUser } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isEmployee = currentUser.role === 'employee';
  const navItems = allNavItems.filter((it) => !isEmployee || it.employeeAllowed);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-secondary/50 lg:hidden"
          onClick={() => useAppStore.getState().toggleSidebar()}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-16 z-40 flex h-[calc(100vh-64px)] w-[260px] flex-col bg-secondary transition-transform duration-200',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 1024) useAppStore.getState().toggleSidebar();
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-4 py-4">
          <p className="text-xs text-sidebar-foreground/60">© 2026 CCC • Intranet</p>
        </div>
      </aside>
    </>
  );
}
