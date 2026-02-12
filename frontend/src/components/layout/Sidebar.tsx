import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

import { Settings, LayoutDashboard, Wallet } from 'lucide-react';
import { NavLink } from 'react-router';

export function AppSidebar() {
  const menuItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      to: '/dashboard',
    },
    {
      name: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      to: '/settings',
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu className="pt-10">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="dashboard"
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! mt-3 mb-2"
            >
              <NavLink to="/dashboard" className="gap-2">
                <div className="text-orange-600">
                  <Wallet className="size-5!" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-orange-600">MyBudget</h1>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton tooltip={item.name} asChild>
                  <NavLink to={item.to}>
                    {({ isActive }) => (
                      <>
                        {item.icon}
                        <span className={`${isActive ? 'font-semibold' : ''}`}>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
