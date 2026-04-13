import { useState, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import { Megaphone, Paperclip, X, FileText, FileSpreadsheet, FileIcon, Download } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { CommunicationAttachment } from '@/types';

const ACCEPTED_TYPES = '.pdf,.mp4,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp';

function isImage(type: string) {
  return /^image\/(png|jpe?g|gif|webp)$/i.test(type);
}
function isVideo(type: string) {
  return /^video\/mp4$/i.test(type);
}
function isPdf(type: string) {
  return type === 'application/pdf';
}

function getDocIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['xls', 'xlsx'].includes(ext)) return <FileSpreadsheet className="h-5 w-5" />;
  if (['ppt', 'pptx'].includes(ext)) return <FileIcon className="h-5 w-5" />;
  return <FileText className="h-5 w-5" />;
}

function AttachmentPreview({ attachment }: { attachment: CommunicationAttachment }) {
  if (isImage(attachment.type)) {
    return (
      <img
        src={attachment.data}
        alt={attachment.name}
        className="mt-3 w-full rounded-lg border border-border object-cover max-h-[400px]"
      />
    );
  }
  if (isVideo(attachment.type)) {
    return (
      <video controls className="mt-3 w-full rounded-lg border border-border max-h-[400px]">
        <source src={attachment.data} type={attachment.type} />
      </video>
    );
  }
  if (isPdf(attachment.type)) {
    return (
      <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
        <FileText className="h-8 w-8 text-destructive flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-card-foreground truncate">{attachment.name}</p>
          <p className="text-xs text-muted-foreground">PDF</p>
        </div>
        <a href={attachment.data} download={attachment.name} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="gap-1">
            <Download className="h-3 w-3" /> Ver / Descargar
          </Button>
        </a>
      </div>
    );
  }
  // Other docs
  return (
    <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
      {getDocIcon(attachment.name)}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-card-foreground truncate">{attachment.name}</p>
      </div>
      <a href={attachment.data} download={attachment.name}>
        <Button size="sm" variant="outline" className="gap-1">
          <Download className="h-3 w-3" /> Descargar
        </Button>
      </a>
    </div>
  );
}

export default function ComunicacionesPage() {
  const { communications, currentUser, createCommunication } = useAppStore();
  const isAdmin = currentUser.role === 'admin';
  const active = communications.filter((c) => !c.archived);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<CommunicationAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('El archivo no puede superar los 10 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachment({
        name: file.name,
        type: file.type,
        data: ev.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePublish = () => {
    if (!newMessage.trim() && !attachment) return;
    createCommunication({
      title: '',
      content: newMessage.trim(),
      date: new Date().toISOString().split('T')[0],
      author: currentUser.name,
      authorRole: currentUser.department,
      authorAvatar: currentUser.avatar,
      attachment: attachment || undefined,
    });
    setNewMessage('');
    setAttachment(null);
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

          {/* Attachment area */}
          {attachment ? (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
              <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-card-foreground truncate flex-1">{attachment.name}</span>
              <button onClick={() => setAttachment(null)} className="text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Paperclip className="h-4 w-4" />
              Adjuntar archivo (imagen, PDF, vídeo o documento)
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={handleFileSelect}
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
                    {comm.authorAvatar && <AvatarImage src={comm.authorAvatar} />}
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
                    {comm.attachment && <AttachmentPreview attachment={comm.attachment} />}
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
