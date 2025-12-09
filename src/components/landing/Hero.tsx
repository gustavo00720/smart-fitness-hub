import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Users, Brain } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Plataforma #1 para Personal Trainers</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black mb-6 animate-slide-up delay-100">
            Transforme sua carreira com{" "}
            <span className="text-gradient">Inteligência Artificial</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up delay-200">
            O TreinAI conecta personais e alunos com tecnologia de ponta. 
            Automatize treinos, acompanhe evolução e use IA para resultados extraordinários.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center mb-16 animate-slide-up delay-300">
            <Link to="/cadastro">
              <Button variant="hero" size="xl" className="group">
                Começar
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-slide-up delay-400">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-3xl md:text-4xl font-display font-bold">5k+</span>
              </div>
              <p className="text-sm text-muted-foreground">Personais Ativos</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-3xl md:text-4xl font-display font-bold">50k+</span>
              </div>
              <p className="text-sm text-muted-foreground">Treinos com IA</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-3xl md:text-4xl font-display font-bold">98%</span>
              </div>
              <p className="text-sm text-muted-foreground">Satisfação</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
