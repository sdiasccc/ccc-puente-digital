import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import DataTable from '@/components/shared/DataTable';
import FormDialog from '@/components/shared/FormDialog';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Highlight } from '@/types';

export default function CmsHighlightsTab() {
  const { highlights, createHighlight, updateHighlight, removeHighlight } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Highlight | null>(null);
  const [form, setForm] = useState({ title: '', description: '', link: '', icon: '', order: 0, active: true });

  const openCreate = () => { setEditing(null); setForm({ title: '', description: '', link: '', icon: '', order: highlights.length + 1, active: true }); setDialogOpen(true); };
  const openEdit = (h: Highlight) => { setEditing(h); setForm({ title: h.title, description: h.description, link: h.link || '', icon: h.icon || '', order: h.order, active: h.active }); setDialogOpen(true); };

  const handleSubmit = () => {
    if (!form.title) return;
    if (editing) { updateHighlight(editing.id, form); toast.success('Destacado actualizado'); }
    else { createHighlight(form); toast.success('Destacado creado'); }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" /> Nuevo destacado</Button></div>
      <DataTable keyExtractor={(h) => h.id} data={highlights} columns={[
        { key: 'title', header: 'Título', render: (h) => <span className="font-medium text-card-foreground">{h.title}</span> },
        { key: 'order', header: 'Orden', render: (h) => <span className="text-muted-foreground">{h.order}</span> },
        { key: 'active', header: 'Estado', render: (h) => <Badge className={h.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}>{h.active ? 'Activo' : 'Inactivo'}</Badge> },
        { key: 'actions', header: 'Acciones', render: (h) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => openEdit(h)}>Editar</Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(h.id)}>Eliminar</Button>
          </div>
        )},
      ]} />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? 'Editar destacado' : 'Nuevo destacado'} onSubmit={handleSubmit}>
        <div className="space-y-2"><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-2"><Label>Descripción</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="space-y-2"><Label>Enlace</Label><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/comunicaciones" /></div>
        <div className="space-y-2"><Label>Icono</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Megaphone, Heart..." /></div>
        <div className="space-y-2"><Label>Orden</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></div>
        <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} /><Label>Activo</Label></div>
      </FormDialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Eliminar destacado" description="¿Estás seguro?" onConfirm={() => { removeHighlight(deleteId!); toast.success('Eliminado'); setDeleteId(null); }} confirmLabel="Eliminar" destructive />
    </div>
  );
}
