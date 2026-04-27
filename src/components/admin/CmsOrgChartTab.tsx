import { useMemo, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormDialog from '@/components/shared/FormDialog';
import { MapPin, Plus, Pencil, Trash2, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import type { OrgNode } from '@/types';

const CCC_SEDES = ['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao'];

function buildTree(nodes: OrgNode[]): (OrgNode & { children: any[] })[] {
  const map: Record<string, OrgNode & { children: any[] }> = {};
  const roots: (OrgNode & { children: any[] })[] = [];
  nodes.forEach((n) => { map[n.id] = { ...n, children: [] }; });
  nodes.forEach((n) => {
    if (n.parentId && map[n.parentId]) map[n.parentId].children.push(map[n.id]);
    else roots.push(map[n.id]);
  });
  return roots;
}

function EditableCard({
  node,
  canEdit,
  onEdit,
  onDelete,
}: {
  node: OrgNode & { children: any[] };
  canEdit: boolean;
  onEdit: (n: OrgNode) => void;
  onDelete: (id: string) => void;
}) {
  const initials = node.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const isSynth = node.id.startsWith('synth-');
  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="admin-hover-target relative rounded-xl border bg-card p-4 card-shadow text-center w-48">
        {canEdit && !isSynth && (
          <div className="absolute top-1 right-1 flex gap-0.5">
            <button onClick={() => onEdit(node)} className="p-1 rounded hover:bg-muted transition-colors" title="Editar">
              <Pencil className="h-3 w-3 text-muted-foreground" />
            </button>
            <button onClick={() => onDelete(node.id)} className="p-1 rounded hover:bg-destructive/10 transition-colors" title="Eliminar">
              <Trash2 className="h-3 w-3 text-destructive" />
            </button>
          </div>
        )}
        <Avatar className="mx-auto h-12 w-12 mb-2">
          {node.avatar && <AvatarImage src={node.avatar} />}
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <h4 className="font-semibold text-sm text-card-foreground">{node.name}</h4>
        <p className="text-xs text-primary font-medium">{node.role}</p>
        {node.office && (
          <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> Sede {node.office}
          </div>
        )}
      </div>
      {node.children.length > 0 && (
        <>
          <div className="w-px h-6 bg-border" />
          <div className="flex gap-3">
            {node.children.map((child: any) => (
              <div key={child.id} className="relative flex flex-col items-center">
                <div className="w-px h-6 bg-border" />
                <EditableCard node={child} canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function CmsOrgChartTab() {
  const { orgNodes, users, currentUser, createOrgNode, updateOrgNode, removeOrgNode } = useAppStore();
  const canEdit = currentUser.role === 'admin' || currentUser.role === 'support';

  // Mismo origen de datos que OrganigramaPage para sincronización en tiempo real
  const realActiveUsers = useMemo(
    () => users.filter((u) => u.active && u.status === 'activo'),
    [users]
  );

  const active = useMemo(() => {
    const matched = orgNodes.filter((n) => {
      if (n.archived) return false;
      return realActiveUsers.some((u) => u.name.toLowerCase() === n.name.toLowerCase());
    });
    const synthesized: OrgNode[] = realActiveUsers
      .filter((u) => !matched.some((n) => n.name.toLowerCase() === u.name.toLowerCase()))
      .map((u) => ({
        id: `synth-${u.id}`,
        name: u.name,
        role: u.cargo || u.role,
        department: u.department,
        office: u.office,
        avatar: u.avatar,
      }));
    return [...matched, ...synthesized];
  }, [orgNodes, realActiveUsers]);

  const tree = useMemo(() => buildTree(active), [active]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editNode, setEditNode] = useState<OrgNode | null>(null);
  const [form, setForm] = useState({ userId: '', role: '', parentId: '', office: '' });

  const availableUsers = users.filter(
    (u) => u.active && u.status === 'activo' && !active.some((n) => n.name.toLowerCase() === u.name.toLowerCase())
  );

  const openAdd = () => {
    setEditNode(null);
    setForm({ userId: '', role: '', parentId: '__none__', office: '' });
    setDialogOpen(true);
  };

  const openEdit = (node: OrgNode) => {
    setEditNode(node);
    setForm({ userId: '', role: node.role, parentId: node.parentId || '__none__', office: node.office || '' });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    removeOrgNode(id);
    toast.success('Nodo eliminado del organigrama');
  };

  const handleUserChange = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setForm(f => ({
      ...f,
      userId,
      role: user?.cargo || f.role,
      office: user?.office || f.office,
    }));
  };

  const handleSubmit = () => {
    if (editNode) {
      updateOrgNode(editNode.id, {
        role: form.role,
        office: form.office,
        parentId: form.parentId && form.parentId !== '__none__' ? form.parentId : undefined,
      });
      toast.success('Nodo actualizado');
    } else {
      const user = users.find((u) => u.id === form.userId);
      if (!user || !form.role) {
        toast.error('Selecciona un usuario y un cargo');
        return;
      }
      createOrgNode({
        name: user.name,
        role: form.role,
        department: user.department,
        office: form.office || user.office,
        avatar: user.avatar,
        parentId: form.parentId && form.parentId !== '__none__' ? form.parentId : undefined,
      });
      toast.success(`${user.name} añadido al organigrama`);
    }
    setDialogOpen(false);
    setEditNode(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-border bg-muted/40 p-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Settings2 className="h-4 w-4" />
          Edición del organigrama. Los cambios se reflejan automáticamente en la vista general.
        </div>
        {canEdit && (
          <Button className="admin-hover-target gap-2" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Agregar al organigrama
          </Button>
        )}
      </div>
      <div
        className="org-readonly-scroll rounded-xl border bg-card p-8 card-shadow"
        style={{ maxHeight: '70vh', overflow: 'auto' }}
      >
        <div className="flex justify-center gap-6 min-w-max">
          {tree.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8">No hay usuarios en el organigrama</p>
          ) : (
            tree.map((root) => (
              <EditableCard key={root.id} node={root} canEdit={canEdit} onEdit={openEdit} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editNode ? 'Editar nodo' : 'Agregar al organigrama'} onSubmit={handleSubmit}>
        {!editNode && (
          <div className="space-y-2">
            <Label>Usuario registrado</Label>
            <Select value={form.userId} onValueChange={handleUserChange}>
              <SelectTrigger><SelectValue placeholder="Selecciona un usuario" /></SelectTrigger>
              <SelectContent>
                {availableUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <Label>Cargo</Label>
          <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Cargo en el organigrama" />
        </div>
        <div className="space-y-2">
          <Label>Sede CCC</Label>
          <Select value={form.office} onValueChange={(v) => setForm({ ...form, office: v })}>
            <SelectTrigger><SelectValue placeholder="Selecciona una sede" /></SelectTrigger>
            <SelectContent>
              {CCC_SEDES.map((s) => (
                <SelectItem key={s} value={s}>Sede {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Jefe directo</Label>
          <Select value={form.parentId} onValueChange={(v) => setForm({ ...form, parentId: v })}>
            <SelectTrigger><SelectValue placeholder="Ninguno (raíz)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Ninguno (raíz)</SelectItem>
              {active.filter(n => n.id !== editNode?.id && !n.id.startsWith('synth-')).map((n) => (
                <SelectItem key={n.id} value={n.id}>{n.name} - {n.role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormDialog>
    </div>
  );
}
