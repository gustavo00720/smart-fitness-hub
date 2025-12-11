import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dumbbell, 
  Users, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Brain,
  Calendar,
  Flame,
  MessageCircle,
  Trash2,
  Edit,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useStudents } from "@/hooks/useStudents";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const WorkoutsList = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { workouts, loading, deleteWorkout } = useWorkouts();
  const { students } = useStudents();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student?.profile?.full_name || 'Aluno desconhecido';
  };

  const getDayName = (day: number | null) => {
    if (day === null) return null;
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[day];
  };

  const filteredWorkouts = workouts.filter(workout =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getStudentName(workout.student_id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group workouts by student
  const workoutsByStudent = filteredWorkouts.reduce((acc, workout) => {
    const studentName = getStudentName(workout.student_id);
    if (!acc[studentName]) {
      acc[studentName] = [];
    }
    acc[studentName].push(workout);
    return acc;
  }, {} as Record<string, typeof workouts>);

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
          <Link to="/dashboard/personal" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Dumbbell className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/dashboard/personal/alunos" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Users className="w-5 h-5" />
            <span>Meus Alunos</span>
          </Link>
          <Link to="/dashboard/personal/treinos" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
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
            <h1 className="text-2xl md:text-3xl font-display font-bold">Treinos</h1>
            <p className="text-muted-foreground">Gerencie os treinos dos seus alunos</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard/personal/treinos/novo">
              <Button variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                Novo Treino
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar treino ou aluno..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Workouts */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : Object.keys(workoutsByStudent).length === 0 ? (
          <Card variant="glass">
            <CardContent className="p-8 text-center">
              <Dumbbell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-display font-semibold mb-2">Nenhum treino encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando um novo treino para seus alunos.
              </p>
              <Link to="/dashboard/personal/treinos/novo">
                <Button variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Treino
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(workoutsByStudent).map(([studentName, studentWorkouts]) => (
              <Card key={studentName} variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {studentName.charAt(0)}
                    </div>
                    {studentName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentWorkouts.map((workout) => (
                      <div 
                        key={workout.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-medium">{workout.name}</p>
                            {workout.day_of_week !== null && (
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                {getDayName(workout.day_of_week)}
                              </span>
                            )}
                            {!workout.is_active && (
                              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                Inativo
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {workout.exercises?.length || 0} exercícios
                          </p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir treino?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. O treino "{workout.name}" será permanentemente excluído.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteWorkout(workout.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkoutsList;
