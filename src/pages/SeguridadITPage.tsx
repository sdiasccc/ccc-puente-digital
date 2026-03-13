import PageHeader from '@/components/shared/PageHeader';
import InfoCard from '@/components/shared/InfoCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, HelpCircle, Mail, Phone, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const faqs = [
  { q: '¿Cómo cambio mi contraseña?', a: 'Accede a "Configuración" > "Seguridad" > "Cambiar contraseña". Recuerda usar al menos 12 caracteres con mayúsculas, números y símbolos.' },
  { q: '¿Qué hago si recibo un email sospechoso?', a: 'No abras enlaces ni descargues archivos. Reenvía el email a seguridad@ccc.com y elimínalo de tu bandeja.' },
  { q: '¿Cómo conecto la VPN?', a: 'Descarga el cliente VPN desde el portal de IT. Usa tus credenciales corporativas para conectarte. Si es la primera vez, contacta con soporte.' },
  { q: '¿Puedo instalar software en mi equipo?', a: 'Solo el software autorizado por IT puede ser instalado. Envía una solicitud a través del formulario de soporte indicando el software necesario.' },
];

interface SupportForm {
  name: string;
  department: string;
  email: string;
  subject: string;
  message: string;
}

export default function SeguridadITPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupportForm>();

  const onSubmit = (data: SupportForm) => {
    toast.success('Solicitud enviada correctamente. Te contactaremos pronto.');
    reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Seguridad IT"
        description="Base de conocimiento y soporte técnico"
      />

      {/* Contacts */}
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard title="Soporte IT" description="Lun-Vie 9:00-18:00" icon={<Phone className="h-5 w-5" />}>
          <p className="mt-2 text-sm font-medium text-primary">soporte@ccc.com</p>
        </InfoCard>
        <InfoCard title="Seguridad informática" description="Incidentes de seguridad 24/7" icon={<Shield className="h-5 w-5" />}>
          <p className="mt-2 text-sm font-medium text-primary">seguridad@ccc.com</p>
        </InfoCard>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-secondary">Preguntas frecuentes</h2>
        <div className="rounded-xl border bg-card card-shadow">
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="px-5 text-sm font-medium text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4 text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Support form */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-secondary">Solicitud de soporte</h2>
        <div className="rounded-xl border bg-card p-6 card-shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...register('name', { required: true })} placeholder="Tu nombre" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Input id="department" {...register('department', { required: true })} placeholder="Tu departamento" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email', { required: true })} placeholder="tu@ccc.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Asunto</Label>
              <Input id="subject" {...register('subject', { required: true })} placeholder="Describe brevemente" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea id="message" {...register('message', { required: true })} placeholder="Detalla tu solicitud..." rows={4} />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="gap-2">
                <Send className="h-4 w-4" /> Enviar solicitud
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
