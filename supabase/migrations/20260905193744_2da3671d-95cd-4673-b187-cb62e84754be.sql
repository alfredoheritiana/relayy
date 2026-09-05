CREATE POLICY "members_owner_update" ON public.organization_members
  FOR UPDATE TO authenticated
  USING (private.is_org_owner(organization_id))
  WITH CHECK (
    private.is_org_owner(organization_id)
    AND (
      role = 'owner'
      OR (SELECT count(*) FROM public.organization_members owners WHERE owners.organization_id = organization_members.organization_id AND owners.role = 'owner') > 1
    )
  );