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
import { Switch } from '@/components/ui/switch';
import { Plus, Archive } from 'lucide-react';
import { toast } from 'sonner';
import type { Communication } from '@/types';

export default function CmsCommunicationsTab() {
  const { communications, createCommunication, updateCommunication, archiveCommunication, removeCommunication } = useAppStore();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Communication | null>(null);
  const [form, setForm] = useState({ title: '', content: '', author: '', pinned: false });

  const active = communications.filter((c) => !c.archived);
  const filtered = active.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditing(null); setForm({ title: '', content: '', author: '', pinned: false }); setDialogOpen(true); };
  const openEdit = (c: Communication) => { setEditing(c); setForm({ title: c.title, content: c.content, author: c.author, pinned: !!c.pinned }); setDialogOpen(true); };

  const handleSubmit = () => {
    if (!form.title || !form.content) return;
    if (editing) {
      updateCommunication(editing.id, form);
      toast.success('Comunicado actualizado');
    } else {
      createCommunication({ ...form, date: new Date().toISOString().split('T')[0] });
      toast.success('Comunicado publicado');
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <SearchFilter searchValue={search} onSearchChange={setSearch} searchPlaceholder="Buscar comunicado..." />
        <Button className="gap-2 flex-shrink-0" onClick={openCreate}><Plus className="h-4 w-4" /> Nuevo comunicado</Button>
      </div>

      <DataTable
        keyExtractor={(c) => c.id}
        data={filtered}
        columns={[
          {
            key: 'title', header: 'Título',
            render: (c) => (
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground">{c.title}</span>
                {c.pinned && <Badge className="bg-primary/10 text-primary text-xs">Destacado</Badge>}
              </div>
            ),
          },
          { key: 'author', header: 'Autor', render: (c) => <span className="text-muted-foreground">{c.author}</span> },
          { key: 'date', header: 'Fecha', render: (c) => <span className="text-muted-foreground">{c.date}</span> },
          {
            key: 'actions', header: 'Acciones',
            render: (c) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>Editar</Button>
                <Button variant="ghost" size="sm" onClick={() => { archiveCommunication(c.id); toast.success('Archivado'); }}><Archive className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(c.id)}>Eliminar</Button>
              </div>
            ),
          },
        ]}
      />

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? 'Editar comunicado' : 'Nuevo comunicado'} onSubmit={handleSubmit}>
        <div className="space-y-2"><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-2"><Label>Contenido</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} /></div>
        <div className="space-y-2"><Label>Autor</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
        <div className="flex items-center gap-2"><Switch checked={form.pinned} onCheckedChange={(v) => setForm({ ...form, pinned: v })} /><Label>Destacado</Label></div>
      </FormDialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Eliminar comunicado" description="¿Estás seguro?" onConfirm={() => { removeCommunication(deleteId!); toast.success('Eliminado'); setDeleteId(null); }} confirmLabel="Eliminar" destructive />
    </div>
  );
}
