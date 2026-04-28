import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AlertCircle, Clock } from 'lucide-react';
import { isValidCccEmail, EMAIL_VALIDATION_MESSAGE } from '@/lib/emailValidation';
import { loginWithGoogle, UNAUTHORIZED_DOMAIN_MESSAGE } from '@/services/authService';

const CCC_SEDES = ['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao'];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, users, loginWithEmail } = useAppStore();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', cargo: '', office: '' });
  const [pendingMessage, setPendingMessage] = useState(false);
  const [registeredMessage, setRegisteredMessage] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleError(null);
    setPendingMessage(false);
    setRegisteredMessage(false);
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (!result.ok) {
        if (result.error === 'unauthorized_domain') {
          setGoogleError(UNAUTHORIZED_DOMAIN_MESSAGE);
        } else {
          toast.error('No se ha podido completar el inicio de sesión con Google');
        }
        return;
      }
      const status = loginWithEmail(result.profile.email);
      if (status === 'success') {
        toast.success('Sesión iniciada con Google');
        navigate('/');
      } else if (status === 'pending') {
        setPendingMessage(true);
      } else if (status === 'not_found') {
        setGoogleError('Esta cuenta de Google no está registrada en la intranet.');
      } else {
        setGoogleError('Tu cuenta está desactivada. Contacta con un administrador.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingMessage(false);
    setRegisteredMessage(false);

    if (isRegister) {
      if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
        toast.error('Rellena todos los campos obligatorios');
        return;
      }
      if (!isValidCccEmail(form.email)) {
        toast.error(EMAIL_VALIDATION_MESSAGE);
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
      if (!isValidCccEmail(form.email)) {
        toast.error(EMAIL_VALIDATION_MESSAGE);
        return;
      }
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

          {googleError && (
            <div className="flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/30 p-4 mb-4">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{googleError}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full inline-flex items-center justify-center gap-3 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.57v2.97h3.85c2.25-2.08 3.58-5.14 3.58-8.78z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.85-2.97c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.79-2.11-6.74-4.96H1.27v3.09C3.25 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.26 14.31c-.24-.72-.38-1.49-.38-2.31s.14-1.59.38-2.31V6.6H1.27A11.99 11.99 0 0 0 0 12c0 1.94.47 3.77 1.27 5.4l3.99-3.09z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.6l3.99 3.09C6.21 6.86 8.87 4.75 12 4.75z"/>
            </svg>
            {googleLoading ? 'Conectando...' : 'Continuar con Google'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">o con tu correo</span>
            </div>
          </div>

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
                placeholder="tu@cursosccc.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {isRegister && (
                <p className="text-xs text-muted-foreground">
                  Solo se permiten correos @cursosccc.com o @formacionprofesionalccc.com
                </p>
              )}
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
