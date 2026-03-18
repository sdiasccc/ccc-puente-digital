import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function PayfitPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden min-h-[280px] flex items-center">
        {/* Background image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/70" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80')] bg-cover bg-center" />

        <div className="relative z-10 flex items-center justify-between w-full px-8 py-10 lg:px-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">payfit</h1>
            <p className="text-white/70 mb-5 max-w-md">
              Gestiona tu fichaje, solicitudes y documentos desde una única plataforma.
            </p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
              onClick={() => window.open('https://app.payfit.com', '_blank')}
            >
              accede ya
            </Button>
          </div>

          {/* Payfit logo placeholder */}
          <div className="hidden lg:flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-2xl font-bold text-white/80">PF</span>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="text-center space-y-5">
        <h2 className="text-2xl font-semibold text-secondary">
          iniciación a payfit, paso a paso
        </h2>

        <div className="mx-auto max-w-3xl rounded-2xl overflow-hidden border border-border bg-secondary/5">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Iniciación a Payfit"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </div>
  );
}
