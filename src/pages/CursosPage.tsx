import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';

const defaultCourses = [
  {
    id: '1',
    title: 'Prevención de Riesgos Laborales',
    description: 'Formación básica en prevención de riesgos laborales según la normativa vigente.',
    link: 'https://www.google.com',
  },
  {
    id: '2',
    title: 'Protección de Datos (RGPD)',
    description: 'Curso obligatorio sobre el Reglamento General de Protección de Datos y su aplicación.',
    link: 'https://www.google.com',
  },
  {
    id: '3',
    title: 'Compliance y Ética Corporativa',
    description: 'Principios de cumplimiento normativo y código ético de la empresa.',
    link: 'https://www.google.com',
  },
];

export default function CursosPage() {
  // Mock completed state (will be persisted in DB later)
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const completedCount = completed.size;
  const totalCourses = defaultCourses.length;
  const progressPercent = (completedCount / totalCourses) * 100;

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden min-h-[200px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/70" />
        <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80')] bg-cover bg-center" />
        <div className="relative z-10 px-8 py-10 lg:px-12">
          <h1 className="text-3xl font-bold text-white">cursos obligatorios</h1>
          <p className="text-white/70 mt-2">Formación que todo empleado debe completar</p>
        </div>
      </section>

      {/* Progress & Warning */}
      <section className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5 card-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-card-foreground">
              cursos completados: <span className="text-primary">{completedCount}/{totalCourses}</span>
            </p>
            <span className="text-xs text-muted-foreground">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
          <p className="text-sm text-card-foreground">
            <strong>Tienes 1 mes para completarlo.</strong> Todos los cursos deben finalizarse dentro del primer mes desde tu incorporación.
          </p>
        </div>
      </section>

      {/* Course List */}
      <section className="space-y-3">
        {defaultCourses.map((course) => {
          const isCompleted = completed.has(course.id);
          return (
            <div
              key={course.id}
              className={`rounded-xl border bg-card p-5 card-shadow flex items-center gap-4 transition-all ${isCompleted ? 'border-success/30 bg-success/5' : ''}`}
            >
              <button
                onClick={() => toggleComplete(course.id)}
                className="flex-shrink-0"
                title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completado'}
              >
                <CheckCircle2
                  className={`h-6 w-6 transition-colors ${isCompleted ? 'text-success' : 'text-muted-foreground/30 hover:text-muted-foreground/60'}`}
                />
              </button>

              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-card-foreground ${isCompleted ? 'line-through opacity-60' : ''}`}>
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
              </div>

              <a href={course.link} target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 flex-shrink-0">
                  empezar <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          );
        })}
      </section>
    </div>
  );
}
