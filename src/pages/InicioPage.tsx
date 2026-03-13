import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import InfoCard from '@/components/shared/InfoCard';
import { Badge } from '@/components/ui/badge';
import { Bell, BookOpen, Clock, FileText, Megaphone, Shield } from 'lucide-react';

export default function InicioPage() {
  const { currentUser, notifications, communications } = useAppStore();
  const navigate = useNavigate();
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const quickAccess = [
    { label: 'Payfit', icon: Clock, path: '/payfit', desc: 'Fichar y gestionar nóminas' },
    { label: 'Comunicaciones', icon: Megaphone, path: '/comunicaciones', desc: 'Últimos comunicados' },
    { label: 'Cursos', icon: BookOpen, path: '/cursos', desc: 'Formación obligatoria' },
    { label: 'Seguridad IT', icon: Shield, path: '/seguridad-it', desc: 'Soporte y preguntas' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`¡Hola, ${currentUser.name.split(' ')[0]}!`}
        description="Bienvenido al portal de empleados de CCC"
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Notificaciones" value={unreadNotifs} icon={<Bell className="h-6 w-6" />} />
        <StatCard label="Comunicados" value={communications.length} icon={<Megaphone className="h-6 w-6" />} />
        <StatCard label="Cursos pendientes" value={2} icon={<BookOpen className="h-6 w-6" />} trend="1 próximo a vencer" />
        <StatCard label="Documentos" value={12} icon={<FileText className="h-6 w-6" />} />
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
        <h2 className="mb-3 text-lg font-semibold text-secondary">Comunicados recientes</h2>
        <div className="space-y-3">
          {communications.map((comm) => (
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
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                        Destacado
                      </Badge>
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
          <button
            onClick={() => navigate('/payfit')}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Ir a Payfit
          </button>
        </div>
      </div>
    </div>
  );
}
