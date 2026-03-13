import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Megaphone, FileText, Bell, GraduationCap, HelpCircle, Gift, Network, Star } from 'lucide-react';
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
];

export default function AdminPage() {
  const { hasPermission } = useAppStore();
  const canManage = hasPermission('manage_cms');

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
        <div className="overflow-x-auto -mx-6 px-6">
          <TabsList className="bg-muted inline-flex w-auto">
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="gap-2 data-[state=active]:bg-card whitespace-nowrap">
                <t.icon className="h-4 w-4" /> <span className="hidden sm:inline">{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
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
      </Tabs>
    </div>
  );
}
