import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SolicitudBeneficioPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, createNotification } = useAppStore();
  const benefit = (location.state as any)?.benefit || 'Beneficio';
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    // Create a notification for admins
    createNotification({
      title: `Solicitud: ${benefit}`,
      message: `${currentUser.name} ha solicitado información sobre "${benefit}". Motivo: ${reason}`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'info',
    });

    toast.success('Solicitud enviada correctamente. Un administrador la revisará pronto.');
    navigate('/beneficios');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Button variant="ghost" className="gap-2 text-muted-foreground" onClick={() => navigate('/beneficios')}>
        <ArrowLeft className="h-4 w-4" /> Volver a beneficios
      </Button>

      <div>
        <h1 className="text-2xl font-bold text-secondary">Formulario de solicitud</h1>
        <p className="text-muted-foreground mt-1">Solicitud para: <span className="font-medium text-primary">{benefit}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-card p-6 card-shadow space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reason">Motivo de tu solicitud</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe brevemente el motivo de tu solicitud..."
            rows={5}
            required
          />
        </div>
        <Button type="submit" className="gap-2">
          <Send className="h-4 w-4" /> Enviar solicitud
        </Button>
      </form>
    </div>
  );
}
