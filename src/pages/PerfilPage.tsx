import { useRef, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Building, MapPin, Shield, Camera, Save } from 'lucide-react';
import { toast } from 'sonner';

const roleLabels: Record<string, string> = { admin: 'Administrador', support: 'Soporte', hr_team: 'Equipo RRHH', employee: 'Empleado' };

export default function PerfilPage() {
  const { currentUser, updateUser, completeOnboardingStep } = useAppStore();
  const initials = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bio, setBio] = useState(currentUser.bio || '');

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

  const handleSaveBio = () => {
    updateUser(currentUser.id, { bio: bio.trim() });
    toast.success('Bio actualizada');
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
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-secondary">{currentUser.name}</h2>
            <Badge className="mt-2 bg-primary/10 text-primary">{roleLabels[currentUser.role]}</Badge>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {currentUser.email}</div>
              <div className="flex items-center gap-2"><Building className="h-4 w-4" /> {currentUser.department}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Sede {currentUser.office}</div>
              {currentUser.cargo && (
                <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> {currentUser.cargo}</div>
              )}
            </div>
          </div>
        </div>

        {/* Bio section */}
        <div className="mt-6 pt-6 border-t border-border space-y-3">
          <h3 className="font-semibold text-card-foreground">Bio</h3>
          <Textarea
            placeholder="Cuéntanos brevemente quién eres..."
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 200))}
            rows={3}
            maxLength={200}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{bio.length}/200</p>
            <Button size="sm" onClick={handleSaveBio} className="gap-1">
              <Save className="h-3 w-3" /> Guardar cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
