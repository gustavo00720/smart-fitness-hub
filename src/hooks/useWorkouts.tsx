import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

interface WorkoutExercise {
  id: string;
  exercise_id: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  order_index: number;
  notes: string | null;
  exercise?: {
    id: string;
    name: string;
    muscle_group: string;
    equipment: string | null;
  };
}

interface Workout {
  id: string;
  name: string;
  description: string | null;
  student_id: string;
  professional_id: string;
  day_of_week: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  exercises?: WorkoutExercise[];
}

export const useWorkouts = (studentId?: string) => {
  const { user, userRole } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = async () => {
    if (!user) return;

    try {
      let query = supabase.from('workouts').select('*');

      if (userRole === 'student') {
        // Get student's workouts
        const { data: student } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!student) {
          setWorkouts([]);
          setLoading(false);
          return;
        }

        query = query.eq('student_id', student.id);
      } else if (userRole === 'professional') {
        // Get professional's workouts for a specific student or all
        const { data: professional } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!professional) {
          setWorkouts([]);
          setLoading(false);
          return;
        }

        query = query.eq('professional_id', professional.id);
        if (studentId) {
          query = query.eq('student_id', studentId);
        }
      }

      const { data: workoutsData, error } = await query.order('day_of_week', { ascending: true });

      if (error) {
        console.error('Error fetching workouts:', error);
        setLoading(false);
        return;
      }

      // Fetch exercises for each workout
      const workoutsWithExercises = await Promise.all(
        (workoutsData || []).map(async (workout) => {
          const { data: workoutExercises } = await supabase
            .from('workout_exercises')
            .select(`
              *,
              exercise:exercises(id, name, muscle_group, equipment)
            `)
            .eq('workout_id', workout.id)
            .order('order_index', { ascending: true });

          return {
            ...workout,
            exercises: workoutExercises || []
          };
        })
      );

      setWorkouts(workoutsWithExercises);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkout = async (data: {
    name: string;
    description?: string;
    student_id: string;
    day_of_week?: number;
    exercises: Array<{
      exercise_id: string;
      sets: number;
      reps: string;
      rest_seconds?: number;
      notes?: string;
    }>;
  }) => {
    if (!user) return { error: new Error('Não autenticado') };

    try {
      // Get professional id
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!professional) {
        return { error: new Error('Profissional não encontrado') };
      }

      // Create workout
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          name: data.name,
          description: data.description || null,
          student_id: data.student_id,
          professional_id: professional.id,
          day_of_week: data.day_of_week || null
        })
        .select()
        .single();

      if (workoutError) {
        return { error: workoutError };
      }

      // Add exercises
      if (data.exercises.length > 0) {
        const exercisesToInsert = data.exercises.map((ex, index) => ({
          workout_id: workout.id,
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          rest_seconds: ex.rest_seconds || 60,
          notes: ex.notes || null,
          order_index: index
        }));

        const { error: exercisesError } = await supabase
          .from('workout_exercises')
          .insert(exercisesToInsert);

        if (exercisesError) {
          console.error('Error adding exercises:', exercisesError);
        }
      }

      toast({
        title: "Treino criado!",
        description: `${data.name} foi criado com sucesso.`
      });

      await fetchWorkouts();
      return { error: null, workout };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', workoutId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o treino.",
        variant: "destructive"
      });
      return { error };
    }

    toast({
      title: "Treino excluído",
      description: "O treino foi removido com sucesso."
    });

    await fetchWorkouts();
    return { error: null };
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user, studentId]);

  return { workouts, loading, createWorkout, deleteWorkout, refetch: fetchWorkouts };
};
