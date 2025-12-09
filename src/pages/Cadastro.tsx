import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dumbbell, ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Cadastro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao TreinAI! Verifique seu e-mail.",
      });
      navigate("/dashboard/personal");
    }, 1500);
  };

  const benefits = [
    "Gestão ilimitada de alunos",
    "TreinAI Coach com IA",
    "7 dias grátis para testar",
    "Suporte prioritário"
  ];

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
            <CardTitle className="text-2xl font-display">
              {step === 1 ? "Criar sua conta" : "Dados profissionais"}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? "Comece sua jornada no TreinAI" 
                : "Complete seu perfil de personal trainer"
              }
            </CardDescription>

            {/* Progress */}
            <div className="flex gap-2 mt-4">
              <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nome completo</label>
                    <Input 
                      type="text" 
                      placeholder="Seu nome"
                      required 
                    />
                  </div>
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
                        placeholder="Mínimo 8 caracteres"
                        required 
                        minLength={8}
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">Confirmar senha</label>
                    <Input 
                      type="password" 
                      placeholder="Repita a senha"
                      required 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">CPF</label>
                    <Input 
                      type="text" 
                      placeholder="000.000.000-00"
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Número do CREF</label>
                    <Input 
                      type="text" 
                      placeholder="000000-G/SP"
                      required 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Validaremos automaticamente seu registro
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Telefone</label>
                    <Input 
                      type="tel" 
                      placeholder="(00) 00000-0000"
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Idade</label>
                    <Input 
                      type="number" 
                      placeholder="Sua idade"
                      required 
                      min={18}
                    />
                  </div>
                </>
              )}

              {/* Benefits */}
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                {step === 2 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Voltar
                  </Button>
                )}
                <Button variant="hero" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : step === 1 ? "Continuar" : "Criar conta"}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Fazer login
                </Link>
              </p>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Ao criar uma conta, você concorda com nossos{" "}
              <Link to="/termos" className="text-primary hover:underline">Termos</Link>
              {" "}e{" "}
              <Link to="/privacidade" className="text-primary hover:underline">Privacidade</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
