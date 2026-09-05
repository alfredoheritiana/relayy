create or replace function public.create_organization_with_owner(
  p_name text,
  p_slug text,
  p_website_url text default null,
  p_description text default null,
  p_industries text[] default '{}',
  p_service_areas text[] default '{}',
  p_target_customers text[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_org uuid;
  v_slug text;
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;
  if coalesce(trim(p_name), '') = '' then
    raise exception 'organization name required';
  end if;

  v_slug := lower(regexp_replace(coalesce(nullif(trim(p_slug), ''), p_name), '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := trim(both '-' from v_slug);
  if v_slug = '' then
    v_slug := 'org';
  end if;
  if exists (select 1 from public.organizations o where o.slug = v_slug) then
    v_slug := v_slug || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6);
  end if;

  insert into public.organizations (name, slug, website_url)
  values (trim(p_name), v_slug, nullif(trim(coalesce(p_website_url, '')), ''))
  returning id into v_org;

  insert into public.organization_members (organization_id, user_id, role)
  values (v_org, v_user, 'owner');

  insert into public.business_profiles (organization_id, description, industries, service_areas, target_customers, status)
  values (v_org, nullif(trim(coalesce(p_description, '')), ''), coalesce(p_industries, '{}'), coalesce(p_service_areas, '{}'), coalesce(p_target_customers, '{}'), 'draft');

  return v_org;
end;
$$;

revoke all on function public.create_organization_with_owner(text, text, text, text, text[], text[], text[]) from public, anon;
grant execute on function public.create_organization_with_owner(text, text, text, text, text[], text[], text[]) to authenticated;