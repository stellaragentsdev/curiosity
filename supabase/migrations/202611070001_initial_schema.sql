create type public.app_role as enum (
  'admin',
  'learning_development',
  'quality_assurance',
  'operations',
  'associate'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  email text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (profile_id, role)
);

create or replace function public.has_app_role(required_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profile_roles
    where profile_id = auth.uid()
      and role = any(required_roles)
  );
$$;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, '')
  );

  insert into public.profile_roles (profile_id, role)
  values (new.id, 'associate');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

create table public.projects (
  id text primary key,
  name text not null,
  client_code text not null default '',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_groups (
  id text primary key,
  name text not null,
  project_id text references public.projects(id) on delete set null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.associates (
  id text primary key,
  profile_id uuid unique references public.profiles(id) on delete set null,
  project_id text references public.projects(id) on delete set null,
  group_id text references public.user_groups(id) on delete set null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.learning_modules (
  id text primary key,
  title text not null,
  project_id text references public.projects(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_defects (
  id text primary key,
  associate_id text references public.associates(id) on delete set null,
  project_id text references public.projects(id) on delete set null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_rebuttals (
  id uuid primary key default gen_random_uuid(),
  defect_id text not null references public.audit_defects(id) on delete cascade,
  submitted_by uuid not null references public.profiles(id),
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'escalated')),
  resolution_note text,
  resolved_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.sops (
  id text primary key,
  project_id text references public.projects(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sop_acknowledgements (
  sop_id text not null references public.sops(id) on delete cascade,
  associate_id text not null references public.associates(id) on delete cascade,
  version text not null,
  acknowledged_at timestamptz not null default now(),
  primary key (sop_id, associate_id, version)
);

create table public.training_enrollments (
  id uuid primary key default gen_random_uuid(),
  module_id text not null references public.learning_modules(id) on delete cascade,
  associate_id text not null references public.associates(id) on delete cascade,
  status text not null default 'assigned' check (status in ('assigned', 'in_progress', 'completed', 'failed')),
  score numeric(5,2) check (score is null or (score >= 0 and score <= 100)),
  data jsonb not null default '{}'::jsonb,
  assigned_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, associate_id)
);

create table public.training_tickets (
  id text primary key,
  associate_id text references public.associates(id) on delete set null,
  project_id text references public.projects(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'closed')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.upload_batches (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.projects(id) on delete set null,
  source text not null,
  status text not null default 'received' check (status in ('received', 'processing', 'completed', 'failed')),
  row_count integer not null default 0 check (row_count >= 0),
  uploaded_by uuid not null references public.profiles(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.calibration_sessions (
  id text primary key,
  project_id text references public.projects(id) on delete set null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflow_definitions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  definition jsonb not null default '{}'::jsonb,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflow_definitions(id) on delete cascade,
  started_by uuid not null references public.profiles(id),
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  input jsonb not null default '{}'::jsonb,
  result jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index associates_profile_id_idx on public.associates(profile_id);
create index associates_project_id_idx on public.associates(project_id);
create index associates_group_id_idx on public.associates(group_id);
create index audit_defects_associate_id_idx on public.audit_defects(associate_id);
create index audit_defects_project_id_idx on public.audit_defects(project_id);
create index training_enrollments_associate_id_idx on public.training_enrollments(associate_id);
create index training_tickets_associate_id_idx on public.training_tickets(associate_id);
create index upload_batches_project_id_idx on public.upload_batches(project_id);
create index workflow_runs_started_by_idx on public.workflow_runs(started_by);

alter table public.profiles enable row level security;
alter table public.profile_roles enable row level security;
alter table public.projects enable row level security;
alter table public.user_groups enable row level security;
alter table public.associates enable row level security;
alter table public.learning_modules enable row level security;
alter table public.audit_defects enable row level security;
alter table public.audit_rebuttals enable row level security;
alter table public.sops enable row level security;
alter table public.sop_acknowledgements enable row level security;
alter table public.training_enrollments enable row level security;
alter table public.training_tickets enable row level security;
alter table public.upload_batches enable row level security;
alter table public.calibration_sessions enable row level security;
alter table public.workflow_definitions enable row level security;
alter table public.workflow_runs enable row level security;

create policy "Profiles are visible to their owner and admins"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_app_role(array['admin']::public.app_role[]));
create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.has_app_role(array['admin']::public.app_role[]))
  with check (id = auth.uid() or public.has_app_role(array['admin']::public.app_role[]));
create policy "Users can read their assigned roles"
  on public.profile_roles for select to authenticated
  using (profile_id = auth.uid() or public.has_app_role(array['admin']::public.app_role[]));
create policy "Admins can manage assigned roles"
  on public.profile_roles for all to authenticated
  using (public.has_app_role(array['admin']::public.app_role[]))
  with check (public.has_app_role(array['admin']::public.app_role[]));

create policy "Authorized staff can read projects"
  on public.projects for select to authenticated
  using (
    public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[])
    or exists (
      select 1 from public.associates a
      where a.profile_id = auth.uid() and a.project_id = projects.id
    )
  );
create policy "L&D admins can manage projects"
  on public.projects for insert to authenticated
  with check (public.has_app_role(array['admin', 'learning_development']::public.app_role[]));
create policy "L&D admins can update projects"
  on public.projects for update to authenticated
  using (public.has_app_role(array['admin', 'learning_development']::public.app_role[]))
  with check (public.has_app_role(array['admin', 'learning_development']::public.app_role[]));
create policy "Admins can delete projects"
  on public.projects for delete to authenticated
  using (public.has_app_role(array['admin']::public.app_role[]));

create policy "Staff can read user groups"
  on public.user_groups for select to authenticated
  using (
    public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[])
    or exists (
      select 1 from public.associates a
      where a.profile_id = auth.uid() and a.group_id = user_groups.id
    )
  );
create policy "L&D admins can manage user groups"
  on public.user_groups for all to authenticated
  using (public.has_app_role(array['admin', 'learning_development']::public.app_role[]))
  with check (public.has_app_role(array['admin', 'learning_development']::public.app_role[]));

create policy "Staff can read associate profiles"
  on public.associates for select to authenticated
  using (
    profile_id = auth.uid()
    or public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[])
  );
create policy "Authorized staff can manage associate profiles"
  on public.associates for all to authenticated
  using (public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[]))
  with check (public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[]));

create policy "Users can read published modules"
  on public.learning_modules for select to authenticated
  using (
    public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[])
    or (
      status = 'published'
      and (
        project_id is null
        or exists (
          select 1 from public.associates a
          where a.profile_id = auth.uid() and a.project_id = learning_modules.project_id
        )
      )
    )
  );
create policy "L&D can create modules"
  on public.learning_modules for insert to authenticated
  with check (public.has_app_role(array['admin', 'learning_development']::public.app_role[]));
create policy "L&D can update modules"
  on public.learning_modules for update to authenticated
  using (public.has_app_role(array['admin', 'learning_development']::public.app_role[]))
  with check (public.has_app_role(array['admin', 'learning_development']::public.app_role[]));
create policy "Admins can delete modules"
  on public.learning_modules for delete to authenticated
  using (public.has_app_role(array['admin']::public.app_role[]));

create policy "QA and staff can read relevant audit defects"
  on public.audit_defects for select to authenticated
  using (
    public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[])
    or exists (
      select 1 from public.associates a
      where a.id = audit_defects.associate_id and a.profile_id = auth.uid()
    )
  );
create policy "QA can create audit defects"
  on public.audit_defects for insert to authenticated
  with check (public.has_app_role(array['admin', 'quality_assurance']::public.app_role[]));
create policy "QA can update audit defects"
  on public.audit_defects for update to authenticated
  using (public.has_app_role(array['admin', 'quality_assurance']::public.app_role[]))
  with check (public.has_app_role(array['admin', 'quality_assurance']::public.app_role[]));

create policy "Users can read their rebuttals and staff can read all"
  on public.audit_rebuttals for select to authenticated
  using (
    submitted_by = auth.uid()
    or public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[])
  );
