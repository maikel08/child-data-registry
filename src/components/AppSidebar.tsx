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
  useSidebar,
} from "@/components/ui/sidebar";
import { useState } from "react";

const items = [
  {
    title: "Registro",
    value: "register",
    icon: Home,
  },
  {
    title: "Lista de Estudiantes",
    value: "list",
    icon: Users,
  },
  {
    title: "Control de Asistencia",
    value: "attendance",
    icon: Calendar,
  },
  {
    title: "Lista Mensual",
    value: "monthly",
    icon: Calendar,
  },
  {
    title: "Reporte de Asistencia",
    value: "report",
    icon: BarChart2,
  },
  {
    title: "Dashboard",
    value: "dashboard",
    icon: BarChart2,
  },
  {
    title: "Pruebas Psicológicas",
    value: "psychological",
    icon: Brain,
  },
];

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();
  const [showAllTabs, setShowAllTabs] = useState(false);
  
  const handleMenuClick = (value: string) => {
    onTabChange(value);
    setOpenMobile(false);
    if (value === "register") {
      setShowAllTabs(true);
    }
  };

  const visibleItems = showAllTabs ? items : items.filter(item => item.value === "register");
  
  return (
    <Sidebar>
      <SidebarContent className="bg-primary">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    data-active={activeTab === item.value}
                    onClick={() => handleMenuClick(item.value)}
                    className="text-white hover:bg-secondary"
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