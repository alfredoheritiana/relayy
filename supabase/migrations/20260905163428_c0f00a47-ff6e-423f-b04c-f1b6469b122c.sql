drop function if exists public.create_organization_with_owner(text, text, text, text, text[], text[], text[]);

create or replace function private.org_has_members(_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.organization_members m where m.organization_id = _org)
$$;

revoke all on function private.org_has_members(uuid) from public, anon, authenticated;

create policy "organizations_insert_authenticated" on public.organizations
  for insert to authenticated with check (true);

create policy "members_insert_first_owner" on public.organization_members
  for insert to authenticated
  with check (user_id = auth.uid() and role = 'owner' and not private.org_has_members(organization_id));

grant insert on public.organizations to authenticated;
grant insert on public.organization_members to authenticated;