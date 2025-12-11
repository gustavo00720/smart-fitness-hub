import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Brain,
  Calendar,
  ChevronRight,
  Flame,
  MessageCircle,
  Copy,
  Check
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useStudents } from "@/hooks/useStudents";
import { useWorkouts } from "@/hooks/useWorkouts";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const PersonalDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { students, loading: loadingStudents } = useStudents();
  const { workouts } = useWorkouts();
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [profileName, setProfileName] = useState("Personal");

  useEffect(() => {
    const fetchProfessionalData = async () => {
      if (!user) return;

      const { data: professional } = await supabase
        .from('professionals')
        .select('invite_code')
        .eq('user_id', user.id)
        .maybeSingle();

      if (professional) {
        setInviteCode(professional.invite_code);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setProfileName(profile.full_name.split(' ')[0]);
      }
    };

    fetchProfessionalData();
  }, [user]);

  const filteredStudents = students.filter(student =>
    student.profile?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const copyInviteCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "Compartilhe com seus alunos para eles se cadastrarem."
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stats = [
    { label: "Total de Alunos", value: students.length.toString(), icon: Users, change: "ativos" },
    { label: "Treinos Criados", value: workouts.length.toString(), icon: Dumbbell, change: "no total" },
    { label: "Taxa de Retenção", value: "94%", icon: TrendingUp, change: "+2% vs anterior" },
    { label: "Streak Médio", value: students.length > 0 
      ? `${Math.round(students.reduce((acc, s) => acc + s.streak_days, 0) / students.length)} dias` 
      : "0 dias", icon: Flame, change: "média geral" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-sidebar p-4 hidden lg:block">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-gradient">TreinAI</span>
        </Link>

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

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Link to="/dashboard/personal/configuracoes" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </Link>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
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
            <h1 className="text-2xl md:text-3xl font-display font-bold">Olá, {profileName}! 👋</h1>
            <p className="text-muted-foreground">Aqui está o resumo do seu dia</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Link to="/dashboard/personal/treinos/novo">
              <Button variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                Novo Treino
              </Button>
            </Link>
          </div>
        </div>

        {/* Invite Code Card */}
        {inviteCode && (
          <Card variant="gradient" className="mb-6 border-primary/30">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Seu código de convite</p>
                <p className="text-2xl font-display font-bold tracking-wider">{inviteCode}</p>
              </div>
              <Button variant="outline" onClick={copyInviteCode}>
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </CardContent>
          </Card>
        )}

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

        {/* Students */}
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
            {loadingStudents ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum aluno encontrado</p>
                <p className="text-sm">Compartilhe seu código de convite para adicionar alunos</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <Link
                    key={student.id}
                    to={`/dashboard/personal/alunos/${student.id}`}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                        {student.profile?.full_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium">{student.profile?.full_name || 'Sem nome'}</p>
                        <p className="text-sm text-muted-foreground">{student.goal || 'Sem objetivo definido'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="hidden md:flex items-center gap-1 text-primary">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-medium">{student.streak_days} dias</span>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PersonalDashboard;
