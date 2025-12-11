import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Student {
  id: string;
  user_id: string;
  goal: string | null;
  streak_days: number;
  last_workout_at: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  profile: {
    full_name: string;
    email: string;
    avatar_url: string | null;
    phone: string | null;
  } | null;
}

export const useStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    if (!user) return;

    try {
      // First get the professional id
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!professional) {
        setStudents([]);
        setLoading(false);
        return;
      }

      // Get students
      const { data: studentsData, error } = await supabase
        .from('students')
        .select('*')
        .eq('professional_id', professional.id);

      if (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
        return;
      }

      // Fetch profiles for each student
      const studentsWithProfiles = await Promise.all(
        (studentsData || []).map(async (student) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email, avatar_url, phone')
            .eq('user_id', student.user_id)
            .maybeSingle();

          return {
            ...student,
            profile
          };
        })
      );

      setStudents(studentsWithProfiles);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [user]);

  return { students, loading, refetch: fetchStudents };
};