create policy "Associates can submit their own rebuttals"
  on public.audit_rebuttals for insert to authenticated
  with check (
    submitted_by = auth.uid()
    and exists (
      select 1
      from public.audit_defects d
      join public.associates a on a.id = d.associate_id
      where d.id = defect_id and a.profile_id = auth.uid()
    )
  );
create policy "QA can resolve rebuttals"
  on public.audit_rebuttals for update to authenticated
  using (public.has_app_role(array['admin', 'quality_assurance']::public.app_role[]))
  with check (public.has_app_role(array['admin', 'quality_assurance']::public.app_role[]));

create policy "Users can read published SOPs"
  on public.sops for select to authenticated
  using (
    public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[])
    or (
      status = 'published'
      and (
        project_id is null
        or exists (
          select 1 from public.associates a
          where a.profile_id = auth.uid() and a.project_id = sops.project_id
        )
      )
    )
  );
create policy "L&D can manage SOPs"
  on public.sops for all to authenticated
  using (public.has_app_role(array['admin', 'learning_development']::public.app_role[]))
  with check (public.has_app_role(array['admin', 'learning_development']::public.app_role[]));

create policy "Users can read their SOP acknowledgements and staff can read all"
  on public.sop_acknowledgements for select to authenticated
  using (
    exists (
      select 1 from public.associates a
      where a.id = associate_id and a.profile_id = auth.uid()
    )
    or public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[])
  );
