import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { ChevronLeft, ChevronRight, Clock, Layers, BookOpen, Shield, Gift, Network, ArrowRight, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WelcomeModal from '@/components/shared/WelcomeModal';
import ProfileSetupModal from '@/components/shared/ProfileSetupModal';

const cardColors = ['#1C44AE', '#4CA387', '#E18F35', '#1C44AE', '#4CA387', '#E18F35'];

const quickAccessItems = [
  {
    id: 1,
    title: 'Iniciación a Payfit',
    subtitle: 'Aprende a usar la plataforma',
    items: ['Control de jornada', 'Solicitud de vacaciones', 'Descargar documentos'],
    cta: 'Explorar más',
    path: '/payfit',
    icon: Clock,
  },
  {
    id: 2,
    title: 'Comunicaciones',
    subtitle: 'Mantente al día',
    items: ['Avisos internos', 'Novedades de empresa', 'Comunicados oficiales'],
    cta: 'Explorar más',
    path: '/comunicaciones',
    icon: Layers,
  },
  {
    id: 3,
    title: 'Cursos obligatorios',
    subtitle: 'Formación requerida',
    items: ['Prevención de riesgos laborales'],
    cta: 'Explorar más',
    path: '/cursos',
    icon: BookOpen,
  },
  {
    id: 4,
    title: 'Seguridad IT',
    subtitle: 'Soporte y recursos',
    items: ['Preguntas frecuentes', 'Solicitar soporte', 'Reportar incidencia'],
    cta: 'Explorar más',
    path: '/seguridad-it',
    icon: Shield,
  },
  {
    id: 5,
    title: 'Beneficios sociales',
    subtitle: 'Descubre tus ventajas',
    items: ['Seguro médico', 'Descuentos formación', 'Programas educativos'],
    cta: 'Explorar más',
    path: '/beneficios',
    icon: Gift,
  },
  {
    id: 6,
    title: 'Organigrama',
    subtitle: 'Estructura de la empresa',
    items: ['Departamentos', 'Equipos', 'Contactos internos'],
    cta: 'Explorar más',
    path: '/organigrama',
    icon: Network,
  },
];

const relevantDocs = [
  {
    id: 'rgpd',
    title: 'Protección de datos (RGPD)',
    description: 'Reglamento General de Protección de Datos y su aplicación en la empresa.',
    link: 'https://www.google.com',
  },
];

export default function InicioPage() {
  const { communications } = useAppStore();
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0);

  const activeCommunications = communications.filter((c) => !c.archived);
  const maxIndex = Math.max(0, quickAccessItems.length - 3);

  const prev = useCallback(() => setCarouselIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setCarouselIndex((i) => Math.min(maxIndex, i + 1)), [maxIndex]);

  return (
    <div className="space-y-8">
      <ProfileSetupModal />
      <WelcomeModal />

      {/* Anuncios recientes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary">Anuncios recientes</h2>
          {activeCommunications.length > 0 && (
            <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate('/comunicaciones')}>
              Ver todos <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {activeCommunications.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No hay comunicados actualmente. Un administrador puede crear nuevos comunicados.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeCommunications.slice(0, 6).map((comm) => (
              <div
                key={comm.id}
                className="rounded-xl border border-border bg-card p-5 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/comunicaciones')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xs font-bold text-primary">
                      {comm.author.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-card-foreground truncate">{comm.author}</p>
                    <p className="text-xs text-muted-foreground">{comm.date}</p>
                  </div>
                </div>
                {comm.title && <h3 className="font-semibold text-card-foreground mb-1">{comm.title}</h3>}
                <p className="text-sm text-muted-foreground line-clamp-2">{comm.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Documentación relevante */}
      <section>
        <h2 className="text-xl font-semibold text-secondary mb-4">Documentación relevante</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relevantDocs.map((doc) => (
            <div key={doc.id} className="rounded-xl border border-border bg-card p-5 card-shadow hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground text-sm">{doc.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{doc.description}</p>
                  <a href={doc.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    Acceder al documento <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accesos rápidos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary">Accesos rápidos</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={prev}
              disabled={carouselIndex === 0}
              className="rounded-md p-1.5 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={next}
              disabled={carouselIndex >= maxIndex}
              className="rounded-md p-1.5 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${carouselIndex * (100 / 3 + 1.33)}%)` }}
          >
            {quickAccessItems.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-2xl p-6 text-white flex-shrink-0 flex flex-col justify-between min-h-[260px]"
                style={{ width: 'calc((100% - 2rem) / 3)', backgroundColor: cardColors[idx] }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-white/80 mb-4">{item.subtitle}</p>
                  <ul className="space-y-1.5">
                    {item.items.map((text, i) => (
                      <li key={i} className="text-sm text-white/90 flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-white/60 flex-shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => navigate(item.path)}
                  className="mt-4 text-sm font-medium text-white/90 hover:text-white flex items-center gap-1 transition-colors self-start"
                >
                  {item.cta} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
