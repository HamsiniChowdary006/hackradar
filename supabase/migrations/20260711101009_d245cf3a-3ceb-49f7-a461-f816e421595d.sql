CREATE TABLE public.scrape_log (
  source_platform text PRIMARY KEY,
  last_run_at timestamptz,
  last_run_status text
);

GRANT SELECT ON public.scrape_log TO authenticated;
GRANT ALL ON public.scrape_log TO service_role;

ALTER TABLE public.scrape_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view scrape log"
  ON public.scrape_log
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));