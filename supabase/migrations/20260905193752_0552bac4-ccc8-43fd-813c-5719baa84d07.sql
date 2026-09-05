CREATE UNIQUE INDEX IF NOT EXISTS organization_members_single_owner_idx
  ON public.organization_members (organization_id)
  WHERE role = 'owner';