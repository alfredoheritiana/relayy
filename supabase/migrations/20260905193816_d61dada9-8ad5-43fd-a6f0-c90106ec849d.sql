CREATE OR REPLACE FUNCTION private.preserve_organization_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF OLD.role = 'owner' AND (TG_OP = 'DELETE' OR NEW.role <> 'owner') THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = OLD.organization_id
        AND user_id <> OLD.user_id
        AND role = 'owner'
    ) THEN
      RAISE EXCEPTION 'organization must retain an owner';
    END IF;
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

REVOKE ALL ON FUNCTION private.preserve_organization_owner() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.preserve_organization_owner() TO postgres, service_role;

DROP TRIGGER IF EXISTS preserve_organization_owner ON public.organization_members;
CREATE TRIGGER preserve_organization_owner
  BEFORE UPDATE OF role OR DELETE ON public.organization_members
  FOR EACH ROW EXECUTE FUNCTION private.preserve_organization_owner();