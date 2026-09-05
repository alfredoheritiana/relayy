CREATE OR REPLACE FUNCTION private.current_user_has_membership()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION private.current_user_has_membership() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.current_user_has_membership() TO authenticated, service_role;