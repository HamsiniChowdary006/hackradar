
-- 1. pending_submissions: add submitted_by
ALTER TABLE public.pending_submissions
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Replace public insert with authenticated-own insert
DROP POLICY IF EXISTS "Anyone can submit a hackathon" ON public.pending_submissions;

CREATE POLICY "Users insert own submissions"
  ON public.pending_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by AND status = 'pending');

CREATE POLICY "Users view own submissions"
  ON public.pending_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = submitted_by);

-- 2. notifications: remove frontend insert/delete
DROP POLICY IF EXISTS "Users insert own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users delete own notifications" ON public.notifications;
