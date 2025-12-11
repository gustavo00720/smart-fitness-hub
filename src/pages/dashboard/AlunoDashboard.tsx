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
  CheckCircle,
  Timer,
  Target
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
import { supabase } from "@/integrations/supabase/client";
import WorkoutSession from "@/components/workout/WorkoutSession";

const AlunoDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { workouts, loading: loadingWorkouts } = useWorkouts();
  const { completeWorkout } = useWorkoutHistory();
  const [profileName, setProfileName] = useState("Aluno");
  const [streakDays, setStreakDays] = useState(0);
  const [showWorkoutSession, setShowWorkoutSession] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<typeof workouts[0] | null>(null);

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

  const handleStartWorkout = () => {
    if (currentWorkout) {
      setShowWorkoutSession(true);
    }
  };

  const handleCompleteWorkout = async () => {
    if (!currentWorkout) return;
    
    await completeWorkout(currentWorkout.id);
    setShowWorkoutSession(false);
    setStreakDays(prev => prev + 1);
  };

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

  const totalExercises = currentWorkout?.exercises?.length || 0;
  const totalSets = currentWorkout?.exercises?.reduce((acc, ex) => acc + ex.sets, 0) || 0;

  // Workout Session Overlay
  if (showWorkoutSession && currentWorkout && currentWorkout.exercises) {
    return (
      <WorkoutSession
        workoutName={currentWorkout.name}
        exercises={currentWorkout.exercises}
        onComplete={handleCompleteWorkout}
        onClose={() => setShowWorkoutSession(false)}
      />
    );
  }

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
            <h1 className="text-2xl md:text-3xl font-display font-bold">{getGreeting()}, {profileName}!</h1>
            <p className="text-muted-foreground">Vamos treinar hoje?</p>
          </div>
          <Card variant="gradient" className="border-primary/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center animate-pulse-glow">
                <Flame className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{streakDays} dias</p>
                <p className="text-sm text-muted-foreground">de streak</p>
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
              {weekProgress.map((day) => (
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
          <>
            {/* Workout Header Card */}
            <Card variant="gradient" className="mb-4 border-primary/30 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
              <CardContent className="p-6 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-primary font-medium mb-1">Treino de Hoje</p>
                    <h2 className="text-2xl font-display font-bold mb-2">{currentWorkout.name}</h2>
                    <p className="text-muted-foreground">{currentWorkout.description || 'Vamos lá!'}</p>
                  </div>
                  <Button 
                    variant="hero" 
                    size="lg"
                    onClick={handleStartWorkout}
                    className="glow-primary"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Iniciar Treino
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Workout Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Card variant="glass">
                <CardContent className="p-4 text-center">
                  <Target className="w-5 h-5 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-display font-bold">{totalExercises}</p>
                  <p className="text-xs text-muted-foreground">Exercícios</p>
                </CardContent>
              </Card>
              <Card variant="glass">
                <CardContent className="p-4 text-center">
                  <Dumbbell className="w-5 h-5 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-display font-bold">{totalSets}</p>
                  <p className="text-xs text-muted-foreground">Séries</p>
                </CardContent>
              </Card>
              <Card variant="glass">
                <CardContent className="p-4 text-center">
                  <Timer className="w-5 h-5 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-display font-bold">~45</p>
                  <p className="text-xs text-muted-foreground">Minutos</p>
                </CardContent>
              </Card>
            </div>

            {/* Exercises Preview */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Exercícios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentWorkout.exercises?.map((exercicio, index) => (
                  <div 
                    key={exercicio.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-display font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {exercicio.exercise?.name || 'Exercício'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {exercicio.sets}x{exercicio.reps} • {exercicio.rest_seconds}s descanso
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
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

        {/* All Workouts */}
        {workouts.length > 1 && (
          <div className="mt-6">
            <h3 className="font-display font-semibold mb-4">Outros Treinos</h3>
            <div className="space-y-3">
              {workouts.filter(w => w.id !== currentWorkout?.id).map((workout) => (
                <Card key={workout.id} variant="glass" className="cursor-pointer hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {workout.exercises?.length || 0} exercícios • {workout.day_of_week !== null && ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][workout.day_of_week]}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setCurrentWorkout(workout);
                        setShowWorkoutSession(true);
                      }}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Iniciar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* AI Coach Button - Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Link to="/dashboard/aluno/coach">
          <Button variant="hero" size="lg" className="rounded-full w-14 h-14 p-0 glow-primary">
            <Brain className="w-6 h-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AlunoDashboard;
