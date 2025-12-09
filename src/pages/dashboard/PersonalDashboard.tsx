import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dumbbell, 
  Users, 
  TrendingUp, 
  Bell, 
  Settings, 
  LogOut,
  Plus,
  Search,
  MoreVertical,
  MessageCircle,
  Brain,
  Calendar,
  ChevronRight,
  Flame
} from "lucide-react";

// Mock data
const mockAlunos = [
  { id: 1, nome: "João Silva", objetivo: "Hipertrofia", streak: 15, ultimoTreino: "Hoje", progresso: 75 },
  { id: 2, nome: "Maria Santos", objetivo: "Emagrecimento", streak: 8, ultimoTreino: "Ontem", progresso: 60 },
  { id: 3, nome: "Pedro Oliveira", objetivo: "Condicionamento", streak: 22, ultimoTreino: "Hoje", progresso: 90 },
  { id: 4, nome: "Ana Costa", objetivo: "Hipertrofia", streak: 5, ultimoTreino: "2 dias atrás", progresso: 45 },
];

const stats = [
  { label: "Total de Alunos", value: "24", icon: Users, change: "+3 este mês" },
  { label: "Treinos Criados", value: "156", icon: Dumbbell, change: "+12 esta semana" },
  { label: "Taxa de Retenção", value: "94%", icon: TrendingUp, change: "+2% vs anterior" },
  { label: "Streak Médio", value: "12 dias", icon: Flame, change: "Recorde!" },
];

const PersonalDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlunos = mockAlunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-sidebar p-4 hidden lg:block">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-gradient">TreinAI</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link to="/dashboard/personal" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
            <Dumbbell className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/dashboard/personal/alunos" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Users className="w-5 h-5" />
            <span>Meus Alunos</span>
          </Link>
          <Link to="/dashboard/personal/treinos" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Calendar className="w-5 h-5" />
            <span>Treinos</span>
          </Link>
          <Link to="/dashboard/personal/coach" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Brain className="w-5 h-5" />
            <span>TreinAI Coach</span>
          </Link>
          <Link to="/dashboard/personal/mensagens" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>Mensagens</span>
          </Link>
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Link to="/dashboard/personal/configuracoes" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </Link>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Olá, Carlos! 👋</h1>
            <p className="text-muted-foreground">Aqui está o resumo do seu dia</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Novo Aluno
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} variant="glass" className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-primary mt-1">{stat.change}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alunos */}
        <Card variant="glass">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Seus Alunos</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar aluno..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredAlunos.map((aluno) => (
                <div 
                  key={aluno.id} 
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                      {aluno.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{aluno.nome}</p>
                      <p className="text-sm text-muted-foreground">{aluno.objetivo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-1 text-primary">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-medium">{aluno.streak} dias</span>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-primary rounded-full"
                          style={{ width: `${aluno.progresso}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{aluno.progresso}% concluído</p>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PersonalDashboard;
