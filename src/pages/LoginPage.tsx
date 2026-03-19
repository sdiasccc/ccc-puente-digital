import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAppStore();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
        toast.error('Rellena todos los campos');
        return;
      }
      const ok = register(form.name.trim(), form.email.trim(), form.password);
      if (ok) {
        toast.success('¡Cuenta creada con éxito!');
        navigate('/');
      } else {
        toast.error('Ya existe una cuenta con ese email');
      }
    } else {
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
          <h1 className="text-3xl font-bold text-white">CCC</h1>
          <p className="text-white/60 mt-2">Portal del empleado</p>
        </div>

        <div className="rounded-2xl bg-card p-8 card-shadow">
          <h2 className="text-xl font-semibold text-secondary mb-6">
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
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
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Iniciar sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
