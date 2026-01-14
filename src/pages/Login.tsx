import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dumbbell, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, userRole } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate input
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setIsLoading(false);
      let errorMessage = "Erro ao fazer login. Tente novamente.";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha incorretos.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Por favor, confirme seu email antes de fazer login.";
      }

      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(false);
    toast({
      title: "Login realizado!",
      description: "Bem-vindo de volta!",
    });

    // Navigate based on user role
    setTimeout(async () => {
      // Fetch the role to determine proper redirect
      if (userRole === 'professional') {
        navigate("/dashboard/trainer");
      } else if (userRole === 'student') {
        navigate("/meu-painel");
      } else if (userRole === 'admin') {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard/personal");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(0_84%_60%/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(0_84%_60%/0.05),transparent_50%)]" />

      <div className="w-full max-w-md relative">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <Card variant="glass" className="border-border/50">
          <CardHeader className="text-center pb-2">
            {/* Logo */}
            <Link to="/" className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center glow-primary">
                <Dumbbell className="w-6 h-6 text-primary-foreground" />
              </div>
            </Link>
            <CardTitle className="text-2xl font-display">Entrar no TreinAI</CardTitle>
            <CardDescription>
              Entre com seu email e senha
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">E-mail</label>
                <Input 
                  type="email" 
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Senha</label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password}</p>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Lembrar de mim</span>
                </label>
                <Link to="/recuperar-senha" className="text-primary hover:underline">
                  Esqueci a senha
                </Link>
              </div>
              <Button variant="hero" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Ainda não tem conta?{" "}
                <Link to="/cadastro" className="text-primary hover:underline font-medium">
                  Criar conta grátis
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
