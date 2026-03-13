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
import type { FAQItem } from '@/types';

export default function CmsFaqTab() {
  const { faqs, createFAQ, updateFAQ, archiveFAQ, removeFAQ } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [form, setForm] = useState({ question: '', answer: '' });

  const active = faqs.filter((f) => !f.archived);

  const openCreate = () => { setEditing(null); setForm({ question: '', answer: '' }); setDialogOpen(true); };
  const openEdit = (f: FAQItem) => { setEditing(f); setForm({ question: f.question, answer: f.answer }); setDialogOpen(true); };

  const handleSubmit = () => {
    if (!form.question || !form.answer) return;
    if (editing) { updateFAQ(editing.id, form); toast.success('FAQ actualizada'); }
    else { createFAQ(form); toast.success('FAQ creada'); }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" /> Nueva FAQ</Button></div>
      <DataTable keyExtractor={(f) => f.id} data={active} columns={[
        { key: 'question', header: 'Pregunta', render: (f) => <span className="font-medium text-card-foreground">{f.question}</span> },
        { key: 'answer', header: 'Respuesta', render: (f) => <span className="text-muted-foreground line-clamp-2">{f.answer}</span> },
        { key: 'actions', header: 'Acciones', render: (f) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => openEdit(f)}>Editar</Button>
            <Button variant="ghost" size="sm" onClick={() => { archiveFAQ(f.id); toast.success('Archivada'); }}><Archive className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(f.id)}>Eliminar</Button>
          </div>
        )},
      ]} />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? 'Editar FAQ' : 'Nueva FAQ'} onSubmit={handleSubmit}>
        <div className="space-y-2"><Label>Pregunta</Label><Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></div>
        <div className="space-y-2"><Label>Respuesta</Label><Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} /></div>
      </FormDialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Eliminar FAQ" description="¿Estás seguro?" onConfirm={() => { removeFAQ(deleteId!); toast.success('Eliminada'); setDeleteId(null); }} confirmLabel="Eliminar" destructive />
    </div>
  );
}
