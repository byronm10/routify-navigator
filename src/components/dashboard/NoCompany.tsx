
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BuildingIcon, PlusCircleIcon } from "lucide-react";

export const NoCompany = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <BuildingIcon className="h-16 w-16 text-[#080b53]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">No tienes empresas registradas</h1>
        <p className="text-gray-600 mb-6">
          Para comenzar a utilizar Routify, necesitas crear una empresa.
        </p>
        <Button 
          className="bg-[#080b53] hover:bg-[#0a0e6b]"
          onClick={() => navigate("/setup-company")}
        >
          <PlusCircleIcon className="mr-2 h-5 w-5" />
          Crear Nueva Empresa
        </Button>
      </div>
    </div>
  );
};
