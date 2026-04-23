import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import DataTable from '@/components/shared/DataTable';
import FormDialog from '@/components/shared/FormDialog';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import SearchFilter from '@/components/shared/SearchFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Document } from '@/types';

export default function CmsDocumentsTab() {
  const { documents, createDocument, updateDocument, removeDocument } = useAppStore();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Document | null>(null);
  const [form, setForm] = useState({ title: '', description: '', link: '' });

  const active = documents.filter((d) => !d.archived);
  const filtered = active.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditing(null); setForm({ title: '', description: '', link: '' }); setDialogOpen(true); };
  const openEdit = (d: Document) => { setEditing(d); setForm({ title: d.title, description: d.description, link: d.link || '' }); setDialogOpen(true); };

  const handleSubmit = () => {
    if (!form.title || !form.link) {
      toast.error('Título y enlace son obligatorios');
      return;
    }
    if (editing) {
      updateDocument(editing.id, { title: form.title, description: form.description, link: form.link, version: editing.version + 1 });
      toast.success('Documento actualizado');
    } else {
      createDocument({
        title: form.title,
        description: form.description,
        link: form.link,
        category: 'general',
        uploadDate: new Date().toISOString().split('T')[0],
        author: '',
        fileType: 'pdf',
        version: 1,
        downloads: 0,
        roles: ['admin', 'hr_team', 'employee', 'support'],
      });
      toast.success('Documento añadido');
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <SearchFilter searchValue={search} onSearchChange={setSearch} searchPlaceholder="Buscar documento..." />
        <Button className="gap-2 flex-shrink-0" onClick={openCreate}><Plus className="h-4 w-4" /> Subir documento</Button>
      </div>

      <DataTable
        keyExtractor={(d) => d.id}
        data={filtered}
        columns={[
          { key: 'title', header: 'Título', render: (d) => <span className="font-medium text-card-foreground">{d.title}</span> },
          { key: 'description', header: 'Descripción', render: (d) => <span className="text-muted-foreground line-clamp-1">{d.description}</span> },
          { key: 'link', header: 'Enlace', render: (d) => d.link ? <a href={d.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[200px] inline-block">{d.link}</a> : <span className="text-muted-foreground">—</span> },
          {
            key: 'actions', header: 'Acciones',
            render: (d) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(d)}>Editar</Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(d.id)}>Eliminar</Button>
              </div>
            ),
          },
        ]}
      />

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? 'Editar documento' : 'Añadir documento'} onSubmit={handleSubmit}>
        <div className="space-y-2"><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-2"><Label>Descripción</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
        <div className="space-y-2"><Label>Enlace</Label><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." /></div>
      </FormDialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Eliminar documento" description="¿Estás seguro?" onConfirm={() => { removeDocument(deleteId!); toast.success('Eliminado'); setDeleteId(null); }} confirmLabel="Eliminar" destructive />
    </div>
  );
}
