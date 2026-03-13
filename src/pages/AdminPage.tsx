import PageHeader from '@/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Megaphone, FileText, Bell, Network, Plus, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const mockUsers = [
  { id: '1', name: 'Carlos García', email: 'carlos@ccc.com', department: 'Tecnología', role: 'admin', active: true },
  { id: '2', name: 'María Fernández', email: 'maria@ccc.com', department: 'RRHH', role: 'hr_team', active: true },
  { id: '3', name: 'Pedro López', email: 'pedro@ccc.com', department: 'Tecnología', role: 'employee', active: true },
  { id: '4', name: 'Laura Sánchez', email: 'laura@ccc.com', department: 'Diseño', role: 'employee', active: false },
];

const roleLabels: Record<string, string> = { admin: 'Admin', hr_team: 'RRHH', employee: 'Empleado' };

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Administración"
        description="Gestión de usuarios, comunicaciones y documentos"
      />

      <Tabs defaultValue="users">
        <TabsList className="bg-muted">
          <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-card"><Users className="h-4 w-4" /> Usuarios</TabsTrigger>
          <TabsTrigger value="comms" className="gap-2 data-[state=active]:bg-card"><Megaphone className="h-4 w-4" /> Comunicaciones</TabsTrigger>
          <TabsTrigger value="docs" className="gap-2 data-[state=active]:bg-card"><FileText className="h-4 w-4" /> Documentos</TabsTrigger>
          <TabsTrigger value="notifs" className="gap-2 data-[state=active]:bg-card"><Bell className="h-4 w-4" /> Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar usuario..." className="pl-10" />
            </div>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Nuevo usuario</Button>
          </div>
          <div className="rounded-xl border bg-card card-shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium text-muted-foreground">Usuario</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Departamento</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Rol</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Estado</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">{u.name.split(' ').map(w => w[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-card-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{u.department}</td>
                    <td className="p-3"><Badge variant="outline">{roleLabels[u.role]}</Badge></td>
                    <td className="p-3">
                      <Badge className={u.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}>
                        {u.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">Editar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="comms" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Gestiona los comunicados internos</p>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Nuevo comunicado</Button>
          </div>
          <div className="rounded-xl border bg-card p-8 card-shadow text-center text-muted-foreground">
            <Megaphone className="mx-auto h-12 w-12 mb-3 text-muted-foreground/40" />
            <p>Panel de gestión de comunicaciones</p>
            <p className="text-xs mt-1">Crea, edita y publica comunicados internos</p>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Sube y gestiona documentos de la empresa</p>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Subir documento</Button>
          </div>
          <div className="rounded-xl border bg-card p-8 card-shadow text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-3 text-muted-foreground/40" />
            <p>Gestor de documentos</p>
            <p className="text-xs mt-1">PDF, DOC, imágenes con metadatos</p>
          </div>
        </TabsContent>

        <TabsContent value="notifs" className="mt-4">
          <div className="rounded-xl border bg-card p-8 card-shadow text-center text-muted-foreground">
            <Bell className="mx-auto h-12 w-12 mb-3 text-muted-foreground/40" />
            <p>Gestión de notificaciones</p>
            <p className="text-xs mt-1">Envía notificaciones a empleados</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
