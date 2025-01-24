import { Home, Users, Calendar, BarChart2, Brain } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Lista de Estudiantes",
    url: "#list",
    icon: Users,
  },
  {
    title: "Control de Asistencia",
    url: "#attendance",
    icon: Calendar,
  },
  {
    title: "Dashboard",
    url: "#dashboard",
    icon: BarChart2,
  },
  {
    title: "Pruebas Psicológicas",
    url: "#psychological",
    icon: Brain,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => {
                      const element = document.querySelector(`[value="${item.url.replace("#", "")}"]`);
                      if (element) {
                        (element as HTMLElement).click();
                      }
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}