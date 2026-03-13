import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import InfoCard from '@/components/shared/InfoCard';
import DocumentCard from '@/components/shared/DocumentCard';
import { Badge } from '@/components/ui/badge';
import { Bell, BookOpen, Clock, FileText, Megaphone, Shield, Star, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InicioPage() {
  const { currentUser, notifications, communications, documents, highlights, courses } = useAppStore();
  const navigate = useNavigate();
  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const pendingCourses = courses.filter((c) => !c.archived && c.mandatory).length;
  const recentDocs = documents.filter((d) => !d.archived).slice(0, 3);
  const activeHighlights = highlights.filter((h) => h.active).sort((a, b) => a.order - b.order);
  const activeCommunications = communications.filter((c) => !c.archived);

  const quickAccess = [
    { label: 'Payfit', icon: Clock, path: '/payfit', desc: 'Fichar y gestionar nóminas' },
    { label: 'Comunicaciones', icon: Megaphone, path: '/comunicaciones', desc: 'Últimos comunicados' },
    { label: 'Cursos', icon: BookOpen, path: '/cursos', desc: 'Formación obligatoria' },
    { label: 'Seguridad IT', icon: Shield, path: '/seguridad-it', desc: 'Soporte y preguntas' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`¡Hola, ${currentUser.name.split(' ')[0]}!`}
        description="Bienvenido al portal de empleados de CCC"
      />

      {/* Highlighted announcements */}
      {activeHighlights.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeHighlights.map((h) => (
            <div
              key={h.id}
              className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 cursor-pointer hover:border-primary/40 transition-all"
              onClick={() => h.link && navigate(h.link)}
            >
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm text-card-foreground">{h.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{h.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Notification highlights */}
      {unreadNotifs > 0 && (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-warning flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">
                Tienes <span className="text-primary font-bold">{unreadNotifs}</span> notificación{unreadNotifs > 1 ? 'es' : ''} sin leer
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {notifications.filter(n => !n.read).slice(0, 2).map(n => n.title).join(' • ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Notificaciones" value={unreadNotifs} icon={<Bell className="h-6 w-6" />} />
        <StatCard label="Comunicados" value={activeCommunications.length} icon={<Megaphone className="h-6 w-6" />} />
        <StatCard label="Cursos pendientes" value={pendingCourses} icon={<BookOpen className="h-6 w-6" />} trend={pendingCourses > 0 ? `${pendingCourses} obligatorio${pendingCourses > 1 ? 's' : ''}` : undefined} />
        <StatCard label="Documentos" value={documents.filter(d => !d.archived).length} icon={<FileText className="h-6 w-6" />} />
      </div>

      {/* Quick access */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-secondary">Acceso rápido</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickAccess.map((item) => (
            <InfoCard
              key={item.path}
              title={item.label}
              description={item.desc}
              icon={<item.icon className="h-5 w-5" />}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      </div>

      {/* Recent communications */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-secondary">Comunicados recientes</h2>
          <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate('/comunicaciones')}>
            Ver todos <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {activeCommunications.slice(0, 3).map((comm) => (
            <div
              key={comm.id}
              className="rounded-xl border bg-card p-4 card-shadow cursor-pointer hover:card-shadow-hover transition-all"
              onClick={() => navigate('/comunicaciones')}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-card-foreground">{comm.title}</h3>
                    {comm.pinned && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">Destacado</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{comm.content}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground">{comm.date}</p>
                  <p className="text-xs text-muted-foreground">{comm.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent documents */}
      {recentDocs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-secondary">Documentos recientes</h2>
            <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate('/documentos')}>
              Ver todos <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>
      )}

      {/* Payfit highlight */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Clock className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-secondary">¿Necesitas fichar o consultar tu nómina?</h3>
            <p className="text-sm text-muted-foreground">
              Accede a la guía de Payfit para aprender a gestionar fichajes, solicitudes y documentos.
            </p>
          </div>
          <Button onClick={() => navigate('/payfit')}>Ir a Payfit</Button>
        </div>
      </div>
    </div>
  );
}
