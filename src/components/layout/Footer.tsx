import { Link } from "react-router-dom";
import { Dumbbell, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-gradient">
                TreinAI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              A plataforma inteligente que conecta personal trainers e alunos.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Produto</h4>
            <ul className="space-y-2">
              <li><Link to="/recursos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Recursos</Link></li>
              <li><Link to="/precos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Preços</Link></li>
              <li><Link to="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Demonstração</Link></li>
              <li><Link to="/novidades" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Novidades</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><Link to="/sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sobre</Link></li>
              <li><Link to="/contato" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contato</Link></li>
              <li><Link to="/carreiras" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Carreiras</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacidade</Link></li>
              <li><Link to="/termos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Termos de Uso</Link></li>
              <li><Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TreinAI. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
