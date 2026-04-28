import { useEffect, useState } from 'react';
import { Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/useAppStore';
import { getBenefitIcon, BENEFIT_ICON_COLOR } from '@/lib/benefitIcons';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';

export default function BeneficiosPage() {
  const { benefits, currentUser, completeOnboardingStep } = useAppStore();
  const activeBenefits = benefits.filter((b) => !b.archived);
  const [modalEmail, setModalEmail] = useState<string | null>(null);

  useEffect(() => {
    completeOnboardingStep(currentUser.id, 'benefitsVisited');
  }, [currentUser.id, completeOnboardingStep]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Beneficios sociales</h1>
        <p className="text-muted-foreground mt-1">Conoce los beneficios que CCC ofrece a sus empleados</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {activeBenefits.map((b) => {
          const Icon = getBenefitIcon(b.icon);
          return (
            <div key={b.id} className="rounded-2xl border bg-card overflow-hidden card-shadow hover:card-shadow-hover transition-all flex flex-col">
              {b.image && (
                <div className="h-40 overflow-hidden bg-muted">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5" style={{ color: BENEFIT_ICON_COLOR }} />
                  </div>
                  <h3 className="font-semibold text-lg text-card-foreground">{b.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{b.description}</p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {b.email && (
                    <button
                      type="button"
                      onClick={() => setModalEmail(b.email)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <Mail className="h-4 w-4" /> {b.email}
                    </button>
                  )}
                  {b.link && (
                    <a href={b.link} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                        <ExternalLink className="h-4 w-4" /> Acceder
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!modalEmail} onOpenChange={(o) => !o && setModalEmail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitud de información</DialogTitle>
            <DialogDescription>
              Para solicitar información sobre este beneficio, envía un correo directamente a la dirección indicada.
            </DialogDescription>
          </DialogHeader>
          {modalEmail && (
            <a
              href={`mailto:${modalEmail}`}
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              <Mail className="h-4 w-4" /> {modalEmail}
            </a>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEmail(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
