import { useAppStore } from '@/stores/useAppStore';
import { X, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

const checklistItems = [
  'Configurar tu perfil y foto de usuario',
  'Revisar la política de teletrabajo',
  'Completar los cursos obligatorios',
  'Conocer al equipo en el organigrama',
  'Consultar tus beneficios sociales',
];

export default function WelcomeModal() {
  const { currentUser } = useAppStore();
  const [dismissed, setDismissed] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(new Array(checklistItems.length).fill(false));

  // Only show if user was created within the last 7 days
  if (!currentUser.createdAt) return null;
  const createdDate = new Date(currentUser.createdAt);
  const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreation > 7 || dismissed) return null;

  const toggleItem = (i: number) => {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
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
            {checklistItems.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => toggleItem(i)}
              >
                {checked[i] ? (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={`text-sm ${checked[i] ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground p-1">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
