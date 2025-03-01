
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  code: z.string().min(6, "El código debe tener al menos 6 caracteres"),
});

interface VerificationFormProps {
  email: string;
  onSuccess: () => void;
}

export const VerificationForm = ({ email, onSuccess }: VerificationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { confirmSignUp } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await confirmSignUp(values.email, values.code);
      toast({
        title: "Verificación exitosa",
        description: "Su cuenta ha sido verificada. Puede iniciar sesión ahora.",
      });
      onSuccess();
    } catch (error) {
      console.error("Error confirming sign up:", error);
      toast({
        variant: "destructive",
        title: "Error de verificación",
        description: "Código inválido o expirado. Intente nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código de Verificación</FormLabel>
              <FormControl>
                <Input placeholder="123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#080b53] hover:bg-[#0a0e6b]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            "Verificar Cuenta"
          )}
        </Button>
      </form>
    </Form>
  );
};
