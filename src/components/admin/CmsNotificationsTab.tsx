import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import DataTable from '@/components/shared/DataTable';
import FormDialog from '@/components/shared/FormDialog';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Notification, NotificationType } from '@/types';

const typeLabels: Record<string, string> = { info: 'Info', warning: 'Aviso', success: 'Éxito' };
const typeColors: Record<string, string> = { info: 'bg-info/10 text-info', warning: 'bg-warning/10 text-warning', success: 'bg-success/10 text-success' };

export default function CmsNotificationsTab() {
  const { notifications, createNotification, removeNotification } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' as NotificationType });

  const handleSubmit = () => {
    if (!form.title || !form.message) return;
    createNotification({ ...form, date: new Date().toISOString().split('T')[0], read: false });
    toast.success('Notificación enviada');
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button className="gap-2" onClick={() => { setForm({ title: '', message: '', type: 'info' }); setDialogOpen(true); }}><Plus className="h-4 w-4" /> Nueva notificación</Button></div>
      <DataTable keyExtractor={(n) => n.id} data={notifications} columns={[
        { key: 'title', header: 'Título', render: (n) => <span className="font-medium text-card-foreground">{n.title}</span> },
        { key: 'type', header: 'Tipo', render: (n) => <Badge className={typeColors[n.type]}>{typeLabels[n.type]}</Badge> },
        { key: 'date', header: 'Fecha', render: (n) => <span className="text-muted-foreground">{n.date}</span> },
        { key: 'read', header: 'Leída', render: (n) => <Badge variant="outline">{n.read ? 'Sí' : 'No'}</Badge> },
        { key: 'actions', header: 'Acciones', render: (n) => (
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(n.id)}>Eliminar</Button>
        )},
      ]} />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title="Nueva notificación" onSubmit={handleSubmit}>
        <div className="space-y-2"><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-2"><Label>Mensaje</Label><Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} /></div>
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as NotificationType })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Aviso</SelectItem>
              <SelectItem value="success">Éxito</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormDialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Eliminar notificación" description="¿Estás seguro?" onConfirm={() => { removeNotification(deleteId!); toast.success('Eliminada'); setDeleteId(null); }} confirmLabel="Eliminar" destructive />
    </div>
  );
}
