import { useAppStore } from '@/stores/useAppStore';
import DataTable from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/shared/EmptyState';
import { History } from 'lucide-react';
import type { AuditAction, AuditEntity } from '@/types';

const actionLabels: Record<AuditAction, string> = {
  create: 'Creado',
  delete: 'Eliminado',
  update: 'Actualizado',
  activate: 'Activado',
  deactivate: 'Desactivado',
};

const entityLabels: Record<AuditEntity, string> = {
  user: 'Usuario',
  document: 'Documento',
  course: 'Curso',
  communication: 'Comunicado',
};

const actionColor: Record<AuditAction, string> = {
  create: 'bg-success/10 text-success',
  delete: 'bg-destructive/10 text-destructive',
  update: 'bg-info/10 text-info',
  activate: 'bg-success/10 text-success',
  deactivate: 'bg-warning/10 text-warning',
};

export default function CmsHistoryTab() {
  const auditLog = useAppStore((s) => s.auditLog);

  if (!auditLog || auditLog.length === 0) {
    return <EmptyState icon={<History className="h-12 w-12" />} title="Sin registros" description="Aún no se ha registrado ninguna acción en el historial." />;
  }

  return (
    <div className="space-y-4">
      <DataTable
        keyExtractor={(e) => e.id}
        data={auditLog}
        columns={[
          { key: 'date', header: 'Fecha', render: (e) => <span className="text-muted-foreground text-sm">{new Date(e.date).toLocaleString('es-ES')}</span> },
          { key: 'action', header: 'Acción', render: (e) => <Badge className={actionColor[e.action]}>{actionLabels[e.action]}</Badge> },
          { key: 'entity', header: 'Tipo', render: (e) => <span className="text-card-foreground">{entityLabels[e.entity]}</span> },
          { key: 'name', header: 'Elemento', render: (e) => <span className="font-medium text-card-foreground">{e.entityName}</span> },
          { key: 'by', header: 'Realizado por', render: (e) => <span className="text-muted-foreground">{e.performedBy}</span> },
        ]}
      />
    </div>
  );
}