import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import DataTable from '@/components/shared/DataTable';
import FormDialog from '@/components/shared/FormDialog';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { OrgNode } from '@/types';

export default function CmsOrgChartTab() {
  const { orgNodes, createOrgNode, updateOrgNode, removeOrgNode } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<OrgNode | null>(null);
  const [form, setForm] = useState({ name: '', role: '', department: '', office: '', parentId: '' });

  const active = orgNodes.filter((n) => !n.archived);

  const openCreate = () => { setEditing(null); setForm({ name: '', role: '', department: '', office: '', parentId: '' }); setDialogOpen(true); };
  const openEdit = (n: OrgNode) => { setEditing(n); setForm({ name: n.name, role: n.role, department: n.department, office: n.office, parentId: n.parentId || '' }); setDialogOpen(true); };

  const handleSubmit = () => {
    if (!form.name || !form.role) return;
    const data = { ...form, parentId: form.parentId || undefined };
    if (editing) { updateOrgNode(editing.id, data); toast.success('Nodo actualizado'); }
    else { createOrgNode(data); toast.success('Nodo creado'); }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" /> Nuevo nodo</Button></div>
      <DataTable keyExtractor={(n) => n.id} data={active} columns={[
        { key: 'name', header: 'Nombre', render: (n) => <span className="font-medium text-card-foreground">{n.name}</span> },
        { key: 'role', header: 'Cargo', render: (n) => <span className="text-muted-foreground">{n.role}</span> },
        { key: 'dept', header: 'Departamento', render: (n) => <span className="text-muted-foreground">{n.department}</span> },
        { key: 'office', header: 'Oficina', render: (n) => <span className="text-muted-foreground">{n.office}</span> },
        { key: 'parent', header: 'Reporta a', render: (n) => <span className="text-muted-foreground">{active.find(p => p.id === n.parentId)?.name || '—'}</span> },
        { key: 'actions', header: 'Acciones', render: (n) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => openEdit(n)}>Editar</Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(n.id)}>Eliminar</Button>
          </div>
        )},
      ]} />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? 'Editar nodo' : 'Nuevo nodo'} onSubmit={handleSubmit}>
        <div className="space-y-2"><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="space-y-2"><Label>Cargo</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
        <div className="space-y-2"><Label>Departamento</Label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
        <div className="space-y-2"><Label>Oficina</Label><Input value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })} /></div>
        <div className="space-y-2">
          <Label>Reporta a</Label>
          <Select value={form.parentId} onValueChange={(v) => setForm({ ...form, parentId: v })}>
            <SelectTrigger><SelectValue placeholder="Ninguno (raíz)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Ninguno (raíz)</SelectItem>
              {active.filter(n => n.id !== editing?.id).map(n => <SelectItem key={n.id} value={n.id}>{n.name} - {n.role}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </FormDialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Eliminar nodo" description="¿Estás seguro?" onConfirm={() => { removeOrgNode(deleteId!); toast.success('Eliminado'); setDeleteId(null); }} confirmLabel="Eliminar" destructive />
    </div>
  );
}
