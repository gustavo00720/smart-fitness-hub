-- Add gamification columns to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS xp integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS level integer NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_check_in date;

-- Create function to increment streak and award XP
CREATE OR REPLACE FUNCTION public.increment_streak(sid uuid, check_date date)
RETURNS public.students
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.students;
  days_diff integer;
  xp_reward integer := 10;
BEGIN
  -- Get current student data
  SELECT * INTO result FROM public.students WHERE id = sid AND user_id = auth.uid();
  
  IF result IS NULL THEN
    RAISE EXCEPTION 'Student not found or unauthorized';
  END IF;
  
  -- Check if already checked in today
  IF result.last_check_in = check_date THEN
    RETURN result;
  END IF;
  
  -- Calculate streak
  IF result.last_check_in IS NULL THEN
    days_diff := 999; -- First check-in
  ELSE
    days_diff := check_date - result.last_check_in;
  END IF;
  
  IF days_diff = 1 THEN
    -- Consecutive day - increment streak
    result.streak_days := result.streak_days + 1;
    -- Bonus XP for maintaining streak
    xp_reward := 10 + (result.streak_days * 2);
  ELSIF days_diff > 1 THEN
    -- Streak broken - reset to 1
    result.streak_days := 1;
  ELSE
    -- First check-in
    result.streak_days := 1;
  END IF;
  
  -- Award XP and calculate level (every 100 XP = 1 level)
  result.xp := result.xp + xp_reward;
  result.level := 1 + (result.xp / 100);
  result.last_check_in := check_date;
  result.last_workout_at := now();
  
  -- Update the student record
  UPDATE public.students 
  SET 
    streak_days = result.streak_days,
    xp = result.xp,
    level = result.level,
    last_check_in = result.last_check_in,
    last_workout_at = result.last_workout_at,
    updated_at = now()
  WHERE id = sid;
  
  RETURN result;
END;
$$;