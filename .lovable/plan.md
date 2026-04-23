

## Reestructuración de usuarios, roles y permisos

Reset completo del sistema de cuentas con tres perfiles fijos, nuevo rol "Soporte", validación estricta de dominios, permisos refinados por rol y registro de auditoría.

### 1. Cuentas iniciales (password universal: `1234`)

Reemplazar `mockUsers` en `src/services/mockData.ts` por exactamente:

| Email | Rol | Estado |
|---|---|---|
| `usuariobase@cursosccc.com` | `employee` (User) | activo |
| `admin@cursosccc.com` | `admin` | activo |
| `soporte@cursosccc.com` | `support` | activo |

Añadir campo `password: string` al tipo `User` y verificarlo en `login()` (hoy se ignora). Bumpear el `name` del store de Zustand a `intranet-ccc-storage-v2` para forzar reseteo del `localStorage` existente.

### 2. Validación de dominios

Actualizar `src/lib/emailValidation.ts`:
- Dominios permitidos: `@cursosccc.com` y `@formacionprofesionalccc.com` (con `.com` obligatorio, no solo prefijo).
- Mensaje: "Solo se permiten correos @cursosccc.com o @formacionprofesionalccc.com".
- Aplicar en `LoginPage` (login + registro), `PerfilPage` (edición de email), `CmsUsersTab` (alta/edición admin).

### 3. Sistema de roles

Extender `UserRole` a `'admin' | 'support' | 'hr_team' | 'employee'` en `src/types/index.ts`.

Reescribir `rolePermissions` en `mockData.ts`:

| Permiso | employee | admin | support |
|---|---|---|---|
| `view_profile` / `edit_profile_basic` (foto + bio) | ✓ | ✓ | ✓ |
| `view_communications` | ✗ | ✓ | ✓ |
| `manage_communications` | ✗ | ✓ | ✓ |
| `manage_users_status` (activar/desactivar) | ✗ | ✓ | ✓ |
| `delete_users` | ✗ | ✗ | ✗ (nadie borra) |
| `manage_documents` | ✗ | ✓ | ✓ |
| `manage_courses` | ✗ | ✓ | ✓ |
| `view_history` (auditoría) | ✗ | ✗ | ✓ |
| `manage_cms` | ✗ | ✓ | ✓ |

### 4. Restricciones del usuario base

- **Sidebar** (`AppSidebar.tsx`): si `role === 'employee'`, ocultar todo excepto **Inicio** y **Mi perfil**. Filtrar `navItems` por permiso.
- **Header** (`AppHeader.tsx`): ocultar campana de notificaciones y entrada "Administración" para `employee`. La búsqueda global se oculta también para `employee`.
- **PerfilPage**: para `employee` deshabilitar campos distintos de foto y bio (nombre, email, cargo, departamento, sede como solo lectura).
- **AuthGuard por ruta**: añadir wrapper `<RoleGuard allowed={[...]}>` que redirige a `/perfil` si el rol no tiene acceso. Aplicar a `/comunicaciones`, `/admin`, `/cursos`, etc. para `employee`.
- **InicioPage**: ocultar bloque "Comunicados y noticias recientes" si el usuario no tiene `view_communications`.

### 5. Soft delete de usuarios (Admin/Support)

En `CmsUsersTab.tsx`:
- Eliminar botón "Eliminar" por completo.
- Sustituir por un `Switch` de estado activo/inactivo que llama a `updateUser(id, { active })`.
- Quitar de `useAppStore` cualquier llamada a `removeUser` desde la UI (mantener la función pero no exponerla).

### 6. Gestión de documentos (Admin/Support)

Pestaña ya existente `CmsDocumentsTab` — simplificar el formulario a tres campos:
- `título`, `descripción`, `enlace` (URL)

Adaptar `Document` en types: añadir `link?: string`. En la página pública de documentos / Inicio "Documentación relevante", renderizar el enlace tal cual.

### 7. Cursos obligatorios dinámicos

`CursosPage.tsx` actualmente usa array local `defaultCourses`. Cambiar a `useAppStore((s) => s.courses)` filtrando `mandatory && !archived`. El contador `X/N` se recalcula automáticamente al añadir/quitar desde `CmsCoursesTab`.

### 8. Pestaña "Historial" (solo Support)

Nuevo módulo de auditoría:

**Tipo nuevo** en `types/index.ts`:
```ts
export interface AuditEntry {
  id: string;
  action: 'create' | 'delete' | 'update' | 'activate' | 'deactivate';
  entity: 'user' | 'document' | 'course' | 'communication';
  entityName: string;
  performedBy: string;   // nombre
  performedById: string; // id
  date: string;          // ISO
}
```

**Store**: añadir `auditLog: AuditEntry[]` + acción `logAudit(entry)`. Persistir en `localStorage`. Llamar a `logAudit` desde:
- `createUser`, `updateUser` (cuando cambia `active`)
- `createDocument`, `removeDocument`
- `createCourse`, `removeCourse`
- `createCommunication`, `removeCommunication`

**UI**: nuevo componente `src/components/admin/CmsHistoryTab.tsx` con tabla (Fecha | Acción | Entidad | Nombre | Realizado por). Añadir tab condicional en `AdminPage.tsx` solo si `currentUser.role === 'support'`.

### 9. Notas técnicas

```text
src/
├── types/index.ts                 → +UserRole 'support', +AuditEntry, +password en User
├── lib/emailValidation.ts         → dominios .com estrictos
├── services/mockData.ts           → 3 usuarios fijos + rolePermissions reescrito
├── stores/useAppStore.ts          → password en login, auditLog, storage v2
├── components/layout/
│   ├── AppSidebar.tsx             → filtrado por permiso
│   └── AppHeader.tsx              → ocultar notif/admin a employee
├── components/admin/
│   ├── CmsUsersTab.tsx            → switch activo, sin botón eliminar
│   ├── CmsDocumentsTab.tsx        → form simplificado (título/desc/link)
│   ├── CmsCoursesTab.tsx          → ya existe, asegurar logAudit
│   └── CmsHistoryTab.tsx          → NUEVO, solo support
├── pages/
│   ├── AdminPage.tsx              → tab "Historial" condicional
│   ├── CursosPage.tsx             → consume store en vez de array local
│   ├── PerfilPage.tsx             → solo foto+bio editable para employee
│   └── LoginPage.tsx              → mensaje validación nuevo dominio
└── App.tsx                        → RoleGuard por ruta
```

**Migración localStorage**: cambiar el `name` del persist a `intranet-ccc-storage-v2` garantiza que los usuarios actuales en disco se descarten y se carguen los 3 nuevos.

