import type { User, Notification, Communication, Document, Course, FAQItem, Benefit, OrgNode, Highlight } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Carlos García',
  email: 'carlos.garcia@ccc.com',
  department: 'Tecnología',
  office: 'Madrid',
  role: 'admin',
  active: true,
  status: 'activo',
};

export const mockUsers: User[] = [
  mockUser,
  { id: '2', name: 'María Fernández', email: 'maria@ccc.com', department: 'RRHH', office: 'Madrid', role: 'hr_team', active: true, status: 'activo' },
  { id: '3', name: 'Pedro López', email: 'pedro@ccc.com', department: 'Tecnología', office: 'Madrid', role: 'employee', active: true, status: 'activo' },
  { id: '4', name: 'Laura Sánchez', email: 'laura@ccc.com', department: 'Diseño', office: 'Barcelona', role: 'employee', active: false, status: 'activo' },
];

export const mockNotifications: Notification[] = [];

export const mockCommunications: Communication[] = [];

export const mockDocuments: Document[] = [
  { id: '1', title: 'Política de teletrabajo 2026', description: 'Normativa actualizada sobre trabajo remoto y horarios flexibles.', category: 'politica', uploadDate: '2026-03-13', author: 'RRHH', fileType: 'pdf', version: 2, downloads: 45, roles: ['admin', 'hr_team', 'employee'] },
  { id: '2', title: 'Contrato tipo empleado', description: 'Plantilla de contrato estándar para nuevos empleados.', category: 'contrato', uploadDate: '2026-03-10', author: 'Legal', fileType: 'doc', version: 1, downloads: 12, roles: ['admin', 'hr_team'] },
  { id: '3', title: 'Guía de onboarding', description: 'Manual de bienvenida para nuevos empleados con procesos y contactos clave.', category: 'general', uploadDate: '2026-03-05', author: 'People & Culture', fileType: 'pdf', version: 3, downloads: 89, roles: ['admin', 'hr_team', 'employee'] },
  { id: '4', title: 'Nómina Febrero 2026', description: 'Nómina correspondiente al mes de febrero.', category: 'nomina', uploadDate: '2026-03-01', author: 'Payroll', fileType: 'pdf', version: 1, downloads: 156, roles: ['admin', 'hr_team', 'employee'] },
  { id: '5', title: 'Plan de formación 2026', description: 'Calendario y contenidos del plan de formación anual.', category: 'formacion', uploadDate: '2026-02-15', author: 'RRHH', fileType: 'pdf', version: 1, downloads: 34, roles: ['admin', 'hr_team', 'employee'] },
];

export const mockCourses: Course[] = [
  { id: '1', title: 'Prevención de Riesgos Laborales (PRL)', description: 'Curso obligatorio sobre seguridad y salud en el trabajo.', link: '#', duration: '4 horas', mandatory: true },
  { id: '2', title: 'Protección de Datos (RGPD)', description: 'Formación sobre el Reglamento General de Protección de Datos.', link: '#', duration: '2 horas', mandatory: true },
  { id: '3', title: 'Código Ético y Compliance', description: 'Principios éticos de la empresa y normativa de cumplimiento.', link: '#', duration: '1.5 horas', mandatory: true },
  { id: '4', title: 'Ciberseguridad Básica', description: 'Buenas prácticas en seguridad informática.', link: '#', duration: '2 horas', mandatory: true },
  { id: '5', title: 'Acoso Laboral y Diversidad', description: 'Protocolo contra el acoso laboral e igualdad de género.', link: '#', duration: '1.5 horas', mandatory: true },
];

export const mockFAQs: FAQItem[] = [
  { id: '1', question: '¿Cómo cambio mi contraseña?', answer: 'Accede a "Configuración" > "Seguridad" > "Cambiar contraseña".' },
  { id: '2', question: '¿Qué hago si recibo un email sospechoso?', answer: 'No abras enlaces ni descargues archivos. Reenvía a seguridad@ccc.com.' },
  { id: '3', question: '¿Cómo conecto la VPN?', answer: 'Descarga el cliente VPN desde el portal de IT y usa tus credenciales corporativas.' },
  { id: '4', question: '¿Puedo instalar software en mi equipo?', answer: 'Solo software autorizado por IT. Envía solicitud a través del formulario de soporte.' },
];

export const mockBenefits: Benefit[] = [
  { id: '1', title: 'Seguro médico privado', description: 'Cobertura médica completa con posibilidad de incluir familiares.', icon: 'Heart' },
  { id: '2', title: 'Formación continua', description: 'Descuentos de hasta el 50% en másteres y certificaciones.', icon: 'GraduationCap' },
  { id: '3', title: 'Programa de bienestar', description: 'Acceso a gimnasio, mindfulness y programa de salud mental.', icon: 'Dumbbell' },
  { id: '4', title: 'Retribución flexible', description: 'Ticket restaurante, transporte, guardería y seguro médico.', icon: 'Gift' },
];

export const mockOrgNodes: OrgNode[] = [
  { id: '1', name: 'Ana Martínez', role: 'CEO', department: 'Dirección General', office: 'Madrid' },
  { id: '2', name: 'Pedro López', role: 'Director de Tecnología', department: 'Tecnología', office: 'Madrid', parentId: '1' },
  { id: '3', name: 'María Fernández', role: 'Directora de RRHH', department: 'RRHH', office: 'Madrid', parentId: '1' },
  { id: '4', name: 'Luis Moreno', role: 'Director Comercial', department: 'Comercial', office: 'Barcelona', parentId: '1' },
  { id: '5', name: 'Carlos García', role: 'Lead Developer', department: 'Tecnología', office: 'Madrid', parentId: '2' },
  { id: '6', name: 'Laura Sánchez', role: 'Diseñadora UX', department: 'Tecnología', office: 'Barcelona', parentId: '2' },
  { id: '7', name: 'Javier Ruiz', role: 'Técnico de RRHH', department: 'RRHH', office: 'Madrid', parentId: '3' },
  { id: '8', name: 'Elena Torres', role: 'Formación', department: 'RRHH', office: 'Sevilla', parentId: '3' },
  { id: '9', name: 'Sara Jiménez', role: 'Account Manager', department: 'Comercial', office: 'Barcelona', parentId: '4' },
  { id: '10', name: 'Diego Navarro', role: 'Sales Rep', department: 'Comercial', office: 'Valencia', parentId: '4' },
];

export const mockHighlights: Highlight[] = [
  { id: '1', title: 'Nueva política de teletrabajo', description: 'Se amplía a 3 días semanales desde abril', link: '/comunicaciones', icon: 'Megaphone', order: 1, active: true },
  { id: '2', title: 'Cursos obligatorios', description: 'Completa tu formación antes del 30 de marzo', link: '/cursos', icon: 'GraduationCap', order: 2, active: true },
  { id: '3', title: 'Nuevos beneficios dentales', description: 'Cobertura dental incluida para todos', link: '/beneficios', icon: 'Heart', order: 3, active: true },
];

export const rolePermissions: Record<string, string[]> = {
  admin: ['manage_users', 'publish_communications', 'upload_documents', 'manage_notifications', 'edit_orgchart', 'view_content', 'download_documents', 'open_support', 'manage_cms'],
  hr_team: ['publish_communications', 'upload_documents', 'manage_benefits', 'manage_training', 'view_content', 'download_documents', 'open_support', 'manage_cms'],
  employee: ['view_content', 'download_documents', 'open_support'],
};
