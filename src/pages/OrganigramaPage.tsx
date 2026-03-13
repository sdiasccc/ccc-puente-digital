import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import { MapPin } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

function OrgCard({ node }: { node: OrgNode & { children: any[] } }) {
  const initials = node.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-xl border bg-card p-4 card-shadow hover:card-shadow-hover transition-all text-center w-48">
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
          <div className="flex gap-4">
            {node.children.map((child: any) => (
              <div key={child.id} className="relative flex flex-col items-center">
                <div className="w-px h-6 bg-border" />
                <OrgCard node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OrganigramaPage() {
  const { orgNodes } = useAppStore();
  const active = orgNodes.filter((n) => !n.archived);
  const tree = buildTree(active);

  return (
    <div className="space-y-6">
      <PageHeader title="Organigrama" description="Estructura organizativa de CCC" />
      <div className="overflow-x-auto rounded-xl border bg-card p-8 card-shadow">
        <div className="flex justify-center min-w-[800px] gap-8">
          {tree.map((root) => (
            <OrgCard key={root.id} node={root} />
          ))}
        </div>
      </div>
    </div>
  );
}
