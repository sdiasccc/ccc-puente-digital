import { create } from 'zustand';
import type { User, Notification, Communication, Document, Course, FAQItem, Benefit, OrgNode, Highlight, UserRole } from '@/types';
import { generateId } from '@/services/idGenerator';
import {
  mockUser, mockUsers, mockNotifications, mockCommunications, mockDocuments,
  mockCourses, mockFAQs, mockBenefits, mockOrgNodes, mockHighlights, rolePermissions,
} from '@/services/mockData';

interface AppState {
  // Core
  currentUser: User;
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

function crudHelpers<T extends { id: string }>(key: string) {
  return {
    create: (item: Omit<T, 'id'>) => (set: any) =>
      set((s: any) => ({ [key]: [...s[key], { ...item, id: generateId() }] })),
    update: (id: string, patch: Partial<T>) => (set: any) =>
      set((s: any) => ({ [key]: s[key].map((i: T) => i.id === id ? { ...i, ...patch } : i) })),
    archive: (id: string) => (set: any) =>
      set((s: any) => ({ [key]: s[key].map((i: any) => i.id === id ? { ...i, archived: true } : i) })),
    remove: (id: string) => (set: any) =>
      set((s: any) => ({ [key]: s[key].filter((i: T) => i.id !== id) })),
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  // Core
  currentUser: mockUser,
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  hasPermission: (action) => {
    const role = get().currentUser.role;
    return rolePermissions[role]?.includes(action) ?? false;
  },

  // Users
  users: mockUsers,
  createUser: (u) => set((s) => ({ users: [...s.users, { ...u, id: generateId() }] })),
  updateUser: (id, u) => set((s) => ({ users: s.users.map((i) => i.id === id ? { ...i, ...u } : i) })),
  removeUser: (id) => set((s) => ({ users: s.users.filter((i) => i.id !== id) })),

  // Notifications
  notifications: mockNotifications,
  markNotificationRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
  createNotification: (n) => set((s) => ({ notifications: [{ ...n, id: generateId() }, ...s.notifications] })),
  removeNotification: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

  // Communications
  communications: mockCommunications,
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
}));
