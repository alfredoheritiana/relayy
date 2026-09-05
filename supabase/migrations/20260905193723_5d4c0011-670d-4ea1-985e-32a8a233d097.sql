DROP POLICY IF EXISTS "organizations_insert_authenticated" ON public.organizations;
CREATE POLICY "organizations_insert_without_membership" ON public.organizations
  FOR INSERT TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE user_id = auth.uid()
    )
  );