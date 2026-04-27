import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/useAppStore';
import { Separator } from '@/components/ui/separator';

const steps = [
  {
    num: 1,
    title: 'Crea tu cuenta',
    description: 'Accede a payfit.com con el correo corporativo proporcionado por RRHH y sigue los pasos para activar tu cuenta.',
  },
  {
    num: 2,
    title: 'Registra tu jornada',
    description: 'Cada día al iniciar y finalizar tu jornada, ficha tu entrada y salida desde la app o la web de Payfit en el apartado "Control de jornada".',
  },
  {
    num: 3,
    title: 'Solicita vacaciones',
    description: 'Desde el menú "Ausencias", selecciona las fechas deseadas y envía tu solicitud. Tu responsable recibirá una notificación para aprobarla.',
  },
  {
    num: 4,
    title: 'Descarga tus documentos',
    description: 'En el apartado "Documentos" encontrarás tus nóminas, contratos y otros documentos disponibles para descargar en PDF.',
  },
];

export default function PayfitPage() {
  const { currentUser, completeOnboardingStep } = useAppStore();

  useEffect(() => {
    completeOnboardingStep(currentUser.id, 'videoWatched');
  }, [currentUser.id, completeOnboardingStep]);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden min-h-[280px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/70" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80')] bg-cover bg-center" />

        <div className="relative z-10 flex items-center justify-between w-full px-8 py-10 lg:px-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">Payfit</h1>
            <p className="text-white/70 mb-5 max-w-md">
              Gestiona tu fichaje, solicitudes y documentos desde una única plataforma.
            </p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
              onClick={() => window.open('https://app.payfit.com', '_blank')}
            >
              Accede ya
            </Button>
          </div>
          <div className="hidden lg:flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-2xl font-bold text-white/80">PF</span>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="text-center space-y-5">
        <h2 className="text-2xl font-semibold text-secondary">
          Iniciación a Payfit, paso a paso
        </h2>
        <div className="mx-auto max-w-3xl rounded-2xl overflow-hidden border border-border bg-secondary/5">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/BHACKCNDMW8"
              title="Naturaleza"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Pasos para comenzar */}
      <section className="max-w-3xl mx-auto space-y-2">
        <h2 className="text-2xl font-semibold text-secondary text-center mb-6">Pasos para comenzar</h2>
        <div className="space-y-0">
          {steps.map((step, idx) => (
            <div key={step.num}>
              <div className="flex items-start gap-5 py-5">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white font-bold text-sm"
                  style={{ backgroundColor: '#1C44AE' }}
                >
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-card-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
              {idx < steps.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
