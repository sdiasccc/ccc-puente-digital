import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import DataTable from '@/components/shared/DataTable';
import FormDialog from '@/components/shared/FormDialog';
import SearchFilter from '@/components/shared/SearchFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { isValidCccEmail, EMAIL_VALIDATION_MESSAGE } from '@/lib/emailValidation';
import type { User, UserRole } from '@/types';

const roleLabels: Record<string, string> = { admin: 'Admin', support: 'Soporte', hr_team: 'RRHH', employee: 'Empleado' };

export default function CmsUsersTab() {
  const { users, createUser, updateUser, activateUser } = useAppStore();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', department: '', office: '', role: 'employee' as UserRole });

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', department: '', office: '', role: 'employee' });
    setDialogOpen(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, department: u.department, office: u.office, role: u.role });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    if (!isValidCccEmail(form.email)) {
      toast.error(EMAIL_VALIDATION_MESSAGE);
      return;
    }
    if (editing) {
      updateUser(editing.id, form);
      toast.success('Usuario actualizado');
    } else {
      createUser({ ...form, active: true, status: 'activo' });
      toast.success('Usuario creado');
    }
    setDialogOpen(false);
  };

  const handleActivate = (id: string) => {
    activateUser(id);
    toast.success('Usuario activado');
  };

  const toggleActive = (u: User, value: boolean) => {
    updateUser(u.id, { active: value });
    toast.success(value ? 'Usuario activado' : 'Usuario desactivado');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <SearchFilter searchValue={search} onSearchChange={setSearch} searchPlaceholder="Buscar usuario..." />
        <Button className="gap-2 flex-shrink-0" onClick={openCreate}><Plus className="h-4 w-4" /> Nuevo usuario</Button>
      </div>

      <DataTable
        keyExtractor={(u) => u.id}
        data={filtered}
        columns={[
          {
            key: 'user', header: 'Usuario',
            render: (u) => (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{u.name.split(' ').map(w => w[0]).join('').slice(0,2)}</AvatarFallback></Avatar>
                <div><p className="font-medium text-card-foreground">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
              </div>
            ),
          },
          { key: 'dept', header: 'Departamento', render: (u) => <span className="text-muted-foreground">{u.department}</span> },
          { key: 'role', header: 'Rol', render: (u) => <Badge variant="outline">{roleLabels[u.role]}</Badge> },
          {
            key: 'status', header: 'Estado',
            render: (u) => {
              if (u.status === 'pendiente') {
                return <Badge className="bg-warning/10 text-warning">Pendiente</Badge>;
              }
              return (
                <div className="flex items-center gap-2">
                  <Switch checked={u.active} onCheckedChange={(v) => toggleActive(u, v)} />
                  <span className="text-xs text-muted-foreground">{u.active ? 'Activo' : 'Inactivo'}</span>
                </div>
              );
            },
          },
          {
            key: 'actions', header: 'Acciones',
            render: (u) => (
              <div className="flex gap-1">
                {u.status === 'pendiente' && (
                  <Button variant="ghost" size="sm" className="text-success gap-1" onClick={() => handleActivate(u.id)}>
                    <CheckCircle className="h-3.5 w-3.5" /> Activar
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>Editar</Button>
              </div>
            ),
          },
        ]}
      />

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? 'Editar usuario' : 'Nuevo usuario'} onSubmit={handleSubmit}>
        <div className="space-y-2"><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="space-y-2"><Label>Departamento</Label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
        <div className="space-y-2"><Label>Oficina</Label><Input value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })} /></div>
        <div className="space-y-2">
          <Label>Rol</Label>
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="support">Soporte</SelectItem>
              <SelectItem value="hr_team">RRHH</SelectItem>
              <SelectItem value="employee">Empleado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormDialog>
    </div>
  );
}
