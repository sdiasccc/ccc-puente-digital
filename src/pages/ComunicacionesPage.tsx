import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import { Megaphone } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ComunicacionesPage() {
  const { communications, currentUser, createCommunication } = useAppStore();
  const isAdmin = currentUser.role === 'admin';
  const active = communications.filter((c) => !c.archived);
  const [newMessage, setNewMessage] = useState('');

  const handlePublish = () => {
    if (!newMessage.trim()) return;
    createCommunication({
      title: '',
      content: newMessage.trim(),
      date: new Date().toISOString().split('T')[0],
      author: currentUser.name,
      authorRole: currentUser.department,
      authorAvatar: currentUser.avatar,
    });
    setNewMessage('');
    toast.success('Comunicado publicado');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Comunicaciones" description="Comunicados internos y anuncios de la empresa" />

      {/* Admin: create panel */}
      {isAdmin && (
        <div className="rounded-xl border bg-card p-5 card-shadow space-y-3">
          <h3 className="font-semibold text-card-foreground">Añadir comunicado</h3>
          <Textarea
            placeholder="Escribe tu comunicado aquí..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={3}
          />
          <Button onClick={handlePublish} className="gap-2">
            <Megaphone className="h-4 w-4" /> Publicar
          </Button>
        </div>
      )}

      {/* List */}
      {active.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="h-12 w-12" />}
          title="Sin comunicados"
          description="No hay comunicados actualmente"
        />
      ) : (
        <div className="space-y-4">
          {active.map((comm) => {
            const initials = comm.author.split(' ').map(w => w[0]).join('').slice(0, 2);
            return (
              <div key={comm.id} className="rounded-xl border bg-card p-5 card-shadow hover:card-shadow-hover transition-all">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-card-foreground">{comm.author}</span>
                      {comm.authorRole && (
                        <span className="text-xs text-muted-foreground">· {comm.authorRole}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{comm.date}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{comm.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
