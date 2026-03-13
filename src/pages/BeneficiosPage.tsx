import PageHeader from '@/components/shared/PageHeader';
import InfoCard from '@/components/shared/InfoCard';
import { Gift, GraduationCap, Heart, Dumbbell } from 'lucide-react';

const benefits = [
  {
    title: 'Seguro médico privado',
    description: 'Cobertura médica completa con la posibilidad de incluir familiares directos a precio reducido.',
    icon: Heart,
  },
  {
    title: 'Formación continua',
    description: 'Descuentos de hasta el 50% en másteres, cursos de idiomas y certificaciones profesionales.',
    icon: GraduationCap,
  },
  {
    title: 'Programa de bienestar',
    description: 'Acceso a gimnasio con tarifa corporativa, sesiones de mindfulness y programa de salud mental.',
    icon: Dumbbell,
  },
  {
    title: 'Retribución flexible',
    description: 'Ticket restaurante, transporte, guardería y seguro médico con ventajas fiscales.',
    icon: Gift,
  },
];

export default function BeneficiosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Beneficios sociales"
        description="Conoce los beneficios que CCC ofrece a sus empleados"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {benefits.map((b, i) => (
          <InfoCard
            key={i}
            title={b.title}
            description={b.description}
            icon={<b.icon className="h-5 w-5" />}
          />
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6 card-shadow">
        <h3 className="font-semibold text-card-foreground mb-3">¿Cómo acceder a los beneficios?</h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Consulta los beneficios disponibles en esta sección</li>
          <li>Contacta con RRHH para solicitar la activación: <span className="font-medium text-primary">rrhh@ccc.com</span></li>
          <li>Completa la documentación necesaria</li>
          <li>Disfruta de tus beneficios desde el mes siguiente</li>
        </ol>
      </div>
    </div>
  );
}
