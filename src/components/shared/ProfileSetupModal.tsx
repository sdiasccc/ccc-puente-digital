import { useState, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const { currentUser, updateUser, completeOnboardingStep } = useAppStore();
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser.firstLogin) return null;

  const initials = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updates: Partial<typeof currentUser> = { firstLogin: false };
    if (avatarPreview) {
      updates.avatar = avatarPreview;
      completeOnboardingStep(currentUser.id, 'profileConfigured');
    }
    if (bio.trim()) {
      updates.bio = bio.trim();
    }
    updateUser(currentUser.id, updates);
    toast.success('Perfil configurado');
  };

  const handleSkip = () => {
    updateUser(currentUser.id, { firstLogin: false });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 card-shadow space-y-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-xl font-bold text-secondary">
            Bienvenido/a, {currentUser.name.split(' ')[0]}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Configura tu perfil</p>
        </div>

        {/* Avatar upload */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Avatar className="h-24 w-24">
              {avatarPreview && <AvatarImage src={avatarPreview} />}
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-secondary/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-primary hover:underline"
          >
            Subir foto
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Textarea
            placeholder="Cuéntanos brevemente quién eres..."
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 200))}
            rows={3}
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground text-right">{bio.length}/200</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleSkip}>
            Omitir por ahora
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            Guardar y continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
