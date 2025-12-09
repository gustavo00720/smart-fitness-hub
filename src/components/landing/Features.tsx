import { Card, CardContent } from "@/components/ui/card";
import { 
  Dumbbell, 
  Brain, 
  TrendingUp, 
  Bell, 
  Users, 
  Shield, 
  Zap,
  MessageCircle 
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA Coach Inteligente",
    description: "Assistente virtual que sugere treinos, tira dúvidas e motiva seus alunos 24/7."
  },
  {
    icon: Dumbbell,
    title: "Gestão de Treinos",
    description: "Crie, envie e acompanhe treinos personalizados com vídeos e instruções detalhadas."
  },
  {
    icon: TrendingUp,
    title: "Acompanhamento de Evolução",
    description: "Gráficos e métricas que mostram o progresso real de cada aluno."
  },
  {
    icon: Bell,
    title: "Notificações Automáticas",
    description: "Lembretes de treino, alertas de pagamento e mensagens motivacionais."
  },
  {
    icon: Users,
    title: "Gestão de Alunos",
    description: "Organize sua carteira de clientes com fichas completas e histórico."
  },
  {
    icon: Shield,
    title: "Validação CREF",
    description: "Verificação automática do registro profissional para credibilidade."
  },
  {
    icon: Zap,
    title: "Streak de Treinos",
    description: "Gamificação que mantém seus alunos motivados e consistentes."
  },
  {
    icon: MessageCircle,
    title: "Chat Integrado",
    description: "Comunicação direta entre personal e aluno dentro da plataforma."
  }
];

const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Recursos
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-4 mb-6">
            Tudo que você precisa em um{" "}
            <span className="text-gradient">só lugar</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Ferramentas poderosas para transformar sua forma de trabalhar e entregar 
            resultados extraordinários para seus alunos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="glass"
              className="group hover:border-primary/50 hover:glow-primary transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-display font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
