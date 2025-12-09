import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const features = [
    "Gestão ilimitada de alunos",
    "TreinAI Coach (IA)",
    "Criação de treinos personalizados",
    "Acompanhamento de evolução",
    "Notificações automáticas",
    "Validação CREF",
    "Suporte prioritário",
    "Relatórios avançados"
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Preços
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-4 mb-6">
            Simples e{" "}
            <span className="text-gradient">transparente</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Um único plano com tudo incluído. Sem surpresas, sem taxas escondidas.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <Card variant="glass" className="relative overflow-hidden border-primary/50 glow-primary">
            {/* Badge */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                <Star className="w-3 h-3" />
                Mais Popular
              </div>
            </div>

            <CardHeader className="text-center pb-0">
              <CardTitle className="text-2xl font-display">Plano Profissional</CardTitle>
              <div className="mt-6">
                <span className="text-5xl font-display font-black">R$49</span>
                <span className="text-muted-foreground">,90/mês</span>
              </div>
            </CardHeader>

            <CardContent className="pt-8">
              <ul className="space-y-4 mb-8">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/cadastro">
                <Button variant="hero" size="lg" className="w-full">
                  Começar Agora
                </Button>
              </Link>

              <p className="text-center text-xs text-muted-foreground mt-4">
                7 dias grátis para testar. Cancele quando quiser.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
