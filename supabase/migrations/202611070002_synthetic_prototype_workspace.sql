create table public.prototype_workspaces (
  workspace_key text primary key check (workspace_key = 'synthetic-demo'),
  dataset_kind text not null default 'synthetic' check (dataset_kind = 'synthetic'),
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  updated_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.prototype_workspaces enable row level security;

create policy "Assigned users can read synthetic prototype data"
  on public.prototype_workspaces for select to authenticated
  using (
    public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations', 'associate']::public.app_role[])
  );

create policy "Admins can initialize synthetic prototype data"
  on public.prototype_workspaces for insert to authenticated
  with check (
    public.has_app_role(array['admin']::public.app_role[])
    and dataset_kind = 'synthetic'
  );

create policy "Assigned users can update synthetic prototype data"
  on public.prototype_workspaces for update to authenticated
  using (
    public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations', 'associate']::public.app_role[])
  )
  with check (
    public.has_app_role(array['admin', 'learning_development', 'quality_assurance', 'operations', 'associate']::public.app_role[])
    and dataset_kind = 'synthetic'
  );

create policy "Admins can remove synthetic prototype data"
  on public.prototype_workspaces for delete to authenticated
  using (public.has_app_role(array['admin']::public.app_role[]));
