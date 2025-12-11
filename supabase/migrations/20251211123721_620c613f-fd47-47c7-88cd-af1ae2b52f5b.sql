-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'professional', 'student');

-- Create enum for CREF status
CREATE TYPE public.cref_status AS ENUM ('pending', 'active', 'inactive', 'rejected');

-- Create user_roles table (security best practice)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table for all users
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create professionals table
CREATE TABLE public.professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    cref_number TEXT NOT NULL UNIQUE,
    cref_state TEXT NOT NULL,
    cref_status cref_status NOT NULL DEFAULT 'pending',
    cref_validated_at TIMESTAMP WITH TIME ZONE,
    specialties TEXT[],
    bio TEXT,
    invite_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
    age INTEGER,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    goal TEXT,
    streak_days INTEGER NOT NULL DEFAULT 0,
    last_workout_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercise library table
CREATE TABLE public.exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    muscle_group TEXT NOT NULL,
    equipment TEXT,
    difficulty TEXT NOT NULL DEFAULT 'intermediate',
    video_url TEXT,
    gif_url TEXT,
    thumbnail_url TEXT,
    instructions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workout templates table
CREATE TABLE public.workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    day_of_week INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workout exercises (junction table)
CREATE TABLE public.workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
    sets INTEGER NOT NULL DEFAULT 3,
    reps TEXT NOT NULL DEFAULT '12',
    rest_seconds INTEGER NOT NULL DEFAULT 60,
    notes TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workout history table
CREATE TABLE public.workout_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    duration_minutes INTEGER,
    notes TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_history ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get current user's professional_id
CREATE OR REPLACE FUNCTION public.get_my_professional_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.professionals WHERE user_id = auth.uid()
$$;

-- Function to get current user's student record
CREATE OR REPLACE FUNCTION public.get_my_student_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.students WHERE user_id = auth.uid()
$$;

-- Generate unique invite code for professionals
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.professionals WHERE invite_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Professionals can view their students profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.user_id = profiles.user_id
    AND s.professional_id = public.get_my_professional_id()
  )
);

-- RLS Policies for professionals
CREATE POLICY "Anyone can view active professionals"
ON public.professionals FOR SELECT
USING (cref_status = 'active');

CREATE POLICY "Professionals can view and update their own record"
ON public.professionals FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all professionals"
ON public.professionals FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for students
CREATE POLICY "Students can view their own record"
ON public.students FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own record"
ON public.students FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own record"
ON public.students FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Professionals can view their students"
ON public.students FOR SELECT
USING (professional_id = public.get_my_professional_id());

CREATE POLICY "Professionals can update their students"
ON public.students FOR UPDATE
USING (professional_id = public.get_my_professional_id());

CREATE POLICY "Admins can manage all students"
ON public.students FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for exercises (public library)
CREATE POLICY "Anyone can view exercises"
ON public.exercises FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage exercises"
ON public.exercises FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for workouts
CREATE POLICY "Professionals can manage their workouts"
ON public.workouts FOR ALL
USING (professional_id = public.get_my_professional_id());

CREATE POLICY "Students can view their workouts"
ON public.workouts FOR SELECT
USING (student_id = public.get_my_student_id());

CREATE POLICY "Admins can view all workouts"
ON public.workouts FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for workout_exercises
CREATE POLICY "Users can view workout exercises for their workouts"
ON public.workout_exercises FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workouts w
    WHERE w.id = workout_exercises.workout_id
    AND (w.professional_id = public.get_my_professional_id() OR w.student_id = public.get_my_student_id())
  )
);

CREATE POLICY "Professionals can manage workout exercises"
ON public.workout_exercises FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.workouts w
    WHERE w.id = workout_exercises.workout_id
    AND w.professional_id = public.get_my_professional_id()
  )
);

-- RLS Policies for workout_history
CREATE POLICY "Students can manage their workout history"
ON public.workout_history FOR ALL
USING (student_id = public.get_my_student_id());

CREATE POLICY "Professionals can view their students workout history"
ON public.workout_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = workout_history.student_id
    AND s.professional_id = public.get_my_professional_id()
  )
);

