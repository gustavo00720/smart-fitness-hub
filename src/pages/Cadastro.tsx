import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dumbbell, ArrowLeft, Eye, EyeOff, Check, User, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

type ProfileType = "profissional" | "aluno" | null;

const signupSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const Cadastro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileType, setProfileType] = useState<ProfileType>(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [crefNumber, setCrefNumber] = useState("");
  const [crefState, setCrefState] = useState("");
  const [age, setAge] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (step === 1) {
      // Validate step 1
      const result = signupSchema.safeParse({ fullName, email, password, confirmPassword });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
      setStep(2);
      return;
    }

    if (profileType === "profissional" && step === 2) {
      if (!crefNumber || !crefState) {
        setErrors({
          crefNumber: !crefNumber ? "CREF é obrigatório" : "",
          crefState: !crefState ? "Estado do CREF é obrigatório" : "",
        });
        return;
      }
      setStep(3);
      return;
    }

    // Final step - submit registration
    setIsLoading(true);

    const additionalData: Record<string, any> = {
      phone,
    };

    if (profileType === "profissional") {
      additionalData.cref_number = crefNumber;
      additionalData.cref_state = crefState;
    } else {
      additionalData.invite_code = inviteCode;
      additionalData.age = age ? parseInt(age) : null;
    }

    const { error } = await signUp(
      email,
      password,
      fullName,
      profileType === "profissional" ? "professional" : "student",
      additionalData
    );

    if (error) {
      setIsLoading(false);
      let errorMessage = "Erro ao criar conta. Tente novamente.";
      
      if (error.message.includes("User already registered")) {
        errorMessage = "Este email já está cadastrado.";
      } else if (error.message.includes("Password")) {
        errorMessage = "Senha muito fraca. Use letras, números e símbolos.";
      }

      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(false);
    toast({
      title: "Conta criada com sucesso!",
      description: "Bem-vindo ao TreinAI!",
    });
    
    navigate(profileType === "profissional" ? "/dashboard/personal" : "/dashboard/aluno");
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
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required 
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                      )}
                    </div>
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
                          placeholder="Mínimo 8 caracteres"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                      {errors.password && (
                        <p className="text-sm text-destructive mt-1">{errors.password}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Confirmar senha</label>
                      <Input 
                        type="password" 
                        placeholder="Repita a senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required 
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                    {profileType === "aluno" && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Código do Personal (opcional)</label>
                        <Input 
                          type="text" 
                          placeholder="Digite o código fornecido"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                          className="uppercase"
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
                      <label className="text-sm font-medium mb-2 block">Telefone</label>
                      <Input 
                        type="tel" 
                        placeholder="(00) 00000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Número do CREF</label>
                      <Input 
                        type="text" 
                        placeholder="000000-G"
                        value={crefNumber}
                        onChange={(e) => setCrefNumber(e.target.value)}
                        required 
                      />
                      {errors.crefNumber && (
                        <p className="text-sm text-destructive mt-1">{errors.crefNumber}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Estado do CREF</label>
                      <Input 
                        type="text" 
                        placeholder="SP"
                        value={crefState}
                        onChange={(e) => setCrefState(e.target.value.toUpperCase())}
                        maxLength={2}
                        className="uppercase"
                        required 
                      />
                      {errors.crefState && (
                        <p className="text-sm text-destructive mt-1">{errors.crefState}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Validaremos automaticamente seu registro
                      </p>
                    </div>
                  </>
                ) : step === 2 && profileType === "aluno" ? (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Telefone (opcional)</label>
                      <Input 
                        type="tel" 
                        placeholder="(00) 00000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Idade (opcional)</label>
                      <Input 
                        type="number" 
                        placeholder="Sua idade"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        min={10}
                        max={100}
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
