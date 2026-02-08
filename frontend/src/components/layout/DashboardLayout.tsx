import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex h-screen w-full flex-col overflow-hidden">
        <SidebarTrigger />
        <>{children}</>
      </main>
    </SidebarProvider>
  );
}
