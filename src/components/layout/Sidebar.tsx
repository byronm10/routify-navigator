
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, UsersIcon, TruckIcon, MapIcon, CalendarIcon, 
  SettingsIcon, ClipboardListIcon, MenuIcon, XIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Inicio", href: "/dashboard", icon: HomeIcon },
    { name: "Rutas", href: "/dashboard/routes", icon: MapIcon },
    { name: "Vehículos", href: "/dashboard/vehicles", icon: TruckIcon },
    { name: "Personal", href: "/dashboard/users", icon: UsersIcon },
    { name: "Programación", href: "/dashboard/scheduling", icon: CalendarIcon },
    { name: "Reportes", href: "/dashboard/reports", icon: ClipboardListIcon },
    { name: "Configuración", href: "/dashboard/settings", icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <MenuIcon /> : <XIcon />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "bg-[#080b53] text-white fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          collapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-center border-b border-white/10">
          <h1 className="text-xl font-bold">Routify</h1>
        </div>
        <nav className="flex flex-col h-[calc(100%-4rem)] p-4">
          <div className="space-y-2 flex-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors",
                  location.pathname === item.href
                    ? "bg-white/20 font-medium"
                    : "text-white/70"
                )}
                onClick={() => setCollapsed(true)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};
