// ============ User & Auth ============
export type UserRole = 'admin' | 'support' | 'hr_team' | 'employee';
export type UserStatus = 'pendiente' | 'activo';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  department: string;
  office: string;
  cargo?: string;
  bio?: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
  status: UserStatus;
  createdAt?: string;
  firstLogin?: boolean;
}

// ============ Onboarding ============
export interface OnboardingState {
  profileConfigured: boolean;
  videoWatched: boolean;
  orgVisited: boolean;
  benefitsVisited: boolean;
}

// ============ Notifications ============
export type NotificationType = 'info' | 'warning' | 'success';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: NotificationType;
  targetUserId?: string;
}

// ============ Communications ============
export interface CommunicationAttachment {
  name: string;
  type: string;
  data: string;
}

export interface Communication {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  attachment?: CommunicationAttachment;
  attachments?: string[];
  pinned?: boolean;
  archived?: boolean;
  kind?: 'noticia' | 'comunicado';
}

// ============ Documents ============
export type DocumentCategory = 'contrato' | 'nomina' | 'politica' | 'formacion' | 'general';

export interface Document {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  uploadDate: string;
  author: string;
  fileType: 'pdf' | 'doc' | 'image';
  fileUrl?: string;
  link?: string;
  version: number;
  downloads: number;
  roles: UserRole[];
  archived?: boolean;
}

// ============ Courses ============
export interface Course {
  id: string;
  title: string;
  description: string;
  link: string;
  duration: string;
  mandatory: boolean;
  archived?: boolean;
}

// ============ FAQ ============
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  archived?: boolean;
}

// ============ Benefits ============
export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  archived?: boolean;
}

// ============ Org Chart ============
export interface OrgNode {
  id: string;
  name: string;
  role: string;
  department: string;
  office: string;
  avatar?: string;
  parentId?: string;
  archived?: boolean;
}

// ============ Homepage Highlights ============
export interface Highlight {
  id: string;
  title: string;
  description: string;
  link?: string;
  icon?: string;
  order: number;
  active: boolean;
}

// ============ Utility ============
export interface CrudActions<T> {
  create: (item: Omit<T, 'id'>) => void;
  update: (id: string, item: Partial<T>) => void;
  archive: (id: string) => void;
  remove: (id: string) => void;
}

// ============ Audit ============
export type AuditAction = 'create' | 'delete' | 'update' | 'activate' | 'deactivate';
export type AuditEntity = 'user' | 'document' | 'course' | 'communication';

export interface AuditEntry {
  id: string;
  action: AuditAction;
  entity: AuditEntity;
  entityName: string;
  performedBy: string;
  performedById: string;
  date: string;
}
