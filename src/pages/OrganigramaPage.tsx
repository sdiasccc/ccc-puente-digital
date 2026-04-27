import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Lock } from 'lucide-react';
import type { OrgNode } from '@/types';

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

function OrgCard({
  node,
  focusedId,
  onSelect,
  registerRef,
}: {
  node: OrgNode & { children: any[] };
  focusedId: string | null;
  onSelect: (id: string) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
}) {
  const initials = node.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const isFocused = focusedId === node.id;

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div
        ref={(el) => registerRef(node.id, el)}
        onClick={() => onSelect(node.id)}
        className="relative rounded-xl border bg-card p-4 card-shadow hover:card-shadow-hover transition-all text-center w-48 cursor-pointer"
        style={isFocused ? { border: '2px solid #ef4444' } : undefined}
      >
        <Avatar className="mx-auto h-12 w-12 mb-2">
          {node.avatar && <AvatarImage src={node.avatar} />}
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <h4 className="font-semibold text-sm text-card-foreground">{node.name}</h4>
        <p className="text-xs text-primary font-medium">{node.role}</p>
        <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> Sede {node.office}
        </div>
      </div>
      {node.children.length > 0 && (
        <>
          <div className="w-px h-6 bg-border" />
          <div className="flex gap-3">
            {node.children.map((child: any) => (
              <div key={child.id} className="relative flex flex-col items-center">
                <div className="w-px h-6 bg-border" />
                <OrgCard node={child} focusedId={focusedId} onSelect={onSelect} registerRef={registerRef} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OrganigramaPage() {
  const { orgNodes, users, currentUser, completeOnboardingStep } = useAppStore();

  // Build org nodes from real users (active + activo). If a manual orgNode exists matching by name use it, else synthesize.
  const realActiveUsers = useMemo(
    () => users.filter((u) => u.active && u.status === 'activo'),
    [users]
  );

  const active = useMemo(() => {
    // Real orgNodes that match active users
    const matched = orgNodes.filter((n) => {
      if (n.archived) return false;
      return realActiveUsers.some((u) => u.name.toLowerCase() === n.name.toLowerCase());
    });
    // Synthesize nodes for active users not yet in the org chart
    const synthesized: OrgNode[] = realActiveUsers
      .filter((u) => !matched.some((n) => n.name.toLowerCase() === u.name.toLowerCase()))
      .map((u) => ({
        id: `synth-${u.id}`,
        name: u.name,
        role: u.cargo || u.role,
        department: u.department,
        office: u.office,
        avatar: u.avatar,
      }));
    return [...matched, ...synthesized];
  }, [orgNodes, realActiveUsers]);

  const [search, setSearch] = useState('');
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    completeOnboardingStep(currentUser.id, 'orgVisited');
  }, [currentUser.id, completeOnboardingStep]);

  const tree = useMemo(() => buildTree(active), [active]);

  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    nodeRefs.current[id] = el;
  }, []);

  const centerOnNode = useCallback((id: string) => {
    const el = nodeRefs.current[id];
    const container = scrollRef.current;
    if (!el || !container) return;
    const elRect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    const offsetLeft = el.offsetLeft - container.offsetLeft;
    const targetLeft = offsetLeft - container.clientWidth / 2 + elRect.width / 2;
    container.scrollTo({ left: targetLeft, behavior: 'smooth' });
    const offsetTop = el.offsetTop - container.offsetTop;
    const targetTop = offsetTop - container.clientHeight / 2 + elRect.height / 2;
    container.scrollTo({ top: targetTop, behavior: 'smooth' });
  }, []);

  // Auto-center on current user on first load
  useEffect(() => {
    if (active.length === 0) return;
    const myNode = active.find((n) => n.name.toLowerCase() === currentUser.name.toLowerCase());
    const targetId = myNode?.id || active[0].id;
    setFocusedId(targetId);
    // delay to allow DOM to render
    setTimeout(() => centerOnNode(targetId), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.length]);

  // When focus changes, scroll into center
  useEffect(() => {
    if (focusedId) centerOnNode(focusedId);
  }, [focusedId, centerOnNode]);

  // Search: when matches exactly one or first match, center on it
  useEffect(() => {
    if (!search.trim()) return;
    const match = active.find((n) => n.name.toLowerCase().includes(search.toLowerCase()));
    if (match) setFocusedId(match.id);
  }, [search, active]);

  // Arrow navigation: parent (up), first child (down), prev/next sibling (left/right)
  const navigate = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!focusedId) return;
    const current = active.find((n) => n.id === focusedId);
    if (!current) return;
    if (direction === 'up' && current.parentId) {
      setFocusedId(current.parentId);
      return;
    }
    if (direction === 'down') {
      const child = active.find((n) => n.parentId === current.id);
      if (child) setFocusedId(child.id);
      return;
    }
    const siblings = active.filter((n) => n.parentId === current.parentId);
    const idx = siblings.findIndex((n) => n.id === current.id);
    if (direction === 'left' && idx > 0) setFocusedId(siblings[idx - 1].id);
    if (direction === 'right' && idx < siblings.length - 1) setFocusedId(siblings[idx + 1].id);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Organigrama" description="Estructura organizativa de CCC" />

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        Vista <strong className="text-foreground">solo lectura</strong>. La edición de la estructura se realiza desde Administración → Organigrama.
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {/* Tree view with external arrow navigation */}
      <div className="space-y-2">
        {/* Top arrow (outside container) */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('up')}
            className="rounded-full bg-card border border-border p-2 card-shadow hover:bg-muted transition-colors"
            title="Arriba"
          >
            <ChevronUp className="h-5 w-5 text-foreground" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('left')}
            className="flex-shrink-0 rounded-full bg-card border border-border p-2 card-shadow hover:bg-muted transition-colors"
            title="Izquierda"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <div
            ref={scrollRef}
            className="org-scroll flex-1 rounded-xl border bg-card p-8 card-shadow scroll-smooth"
            style={{ maxHeight: '70vh', overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
          <style>{`.org-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div className="flex justify-center gap-6 min-w-max">
            {tree.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8">No hay usuarios en el organigrama</p>
            ) : (
              tree.map((root) => (
                <OrgCard
                  key={root.id}
                  node={root}
                  focusedId={focusedId}
                  onSelect={setFocusedId}
                  registerRef={registerRef}
                />
              ))
            )}
          </div>
          </div>
          <button
            onClick={() => navigate('right')}
            className="flex-shrink-0 rounded-full bg-card border border-border p-2 card-shadow hover:bg-muted transition-colors"
            title="Derecha"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('down')}
            className="rounded-full bg-card border border-border p-2 card-shadow hover:bg-muted transition-colors"
            title="Abajo"
          >
            <ChevronDown className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
