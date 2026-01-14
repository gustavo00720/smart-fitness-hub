import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { StudentGamification } from '@/types/gamification';

export function useStreak() {
  const { user } = useAuth();
  const [student, setStudent] = useState<StudentGamification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('id, user_id, streak_days, xp, level, last_check_in, goal')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching student:', error);
      } else {
        setStudent(data as StudentGamification);
      }
      setLoading(false);
    };

    fetchStudent();
  }, [user]);

  const checkIn = async () => {
    if (!student) {
      toast.error('Estudante não encontrado');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase.rpc('increment_streak', {
      sid: student.id,
      check_date: today,
    });

    if (error) {
      console.error('Error checking in:', error);
      toast.error('Erro ao registrar check-in');
      return;
    }

    if (data) {
      const updatedStudent = data as StudentGamification;
      const xpGained = updatedStudent.xp - student.xp;
      
      setStudent(updatedStudent);
      
      if (xpGained > 0) {
        toast.success(`+${xpGained} XP! 🔥 Ofensiva: ${updatedStudent.streak_days} dias`);
      } else {
        toast.info('Você já fez check-in hoje!');
      }
    }
  };

  return { student, loading, checkIn };
}
