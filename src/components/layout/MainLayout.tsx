import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <AppSidebar />
      <main className="pt-16 lg:pl-[260px]">
        <div className="p-6 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
