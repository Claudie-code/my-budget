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
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <NavLink to="/" className="flex items-center gap-2">
                <Wallet className="size-5!" />
                <span className="text-base font-semibold text-foreground">MyBudget.</span>
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
                      <span
                        className={`flex items-center gap-2 p-2 rounded-md hover:bg-accent/10 ${isActive ? ' bg-accent/20 font-semibold' : ''}`}
                      >
                        {item.icon}
                        {item.name}
                      </span>
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
