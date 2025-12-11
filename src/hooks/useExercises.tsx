import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Exercise {
  id: string;
  name: string;
  description: string;
  muscle_group: string;
  difficulty: string;
  equipment: string | null;
  instructions: string[] | null;
  thumbnail_url: string | null;
  gif_url: string | null;
  video_url: string | null;
}

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('muscle_group', { ascending: true });

      if (error) {
        console.error('Error fetching exercises:', error);
        return;
      }

      setExercises(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const getExercisesByMuscle = (muscleGroup: string) => {
    return exercises.filter(e => e.muscle_group === muscleGroup);
  };

  const muscleGroups = [...new Set(exercises.map(e => e.muscle_group))];

  return { exercises, loading, muscleGroups, getExercisesByMuscle, refetch: fetchExercises };
};
