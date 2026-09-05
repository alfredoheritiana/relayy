CREATE UNIQUE INDEX IF NOT EXISTS organization_members_one_org_per_user_idx
  ON public.organization_members (user_id);