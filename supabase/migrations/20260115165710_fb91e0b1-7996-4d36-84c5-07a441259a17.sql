-- Create messages table for AI coach conversations
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Students can view their own messages
CREATE POLICY "Students can view their own messages"
ON public.messages
FOR SELECT
USING (student_id = get_my_student_id());

-- Students can insert their own messages
CREATE POLICY "Students can insert their own messages"
ON public.messages
FOR INSERT
WITH CHECK (student_id = get_my_student_id());

-- Students can delete their own messages
CREATE POLICY "Students can delete their own messages"
ON public.messages
FOR DELETE
USING (student_id = get_my_student_id());

-- Professionals can view their students' messages
CREATE POLICY "Professionals can view student messages"
ON public.messages
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.students s
  WHERE s.id = messages.student_id
  AND s.professional_id = get_my_professional_id()
));

-- Create index for faster queries
CREATE INDEX idx_messages_student_id ON public.messages(student_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);