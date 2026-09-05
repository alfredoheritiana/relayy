CREATE OR REPLACE FUNCTION private.current_user_has_membership()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION private.current_user_has_membership() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.current_user_has_membership() TO authenticated, service_role;

DROP POLICY IF EXISTS "organizations_insert_without_membership" ON public.organizations;
CREATE POLICY "organizations_insert_without_membership" ON public.organizations
  FOR INSERT TO authenticated
  WITH CHECK (NOT private.current_user_has_membership());