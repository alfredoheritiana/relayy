CREATE OR REPLACE FUNCTION private.preserve_organization_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF OLD.role = 'owner' AND (
    TG_OP = 'DELETE'
    OR (TG_OP = 'UPDATE' AND NEW.role <> 'owner')
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = OLD.organization_id
        AND user_id <> OLD.user_id
        AND role = 'owner'
    ) THEN
      RAISE EXCEPTION 'organization must retain an owner';
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;