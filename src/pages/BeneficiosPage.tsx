import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import InfoCard from '@/components/shared/InfoCard';
import { Heart, GraduationCap, Dumbbell, Gift } from 'lucide-react';

const iconMap: Record<string, any> = { Heart, GraduationCap, Dumbbell, Gift };

export default function BeneficiosPage() {
  const { benefits } = useAppStore();
  const active = benefits.filter((b) => !b.archived);

  return (
    <div className="space-y-6">
      <PageHeader title="Beneficios sociales" description="Conoce los beneficios que CCC ofrece a sus empleados" />

      <div className="grid gap-4 md:grid-cols-2">
        {active.map((b) => {
          const Icon = iconMap[b.icon] || Gift;
          return (
            <InfoCard key={b.id} title={b.title} description={b.description} icon={<Icon className="h-5 w-5" />} />
          );
        })}
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
