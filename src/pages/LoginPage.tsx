import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AlertCircle, Clock } from 'lucide-react';

const CCC_SEDES = ['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao'];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, users } = useAppStore();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', cargo: '', office: '' });
  const [pendingMessage, setPendingMessage] = useState(false);
  const [registeredMessage, setRegisteredMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingMessage(false);
    setRegisteredMessage(false);

    if (isRegister) {
      if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
        toast.error('Rellena todos los campos obligatorios');
        return;
      }
      const result = register(form.name.trim(), form.email.trim(), form.password, form.cargo.trim(), form.office);
      if (result === 'success') {
        setRegisteredMessage(true);
        setForm({ name: '', email: '', password: '', cargo: '', office: '' });
      } else if (result === 'exists') {
        toast.error('Ya existe una cuenta con ese email');
      }
    } else {
      const user = users.find((u) => u.email === form.email.trim());
      if (user && user.status === 'pendiente') {
        setPendingMessage(true);
        return;
      }
      const ok = login(form.email.trim(), form.password);
      if (ok) {
        toast.success('Sesión iniciada');
        navigate('/');
      } else {
        toast.error('Credenciales incorrectas');
      }
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Intranet CCC</h1>
          <p className="text-white/60 mt-2">Portal del empleado</p>
        </div>

        <div className="rounded-2xl bg-card p-8 card-shadow">
          <h2 className="text-xl font-semibold text-secondary mb-6">
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>

          {pendingMessage && (
            <div className="flex items-start gap-3 rounded-lg bg-warning/10 border border-warning/30 p-4 mb-4">
              <Clock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">En espera</p>
                <p className="text-xs text-muted-foreground mt-1">Tu cuenta aún no ha sido activada por un administrador.</p>
              </div>
            </div>
          )}

          {registeredMessage && (
            <div className="flex items-start gap-3 rounded-lg bg-info/10 border border-info/30 p-4 mb-4">
              <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-info">Petición registrada</p>
                <p className="text-xs text-muted-foreground mt-1">Un administrador debe validar tu acceso antes de que puedas entrar.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    placeholder="Ej: Desarrollador, Profesor, Manager..."
                    value={form.cargo}
                    onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="office">Sede CCC</Label>
                  <Select value={form.office} onValueChange={(v) => setForm({ ...form, office: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecciona una sede" /></SelectTrigger>
                    <SelectContent>
                      {CCC_SEDES.map((s) => (
                        <SelectItem key={s} value={s}>Sede {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ccc.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              {isRegister ? 'Registrarse' : 'Entrar'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              type="button"
              className="text-primary font-medium hover:underline"
              onClick={() => {
                setIsRegister(!isRegister);
                setPendingMessage(false);
                setRegisteredMessage(false);
              }}
            >
              {isRegister ? 'Iniciar sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
