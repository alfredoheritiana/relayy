DROP POLICY IF EXISTS "members_owner_update" ON public.organization_members;
CREATE POLICY "members_owner_update" ON public.organization_members
  FOR UPDATE TO authenticated
  USING (private.is_org_owner(organization_id))
  WITH CHECK (private.is_org_owner(organization_id));