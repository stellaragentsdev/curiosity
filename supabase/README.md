# Supabase setup

1. Create a Supabase project and apply `migrations/202611070001_initial_schema.sql` in the SQL Editor (or with the Supabase CLI).
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
5. Start the app with `npm run dev`. Without Supabase environment variables, the existing sample-data preview remains available and is explicitly not authenticated.

The migration establishes identity, role assignment, core learning/quality/workflow tables, and row-level access policies. Existing screens still use local sample data until their individual read/write paths are migrated; the Creator page labels this boundary. Email ingestion, Teams, and Sam's agent actions are later-phase integrations.
