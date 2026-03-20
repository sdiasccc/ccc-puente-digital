import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import AppFooter from './AppFooter';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <AppSidebar />
      <main className="pt-16 lg:pl-[260px] flex-1">
        <div className="p-6 animate-fade-in">
          <Outlet />
        </div>
        <div className="lg:pl-0">
          <AppFooter />
        </div>
      </main>
    </div>
  );
}
