ALTER TABLE public.organizations
  ADD CONSTRAINT organizations_name_not_blank CHECK (length(trim(name)) > 0);