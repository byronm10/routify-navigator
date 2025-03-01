
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TruckIcon, UsersIcon, MapIcon, AlertTriangleIcon } from "lucide-react";

interface CompanyDashboardProps {
  companyId: string;
}

// Mock data - would come from your API
const dashboardData = {
  vehicles: {
    total: 45,
    active: 32,
    maintenance: 8,
    inactive: 5
  },
  routes: {
    total: 78,
    active: 58,
    completed: 12,
    suspended: 8
  },
  staff: {
    total: 112,
    drivers: 48,
    helpers: 32,
    operators: 15,
    others: 17
  },
  incidents: [
    { date: "2023-05-01", count: 3 },
    { date: "2023-05-02", count: 1 },
    { date: "2023-05-03", count: 0 },
    { date: "2023-05-04", count: 2 },
    { date: "2023-05-05", count: 5 },
    { date: "2023-05-06", count: 2 },
    { date: "2023-05-07", count: 1 }
  ],
  recentActivity: [
    { id: 1, type: "route_completed", description: "Ruta BOG-MED completada", timestamp: "2023-05-07T15:30:00Z" },
    { id: 2, type: "maintenance_scheduled", description: "Mantenimiento programado para vehículo ABC-123", timestamp: "2023-05-07T14:20:00Z" },
    { id: 3, type: "driver_assigned", description: "Conductor asignado a ruta BOG-CTG", timestamp: "2023-05-07T12:10:00Z" },
    { id: 4, type: "incident_reported", description: "Incidente reportado en ruta MED-CTG", timestamp: "2023-05-07T10:05:00Z" },
    { id: 5, type: "vehicle_added", description: "Nuevo vehículo registrado XYZ-789", timestamp: "2023-05-06T16:45:00Z" },
  ]
};

export const CompanyDashboard = ({ companyId }: CompanyDashboardProps) => {
  const [timeframe, setTimeframe] = useState<string>("week");
  
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", companyId, timeframe],
    queryFn: () => {
      // This would be a real API call
      console.log(`Fetching dashboard data for company ${companyId} with timeframe ${timeframe}`);
      return Promise.resolve(dashboardData);
    },
    enabled: !!companyId,
  });
  
  if (isLoading || !data) {
    return <div>Cargando datos del dashboard...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Panel de Control</h2>
        <Tabs value={timeframe} onValueChange={setTimeframe} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mes</TabsTrigger>
            <TabsTrigger value="year">Año</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehículos</CardTitle>
            <TruckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.vehicles.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.vehicles.active} activos, {data.vehicles.maintenance} en mantenimiento
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rutas</CardTitle>
            <MapIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.routes.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.routes.active} activas, {data.routes.completed} completadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.staff.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.staff.drivers} conductores, {data.staff.helpers} ayudantes
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Incidentes Recientes</CardTitle>
            <CardDescription>Número de incidentes reportados</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.incidents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#080b53" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {data.recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${
                    activity.type.includes("incident") 
                      ? "bg-red-100" 
                      : "bg-blue-100"
                  }`}>
                    {activity.type.includes("incident") 
                      ? <AlertTriangleIcon className="h-4 w-4 text-red-500" />
                      : activity.type.includes("route") 
                        ? <MapIcon className="h-4 w-4 text-blue-500" />
                        : activity.type.includes("vehicle") 
                          ? <TruckIcon className="h-4 w-4 text-green-500" />
                          : <UsersIcon className="h-4 w-4 text-purple-500" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
