import { useStreak } from '@/hooks/useStreak';
import StreakDisplay from '@/components/StreakDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Dumbbell, Loader2 } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkouts';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function DashboardStudent() {
  const { student, loading: loadingStreak, checkIn } = useStreak();
  const { workouts, loading: loadingWorkouts } = useWorkouts();

  if (loadingStreak) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Perfil de estudante não encontrado</p>
      </div>
    );
  }

  const todayWorkout = workouts.find(w => {
    const today = new Date().getDay();
    return w.day_of_week === today && w.is_active;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Meu Painel</h1>
        </div>

        <StreakDisplay 
          streak={student.streak_days} 
          xp={student.xp} 
          level={student.level} 
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Treino de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingWorkouts ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : todayWorkout ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">{todayWorkout.name}</p>
                    <p className="text-sm text-muted-foreground">{todayWorkout.description}</p>
                  </div>
                  <Button onClick={checkIn} className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Marcar treino como concluído
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum treino programado para hoje</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Meta atual</span>
                <span className="font-medium">{student.goal || 'Não definida'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Maior ofensiva</span>
                <span className="font-medium">{student.streak_days} dias</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de XP</span>
                <span className="font-medium">{student.xp} XP</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
