INSERT INTO public.profiles (id)
SELECT DISTINCT user_id
FROM public.organization_members
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.organization_members
  ADD CONSTRAINT organization_members_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "organizations_insert_authenticated" ON public.organizations;
DROP POLICY IF EXISTS "members_insert_first_owner" ON public.organization_members;
REVOKE INSERT ON public.organizations FROM authenticated;
REVOKE INSERT ON public.organization_members FROM authenticated;

CREATE OR REPLACE FUNCTION public.create_workspace(
  p_name text,
  p_slug text,
  p_website_url text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_industries text[] DEFAULT '{}',
  p_service_areas text[] DEFAULT '{}',
  p_services text[] DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_org uuid;
  v_slug text;
  v_service text;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF coalesce(trim(p_name), '') = '' THEN
    RAISE EXCEPTION 'organization name required';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.organization_members WHERE user_id = v_user
  ) THEN
    RAISE EXCEPTION 'workspace already configured';
  END IF;

  INSERT INTO public.profiles (id, email)
  VALUES (v_user, auth.jwt() ->> 'email')
  ON CONFLICT (id) DO UPDATE
    SET email = excluded.email;

  v_slug := lower(regexp_replace(coalesce(nullif(trim(p_slug), ''), p_name), '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := trim(both '-' from v_slug);
  IF v_slug = '' THEN
    v_slug := 'org';
  END IF;
  IF EXISTS (SELECT 1 FROM public.organizations WHERE slug = v_slug) THEN
    v_slug := v_slug || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6);
  END IF;

  INSERT INTO public.organizations (name, slug, website_url)
  VALUES (trim(p_name), v_slug, nullif(trim(coalesce(p_website_url, '')), ''))
  RETURNING id INTO v_org;

  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (v_org, v_user, 'owner');

  INSERT INTO public.business_profiles (
    organization_id,
    description,
    industries,
    service_areas,
    target_customers,
    status
  ) VALUES (
    v_org,
    nullif(trim(coalesce(p_description, '')), ''),
    coalesce(p_industries, '{}'),
    coalesce(p_service_areas, '{}'),
    '{}',
    'ready'
  );

  FOREACH v_service IN ARRAY coalesce(p_services, '{}') LOOP
    IF nullif(trim(v_service), '') IS NOT NULL THEN
      INSERT INTO public.services (organization_id, name)
      VALUES (v_org, trim(v_service));
    END IF;
  END LOOP;

  RETURN v_org;
END;
$$;

REVOKE ALL ON FUNCTION public.create_workspace(text, text, text, text, text[], text[], text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_workspace(text, text, text, text, text[], text[], text[]) TO authenticated, service_role;