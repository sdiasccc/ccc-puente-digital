import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import DataTable from '@/components/shared/DataTable';
import FormDialog from '@/components/shared/FormDialog';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Course } from '@/types';

export default function CmsCoursesTab() {
  const { courses, createCourse, updateCourse, archiveCourse, removeCourse } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState({ title: '', description: '', link: '', duration: '', mandatory: true });

  const active = courses.filter((c) => !c.archived);

  const openCreate = () => { setEditing(null); setForm({ title: '', description: '', link: '', duration: '', mandatory: true }); setDialogOpen(true); };
  const openEdit = (c: Course) => { setEditing(c); setForm({ title: c.title, description: c.description, link: c.link, duration: c.duration, mandatory: c.mandatory }); setDialogOpen(true); };

  const handleSubmit = () => {
    if (!form.title) return;
    if (editing) { updateCourse(editing.id, form); toast.success('Curso actualizado'); }
    else { createCourse(form); toast.success('Curso creado'); }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" /> Nuevo curso</Button></div>
      <DataTable keyExtractor={(c) => c.id} data={active} columns={[
        { key: 'title', header: 'Curso', render: (c) => <span className="font-medium text-card-foreground">{c.title}</span> },
        { key: 'duration', header: 'Duración', render: (c) => <span className="text-muted-foreground">{c.duration}</span> },
        { key: 'mandatory', header: 'Obligatorio', render: (c) => <Badge className={c.mandatory ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}>{c.mandatory ? 'Sí' : 'No'}</Badge> },
        { key: 'actions', header: 'Acciones', render: (c) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>Editar</Button>
            <Button variant="ghost" size="sm" onClick={() => { archiveCourse(c.id); toast.success('Archivado'); }}><Archive className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(c.id)}>Eliminar</Button>
          </div>
        )},
      ]} />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? 'Editar curso' : 'Nuevo curso'} onSubmit={handleSubmit}>
        <div className="space-y-2"><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-2"><Label>Descripción</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
        <div className="space-y-2"><Label>Enlace</Label><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." /></div>
        <div className="space-y-2"><Label>Duración</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="2 horas" /></div>
        <div className="flex items-center gap-2"><Switch checked={form.mandatory} onCheckedChange={(v) => setForm({ ...form, mandatory: v })} /><Label>Obligatorio</Label></div>
      </FormDialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Eliminar curso" description="¿Estás seguro?" onConfirm={() => { removeCourse(deleteId!); toast.success('Eliminado'); setDeleteId(null); }} confirmLabel="Eliminar" destructive />
    </div>
  );
}
