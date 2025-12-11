-- Allow users to insert their own role during signup
CREATE POLICY "Users can insert their own role"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own professional record
CREATE POLICY "Professionals can insert their own record"
ON public.professionals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own student record (if needed)
CREATE POLICY "Students can delete their own record"
ON public.students
FOR DELETE
USING (auth.uid() = user_id);