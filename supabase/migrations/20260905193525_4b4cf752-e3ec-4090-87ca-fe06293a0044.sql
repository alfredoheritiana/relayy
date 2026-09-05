CREATE POLICY "members_owner_delete" ON public.organization_members
  FOR DELETE TO authenticated
  USING (private.is_org_owner(organization_id));