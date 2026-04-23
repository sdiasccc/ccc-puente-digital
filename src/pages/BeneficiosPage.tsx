import { useEffect } from 'react';
import { Heart, GraduationCap, Mail, Tag, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';

export default function BeneficiosPage() {
  const navigate = useNavigate();
  const { currentUser, completeOnboardingStep } = useAppStore();

  useEffect(() => {
    completeOnboardingStep(currentUser.id, 'benefitsVisited');
  }, [currentUser.id, completeOnboardingStep]);

  const benefitCards = [
    {
      title: 'Seguro médico',
      description: 'Todos los empleados cuentan con un seguro médico privado que cubre consultas, pruebas diagnósticas, hospitalización y urgencias desde el primer día.',
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    },
    {
      title: 'Descuentos en formación',
      description: 'Accede a descuentos exclusivos en programas de formación, másteres y certificaciones profesionales con nuestras instituciones colaboradoras.',
      icon: GraduationCap,
      image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600&q=80',
    },
    {
      title: 'Club de descuentos',
      description: 'Accede al portal exclusivo de Club de Beneficios CCC con descuentos en ocio, viajes, tecnología, salud y mucho más.',
      icon: Tag,
      image: 'https://images.unsplash.com/photo-1556742400-b5b7c5121f4e?w=600&q=80',
      externalLink: 'https://ccc.clubdebenefits.com/pages/index',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Beneficios sociales</h1>
        <p className="text-muted-foreground mt-1">Conoce los beneficios que CCC ofrece a sus empleados</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {benefitCards.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.title} className="rounded-2xl border bg-card overflow-hidden card-shadow hover:card-shadow-hover transition-all">
              <div className="h-40 overflow-hidden">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-card-foreground">{b.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                {b.externalLink ? (
                  <a href={b.externalLink} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <ExternalLink className="h-4 w-4" /> Acceder al club
                    </Button>
                  </a>
                ) : (
                  <Button
                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => navigate('/beneficios/solicitud', { state: { benefit: b.title } })}
                  >
                    <Mail className="h-4 w-4" /> Contactar
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
