import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import DataTable from '@/components/shared/DataTable';
import FormDialog from '@/components/shared/FormDialog';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Archive } from 'lucide-react';
import { toast } from 'sonner';
import type { Benefit } from '@/types';

export default function CmsBenefitsTab() {
  const { benefits, createBenefit, updateBenefit, archiveBenefit, removeBenefit } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Benefit | null>(null);
  const [form, setForm] = useState({ title: '', description: '', icon: 'Heart' });

  const active = benefits.filter((b) => !b.archived);

  const openCreate = () => { setEditing(null); setForm({ title: '', description: '', icon: 'Heart' }); setDialogOpen(true); };
  const openEdit = (b: Benefit) => { setEditing(b); setForm({ title: b.title, description: b.description, icon: b.icon }); setDialogOpen(true); };

  const handleSubmit = () => {
    if (!form.title) return;
    if (editing) { updateBenefit(editing.id, form); toast.success('Beneficio actualizado'); }
    else { createBenefit(form); toast.success('Beneficio creado'); }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" /> Nuevo beneficio</Button></div>
      <DataTable keyExtractor={(b) => b.id} data={active} columns={[
        { key: 'title', header: 'Beneficio', render: (b) => <span className="font-medium text-card-foreground">{b.title}</span> },
        { key: 'description', header: 'Descripción', render: (b) => <span className="text-muted-foreground line-clamp-2">{b.description}</span> },
        { key: 'actions', header: 'Acciones', render: (b) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => openEdit(b)}>Editar</Button>
            <Button variant="ghost" size="sm" onClick={() => { archiveBenefit(b.id); toast.success('Archivado'); }}><Archive className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(b.id)}>Eliminar</Button>
          </div>
        )},
      ]} />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? 'Editar beneficio' : 'Nuevo beneficio'} onSubmit={handleSubmit}>
        <div className="space-y-2"><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-2"><Label>Descripción</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
        <div className="space-y-2"><Label>Icono</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Heart, Gift, GraduationCap..." /></div>
      </FormDialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Eliminar beneficio" description="¿Estás seguro?" onConfirm={() => { removeBenefit(deleteId!); toast.success('Eliminado'); setDeleteId(null); }} confirmLabel="Eliminar" destructive />
    </div>
  );
}
