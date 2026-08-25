GRANT SELECT ON public.feedback TO authenticated;

CREATE POLICY "Admins can view feedback"
ON public.feedback
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));