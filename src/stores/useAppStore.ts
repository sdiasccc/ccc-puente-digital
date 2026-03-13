import { create } from 'zustand';

export type UserRole = 'admin' | 'hr_team' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  office: string;
  role: UserRole;
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface Communication {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  attachments?: string[];
  pinned?: boolean;
}

interface AppState {
  currentUser: User;
  notifications: Notification[];
  communications: Communication[];
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  markNotificationRead: (id: string) => void;
  hasPermission: (action: string) => boolean;
}

const mockUser: User = {
  id: '1',
  name: 'Carlos García',
  email: 'carlos.garcia@ccc.com',
  department: 'Tecnología',
  office: 'Madrid',
  role: 'admin',
  avatar: undefined,
};

const mockNotifications: Notification[] = [
  { id: '1', title: 'Nuevo comunicado', message: 'Se ha publicado un nuevo comunicado sobre la política de teletrabajo.', date: '2026-03-13', read: false, type: 'info' },
  { id: '2', title: 'Curso obligatorio pendiente', message: 'Recuerda completar el curso de PRL antes del 30 de marzo.', date: '2026-03-12', read: false, type: 'warning' },
  { id: '3', title: 'Nómina disponible', message: 'Tu nómina de febrero ya está disponible en Payfit.', date: '2026-03-10', read: true, type: 'success' },
];

const mockCommunications: Communication[] = [
  { id: '1', title: 'Actualización política de teletrabajo', content: 'A partir del 1 de abril se amplía a 3 días de teletrabajo por semana. Consulta los detalles en el documento adjunto.', date: '2026-03-13', author: 'RRHH', pinned: true },
  { id: '2', title: 'Evento de team building - Abril', content: 'El próximo 15 de abril celebraremos una jornada de team building en las oficinas de Madrid. ¡Apúntate!', date: '2026-03-11', author: 'People & Culture' },
  { id: '3', title: 'Nuevos beneficios de salud', content: 'Hemos ampliado nuestra póliza de seguros con cobertura dental incluida para todos los empleados.', date: '2026-03-08', author: 'RRHH' },
];

const rolePermissions: Record<UserRole, string[]> = {
  admin: ['manage_users', 'publish_communications', 'upload_documents', 'manage_notifications', 'edit_orgchart', 'view_content', 'download_documents', 'open_support'],
  hr_team: ['publish_communications', 'upload_documents', 'manage_benefits', 'manage_training', 'view_content', 'download_documents', 'open_support'],
  employee: ['view_content', 'download_documents', 'open_support'],
};

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: mockUser,
  notifications: mockNotifications,
  communications: mockCommunications,
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  hasPermission: (action) => {
    const role = get().currentUser.role;
    return rolePermissions[role]?.includes(action) ?? false;
  },
}));
