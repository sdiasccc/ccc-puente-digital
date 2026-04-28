import type { User, Notification, Communication, Document, Course, FAQItem, Benefit, OrgNode, Highlight } from '@/types';

export const mockUser: User = {
  id: 'u-admin',
  name: 'Administrador CCC',
  email: 'admin@cursosccc.com',
  password: '1234',
  department: 'Dirección',
  office: 'Madrid',
  cargo: 'Administrador',
  role: 'admin',
  active: true,
  status: 'activo',
  firstLogin: false,
};

export const mockUsers: User[] = [
  mockUser,
  { id: 'u-base', name: 'Usuario Base', email: 'usuariobase@cursosccc.com', password: '1234', department: 'General', office: 'Madrid', cargo: 'Empleado', role: 'employee', active: true, status: 'activo', firstLogin: false },
  { id: 'u-support', name: 'Soporte CCC', email: 'soporte@cursosccc.com', password: '1234', department: 'Soporte', office: 'Madrid', cargo: 'Soporte técnico', role: 'support', active: true, status: 'activo', firstLogin: false },
];

export const mockNotifications: Notification[] = [];

export const mockCommunications: Communication[] = [];

export const mockDocuments: Document[] = [
  { id: '1', title: 'Política de teletrabajo 2026', description: 'Normativa actualizada sobre trabajo remoto y horarios flexibles.', category: 'politica', uploadDate: '2026-03-13', author: 'RRHH', fileType: 'pdf', version: 2, downloads: 45, roles: ['admin', 'hr_team', 'employee'] },
  { id: '2', title: 'Contrato tipo empleado', description: 'Plantilla de contrato estándar para nuevos empleados.', category: 'contrato', uploadDate: '2026-03-10', author: 'Legal', fileType: 'doc', version: 1, downloads: 12, roles: ['admin', 'hr_team'] },
  { id: '3', title: 'Guía de onboarding', description: 'Manual de bienvenida para nuevos empleados con procesos y contactos clave.', category: 'general', uploadDate: '2026-03-05', author: 'People & Culture', fileType: 'pdf', version: 3, downloads: 89, roles: ['admin', 'hr_team', 'employee'] },
  { id: '4', title: 'Nómina febrero 2026', description: 'Nómina correspondiente al mes de febrero.', category: 'nomina', uploadDate: '2026-03-01', author: 'Payroll', fileType: 'pdf', version: 1, downloads: 156, roles: ['admin', 'hr_team', 'employee'] },
  { id: '5', title: 'Plan de formación 2026', description: 'Calendario y contenidos del plan de formación anual.', category: 'formacion', uploadDate: '2026-02-15', author: 'RRHH', fileType: 'pdf', version: 1, downloads: 34, roles: ['admin', 'hr_team', 'employee'] },
];

export const mockCourses: Course[] = [
  { id: '1', title: 'Prevención de riesgos laborales (PRL)', description: 'Curso obligatorio sobre seguridad y salud en el trabajo.', link: '#', duration: '4 horas', mandatory: true },
];

export const mockFAQs: FAQItem[] = [
  { id: '1', question: '¿Cómo cambio mi contraseña?', answer: 'Accede a "Configuración" > "Seguridad" > "Cambiar contraseña".' },
  { id: '2', question: '¿Qué hago si recibo un email sospechoso?', answer: 'No abras enlaces ni descargues archivos. Reenvía a seguridad@ccc.com.' },
  { id: '3', question: '¿Cómo conecto la VPN?', answer: 'Descarga el cliente VPN desde el portal de IT y usa tus credenciales corporativas.' },
  { id: '4', question: '¿Puedo instalar software en mi equipo?', answer: 'Solo software autorizado por IT. Envía solicitud a través del formulario de soporte.' },
];

export const mockBenefits: Benefit[] = [
  {
    id: 'b-formacion',
    title: 'Descuentos en formación',
    description: 'Accede a descuentos exclusivos en programas de formación, másteres y certificaciones profesionales con nuestras instituciones colaboradoras.',
    icon: 'GraduationCap',
    email: 'formacion@cursosccc.com',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600&q=80',
  },
  {
    id: 'b-club',
    title: 'Club de descuentos',
    description: 'Accede al portal exclusivo de Club de Beneficios CCC con descuentos en ocio, viajes, tecnología, salud y mucho más.',
    icon: 'Tag',
    email: 'club@cursosccc.com',
    image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&q=80',
    link: 'https://ccc.clubdebenefits.com/pages/index',
  },
];

export const mockOrgNodes: OrgNode[] = [];

export const mockHighlights: Highlight[] = [
  { id: '1', title: 'Nueva política de teletrabajo', description: 'Se amplía a 3 días semanales desde abril', link: '/comunicaciones', icon: 'Megaphone', order: 1, active: true },
  { id: '2', title: 'Cursos obligatorios', description: 'Completa tu formación antes del 30 de marzo', link: '/cursos', icon: 'GraduationCap', order: 2, active: true },
  { id: '3', title: 'Nuevos beneficios dentales', description: 'Cobertura dental incluida para todos', link: '/beneficios', icon: 'Heart', order: 3, active: true },
];

export const rolePermissions: Record<string, string[]> = {
  admin: [
    'view_profile', 'edit_profile_basic',
    'view_communications', 'manage_communications',
    'manage_users_status', 'manage_documents', 'manage_courses',
    'view_content', 'download_documents', 'open_support', 'manage_cms',
    'view_notifications',
  ],
  support: [
    'view_profile', 'edit_profile_basic',
    'view_communications', 'manage_communications',
    'manage_users_status', 'manage_documents', 'manage_courses',
    'view_content', 'download_documents', 'open_support', 'manage_cms',
    'view_notifications', 'view_history',
  ],
  hr_team: [
    'view_profile', 'edit_profile_basic',
    'view_communications', 'manage_communications',
    'manage_documents', 'manage_courses',
    'view_content', 'download_documents', 'open_support', 'manage_cms',
    'view_notifications',
  ],
  employee: ['view_profile', 'edit_profile_basic'],
};
