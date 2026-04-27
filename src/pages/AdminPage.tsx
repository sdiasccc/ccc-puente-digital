import { useRef } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Megaphone, FileText, Bell, GraduationCap, HelpCircle, Gift, Network, Star, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import CmsUsersTab from '@/components/admin/CmsUsersTab';
import CmsCommunicationsTab from '@/components/admin/CmsCommunicationsTab';
import CmsDocumentsTab from '@/components/admin/CmsDocumentsTab';
import CmsCoursesTab from '@/components/admin/CmsCoursesTab';
import CmsFaqTab from '@/components/admin/CmsFaqTab';
import CmsBenefitsTab from '@/components/admin/CmsBenefitsTab';
import CmsOrgChartTab from '@/components/admin/CmsOrgChartTab';
import CmsHighlightsTab from '@/components/admin/CmsHighlightsTab';
import CmsNotificationsTab from '@/components/admin/CmsNotificationsTab';
import CmsHistoryTab from '@/components/admin/CmsHistoryTab';

export default function AdminPage() {
  const { hasPermission, currentUser } = useAppStore();
  const canManage = hasPermission('manage_cms');
  const canViewHistory = currentUser.role === 'support';
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (dir: 'left' | 'right') => {
    const el = tabsScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'comms', label: 'Comunicaciones', icon: Megaphone },
    { id: 'docs', label: 'Documentos', icon: FileText },
    { id: 'courses', label: 'Cursos', icon: GraduationCap },
    { id: 'faq', label: 'FAQ IT', icon: HelpCircle },
    { id: 'benefits', label: 'Beneficios', icon: Gift },
    { id: 'org', label: 'Organigrama', icon: Network },
    { id: 'highlights', label: 'Destacados', icon: Star },
    { id: 'notifs', label: 'Notificaciones', icon: Bell },
    ...(canViewHistory ? [{ id: 'history', label: 'Historial', icon: History }] : []),
  ];

  if (!canManage) {
    return (
      <div className="space-y-6">
        <PageHeader title="Administración" description="No tienes permisos para acceder a esta sección" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administración CMS"
        description="Gestiona todo el contenido del portal sin necesidad de editar código"
      />

      <Tabs defaultValue="users">
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollTabs('left')}
            className="admin-hover-target absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card border border-border p-1.5 card-shadow hover:bg-muted transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
          <button
            type="button"
            onClick={() => scrollTabs('right')}
            className="admin-hover-target absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card border border-border p-1.5 card-shadow hover:bg-muted transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
          <div
            ref={tabsScrollRef}
            className="admin-tabs-scroll mx-10 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.admin-tabs-scroll::-webkit-scrollbar { display: none; }`}</style>
            <TabsList className="bg-muted inline-flex w-auto">
              {tabs.map((t) => (
                <TabsTrigger key={t.id} value={t.id} className="admin-hover-target gap-2 data-[state=active]:bg-card whitespace-nowrap border border-transparent">
                  <t.icon className="h-4 w-4" /> <span className="hidden sm:inline">{t.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <TabsContent value="users" className="mt-4"><CmsUsersTab /></TabsContent>
        <TabsContent value="comms" className="mt-4"><CmsCommunicationsTab /></TabsContent>
        <TabsContent value="docs" className="mt-4"><CmsDocumentsTab /></TabsContent>
        <TabsContent value="courses" className="mt-4"><CmsCoursesTab /></TabsContent>
        <TabsContent value="faq" className="mt-4"><CmsFaqTab /></TabsContent>
        <TabsContent value="benefits" className="mt-4"><CmsBenefitsTab /></TabsContent>
        <TabsContent value="org" className="mt-4"><CmsOrgChartTab /></TabsContent>
        <TabsContent value="highlights" className="mt-4"><CmsHighlightsTab /></TabsContent>
        <TabsContent value="notifs" className="mt-4"><CmsNotificationsTab /></TabsContent>
        {canViewHistory && (
          <TabsContent value="history" className="mt-4"><CmsHistoryTab /></TabsContent>
        )}
      </Tabs>
    </div>
  );
}
