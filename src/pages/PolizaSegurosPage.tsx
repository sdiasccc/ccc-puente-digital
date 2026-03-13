import PageHeader from '@/components/shared/PageHeader';
import InfoCard from '@/components/shared/InfoCard';
import { Heart, FileText, Mail } from 'lucide-react';

export default function PolizaSegurosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Póliza de seguros"
        description="Información sobre la cobertura de seguros para empleados de CCC"
      />

      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-secondary">Seguro médico de empresa</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Todos los empleados de CCC cuentan con un seguro médico privado que cubre consultas, pruebas diagnósticas,
              hospitalización y urgencias. La cobertura se activa desde el primer día de incorporación.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard
          title="¿Cómo solicitar cobertura?"
          icon={<FileText className="h-5 w-5" />}
        >
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Accede al portal de la aseguradora con tus credenciales</li>
            <li>Busca el profesional o centro médico deseado</li>
            <li>Solicita la autorización si es necesaria</li>
            <li>Presenta tu tarjeta de asegurado en la cita</li>
          </ol>
        </InfoCard>

        <InfoCard
          title="Envío de DNI a RRHH"
          icon={<Mail className="h-5 w-5" />}
        >
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p>Para activar tu seguro, envía una copia de tu DNI (ambas caras) al departamento de RRHH:</p>
            <p className="font-medium text-primary">rrhh@ccc.com</p>
            <p>Incluye en el asunto: "Alta seguro - [Tu nombre completo]"</p>
          </div>
        </InfoCard>
      </div>

      <InfoCard
        title="Cobertura incluida"
        icon={<Heart className="h-5 w-5" />}
      >
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {[
            'Medicina general y especialistas',
            'Pruebas diagnósticas',
            'Hospitalización',
            'Urgencias 24h',
            'Cobertura dental básica',
            'Fisioterapia (con autorización)',
            'Salud mental',
            'Segunda opinión médica',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
}
