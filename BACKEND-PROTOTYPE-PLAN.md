# L&D Intell backend prototype plan

## Goal

Deliver an interactive prototype where the five role experiences (Admin, L&D, QA, Operations, and Associate) use clearly labeled synthetic records, role changes are visible, and prototype actions persist. Supabase is the selected backend. No production/customer data is included.

## Current implementation

1. The existing React app already contains synthetic domain data for projects, associates, learning, compliance, quality, training, SOPs, uploads, and NHT/CS cohorts.
2. With no Supabase credentials, the app now saves prototype edits in browser local storage. This is a single-browser demo, not a shared backend.
3. With Supabase configured, the app can load/save the synthetic snapshot in the isolated `prototype_workspaces` table. Admin initializes it from the workspace home; assigned roles can exercise the shared synthetic workspace.
4. The table is deliberately marked `synthetic` and RLS-protected. It is a temporary prototype bridge, not a production schema or a place for PHI/live employee records.
5. Core tables and profile/role policies are in the initial migration; the synthetic workspace table is an additive migration.

## Shared browser preview observation (2026-11-07)

- The local app is available at `http://localhost:5173/` and is branded **Curiosity — L&D Intell**, with the subtitle “Interactive, AI-enabled Learning Intelligence.”
- The shared preview currently opens the Admin workspace, with a role preview selector for Admin, L&D, QA, Operations, and Associate. The UI explicitly warns that role preview is not access control.
- The observed Admin home shows synthetic summary values: 6 projects, 84.8% portfolio health, 6 people, and 5 open priorities. Its shortcuts include people/projects management, portfolio review, and the system blueprint; the governance pulse lists one quality rebuttal, four training follow-ups, and 95.3% compliance completion.
- The top navigation exposes “Ask Trainer Sam.” The presence of this control is not evidence that mailbox ingestion, Teams, or a production agent is connected.
- The header and home explicitly label records as synthetic and say they are saved in this browser. A simulated Operations demo upload was verified to remain in local storage after a page reload; it does not import a file or sync external systems.

## Step-by-step path to a backend-connected prototype

1. **Provision Supabase project** — Create/select a non-production project and confirm its region. No production data should be loaded. Estimated: 30–60 minutes.
2. **Apply migrations** — Apply `202611070001_initial_schema.sql`, then `202611070002_synthetic_prototype_workspace.sql`. Verify RLS is enabled. Estimated: 30–60 minutes.
3. **Configure local app** — Put the project URL and publishable/anon key in `.env.local` (never use a service-role key in the browser), configure the local redirect URL, and restart Vite. Estimated: 15–30 minutes.
4. **Create synthetic test identities** — Invite/create one test account per role, verify the profile trigger, and assign each role through `profile_roles`. Keep test accounts separate from real staff. Estimated: 30–60 minutes.
5. **Seed and exercise synthetic workspace** — Sign in as Admin, initialize the snapshot, then test each role’s home and permitted modules. Make an edit in each workflow and verify it survives refresh and appears to another authorized test user. Estimated: 2–4 hours.
6. **Test role access and negative paths** — Verify role-specific tabs, Supabase RLS, unassigned-user denial, failed writes, and the explicit synthetic-data label. Do not treat frontend role filtering as security. Estimated: 1–2 days.

## Production-ready backend follow-up

7. **Replace snapshot storage with normalized repository calls** — Map each screen to relational tables and persist actions as narrow inserts/updates. Add missing tables for compliance courses, weekly assessments, question banks, NHT/CS cohorts, and task approvals as their final shapes are agreed. Estimated: 2–4 days.
8. **Implement and test approval workflows** — Define approver roles, transitions, audit trail, rejection/resubmission rules, and notification expectations; enforce transitions with RLS/database functions rather than client-only checks. Estimated: 2–3 days after workflow rules are confirmed.
9. **Add quality gates** — Add automated tests for role policies and workflow transitions, database migration checks, backup/restore validation, and error/empty/loading UI. Estimated: 1–2 days.
10. **Release a controlled pilot** — Seed test accounts only, obtain data-owner/security approval before any live data, and deploy to a non-production environment first. Estimated: 1–2 days.

## Estimate

- **Backend-connected synthetic prototype:** approximately **1–2 working days** after Supabase project access and test identities are available.
- **Normalized MVP with approval workflows and automated access tests:** approximately **6–10 working days** after the schema and approval rules are agreed.
- **Email ingestion, Teams, and a live agentic Sam:** separate later phase; estimate **1–3 additional weeks** depending on mailbox/tenant permissions, security review, and AI-provider selection.

These are engineering estimates, not calendar commitments. Waiting for credentials, stakeholder decisions, security review, or external access adds elapsed time.

## Required next steps from the project owner

- Provide the Supabase project URL and publishable/anon key through the local `.env.local` file or an approved secret manager. Never send a service-role key in chat or commit it.
- Confirm/create a non-production Supabase project and apply the two migrations.
- Create synthetic test identities and assign the five roles.
- Before normalized approval implementation, confirm which actions require approval, who may approve them, and whether a rejection can be resubmitted.
- Keep all prototype data synthetic until the data owner and security reviewer approve a live-data pilot.
