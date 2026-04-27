import { useMemo } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Lock, MapPin } from 'lucide-react';
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

function ReadOnlyCard({ node }: { node: OrgNode & { children: any[] } }) {
  const initials = node.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="rounded-xl border bg-card p-4 card-shadow text-center w-48 cursor-not-allowed select-none opacity-95">
        <Avatar className="mx-auto h-12 w-12 mb-2">
          {node.avatar && <AvatarImage src={node.avatar} />}
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <h4 className="font-semibold text-sm text-card-foreground">{node.name}</h4>
        <p className="text-xs text-primary font-medium">{node.role}</p>
        {node.office && (
          <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> Sede {node.office}
          </div>
        )}
      </div>
      {node.children.length > 0 && (
        <>
          <div className="w-px h-6 bg-border" />
          <div className="flex gap-3">
            {node.children.map((child: any) => (
              <div key={child.id} className="relative flex flex-col items-center">
                <div className="w-px h-6 bg-border" />
                <ReadOnlyCard node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function CmsOrgChartTab() {
  const { orgNodes, users } = useAppStore();

  // Mismo origen de datos que OrganigramaPage para sincronización en tiempo real
  const realActiveUsers = useMemo(
    () => users.filter((u) => u.active && u.status === 'activo'),
    [users]
  );

  const active = useMemo(() => {
    const matched = orgNodes.filter((n) => {
      if (n.archived) return false;
      return realActiveUsers.some((u) => u.name.toLowerCase() === n.name.toLowerCase());
    });
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

  const tree = useMemo(() => buildTree(active), [active]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        Vista sincronizada en tiempo real con el organigrama principal. <strong className="text-foreground">Solo lectura</strong> — para editar, usa la sección Organigrama.
      </div>
      <div
        className="org-readonly-scroll rounded-xl border bg-card p-8 card-shadow"
        style={{ maxHeight: '70vh', overflow: 'auto' }}
      >
        <div className="flex justify-center gap-6 min-w-max">
          {tree.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8">No hay usuarios en el organigrama</p>
          ) : (
            tree.map((root) => <ReadOnlyCard key={root.id} node={root} />)
          )}
        </div>
      </div>
    </div>
  );
}
