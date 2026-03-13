import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Building, MapPin, Shield } from 'lucide-react';

const roleLabels = { admin: 'Administrador', hr_team: 'Equipo RRHH', employee: 'Empleado' };

export default function PerfilPage() {
  const { currentUser } = useAppStore();
  const initials = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <div className="space-y-6">
      <PageHeader title="Mi perfil" />

      <div className="rounded-xl border bg-card p-8 card-shadow">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{initials}</AvatarFallback>
          </Avatar>
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
