import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Notification, Communication, Document, Course, FAQItem, Benefit, OrgNode, Highlight, UserRole, OnboardingState } from '@/types';
import { generateId } from '@/services/idGenerator';
import {
  mockUser, mockUsers, mockNotifications, mockDocuments,
  mockCourses, mockFAQs, mockBenefits, mockOrgNodes, mockHighlights, rolePermissions,
} from '@/services/mockData';

function getOrgLevel(cargo: string): number {
  const c = cargo.toLowerCase();
  if (['administrador', 'director', 'directora', 'ceo'].some(k => c.includes(k))) return 1;
  if (['responsable', 'manager', 'lead', 'jefe', 'jefa'].some(k => c.includes(k))) return 2;
  if (['técnico', 'diseñador', 'diseñadora', 'desarrollador', 'desarrolladora', 'comercial', 'formador', 'formadora', 'profesor', 'profesora', 'personal de it'].some(k => c.includes(k))) return 3;
  return 3;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  currentUser: User;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, cargo?: string, office?: string) => 'success' | 'exists' | 'error';
  logout: () => void;
  activateUser: (id: string) => void;

  // Onboarding
  onboarding: Record<string, OnboardingState>;
  completeOnboardingStep: (userId: string, step: keyof OnboardingState) => void;

  // Core
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  hasPermission: (action: string) => boolean;

  // Users
  users: User[];
  createUser: (u: Omit<User, 'id'>) => void;
  updateUser: (id: string, u: Partial<User>) => void;
  removeUser: (id: string) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  createNotification: (n: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;

  // Communications
  communications: Communication[];
  createCommunication: (c: Omit<Communication, 'id'>) => void;
  updateCommunication: (id: string, c: Partial<Communication>) => void;
  archiveCommunication: (id: string) => void;
  removeCommunication: (id: string) => void;

  // Documents
  documents: Document[];
  createDocument: (d: Omit<Document, 'id'>) => void;
  updateDocument: (id: string, d: Partial<Document>) => void;
  archiveDocument: (id: string) => void;
  removeDocument: (id: string) => void;
  incrementDownload: (id: string) => void;

  // Courses
  courses: Course[];
  createCourse: (c: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, c: Partial<Course>) => void;
  archiveCourse: (id: string) => void;
  removeCourse: (id: string) => void;

  // FAQs
  faqs: FAQItem[];
  createFAQ: (f: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, f: Partial<FAQItem>) => void;
  archiveFAQ: (id: string) => void;
  removeFAQ: (id: string) => void;

  // Benefits
  benefits: Benefit[];
  createBenefit: (b: Omit<Benefit, 'id'>) => void;
  updateBenefit: (id: string, b: Partial<Benefit>) => void;
  archiveBenefit: (id: string) => void;
  removeBenefit: (id: string) => void;

  // Org nodes
  orgNodes: OrgNode[];
  createOrgNode: (n: Omit<OrgNode, 'id'>) => void;
  updateOrgNode: (id: string, n: Partial<OrgNode>) => void;
  archiveOrgNode: (id: string) => void;
  removeOrgNode: (id: string) => void;

  // Highlights
  highlights: Highlight[];
  createHighlight: (h: Omit<Highlight, 'id'>) => void;
  updateHighlight: (id: string, h: Partial<Highlight>) => void;
  removeHighlight: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      isAuthenticated: false,
      currentUser: mockUser,
      login: (email, _password) => {
        const user = get().users.find((u) => u.email === email);
        if (!user) return false;
        if (user.status === 'pendiente') return false;
        if (!user.active) return false;
        set({ isAuthenticated: true, currentUser: user });
        return true;
      },
      register: (name, email, _password, cargo?, office?) => {
        const exists = get().users.some((u) => u.email === email);
        if (exists) return 'exists';
        const newUser: User = {
          id: generateId(),
          name,
          email,
          department: 'Sin asignar',
          office: office || 'Sin asignar',
          cargo: cargo || '',
          role: 'employee',
          active: true,
          status: 'pendiente',
          createdAt: new Date().toISOString(),
          firstLogin: true,
        };
        const adminNotification: Notification = {
          id: generateId(),
          title: 'Nuevo registro de usuario',
          message: `${name} (${email}) se ha registrado y está pendiente de activación.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          type: 'info',
        };
        set((s) => ({
          users: [...s.users, newUser],
          notifications: [adminNotification, ...s.notifications],
        }));
        return 'success';
      },
      logout: () => set({ isAuthenticated: false }),
      activateUser: (id) => {
        const state = get();
        const user = state.users.find(u => u.id === id);
        if (!user) return;

        const updatedUsers = state.users.map((u) => u.id === id ? { ...u, status: 'activo' as const } : u);

        // Auto-insert into org chart if user has cargo and isn't already in it
        const alreadyInOrg = state.orgNodes.some(n => n.name === user.name && !n.archived);
        let newOrgNodes = state.orgNodes;
        if (!alreadyInOrg && user.cargo) {
          const level = getOrgLevel(user.cargo);
          let parentId: string | undefined;
          if (level === 2) {
            const roots = state.orgNodes.filter(n => !n.parentId && !n.archived);
            parentId = roots[0]?.id;
          } else if (level === 3) {
            const level2Nodes = state.orgNodes.filter(n => {
              if (n.archived) return false;
              const nodeLevel = getOrgLevel(n.role);
              return nodeLevel <= 2;
            });
            // Try to find a parent in same department
            const sameDept = level2Nodes.find(n => n.department.toLowerCase() === user.department.toLowerCase());
            parentId = sameDept?.id || level2Nodes[0]?.id;
          }
          const newNode: OrgNode = {
            id: generateId(),
            name: user.name,
            role: user.cargo,
            department: user.department,
            office: user.office,
            avatar: user.avatar,
            parentId,
          };
          newOrgNodes = [...state.orgNodes, newNode];
        }

        set({ users: updatedUsers, orgNodes: newOrgNodes });
      },

      // Onboarding
      onboarding: {},
      completeOnboardingStep: (userId, step) =>
        set((s) => ({
          onboarding: {
            ...s.onboarding,
            [userId]: {
              profileConfigured: false,
              videoWatched: false,
              orgVisited: false,
              benefitsVisited: false,
              ...s.onboarding[userId],
              [step]: true,
            },
          },
        })),

      // Core
      sidebarOpen: true,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      hasPermission: (action) => {
        const role = get().currentUser.role;
        return rolePermissions[role]?.includes(action) ?? false;
      },

      // Users
      users: mockUsers,
      createUser: (u) => set((s) => ({ users: [...s.users, { ...u, id: generateId() }] })),
      updateUser: (id, u) => set((s) => ({
        users: s.users.map((i) => i.id === id ? { ...i, ...u } : i),
        currentUser: s.currentUser.id === id ? { ...s.currentUser, ...u } : s.currentUser,
      })),
      removeUser: (id) => set((s) => ({ users: s.users.filter((i) => i.id !== id) })),

      // Notifications
      notifications: mockNotifications,
      markNotificationRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
      createNotification: (n) => set((s) => ({ notifications: [{ ...n, id: generateId() }, ...s.notifications] })),
      removeNotification: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

      // Communications
      communications: [],
      createCommunication: (c) => set((s) => ({ communications: [{ ...c, id: generateId() }, ...s.communications] })),
      updateCommunication: (id, c) => set((s) => ({ communications: s.communications.map((i) => i.id === id ? { ...i, ...c } : i) })),
      archiveCommunication: (id) => set((s) => ({ communications: s.communications.map((i) => i.id === id ? { ...i, archived: true } : i) })),
      removeCommunication: (id) => set((s) => ({ communications: s.communications.filter((i) => i.id !== id) })),

      // Documents
      documents: mockDocuments,
      createDocument: (d) => set((s) => ({ documents: [{ ...d, id: generateId() }, ...s.documents] })),
      updateDocument: (id, d) => set((s) => ({ documents: s.documents.map((i) => i.id === id ? { ...i, ...d } : i) })),
      archiveDocument: (id) => set((s) => ({ documents: s.documents.map((i) => i.id === id ? { ...i, archived: true } : i) })),
      removeDocument: (id) => set((s) => ({ documents: s.documents.filter((i) => i.id !== id) })),
      incrementDownload: (id) => set((s) => ({ documents: s.documents.map((i) => i.id === id ? { ...i, downloads: i.downloads + 1 } : i) })),

      // Courses
      courses: mockCourses,
      createCourse: (c) => set((s) => ({ courses: [...s.courses, { ...c, id: generateId() }] })),
      updateCourse: (id, c) => set((s) => ({ courses: s.courses.map((i) => i.id === id ? { ...i, ...c } : i) })),
      archiveCourse: (id) => set((s) => ({ courses: s.courses.map((i) => i.id === id ? { ...i, archived: true } : i) })),
      removeCourse: (id) => set((s) => ({ courses: s.courses.filter((i) => i.id !== id) })),

      // FAQs
      faqs: mockFAQs,
      createFAQ: (f) => set((s) => ({ faqs: [...s.faqs, { ...f, id: generateId() }] })),
      updateFAQ: (id, f) => set((s) => ({ faqs: s.faqs.map((i) => i.id === id ? { ...i, ...f } : i) })),
      archiveFAQ: (id) => set((s) => ({ faqs: s.faqs.map((i) => i.id === id ? { ...i, archived: true } : i) })),
      removeFAQ: (id) => set((s) => ({ faqs: s.faqs.filter((i) => i.id !== id) })),

      // Benefits
      benefits: mockBenefits,
      createBenefit: (b) => set((s) => ({ benefits: [...s.benefits, { ...b, id: generateId() }] })),
      updateBenefit: (id, b) => set((s) => ({ benefits: s.benefits.map((i) => i.id === id ? { ...i, ...b } : i) })),
      archiveBenefit: (id) => set((s) => ({ benefits: s.benefits.map((i) => i.id === id ? { ...i, archived: true } : i) })),
      removeBenefit: (id) => set((s) => ({ benefits: s.benefits.filter((i) => i.id !== id) })),

      // Org nodes
      orgNodes: mockOrgNodes,
      createOrgNode: (n) => set((s) => ({ orgNodes: [...s.orgNodes, { ...n, id: generateId() }] })),
      updateOrgNode: (id, n) => set((s) => ({ orgNodes: s.orgNodes.map((i) => i.id === id ? { ...i, ...n } : i) })),
      archiveOrgNode: (id) => set((s) => ({ orgNodes: s.orgNodes.map((i) => i.id === id ? { ...i, archived: true } : i) })),
      removeOrgNode: (id) => set((s) => ({ orgNodes: s.orgNodes.filter((i) => i.id !== id) })),

      // Highlights
      highlights: mockHighlights,
      createHighlight: (h) => set((s) => ({ highlights: [...s.highlights, { ...h, id: generateId() }] })),
      updateHighlight: (id, h) => set((s) => ({ highlights: s.highlights.map((i) => i.id === id ? { ...i, ...h } : i) })),
      removeHighlight: (id) => set((s) => ({ highlights: s.highlights.filter((i) => i.id !== id) })),
    }),
    {
      name: 'intranet-ccc-storage',
      partialize: (state) => ({
        users: state.users,
        notifications: state.notifications,
        communications: state.communications,
        documents: state.documents,
        courses: state.courses,
        faqs: state.faqs,
        benefits: state.benefits,
        orgNodes: state.orgNodes,
        highlights: state.highlights,
        onboarding: state.onboarding,
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
      }),
    }
  )
);
