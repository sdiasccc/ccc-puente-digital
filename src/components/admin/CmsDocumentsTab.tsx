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
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Archive } from 'lucide-react';
import { toast } from 'sonner';
import type { Document, DocumentCategory } from '@/types';

const categoryLabels: Record<string, string> = { contrato: 'Contrato', nomina: 'Nómina', politica: 'Política', formacion: 'Formación', general: 'General' };

export default function CmsDocumentsTab() {
  const { documents, createDocument, updateDocument, archiveDocument, removeDocument } = useAppStore();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Document | null>(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'general' as DocumentCategory, author: '', fileType: 'pdf' as 'pdf' | 'doc' | 'image' });

  const active = documents.filter((d) => !d.archived);
  const filtered = active.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditing(null); setForm({ title: '', description: '', category: 'general', author: '', fileType: 'pdf' }); setDialogOpen(true); };
  const openEdit = (d: Document) => { setEditing(d); setForm({ title: d.title, description: d.description, category: d.category, author: d.author, fileType: d.fileType }); setDialogOpen(true); };

  const handleSubmit = () => {
    if (!form.title) return;
    if (editing) {
      updateDocument(editing.id, { ...form, version: editing.version + 1 });
      toast.success('Documento actualizado (nueva versión)');
    } else {
      createDocument({ ...form, uploadDate: new Date().toISOString().split('T')[0], version: 1, downloads: 0, roles: ['admin', 'hr_team', 'employee'] });
      toast.success('Documento subido');
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
          { key: 'category', header: 'Categoría', render: (d) => <Badge variant="outline">{categoryLabels[d.category]}</Badge> },
          { key: 'version', header: 'Versión', render: (d) => <span className="text-muted-foreground">v{d.version}</span> },
          { key: 'downloads', header: 'Descargas', render: (d) => <span className="text-muted-foreground">{d.downloads}</span> },
          { key: 'date', header: 'Fecha', render: (d) => <span className="text-muted-foreground">{d.uploadDate}</span> },
          {
            key: 'actions', header: 'Acciones',
            render: (d) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(d)}>Editar</Button>
                <Button variant="ghost" size="sm" onClick={() => { archiveDocument(d.id); toast.success('Archivado'); }}><Archive className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(d.id)}>Eliminar</Button>
              </div>
            ),
          },
        ]}
      />

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? 'Editar documento' : 'Subir documento'} onSubmit={handleSubmit}>
        <div className="space-y-2"><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-2"><Label>Descripción</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as DocumentCategory })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Autor</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
      </FormDialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Eliminar documento" description="¿Estás seguro?" onConfirm={() => { removeDocument(deleteId!); toast.success('Eliminado'); setDeleteId(null); }} confirmLabel="Eliminar" destructive />
    </div>
  );
}
