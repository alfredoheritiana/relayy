DROP POLICY IF EXISTS experiences_update ON public.experiences;
CREATE POLICY experiences_update ON public.experiences
  FOR UPDATE TO authenticated
  USING (private.is_org_member(organization_id))
  WITH CHECK (private.is_org_member(organization_id));

DROP POLICY IF EXISTS versions_update_draft ON public.experience_versions;
CREATE POLICY versions_update_draft ON public.experience_versions
  FOR UPDATE TO authenticated
  USING (private.is_org_member(organization_id) AND published_at IS NULL)
  WITH CHECK (private.is_org_member(organization_id));