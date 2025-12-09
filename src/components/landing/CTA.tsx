import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Dumbbell } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-primary opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(0_84%_60%/0.2),transparent_70%)]" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
            <Dumbbell className="w-10 h-10 text-primary-foreground" />
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Pronto para transformar sua{" "}
            <span className="text-gradient">carreira?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Junte-se a milhares de personal trainers que já estão usando 
            inteligência artificial para entregar resultados extraordinários.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/cadastro">
              <Button variant="hero" size="xl" className="group">
                Criar Conta Grátis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/contato">
              <Button variant="glass" size="xl">
                Falar com Vendas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
