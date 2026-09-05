ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS experience_version_id uuid REFERENCES public.experience_versions(id);

UPDATE public.leads l
SET experience_version_id = s.experience_version_id
FROM public.interaction_sessions s
WHERE s.id = l.session_id AND l.experience_version_id IS NULL;

CREATE INDEX IF NOT EXISTS leads_experience_version_id_idx
  ON public.leads(experience_version_id);