import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, ExternalLink } from 'lucide-react';

export default function CursosPage() {
  const { courses } = useAppStore();
  const active = courses.filter((c) => !c.archived);

  return (
    <div className="space-y-6">
      <PageHeader title="Cursos obligatorios" description="Formación que todo empleado debe completar en su primer mes" />

      <div className="rounded-xl border-2 border-warning/20 bg-warning/5 p-5">
        <p className="text-sm text-foreground">
          <strong>Importante:</strong> Todos los empleados deben completar estos cursos dentro del primer mes desde su incorporación. Contacta con RRHH si tienes alguna duda.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {active.map((course) => (
          <div key={course.id} className="rounded-xl border bg-card p-5 card-shadow flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground text-sm">{course.title}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{course.duration}</Badge>
                  {course.mandatory && <Badge className="bg-warning/10 text-warning text-xs">Obligatorio</Badge>}
                </div>
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
