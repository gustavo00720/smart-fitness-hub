import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, User, Users, Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent, userType: string) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login realizado!",
        description: `Bem-vindo de volta, ${userType}!`,
      });
      
      if (userType === "personal") {
        navigate("/dashboard/personal");
      } else if (userType === "aluno") {
        navigate("/dashboard/aluno");
      } else {
        navigate("/dashboard/admin");
      }
    }, 1500);
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
              Escolha seu tipo de acesso para continuar
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="personal" className="flex items-center gap-1 text-xs">
                  <User className="w-3 h-3" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="aluno" className="flex items-center gap-1 text-xs">
                  <Users className="w-3 h-3" />
                  Aluno
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-1 text-xs">
                  <Shield className="w-3 h-3" />
                  Admin
                </TabsTrigger>
              </TabsList>

              {/* Personal Login */}
              <TabsContent value="personal">
                <form onSubmit={(e) => handleLogin(e, "personal")} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">E-mail</label>
                    <Input 
                      type="email" 
                      placeholder="seu@email.com"
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Senha</label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••"
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
                    {isLoading ? "Entrando..." : "Entrar como Personal"}
                  </Button>
                </form>
              </TabsContent>

              {/* Aluno Login */}
              <TabsContent value="aluno">
                <form onSubmit={(e) => handleLogin(e, "aluno")} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Código do Personal</label>
                    <Input 
                      type="text" 
                      placeholder="ABC123"
                      required 
                      className="uppercase"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Código fornecido pelo seu personal trainer
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Seu Nome</label>
                    <Input 
                      type="text" 
                      placeholder="João Silva"
                      required 
                    />
                  </div>
                  <Button variant="hero" className="w-full" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar como Aluno"}
                  </Button>
                </form>
              </TabsContent>

              {/* Admin Login */}
              <TabsContent value="admin">
                <form onSubmit={(e) => handleLogin(e, "admin")} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">E-mail Admin</label>
                    <Input 
                      type="email" 
                      placeholder="admin@treinai.com"
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Senha Master</label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••"
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
                  </div>
                  <Button variant="hero" className="w-full" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar como Admin"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

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
