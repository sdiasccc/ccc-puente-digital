import { useState, useMemo, useEffect, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import FormDialog from '@/components/shared/FormDialog';
import { MapPin, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import type { OrgNode } from '@/types';

const ORG_ROLES = ['profesor', 'personal de IT', 'administrador'];

function buildTree(nodes: OrgNode[]): (OrgNode & { children: any[] })[] {
  const map: Record<string, OrgNode & { children: any[] }> = {};
  const roots: (OrgNode & { children: any[] })[] = [];
  nodes.forEach((n) => { map[n.id] = { ...n, children: [] }; });
  nodes.forEach((n) => {
    if (n.parentId && map[n.parentId]) map[n.parentId].children.push(map[n.id]);
    else roots.push(map[n.id]);
  });
  return roots;
}

function OrgCard({ node, search }: { node: OrgNode & { children: any[] }; search: string }) {
  const initials = node.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const highlighted = search && node.name.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className={`rounded-xl border bg-card p-4 card-shadow hover:card-shadow-hover transition-all text-center w-44 ${highlighted ? 'ring-2 ring-primary' : ''}`}>
        <Avatar className="mx-auto h-12 w-12 mb-2">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <h4 className="font-semibold text-sm text-card-foreground">{node.name}</h4>
        <p className="text-xs text-primary font-medium">{node.role}</p>
        <p className="text-xs text-muted-foreground">{node.department}</p>
        <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {node.office}
        </div>
      </div>
      {node.children.length > 0 && (
        <>
          <div className="w-px h-6 bg-border" />
          <div className="flex gap-3">
            {node.children.map((child: any) => (
              <div key={child.id} className="relative flex flex-col items-center">
                <div className="w-px h-6 bg-border" />
                <OrgCard node={child} search={search} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OrganigramaPage() {
  const { orgNodes, users, currentUser, createOrgNode, completeOnboardingStep } = useAppStore();
  const isAdmin = currentUser.role === 'admin';
  const active = orgNodes.filter((n) => !n.archived);

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ userId: '', role: '', parentId: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    completeOnboardingStep(currentUser.id, 'orgVisited');
  }, [currentUser.id, completeOnboardingStep]);

  const tree = useMemo(() => buildTree(active), [active]);

  const availableUsers = users.filter(
    (u) => u.active && !active.some((n) => n.name === u.name)
  );

  const handleAdd = () => {
    const user = users.find((u) => u.id === form.userId);
    if (!user || !form.role) return;
    createOrgNode({
      name: user.name,
      role: form.role,
      department: user.department,
      office: user.office,
      parentId: form.parentId || undefined,
    });
    toast.success(`${user.name} añadido al organigrama`);
    setDialogOpen(false);
    setForm({ userId: '', role: '', parentId: '' });
  };

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

  return (
    <div className="space-y-6">
      <PageHeader title="Organigrama" description="Estructura organizativa de CCC" />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {isAdmin && (
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Agregar al organigrama
          </Button>
        )}
      </div>

      {/* Tree view with horizontal scroll arrows */}
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card border border-border p-2 card-shadow hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card border border-border p-2 card-shadow hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>

        <div ref={scrollRef} className="overflow-x-auto rounded-xl border bg-card p-8 card-shadow scroll-smooth mx-8">
          <div className="flex justify-center gap-6 min-w-max">
            {tree.map((root) => (
              <OrgCard key={root.id} node={root} search={search} />
            ))}
          </div>
        </div>
      </div>

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title="Agregar al organigrama" onSubmit={handleAdd}>
        <div className="space-y-2">
          <Label>Usuario registrado</Label>
          <Select value={form.userId} onValueChange={(v) => setForm({ ...form, userId: v })}>
            <SelectTrigger><SelectValue placeholder="Selecciona un usuario" /></SelectTrigger>
            <SelectContent>
              {availableUsers.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Rol en el organigrama</Label>
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
            <SelectTrigger><SelectValue placeholder="Selecciona un rol" /></SelectTrigger>
            <SelectContent>
              {ORG_ROLES.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Reporta a</Label>
          <Select value={form.parentId} onValueChange={(v) => setForm({ ...form, parentId: v })}>
            <SelectTrigger><SelectValue placeholder="Ninguno (raíz)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Ninguno (raíz)</SelectItem>
              {active.map((n) => (
                <SelectItem key={n.id} value={n.id}>{n.name} - {n.role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormDialog>
    </div>
  );
}
