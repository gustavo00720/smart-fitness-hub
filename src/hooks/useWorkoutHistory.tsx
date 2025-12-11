import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

interface WorkoutHistoryEntry {
  id: string;
  workout_id: string | null;
  student_id: string;
  completed_at: string;
  duration_minutes: number | null;
  notes: string | null;
  workout?: {
    name: string;
  } | null;
}

export const useWorkoutHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user) return;

    try {
      // Get student id
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!student) {
        setHistory([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('workout_history')
        .select(`
          *,
          workout:workouts(name)
        `)
        .eq('student_id', student.id)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        return;
      }

      setHistory(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeWorkout = async (workoutId: string, durationMinutes?: number, notes?: string) => {
    if (!user) return { error: new Error('Não autenticado') };

    try {
      // Get student id
      const { data: student } = await supabase
        .from('students')
        .select('id, streak_days')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!student) {
        return { error: new Error('Estudante não encontrado') };
      }

      // Add to history
      const { error: historyError } = await supabase
        .from('workout_history')
        .insert({
          workout_id: workoutId,
          student_id: student.id,
          duration_minutes: durationMinutes || null,
          notes: notes || null
        });

      if (historyError) {
        return { error: historyError };
      }

      // Update student's last workout and streak
      const { error: updateError } = await supabase
        .from('students')
        .update({
          last_workout_at: new Date().toISOString(),
          streak_days: (student.streak_days || 0) + 1
        })
        .eq('id', student.id);

      if (updateError) {
        console.error('Error updating student:', updateError);
      }

      toast({
        title: "Treino concluído! 💪",
        description: "Parabéns! Continue assim!"
      });

      await fetchHistory();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  return { history, loading, completeWorkout, refetch: fetchHistory };
};
