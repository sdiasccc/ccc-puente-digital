import { Bell, Search, Menu, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

export default function AppHeader() {
  const { currentUser, notifications, toggleSidebar } = useAppStore();
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const initials = currentUser.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-sidebar-border bg-secondary px-4">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="rounded-md p-2 hover:bg-sidebar-accent lg:hidden">
          <Menu className="h-5 w-5 text-secondary-foreground" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">CCC</span>
          </div>
          <span className="hidden text-lg font-bold text-secondary-foreground sm:block">Portal CCC</span>
        </div>
      </div>

      <div className="hidden max-w-md flex-1 px-8 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground/60" />
          <Input
            placeholder="Buscar en el portal..."
            className="h-9 pl-10 bg-sidebar-accent border-0 text-secondary-foreground placeholder:text-sidebar-foreground/60 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative rounded-md p-2 hover:bg-muted">
              <Bell className="h-5 w-5 text-foreground" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                  {unreadCount}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2 font-semibold text-sm">Notificaciones</div>
            <DropdownMenuSeparator />
            {notifications.slice(0, 5).map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3">
                <span className={`text-sm font-medium ${n.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {n.title}
                </span>
                <span className="text-xs text-muted-foreground line-clamp-1">{n.message}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium leading-none text-foreground">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.department}</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/perfil')}>Mi perfil</DropdownMenuItem>
            {(currentUser.role === 'admin' || currentUser.role === 'hr_team') && (
              <DropdownMenuItem onClick={() => navigate('/admin')}>Administración</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
