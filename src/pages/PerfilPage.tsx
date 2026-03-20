import { useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Building, MapPin, Shield, Camera } from 'lucide-react';
import { toast } from 'sonner';

const roleLabels = { admin: 'Administrador', hr_team: 'Equipo RRHH', employee: 'Empleado' };

export default function PerfilPage() {
  const { currentUser, updateUser, completeOnboardingStep } = useAppStore();
  const initials = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      updateUser(currentUser.id, { avatar: dataUrl });
      completeOnboardingStep(currentUser.id, 'profileConfigured');
      toast.success('Foto de perfil actualizada');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Mi perfil" />

      <div className="rounded-xl border bg-card p-8 card-shadow">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative group">
            <Avatar className="h-24 w-24">
              {currentUser.avatar && <AvatarImage src={currentUser.avatar} />}
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-secondary/60 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-secondary">{currentUser.name}</h2>
            <Badge className="mt-2 bg-primary/10 text-primary">{roleLabels[currentUser.role]}</Badge>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {currentUser.email}</div>
              <div className="flex items-center gap-2"><Building className="h-4 w-4" /> {currentUser.department}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {currentUser.office}</div>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> {roleLabels[currentUser.role]}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
