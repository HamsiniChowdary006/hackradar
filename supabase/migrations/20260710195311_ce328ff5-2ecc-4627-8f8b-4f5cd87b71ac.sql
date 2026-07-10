
CREATE TABLE public.hackathons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  source_platform TEXT NOT NULL,
  source_url TEXT NOT NULL,
  skill_level TEXT NOT NULL CHECK (skill_level IN ('Beginner','Medium','Advanced')),
  mode TEXT NOT NULL CHECK (mode IN ('Online','Offline','Hybrid')),
  city TEXT,
  country TEXT,
  registration_deadline DATE,
  event_start DATE,
  event_end DATE,
  tags TEXT[] DEFAULT '{}',
  fee TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hackathons TO anon, authenticated;
GRANT ALL ON public.hackathons TO service_role;
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hackathons are publicly readable" ON public.hackathons FOR SELECT USING (true);

CREATE TABLE public.pending_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_platform TEXT,
  description TEXT,
  skill_level TEXT,
  mode TEXT,
  city TEXT,
  country TEXT,
  registration_deadline DATE,
  event_start DATE,
  event_end DATE,
  tags TEXT[] DEFAULT '{}',
  fee TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  submitter_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.pending_submissions TO anon, authenticated;
GRANT ALL ON public.pending_submissions TO service_role;
ALTER TABLE public.pending_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a hackathon" ON public.pending_submissions FOR INSERT WITH CHECK (status = 'pending');
