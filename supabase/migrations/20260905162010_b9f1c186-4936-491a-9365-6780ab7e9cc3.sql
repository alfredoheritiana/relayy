create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles_self_select" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles_self_insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles_self_update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  website_url text,
  locale text not null default 'fr',
  timezone text not null default 'Europe/Brussels',
  brand_config jsonb not null default '{}'::jsonb,
  data_retention_days integer not null default 365 check (data_retention_days > 0 and data_retention_days <= 3650),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger organizations_updated_at before update on public.organizations for each row execute function public.set_updated_at();

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('owner','member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);
create index organization_members_user_idx on public.organization_members(user_id);
create trigger organization_members_updated_at before update on public.organization_members for each row execute function public.set_updated_at();

create or replace function public.is_org_member(_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = _org and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_org_owner(_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = _org and m.user_id = auth.uid() and m.role = 'owner'
  );
$$;

revoke all on function public.is_org_member(uuid) from public;
revoke all on function public.is_org_owner(uuid) from public;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.is_org_owner(uuid) to authenticated;

grant select, update on public.organizations to authenticated;
grant all on public.organizations to service_role;
alter table public.organizations enable row level security;
create policy "organizations_member_select" on public.organizations for select to authenticated using (public.is_org_member(id));
create policy "organizations_owner_update" on public.organizations for update to authenticated using (public.is_org_owner(id)) with check (public.is_org_owner(id));

grant select on public.organization_members to authenticated;
grant all on public.organization_members to service_role;
alter table public.organization_members enable row level security;
create policy "members_select_same_org" on public.organization_members for select to authenticated using (public.is_org_member(organization_id));

create table public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid unique not null references public.organizations(id) on delete cascade,
  description text,
  industries text[] not null default '{}',
  target_customers text[] not null default '{}',
  service_areas text[] not null default '{}',
  disqualifiers jsonb not null default '[]'::jsonb,
  qualification_config jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','ready','needs_review')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.business_profiles to authenticated;
grant all on public.business_profiles to service_role;
alter table public.business_profiles enable row level security;
create policy "business_profiles_select" on public.business_profiles for select to authenticated using (public.is_org_member(organization_id));
create policy "business_profiles_insert" on public.business_profiles for insert to authenticated with check (public.is_org_owner(organization_id));
create policy "business_profiles_update" on public.business_profiles for update to authenticated using (public.is_org_owner(organization_id)) with check (public.is_org_owner(organization_id));
create trigger business_profiles_updated_at before update on public.business_profiles for each row execute function public.set_updated_at();

create table public.services (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index services_org_idx on public.services(organization_id);
grant select, insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "services_select" on public.services for select to authenticated using (public.is_org_member(organization_id));
create policy "services_insert" on public.services for insert to authenticated with check (public.is_org_owner(organization_id));
create policy "services_update" on public.services for update to authenticated using (public.is_org_owner(organization_id)) with check (public.is_org_owner(organization_id));
create policy "services_delete" on public.services for delete to authenticated using (public.is_org_owner(organization_id));
create trigger services_updated_at before update on public.services for each row execute function public.set_updated_at();

create table public.knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  type text not null check (type in ('url','note','file')),
  title text not null,
  source_url text,
  content text,
  status text not null default 'pending' check (status in ('pending','processing','ready','failed','needs_review')),
  error_message text,
  last_processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index knowledge_sources_org_status_idx on public.knowledge_sources(organization_id, status);
grant select, insert, update, delete on public.knowledge_sources to authenticated;
grant all on public.knowledge_sources to service_role;
alter table public.knowledge_sources enable row level security;
create policy "knowledge_select" on public.knowledge_sources for select to authenticated using (public.is_org_member(organization_id));
create policy "knowledge_insert" on public.knowledge_sources for insert to authenticated with check (public.is_org_member(organization_id));
create policy "knowledge_update" on public.knowledge_sources for update to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy "knowledge_delete" on public.knowledge_sources for delete to authenticated using (public.is_org_owner(organization_id));
create trigger knowledge_sources_updated_at before update on public.knowledge_sources for each row execute function public.set_updated_at();

create table public.website_analyses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  url text not null,
  status text not null default 'pending' check (status in ('pending','processing','ready','failed','needs_review')),
  extracted_facts jsonb not null default '{}'::jsonb,
  facts_to_confirm jsonb not null default '[]'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index website_analyses_org_idx on public.website_analyses(organization_id, created_at desc);
grant select on public.website_analyses to authenticated;
grant all on public.website_analyses to service_role;
alter table public.website_analyses enable row level security;
create policy "analyses_select" on public.website_analyses for select to authenticated using (public.is_org_member(organization_id));
create trigger website_analyses_updated_at before update on public.website_analyses for each row execute function public.set_updated_at();

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text unique not null,
  goal text not null,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  active_version_id uuid,
  branding jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index experiences_org_status_idx on public.experiences(organization_id, status);
grant select, insert, update on public.experiences to authenticated;
grant all on public.experiences to service_role;
alter table public.experiences enable row level security;
create policy "experiences_select" on public.experiences for select to authenticated using (public.is_org_member(organization_id));
create policy "experiences_insert" on public.experiences for insert to authenticated with check (public.is_org_member(organization_id));
create policy "experiences_update" on public.experiences for update to authenticated using (public.is_org_owner(organization_id)) with check (public.is_org_owner(organization_id));
create trigger experiences_updated_at before update on public.experiences for each row execute function public.set_updated_at();

create table public.experience_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  experience_id uuid not null references public.experiences(id) on delete cascade,
  version_number integer not null,
  definition jsonb not null,
  qualification_rules jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1,
  created_by uuid,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (experience_id, version_number)
);
create index experience_versions_exp_idx on public.experience_versions(experience_id, version_number desc);
grant select, insert, update on public.experience_versions to authenticated;
grant all on public.experience_versions to service_role;
alter table public.experience_versions enable row level security;
create policy "versions_select" on public.experience_versions for select to authenticated using (public.is_org_member(organization_id));
create policy "versions_insert" on public.experience_versions for insert to authenticated with check (public.is_org_member(organization_id));
create policy "versions_update_draft" on public.experience_versions for update to authenticated using (public.is_org_owner(organization_id) and published_at is null) with check (public.is_org_owner(organization_id));

create table public.interaction_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  experience_id uuid not null references public.experiences(id) on delete cascade,
  experience_version_id uuid not null references public.experience_versions(id),
  public_token_hash text not null,
  status text not null default 'started' check (status in ('started','in_progress','review','completed','abandoned','expired')),
  locale text not null default 'fr',
  current_phase text not null default 'besoin',
  is_demo boolean not null default false,
  consent_at timestamptz,
  started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  completed_at timestamptz,
  expires_at timestamptz not null default (now() + interval '24 hours')
);
create index sessions_exp_status_idx on public.interaction_sessions(experience_id, status, last_activity_at desc);
create index sessions_token_idx on public.interaction_sessions(public_token_hash);
grant select on public.interaction_sessions to authenticated;
grant all on public.interaction_sessions to service_role;
alter table public.interaction_sessions enable row level security;
create policy "sessions_select" on public.interaction_sessions for select to authenticated using (public.is_org_member(organization_id));

create table public.interaction_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  session_id uuid not null references public.interaction_sessions(id) on delete cascade,
  actor text not null check (actor in ('visitor','system')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index messages_session_idx on public.interaction_messages(session_id, created_at);
grant select on public.interaction_messages to authenticated;
grant all on public.interaction_messages to service_role;
alter table public.interaction_messages enable row level security;
create policy "messages_select" on public.interaction_messages for select to authenticated using (public.is_org_member(organization_id));

create table public.session_values (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  session_id uuid not null references public.interaction_sessions(id) on delete cascade,
  field_key text not null,
  value jsonb not null,
  source text not null check (source in ('explicit','extracted_high','extracted_low','corrected')),
  confidence numeric check (confidence >= 0 and confidence <= 1),
  source_message_id uuid,
  is_current boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index session_values_current_unique on public.session_values(session_id, field_key) where is_current;
create index session_values_session_idx on public.session_values(session_id);
grant select on public.session_values to authenticated;
grant all on public.session_values to service_role;
alter table public.session_values enable row level security;
create policy "session_values_select" on public.session_values for select to authenticated using (public.is_org_member(organization_id));

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  session_id uuid unique not null references public.interaction_sessions(id) on delete cascade,
  status text not null default 'new' check (status in ('new','to_contact','qualified','not_a_fit','done')),
  contact_name text,
  email text,
  phone text,
  company_name text,
  intent text,
  summary text,
  completeness_score integer check (completeness_score between 0 and 100),
  overall_score integer check (overall_score between 0 and 100),
  recommended_action text check (recommended_action in ('high_priority_contact','standard_follow_up','request_missing_information','not_a_fit')),
  missing_fields text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leads_org_created_idx on public.leads(organization_id, created_at desc);
create index leads_org_status_idx on public.leads(organization_id, status);
create index leads_org_score_idx on public.leads(organization_id, overall_score desc);
create index leads_org_email_idx on public.leads(organization_id, lower(email));
grant select, update on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "leads_select" on public.leads for select to authenticated using (public.is_org_member(organization_id));
create policy "leads_update_status" on public.leads for update to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create trigger leads_updated_at before update on public.leads for each row execute function public.set_updated_at();

create table public.lead_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  dimension text not null check (dimension in ('fit','intent','urgency','completeness')),
  score integer check (score between 0 and 100),
  reasons jsonb not null default '[]'::jsonb,
  rule_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lead_id, dimension)
);
grant select on public.lead_scores to authenticated;
grant all on public.lead_scores to service_role;
alter table public.lead_scores enable row level security;
create policy "lead_scores_select" on public.lead_scores for select to authenticated using (public.is_org_member(organization_id));

create table public.interaction_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  session_id uuid references public.interaction_sessions(id) on delete cascade,
  event_name text not null,
  phase text,
  question_key text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);
create index events_org_time_idx on public.interaction_events(organization_id, occurred_at desc);
create index events_session_time_idx on public.interaction_events(session_id, occurred_at);
grant select on public.interaction_events to authenticated;
grant all on public.interaction_events to service_role;
alter table public.interaction_events enable row level security;
create policy "events_select" on public.interaction_events for select to authenticated using (public.is_org_member(organization_id));