CREATE POLICY "Admins can view all workout history"
ON public.workout_history FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at
BEFORE UPDATE ON public.professionals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at
BEFORE UPDATE ON public.workouts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial exercise library
INSERT INTO public.exercises (name, description, muscle_group, equipment, difficulty, instructions, gif_url) VALUES
('Supino Reto', 'Exercício clássico para desenvolvimento do peitoral', 'Peito', 'Barra e banco', 'intermediate', ARRAY['Deite no banco com os pés apoiados', 'Segure a barra na largura dos ombros', 'Desça a barra até o peito', 'Empurre para cima até estender os braços'], 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHJtbzN5dWF1ZmV4Y2s0OHN0OWZyYjN1OWF4MzZ1NTdvNHN0MzYxdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7btVPbdpCjSpA9gY/giphy.gif'),
('Agachamento Livre', 'Exercício fundamental para pernas e glúteos', 'Pernas', 'Barra', 'intermediate', ARRAY['Posicione a barra nos trapézios', 'Pés na largura dos ombros', 'Desça até as coxas ficarem paralelas ao chão', 'Suba controladamente'], 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTd5bXJhdnhyYjF4YnV0bGNyMG1odHZkNXRiYjR4eGJ2cG1sbXZ1eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBff8cRRFf7k2u4/giphy.gif'),
('Levantamento Terra', 'Exercício composto para posterior de coxa e lombar', 'Costas', 'Barra', 'advanced', ARRAY['Pés na largura do quadril', 'Pegada na largura dos ombros', 'Mantenha as costas retas', 'Levante usando as pernas e quadril'], 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2FtcmZ4cGVhdXl0OWpmczN3ZXByMGViMDlubXQyazN1ZG9qNHA0NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjI6SIIHBdRxXI40/giphy.gif'),
('Rosca Direta', 'Exercício isolado para bíceps', 'Bíceps', 'Barra ou halteres', 'beginner', ARRAY['Em pé, braços estendidos', 'Flexione os cotovelos', 'Suba até a contração máxima', 'Desça controladamente'], 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWVlNWNhbDJ3dWM2dWZldmRqNm1qYTBmY3ZmNHI5NTUwb25odGl5OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTk9ZZzP1ACOlXhFSw/giphy.gif'),
('Tríceps Pulley', 'Exercício isolado para tríceps', 'Tríceps', 'Cabo', 'beginner', ARRAY['Em pé de frente para o cabo', 'Cotovelos junto ao corpo', 'Estenda os braços para baixo', 'Volte controladamente'], 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXl5NWN2aXZ3YXV5cWV4a2xiOGcxajY0OXB3dGNqZXRyazBtaXVlaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26uf9QPzzlKPvQG5O/giphy.gif'),
('Desenvolvimento', 'Exercício para ombros', 'Ombros', 'Barra ou halteres', 'intermediate', ARRAY['Sentado ou em pé', 'Halteres na altura dos ombros', 'Empurre para cima', 'Desça até a posição inicial'], 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDJqbWJwMnF2OGlqZTJ5cHVlM2huaG1qNmtzOGdtdWxnYmNxeDBkYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0IylOPCNkiqOgMyA/giphy.gif'),
('Puxada Frontal', 'Exercício para dorsais', 'Costas', 'Cabo', 'beginner', ARRAY['Sentado na máquina', 'Pegada na largura dos ombros', 'Puxe a barra até o peito', 'Volte controladamente'], 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXkwb2VxbDFraW9tOHh2cjJ1ZzVqZmk2OW5zZ3J6aTlicXN0YnV1NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9IgN8YKRhByRBzMI/giphy.gif'),
('Leg Press', 'Exercício para quadríceps', 'Pernas', 'Máquina', 'beginner', ARRAY['Sentado na máquina', 'Pés na plataforma', 'Empurre até estender as pernas', 'Volte flexionando os joelhos'], 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXdlMzRtOXl0dTd1b3V3OXpxNnBudWJqbXNibGVraHVnbWtsZWNmaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l378bu6ZYmzS6nBGU/giphy.gif'),
('Abdominal Crunch', 'Exercício básico para abdômen', 'Abdômen', 'Nenhum', 'beginner', ARRAY['Deitado de costas', 'Joelhos flexionados', 'Contraia o abdômen elevando os ombros', 'Desça controladamente'], 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnV2YmQ3czNhOGtpd2Q1YWFsaGo5dnJzbXdmcGJ2dXp4azFtZXZlbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2OqJ8VELu0RWOQ/giphy.gif'),
('Prancha', 'Exercício isométrico para core', 'Abdômen', 'Nenhum', 'beginner', ARRAY['Apoie antebraços e pontas dos pés', 'Corpo reto como uma tábua', 'Contraia o abdômen', 'Mantenha a posição'], 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2tmMnJ2YTB6dWF6cHFtNnZmMTJ6cHRhbXQ5eWFxcnk5dWs5NnVyYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBvH1pAhtfSx52U/giphy.gif'),
('Extensão de Pernas', 'Exercício isolado para quadríceps', 'Pernas', 'Máquina', 'beginner', ARRAY['Sentado na máquina', 'Tornozelos atrás do rolo', 'Estenda as pernas', 'Volte controladamente'], 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTNhbWxzNWRhc2FmY2ZwOG1hMmNpZ3p3ZHVlbTJhNGxzY2xjNm1tbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gsspfbt1HfVQ9va/giphy.gif'),
('Mesa Flexora', 'Exercício para posterior de coxa', 'Pernas', 'Máquina', 'beginner', ARRAY['Deitado de bruços', 'Tornozelos sob o rolo', 'Flexione as pernas', 'Volte controladamente'], 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDM5Y3N2dXdnb2RvOXB5cHZ0YXV2YjJ6cWZpNHp5eW5kMnJiYnR6cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBvH1pAhtfSx52U/giphy.gif');