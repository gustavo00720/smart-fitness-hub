import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dumbbell, 
  Calendar,
  Brain,
  Settings, 
  LogOut,
  Flame,
  Trophy,
  Play,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
import { supabase } from "@/integrations/supabase/client";

const AlunoDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { workouts, loading: loadingWorkouts } = useWorkouts();
  const { completeWorkout } = useWorkoutHistory();
  const [profileName, setProfileName] = useState("Aluno");
  const [streakDays, setStreakDays] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<typeof workouts[0] | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // Get today's day of week (0 = Sunday, 1 = Monday, etc.)
  const today = new Date().getDay();
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setProfileName(profile.full_name.split(' ')[0]);
      }

      const { data: student } = await supabase
        .from('students')
        .select('streak_days')
        .eq('user_id', user.id)
        .maybeSingle();

      if (student) {
        setStreakDays(student.streak_days);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    // Find today's workout or the first active workout
    const todayWorkout = workouts.find(w => w.day_of_week === today && w.is_active);
    const activeWorkout = workouts.find(w => w.is_active);
    setCurrentWorkout(todayWorkout || activeWorkout || null);
  }, [workouts, today]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleExercise = (exerciseId: string) => {
    setCompletedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(e => e !== exerciseId) 
        : [...prev, exerciseId]
    );
  };

  const handleCompleteWorkout = async () => {
    if (!currentWorkout) return;
    
    setIsCompleting(true);
    const { error } = await completeWorkout(currentWorkout.id);
    setIsCompleting(false);
    
    if (!error) {
      setCompletedExercises([]);
      setStreakDays(prev => prev + 1);
    }
  };

  const progressPercent = currentWorkout?.exercises 
    ? (completedExercises.length / currentWorkout.exercises.length) * 100 
    : 0;

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const weekProgress = weekDays.map((day, index) => ({
    day,
    completed: index < today && workouts.some(w => w.day_of_week === index),
    isToday: index === today
  }));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 glass-strong lg:hidden">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-gradient">TreinAI</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard/aluno/coach">
              <Button variant="ghost" size="icon">
                <Brain className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard/aluno/configuracoes">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-sidebar p-4 hidden lg:block">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-gradient">TreinAI</span>
        </Link>

        <nav className="space-y-2">
          <Link to="/dashboard/aluno" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
            <Dumbbell className="w-5 h-5" />
            <span>Meu Treino</span>
          </Link>
          <Link to="/dashboard/aluno/historico" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Calendar className="w-5 h-5" />
            <span>Histórico</span>
          </Link>
          <Link to="/dashboard/aluno/coach" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Brain className="w-5 h-5" />
            <span>TreinAI Coach</span>
          </Link>
          <Link to="/dashboard/aluno/mensagens" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>Meu Personal</span>
          </Link>
          <Link to="/dashboard/aluno/evolucao" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span>Evolução</span>
          </Link>
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Link to="/dashboard/aluno/configuracoes" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
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
      <main className="lg:ml-64 p-4 lg:p-6">
        {/* Greeting & Streak */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">{getGreeting()}, {profileName}! 💪</h1>
            <p className="text-muted-foreground">Vamos treinar hoje?</p>
          </div>
          <Card variant="gradient" className="border-primary/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center animate-pulse-glow">
                <Flame className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{streakDays} dias</p>
                <p className="text-sm text-muted-foreground">de streak 🔥</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Week Progress */}
        <Card variant="glass" className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Esta Semana</h3>
              <span className="text-sm text-muted-foreground">
                {weekProgress.filter(d => d.completed).length}/7 treinos
              </span>
            </div>
            <div className="flex justify-between">
              {weekProgress.map((day, index) => (
                <div key={day.day} className="flex flex-col items-center gap-2">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      day.completed 
                        ? 'bg-gradient-primary glow-primary' 
                        : day.isToday 
                          ? 'border-2 border-primary' 
                          : 'bg-secondary'
                    }`}
                  >
                    {day.completed && <Trophy className="w-4 h-4 text-primary-foreground" />}
                  </div>
                  <span className={`text-xs ${day.isToday ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Workout */}
        {loadingWorkouts ? (
          <Card variant="glass">
            <CardContent className="p-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        ) : currentWorkout ? (
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{currentWorkout.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {completedExercises.length}/{currentWorkout.exercises?.length || 0} exercícios
                </p>
              </div>
              {progressPercent === 100 ? (
                <Button 
                  variant="hero" 
                  onClick={handleCompleteWorkout}
                  disabled={isCompleting}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isCompleting ? "Salvando..." : "Concluir Treino"}
                </Button>
              ) : (
                <Button variant="hero">
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Exercises */}
              <div className="space-y-3">
                {currentWorkout.exercises?.map((exercicio) => (
                  <div 
                    key={exercicio.id}
                    onClick={() => toggleExercise(exercicio.id)}
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                      completedExercises.includes(exercicio.id)
                        ? 'bg-primary/10 border border-primary/30'
                        : 'bg-secondary/30 hover:bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        completedExercises.includes(exercicio.id)
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {completedExercises.includes(exercicio.id) && (
                          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${completedExercises.includes(exercicio.id) ? 'line-through text-muted-foreground' : ''}`}>
                          {exercicio.exercise?.name || 'Exercício'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {exercicio.sets}x{exercicio.reps} • {exercicio.rest_seconds}s descanso
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card variant="glass">
            <CardContent className="p-8 text-center">
              <Dumbbell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-display font-semibold mb-2">Nenhum treino disponível</h3>
              <p className="text-muted-foreground">
                Seu personal ainda não criou um treino para você.
              </p>
            </CardContent>
          </Card>
        )}

        {/* AI Coach Button - Mobile */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <Link to="/dashboard/aluno/coach">
            <Button variant="hero" size="lg" className="rounded-full w-14 h-14 p-0 glow-primary">
              <Brain className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AlunoDashboard;
