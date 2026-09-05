ALTER TABLE public.organization_members
  ALTER COLUMN organization_id SET NOT NULL,
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN role SET NOT NULL;