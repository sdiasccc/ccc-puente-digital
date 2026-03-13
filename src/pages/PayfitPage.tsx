import PageHeader from '@/components/shared/PageHeader';
import InfoCard from '@/components/shared/InfoCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Edit, Send, CalendarDays, FileText, Filter } from 'lucide-react';

const sections = [
  {
    id: 'fichaje',
    label: 'Fichaje',
    icon: Clock,
    cards: [
      { title: 'Fichar entrada / salida', description: 'Accede a Payfit y pulsa el botón de fichaje en la pantalla principal. Recuerda fichar tanto al inicio como al final de tu jornada.' },
      { title: 'Editar horas de trabajo', description: 'Si necesitas corregir un fichaje, ve a "Mi horario" > selecciona el día > "Editar". Los cambios requieren aprobación de tu responsable.' },
      { title: 'Enviar el mes', description: 'Al finalizar el mes, revisa tus fichajes y pulsa "Enviar mes" para confirmar. Tienes hasta el día 3 del mes siguiente para hacerlo.' },
    ],
  },
  {
    id: 'solicitudes',
    label: 'Solicitudes',
    icon: CalendarDays,
    cards: [
      { title: 'Vacaciones', description: 'Accede a "Solicitudes" > "Nueva solicitud" > "Vacaciones". Selecciona las fechas y envía la petición. Tu responsable recibirá una notificación para aprobarla.' },
      { title: 'Ausencia personal', description: 'Para ausencias justificadas (citas médicas, trámites), crea una solicitud de tipo "Ausencia personal" indicando el motivo.' },
      { title: 'Justificantes médicos', description: 'Sube tu justificante médico en la sección "Documentos" de la solicitud. Formatos aceptados: PDF, JPG.' },
    ],
  },
  {
    id: 'documentos',
    label: 'Documentos',
    icon: FileText,
    cards: [
      { title: 'Contratos', description: 'Encuentra tu contrato vigente en "Mis documentos" > filtrar por "Contrato". Puedes descargarlo en formato PDF.' },
      { title: 'Nóminas', description: 'Tus nóminas se publican cada mes. Accede a "Mis documentos" > filtrar por "Nómina" > selecciona el mes deseado.' },
      { title: 'Filtrar por fecha', description: 'Usa el filtro de fechas para localizar documentos de periodos anteriores. Puedes combinar filtros de tipo y fecha.' },
    ],
  },
];

export default function PayfitPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payfit"
        description="Guía completa para gestionar tu fichaje, solicitudes y documentos en Payfit"
      />

      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
        <p className="text-sm text-foreground">
          <strong>Payfit</strong> es la plataforma de gestión de nóminas y RRHH de CCC. Aquí encontrarás toda la información necesaria para utilizar las funcionalidades principales.
        </p>
      </div>

      <Tabs defaultValue="fichaje" className="w-full">
        <TabsList className="w-full justify-start bg-muted">
          {sections.map((s) => (
            <TabsTrigger key={s.id} value={s.id} className="gap-2 data-[state=active]:bg-card">
              <s.icon className="h-4 w-4" />
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              {section.cards.map((card, i) => (
                <InfoCard
                  key={i}
                  title={card.title}
                  description={card.description}
                  icon={<section.icon className="h-5 w-5" />}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
