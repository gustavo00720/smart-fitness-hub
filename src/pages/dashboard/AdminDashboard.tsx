import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dumbbell, 
  Users, 
  TrendingUp, 
  Shield,
  Settings, 
  LogOut,
  Search,
  DollarSign,
  UserCheck,
  UserX,
  MoreVertical,
  Eye,
  Ban,
  Trash2,
  BarChart3
} from "lucide-react";

// Mock data
const mockPersonais = [
  { id: 1, nome: "Carlos Ferreira", email: "carlos@email.com", cref: "123456-G/SP", status: "ativo", alunos: 24, assinatura: "ativa", dataVencimento: "2024-02-15" },
  { id: 2, nome: "Ana Paula", email: "ana@email.com", cref: "789012-G/RJ", status: "ativo", alunos: 18, assinatura: "ativa", dataVencimento: "2024-02-20" },
  { id: 3, nome: "Ricardo Santos", email: "ricardo@email.com", cref: "345678-G/MG", status: "pendente", alunos: 0, assinatura: "pendente", dataVencimento: "-" },
  { id: 4, nome: "Julia Costa", email: "julia@email.com", cref: "901234-G/SP", status: "suspenso", alunos: 12, assinatura: "vencida", dataVencimento: "2024-01-15" },
];

const stats = [
  { label: "Total de Personais", value: "156", icon: Users, color: "text-blue-500" },
  { label: "Assinaturas Ativas", value: "142", icon: UserCheck, color: "text-green-500" },
  { label: "Receita Mensal", value: "R$ 7.100", icon: DollarSign, color: "text-primary" },
  { label: "Inadimplentes", value: "8", icon: UserX, color: "text-yellow-500" },
];

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPersonais = mockPersonais.filter(personal =>
    personal.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    personal.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      ativo: "bg-green-500/20 text-green-500",
      pendente: "bg-yellow-500/20 text-yellow-500",
      suspenso: "bg-red-500/20 text-red-500"
    };
    return styles[status as keyof typeof styles] || styles.pendente;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-sidebar p-4 hidden lg:block">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-gradient">Admin</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link to="/dashboard/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/dashboard/admin/personais" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Users className="w-5 h-5" />
            <span>Personais</span>
          </Link>
          <Link to="/dashboard/admin/assinaturas" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <DollarSign className="w-5 h-5" />
            <span>Assinaturas</span>
          </Link>
          <Link to="/dashboard/admin/relatorios" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span>Relatórios</span>
          </Link>
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Link to="/dashboard/admin/configuracoes" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
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
            <h1 className="text-2xl md:text-3xl font-display font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerencie a plataforma TreinAI</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Exportar Relatório
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
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personais Table */}
        <Card variant="glass">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Personal Trainers</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar personal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Personal</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">CREF</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Alunos</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Vencimento</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPersonais.map((personal) => (
                    <tr key={personal.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                            {personal.nome.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{personal.nome}</p>
                            <p className="text-sm text-muted-foreground">{personal.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <code className="text-sm bg-secondary px-2 py-1 rounded">{personal.cref}</code>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="font-medium">{personal.alunos}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getStatusBadge(personal.status)}`}>
                          {personal.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-sm text-muted-foreground">
                        {personal.dataVencimento}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Ban className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
