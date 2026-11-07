# Supabase setup

1. Create a Supabase project and apply `migrations/202611070001_initial_schema.sql` followed by `migrations/202611070002_synthetic_prototype_workspace.sql` in the SQL Editor (or with the Supabase CLI).
2. Copy `.env.example` to `.env.local` and set the project URL and publishable/anon key. Never put a service-role key in the browser app.
3. Configure Supabase Auth email sign-in and the allowed redirect URL for the local app and production site.
4. New users receive the `associate` role. Assign additional roles from the Supabase SQL Editor as an administrator:

   ```sql
   insert into public.profile_roles (profile_id, role)
   select id, 'admin'::public.app_role
   from public.profiles
   where email = 'admin@example.com'
   on conflict do nothing;
   ```

   Repeat with `learning_development`, `quality_assurance`, `operations`, or `associate` as needed. A user can have multiple rows and switch only among their assigned roles.
5. Start the app with `npm run dev`. In local preview mode, synthetic workspace edits persist in this browser only. In the authenticated preview, an Admin can initialize the shared synthetic workspace from the role home; subsequent changes synchronize to Supabase.

The first migration establishes identity, role assignment, core learning/quality/workflow tables, and row-level access policies. The second adds an isolated JSON workspace used only for synthetic prototype records. It is a migration bridge for interactive role testing—not a production data model. Do not store customer, PHI, or live employee records in `prototype_workspaces`; migrate live records to the normalized tables before production. Changes are whole-snapshot last-write-wins, so this is not suitable for concurrent production editing.

The test dataset uses fictional names and metrics. For live authenticated role testing, create/invite separate test users in Supabase Auth and assign each a role using the SQL above. One user may be given multiple roles to test role switching. Email ingestion, Teams, and Sam's agent actions remain later-phase integrations.
