create schema if not exists private;
revoke all on schema private from anon, authenticated;
grant usage on schema private to authenticated, service_role;

create or replace function private.is_org_member(_org uuid)
returns boolean language sql stable security definer set search_path to 'public' as $$
  select exists (select 1 from public.organization_members m where m.organization_id = _org and m.user_id = auth.uid());
$$;

create or replace function private.is_org_owner(_org uuid)
returns boolean language sql stable security definer set search_path to 'public' as $$
  select exists (select 1 from public.organization_members m where m.organization_id = _org and m.user_id = auth.uid() and m.role = 'owner');
$$;

revoke all on function private.is_org_member(uuid) from public, anon;
revoke all on function private.is_org_owner(uuid) from public, anon;
grant execute on function private.is_org_member(uuid) to authenticated, service_role;
grant execute on function private.is_org_owner(uuid) to authenticated, service_role;

do $do$
declare
  pol record;
  stmt text;
  q text;
  wc text;
begin
  for pol in
    select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
    from pg_policies
    where schemaname = 'public'
      and (coalesce(qual,'') like '%is_org_%' or coalesce(with_check,'') like '%is_org_%')
  loop
    q := replace(coalesce(pol.qual, ''), 'is_org_', 'private.is_org_');
    q := replace(q, 'public.private.', 'private.');
    wc := replace(coalesce(pol.with_check, ''), 'is_org_', 'private.is_org_');
    wc := replace(wc, 'public.private.', 'private.');

    execute format('drop policy %I on %I.%I', pol.policyname, pol.schemaname, pol.tablename);

    stmt := format('create policy %I on %I.%I as %s for %s to %s',
      pol.policyname, pol.schemaname, pol.tablename,
      case when pol.permissive = 'PERMISSIVE' then 'permissive' else 'restrictive' end,
      lower(pol.cmd),
      array_to_string(pol.roles, ', '));

    if pol.qual is not null then
      stmt := stmt || format(' using (%s)', q);
    end if;
    if pol.with_check is not null then
      stmt := stmt || format(' with check (%s)', wc);
    end if;

    execute stmt;
  end loop;
end
$do$;

drop function if exists public.is_org_member(uuid);
drop function if exists public.is_org_owner(uuid);