ALTER FUNCTION public.create_workspace(text, text, text, text, text[], text[], text[])
  SECURITY INVOKER;

GRANT INSERT ON public.organizations TO authenticated;
GRANT INSERT ON public.organization_members TO authenticated;

CREATE POLICY "organizations_insert_authenticated" ON public.organizations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "members_insert_first_owner" ON public.organization_members
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND role = 'owner'
    AND NOT private.org_has_members(organization_id)
  );