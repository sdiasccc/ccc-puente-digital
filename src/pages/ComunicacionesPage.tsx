import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Paperclip, Pin } from 'lucide-react';

export default function ComunicacionesPage() {
  const { communications } = useAppStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comunicaciones"
        description="Comunicados internos y anuncios de la empresa"
      />

      <div className="space-y-4">
        {communications.map((comm) => (
          <div
            key={comm.id}
            className="rounded-xl border bg-card p-6 card-shadow hover:card-shadow-hover transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-card-foreground">{comm.title}</h3>
                    {comm.pinned && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary gap-1">
                        <Pin className="h-3 w-3" /> Destacado
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{comm.content}</p>
                  {comm.attachments && comm.attachments.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Paperclip className="h-3 w-3" />
                      <span>{comm.attachments.length} archivo(s) adjunto(s)</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-muted-foreground">{comm.date}</p>
                <p className="text-xs text-muted-foreground">{comm.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