create policy "Associates can acknowledge assigned published SOPs"
  on public.sop_acknowledgements for insert to authenticated
  with check (
    exists (
      select 1
      from public.associates a
      join public.sops s on s.id = sop_id
      where a.id = associate_id and a.profile_id = auth.uid() and s.status = 'published'
        and (s.project_id is null or s.project_id = a.project_id)
    )
  );

create policy "Users can read their own training enrollments and staff can read all"
  on public.training_enrollments for select to authenticated
  using (
    exists (
      select 1 from public.associates a
      where a.id = associate_id and a.profile_id = auth.uid()
    )
    or public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[])
  );
create policy "L&D can assign training"
  on public.training_enrollments for insert to authenticated
  with check (public.has_app_role(array['admin', 'learning_development', 'quality_assurance']::public.app_role[]));
create policy "L&D and QA can update training progress"
  on public.training_enrollments for update to authenticated
  using (public.has_app_role(array['admin', 'learning_development', 'quality_assurance']::public.app_role[]))
  with check (public.has_app_role(array['admin', 'learning_development', 'quality_assurance']::public.app_role[]));
create policy "Admins can delete training enrollments"
  on public.training_enrollments for delete to authenticated
  using (public.has_app_role(array['admin']::public.app_role[]));

create policy "Staff can read training tickets"
  on public.training_tickets for select to authenticated
  using (
    public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[])
    or exists (
      select 1 from public.associates a
      where a.id = associate_id and a.profile_id = auth.uid()
    )
  );
create policy "Staff can manage training tickets"
  on public.training_tickets for all to authenticated
  using (public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[]))
  with check (public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[]));

create policy "Staff can read upload batches"
  on public.upload_batches for select to authenticated
  using (public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[]));
create policy "Staff can manage upload batches"
  on public.upload_batches for all to authenticated
  using (public.has_app_role(array['admin', 'quality_assurance', 'operations']::public.app_role[]))
  with check (public.has_app_role(array['admin', 'quality_assurance', 'operations']::public.app_role[]));

create policy "Staff can read calibration sessions"
  on public.calibration_sessions for select to authenticated
  using (public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[]));
create policy "QA and operations can manage calibration sessions"
  on public.calibration_sessions for all to authenticated
  using (public.has_app_role(array['admin', 'quality_assurance', 'operations']::public.app_role[]))
  with check (public.has_app_role(array['admin', 'quality_assurance', 'operations']::public.app_role[]));

create policy "Staff can read workflow definitions"
  on public.workflow_definitions for select to authenticated
  using (
    status = 'published'
    or public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[])
  );
create policy "L&D can manage workflow definitions"
  on public.workflow_definitions for all to authenticated
  using (public.has_app_role(array['admin', 'learning_development']::public.app_role[]))
  with check (public.has_app_role(array['admin', 'learning_development']::public.app_role[]));

create policy "Users can read their runs and authorized staff can read all"
  on public.workflow_runs for select to authenticated
  using (
    started_by = auth.uid()
    or public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[])
  );
create policy "Users can start workflow runs"
  on public.workflow_runs for insert to authenticated
  with check (
    started_by = auth.uid()
    and exists (
      select 1 from public.workflow_definitions w
      where w.id = workflow_id and w.status = 'published'
    )
  );
create policy "Staff can update workflow runs"
  on public.workflow_runs for update to authenticated
  using (public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[]))
  with check (public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations']::public.app_role[]));

grant usage on schema public to authenticated;
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;
grant select, insert, update, delete on public.profile_roles,
  public.projects, public.user_groups, public.associates, public.learning_modules,
  public.audit_defects, public.audit_rebuttals, public.sops, public.sop_acknowledgements,
  public.training_enrollments, public.training_tickets, public.upload_batches,
  public.calibration_sessions, public.workflow_definitions, public.workflow_runs
  to authenticated;
grant execute on function public.has_app_role(public.app_role[]) to authenticated;
