import type { Document } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, User } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

const categoryLabels: Record<string, string> = {
  contrato: 'Contrato',
  nomina: 'Nómina',
  politica: 'Política',
  formacion: 'Formación',
  general: 'General',
};

const categoryColors: Record<string, string> = {
  contrato: 'bg-info/10 text-info',
  nomina: 'bg-success/10 text-success',
  politica: 'bg-warning/10 text-warning',
  formacion: 'bg-primary/10 text-primary',
  general: 'bg-muted text-muted-foreground',
};

interface DocumentCardProps {
  document: Document;
  showDownload?: boolean;
}

export default function DocumentCard({ document: doc, showDownload = true }: DocumentCardProps) {
  const { incrementDownload } = useAppStore();

  const handleDownload = () => {
    incrementDownload(doc.id);
  };

  return (
    <div className="rounded-xl border bg-card p-5 card-shadow hover:card-shadow-hover transition-all">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-card-foreground text-sm">{doc.title}</h3>
            <Badge className={categoryColors[doc.category]}>{categoryLabels[doc.category]}</Badge>
            {doc.version > 1 && <Badge variant="outline" className="text-xs">v{doc.version}</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{doc.description}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {doc.uploadDate}</span>
            <span className="flex items-center gap-1"><User className="h-3 w-3" /> {doc.author}</span>
            <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {doc.downloads}</span>
          </div>
        </div>
        {showDownload && (
          <Button variant="outline" size="sm" className="flex-shrink-0 gap-1" onClick={handleDownload}>
            <Download className="h-4 w-4" /> Descargar
          </Button>
        )}
      </div>
    </div>
  );
}
