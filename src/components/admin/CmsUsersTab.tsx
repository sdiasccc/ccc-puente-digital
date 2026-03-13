import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import DataTable from '@/components/shared/DataTable';
import FormDialog from '@/components/shared/FormDialog';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import SearchFilter from '@/components/shared/SearchFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { User, UserRole } from '@/types';

const roleLabels: Record<string, string> = { admin: 'Admin', hr_team: 'RRHH', employee: 'Empleado' };

export default function CmsUsersTab() {
  const { users, createUser, updateUser, removeUser } = useAppStore();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
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
    if (editing) {
      updateUser(editing.id, form);
      toast.success('Usuario actualizado');
    } else {
      createUser({ ...form, active: true });
      toast.success('Usuario creado');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      removeUser(deleteId);
      toast.success('Usuario eliminado');
      setDeleteId(null);
    }
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
            render: (u) => <Badge className={u.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}>{u.active ? 'Activo' : 'Inactivo'}</Badge>,
          },
          {
            key: 'actions', header: 'Acciones',
            render: (u) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>Editar</Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(u.id)}>Eliminar</Button>
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
              <SelectItem value="hr_team">RRHH</SelectItem>
              <SelectItem value="employee">Empleado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormDialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Eliminar usuario" description="¿Estás seguro de que quieres eliminar este usuario?" onConfirm={handleDelete} confirmLabel="Eliminar" destructive />
    </div>
  );
}
