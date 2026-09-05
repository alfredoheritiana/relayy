DROP POLICY IF EXISTS "members_owner_delete" ON public.organization_members;
CREATE POLICY "members_owner_delete" ON public.organization_members
  FOR DELETE TO authenticated
  USING (
    private.is_org_owner(organization_id)
    AND (
      role <> 'owner'
      OR (SELECT count(*) FROM public.organization_members owners WHERE owners.organization_id = organization_members.organization_id AND owners.role = 'owner') > 1
    )
  );