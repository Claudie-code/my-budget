import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './Sidebar';
import { PageHeader } from './PageHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex h-screen w-full flex-col overflow-hidden">
        <SidebarTrigger />
        <PageHeader />
        <div className="flex flex-1 min-h-0">{children}</div>
      </main>
    </SidebarProvider>
  );
}
