import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import InfoCard from '@/components/shared/InfoCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Phone, Send, AlertOctagon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface SupportForm {
  name: string;
  department: string;
  email: string;
  subject: string;
  message: string;
}

export default function SeguridadITPage() {
  const { faqs } = useAppStore();
  const activeFaqs = faqs.filter((f) => !f.archived);
  const { register, handleSubmit, reset } = useForm<SupportForm>();

  const onSubmit = () => {
    toast.success('Solicitud enviada correctamente. Te contactaremos pronto.');
    reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Seguridad IT" description="Base de conocimiento y soporte técnico" />

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard title="Soporte IT" description="Lun-Vie 9:00-18:00" icon={<Phone className="h-5 w-5" />}>
          <p className="mt-2 text-sm font-medium text-primary">soporte@ccc.com</p>
        </InfoCard>
        <InfoCard title="Seguridad informática" description="Incidentes de seguridad 24/7" icon={<Shield className="h-5 w-5" />}>
          <p className="mt-2 text-sm font-medium text-primary">seguridad@ccc.com</p>
        </InfoCard>
      </div>

      {/* Solicitud de soporte */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-secondary">Solicitud de soporte</h2>
        <div className="rounded-xl border bg-card p-6 card-shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="name">Nombre</Label><Input id="name" {...register('name', { required: true })} placeholder="Tu nombre" /></div>
            <div className="space-y-2"><Label htmlFor="department">Departamento</Label><Input id="department" {...register('department', { required: true })} placeholder="Tu departamento" /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register('email', { required: true })} placeholder="tu@ccc.com" /></div>
            <div className="space-y-2"><Label htmlFor="subject">Asunto</Label><Input id="subject" {...register('subject', { required: true })} placeholder="Describe brevemente" /></div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="message">Mensaje</Label><Textarea id="message" {...register('message', { required: true })} placeholder="Detalla tu solicitud..." rows={4} /></div>
            <div className="md:col-span-2"><Button type="submit" className="gap-2"><Send className="h-4 w-4" /> Enviar solicitud</Button></div>
          </form>
        </div>
      </div>

      {/* Brecha de seguridad - Destacado */}
      <div className="rounded-2xl bg-info p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
          <AlertOctagon className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">¿has detectado una brecha?</h3>
          <p className="text-sm text-white/80 mt-1">
            si sospechas de un ataque, has recibido un email sospechoso o has detectado actividad inusual, contactanos
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex-shrink-0">
          reportar incidencias
        </Button>
      </div>

      {/* Preguntas frecuentes */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-secondary">Preguntas frecuentes</h2>
        <div className="rounded-xl border bg-card card-shadow">
          <Accordion type="single" collapsible>
            {activeFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="px-5 text-sm font-medium text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="px-5 pb-4 text-sm text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
