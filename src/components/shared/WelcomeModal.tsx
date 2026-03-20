import { useAppStore } from '@/stores/useAppStore';
import { X, CheckCircle2, Circle, Clock } from 'lucide-react';
import { useState } from 'react';

const checklistItems = [
  { key: 'profileConfigured' as const, label: 'Configurar tu perfil y foto de usuario' },
  { key: 'videoWatched' as const, label: 'Ver vídeo de iniciación a Payfit' },
  { key: null, label: 'Completar los cursos obligatorios (próximamente)' },
  { key: 'orgVisited' as const, label: 'Conocer al equipo en el organigrama' },
  { key: 'benefitsVisited' as const, label: 'Consultar tus beneficios sociales' },
];

export default function WelcomeModal() {
  const { currentUser, onboarding } = useAppStore();
  const [dismissed, setDismissed] = useState(false);

  if (!currentUser.createdAt) return null;
  const createdDate = new Date(currentUser.createdAt);
  const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreation > 7 || dismissed) return null;

  const userOnboarding = onboarding[currentUser.id] || {
    profileConfigured: false,
    videoWatched: false,
    orgVisited: false,
    benefitsVisited: false,
  };

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5 mb-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-secondary">
            Bienvenido a nuestro equipo, {currentUser.name} 👋
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Estos son los pasos recomendados para tu primera semana:
          </p>
          <ul className="space-y-2.5">
            {checklistItems.map((item, i) => {
              const isCompleted = item.key ? userOnboarding[item.key] : false;
              const isComingSoon = item.key === null;
              return (
                <li key={i} className="flex items-center gap-3 select-none">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : isComingSoon ? (
                    <Clock className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={`text-sm ${isCompleted ? 'line-through text-muted-foreground' : isComingSoon ? 'text-muted-foreground/60 italic' : 'text-card-foreground'}`}>
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground p-1">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
