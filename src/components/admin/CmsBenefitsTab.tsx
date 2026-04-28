import { useState, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import DataTable from '@/components/shared/DataTable';
import FormDialog from '@/components/shared/FormDialog';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Benefit } from '@/types';
import { benefitIconLibrary, BENEFIT_ICON_COLOR, getBenefitIcon } from '@/lib/benefitIcons';

const emptyForm = { title: '', description: '', icon: 'Gift', email: '', image: '', link: '' };

export default function CmsBenefitsTab() {
  const { benefits, createBenefit, updateBenefit, removeBenefit } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Benefit | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const active = benefits.filter((b) => !b.archived);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (b: Benefit) => {
    setEditing(b);
    setForm({
      title: b.title, description: b.description, icon: b.icon,
      email: b.email || '', image: b.image || '', link: b.link || '',
    });
    setDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.email.trim()) {
      toast.error('El título y el correo son obligatorios');
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      icon: form.icon,
      email: form.email.trim(),
      image: form.image || undefined,
      link: form.link.trim() || undefined,
    };
    if (editing) { updateBenefit(editing.id, payload); toast.success('Beneficio actualizado'); }
    else { createBenefit(payload); toast.success('Beneficio creado'); }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="admin-hover-target gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Nuevo beneficio
        </Button>
      </div>
      <DataTable keyExtractor={(b) => b.id} data={active} columns={[
        { key: 'icon', header: '', render: (b) => {
          const Icon = getBenefitIcon(b.icon);
          return <Icon className="h-5 w-5" style={{ color: BENEFIT_ICON_COLOR }} />;
        }},
        { key: 'title', header: 'Beneficio', render: (b) => <span className="font-medium text-card-foreground">{b.title}</span> },
        { key: 'email', header: 'Correo', render: (b) => <span className="text-sm text-muted-foreground">{b.email}</span> },
        { key: 'description', header: 'Descripción', render: (b) => <span className="text-muted-foreground line-clamp-2">{b.description}</span> },
        { key: 'actions', header: 'Acciones', render: (b) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => openEdit(b)}>Editar</Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(b.id)}>Eliminar</Button>
          </div>
        )},
      ]} />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? 'Editar beneficio' : 'Nuevo beneficio'} onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Descripción</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Correo de contacto</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contacto@cursosccc.com" />
        </div>
        <div className="space-y-2">
          <Label>Enlace externo (opcional)</Label>
          <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label>Icono</Label>
          <div className="grid grid-cols-6 gap-2 p-2 rounded-lg border border-border bg-muted/40 max-h-40 overflow-y-auto">
            {benefitIconLibrary.map(({ name, Icon }) => {
              const selected = form.icon === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setForm({ ...form, icon: name })}
                  className={`flex items-center justify-center h-10 rounded-md border transition-all ${selected ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-card'}`}
                  title={name}
                >
                  <Icon className="h-5 w-5" style={{ color: BENEFIT_ICON_COLOR }} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Imagen</Label>
          {form.image ? (
            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
              <img src={form.image} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setForm({ ...form, image: '' })}
                className="absolute top-1 right-1 rounded-full bg-background/90 p-1 hover:bg-background"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button type="button" variant="outline" className="w-full gap-2" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" /> Subir imagen
            </Button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <Input
            value={form.image.startsWith('data:') ? '' : form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="O pega una URL de imagen"
          />
        </div>
      </FormDialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Eliminar beneficio" description="¿Estás seguro?" onConfirm={() => { removeBenefit(deleteId!); toast.success('Eliminado'); setDeleteId(null); }} confirmLabel="Eliminar" destructive />
    </div>
  );
}
