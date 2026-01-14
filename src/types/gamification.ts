export interface StudentGamification {
  id: string;
  user_id: string;
  streak_days: number;
  xp: number;
  level: number;
  last_check_in: string | null;
  goal: string | null;
}

export interface Trainer {
  id: string;
  user_id: string;
  invite_code: string;
  cref_number: string;
  cref_state: string;
  specialties: string[] | null;
  bio: string | null;
}
