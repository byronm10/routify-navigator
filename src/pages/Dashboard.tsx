
import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/Sidebar";
import { CompanyDashboard } from "@/components/dashboard/CompanyDashboard";
import { CompanySelector } from "@/components/dashboard/CompanySelector";
import { NoCompany } from "@/components/dashboard/NoCompany";
import { useCompanies } from "@/hooks/useCompanies";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { companies, isLoading } = useCompanies();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  useEffect(() => {
    // If user has no companies, redirect to setup
    if (!isLoading && companies.length === 0) {
      navigate("/setup-company");
    } else if (!isLoading && companies.length > 0 && !selectedCompany) {
      // Set first company as default
      setSelectedCompany(companies[0].id);
    }
  }, [companies, isLoading, navigate, selectedCompany]);

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Sesión cerrada",
      description: "Ha cerrado sesión correctamente",
    });
    navigate("/");
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (companies.length === 0) {
    return <NoCompany />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            <CompanySelector 
              companies={companies} 
              selectedCompany={selectedCompany} 
              onSelectCompany={setSelectedCompany} 
            />
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Cerrar Sesión
          </Button>
        </header>

        <main className="p-6">
          <Routes>
            <Route path="/" element={
              selectedCompany ? (
                <CompanyDashboard companyId={selectedCompany} />
              ) : (
                <div>Por favor seleccione una empresa</div>
              )
            } />
            <Route path="*" element={<div>Página no encontrada</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
