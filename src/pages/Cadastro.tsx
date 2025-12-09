import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dumbbell, ArrowLeft, Eye, EyeOff, Check, User, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProfileType = "profissional" | "aluno" | null;

const Cadastro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileType, setProfileType] = useState<ProfileType>(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    if (profileType === "profissional" && step === 2) {
      setStep(3);
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
      navigate(profileType === "profissional" ? "/dashboard/personal" : "/dashboard/aluno");
    }, 1500);
  };

  const benefitsProfissional = [
    "Gestão ilimitada de alunos",
    "TreinAI Coach com IA",
    "7 dias grátis para testar",
    "Suporte prioritário"
  ];

  const benefitsAluno = [
    "Acesso aos seus treinos",
    "TreinAI Coach com IA",
    "Acompanhamento de evolução",
    "Streak de treinos"
  ];

  const benefits = profileType === "aluno" ? benefitsAluno : benefitsProfissional;

  const totalSteps = profileType === "profissional" ? 3 : 2;

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
              {!profileType 
                ? "Escolha seu perfil"
                : step === 1 
                  ? "Criar sua conta" 
                  : step === 2 && profileType === "profissional"
                    ? "Dados profissionais"
                    : "Confirme seus dados"
              }
            </CardTitle>
            <CardDescription>
              {!profileType 
                ? "Selecione como deseja usar o TreinAI"
                : step === 1 
                  ? "Comece sua jornada no TreinAI" 
                  : profileType === "profissional" && step === 2
                    ? "Complete seu perfil de personal trainer"
                    : "Finalize seu cadastro"
              }
            </CardDescription>

            {/* Progress - only show after selecting profile */}
            {profileType && (
              <div className="flex gap-2 mt-4">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 flex-1 rounded-full ${step >= i + 1 ? 'bg-primary' : 'bg-muted'}`} 
                  />
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-6">
            {/* Profile Type Selection */}
            {!profileType ? (
              <div className="space-y-4">
                <button
                  onClick={() => setProfileType("profissional")}
                  className="w-full p-4 rounded-lg border border-border hover:border-primary bg-secondary/30 hover:bg-secondary/50 transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">Profissional</h3>
                    <p className="text-sm text-muted-foreground">Personal Trainer ou Educador Físico</p>
                  </div>
                </button>

                <button
                  onClick={() => setProfileType("aluno")}
                  className="w-full p-4 rounded-lg border border-border hover:border-primary bg-secondary/30 hover:bg-secondary/50 transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">Aluno</h3>
                    <p className="text-sm text-muted-foreground">Quero acessar meus treinos</p>
                  </div>
                </button>

                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Fazer login
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
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
                    {profileType === "aluno" && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Código do Personal</label>
                        <Input 
                          type="text" 
                          placeholder="Digite o código fornecido"
                          required 
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Solicite o código ao seu personal trainer
                        </p>
                      </div>
                    )}
                  </>
                ) : step === 2 && profileType === "profissional" ? (
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
                ) : null}

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
                  {step > 1 ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setStep(step - 1)}
                    >
                      Voltar
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setProfileType(null)}
                    >
                      Voltar
                    </Button>
                  )}
                  <Button variant="hero" className="flex-1" disabled={isLoading}>
                    {isLoading 
                      ? "Criando conta..." 
                      : step < totalSteps 
                        ? "Continuar" 
                        : "Criar conta"
                    }
                  </Button>
                </div>
              </form>
            )}

            {profileType && (
              <>
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
