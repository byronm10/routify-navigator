
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import logo from "../assets/logo.svg";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#080b53] to-[#0a0e6b] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src={logo} 
            alt="Routify Logo" 
            className="mx-auto h-20 mb-4"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <h1 className="text-3xl font-bold text-white">Routify</h1>
          <p className="text-white/70 mt-2">
            Gestión de flotas de buses privados
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">Bienvenido</CardTitle>
            <CardDescription className="text-center">
              Administre su flota de buses con facilidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
            <p>
              Routify - La solución integral para empresas de transporte
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
