import PageHeader from '@/components/shared/PageHeader';
import InfoCard from '@/components/shared/InfoCard';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, ExternalLink } from 'lucide-react';

const courses = [
  { title: 'Prevención de Riesgos Laborales (PRL)', description: 'Curso obligatorio sobre seguridad y salud en el trabajo. Incluye protocolos de emergencia y prevención de riesgos.', link: '#', duration: '4 horas' },
  { title: 'Protección de Datos (RGPD)', description: 'Formación sobre el Reglamento General de Protección de Datos y su aplicación en el entorno laboral.', link: '#', duration: '2 horas' },
  { title: 'Código Ético y Compliance', description: 'Principios éticos de la empresa, canal de denuncias y normativa de cumplimiento.', link: '#', duration: '1.5 horas' },
  { title: 'Ciberseguridad Básica', description: 'Buenas prácticas en seguridad informática: contraseñas, phishing, navegación segura y uso de VPN.', link: '#', duration: '2 horas' },
  { title: 'Acoso Laboral y Diversidad', description: 'Protocolo contra el acoso laboral, igualdad de género y diversidad en el entorno profesional.', link: '#', duration: '1.5 horas' },
];

export default function CursosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Cursos obligatorios"
        description="Formación que todo empleado debe completar en su primer mes"
      />

      <div className="rounded-xl border-2 border-warning/20 bg-warning/5 p-5">
        <p className="text-sm text-foreground">
          <strong>Importante:</strong> Todos los empleados deben completar estos cursos dentro del primer mes desde su incorporación. 
          Contacta con RRHH si tienes alguna duda.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 card-shadow flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground text-sm">{course.title}</h3>
                <Badge variant="outline" className="mt-1 text-xs">{course.duration}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground flex-1">{course.description}</p>
            <a
              href={course.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors self-start"
            >
              Acceder al curso <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
