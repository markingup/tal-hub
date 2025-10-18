Supabase Setup – Engineering Notes (MVP)

Project: TALHub
Scope: What’s already provisioned in Supabase for the MVP (schema, RLS, auth trigger, storage) + how to work with it.

⸻

TL;DR
	•	Core entities: profiles, cases, case_participants, documents, messages, deadlines, consultations, payments
	•	Access model: RLS-first — case access is mediated solely through case_participants (plus admin).
	•	Auth glue: handle_new_user() trigger creates a profiles row on signup.
	•	Storage: Private bucket talhub-docs for evidence; access via signed URLs.
	•	Enums: user_role, case_status, case_type, doc_type, message_type
	•	Extensions: pgcrypto used for gen_random_uuid() (Supabase has it enabled by default).

⸻

What’s In Place

1) Enums
	•	user_role: tenant | landlord | lawyer | admin
	•	case_status: draft | active | closed | archived
	•	case_type: non_payment | repossession | renovation | rent_increase | repairs | other
	•	doc_type: lease | notice | photo | invoice | email | audio | video | other
	•	message_type: text | system

2) Tables

profiles
	•	PK = id (FK → auth.users.id)
	•	Fields: email, role (default tenant), full_name, phone, created_at
	•	RLS: user can SELECT/UPDATE only their own row. Inserts happen via trigger.

cases
	•	Fields: title, type, status (default draft), created_by, optional: tal_dossier_number, opposing_party_name, next_hearing_date, notes
	•	RLS:
	•	SELECT/UPDATE: only participants (via case_participants) or admin
	•	INSERT: creator = current user

case_participants
	•	Composite PK (case_id, user_id), fields: role, added_by, created_at
	•	RLS:
	•	SELECT: visible to the user, any participant of the same case, or admin
	•	INSERT: only if the adder is a participant of that case (or admin)
	•	DELETE: self-remove or admin

documents
	•	Fields: case_id, user_id, name, type, storage_path, size_bytes, created_at
	•	RLS:
	•	SELECT/INSERT: participants only (insert requires user_id = current user)

messages
	•	Fields: case_id, sender_id, type, content, created_at
	•	RLS:
	•	SELECT/INSERT: participants only (insert requires sender_id = current user)

deadlines
	•	Fields: case_id, title, due_date, is_done, created_by, created_at
	•	RLS:
	•	ALL: participants only (both USING and WITH CHECK)

consultations  (for lawyer requests; Phase 2 wiring-ready)
	•	Fields: case_id, requested_by, lawyer_id, status, notes, created_at
	•	RLS:
	•	SELECT: requested_by, lawyer_id, or any participant of that case
	•	INSERT: participants only, requested_by = current user
	•	UPDATE: requested_by or lawyer_id

payments  (log only; Stripe handles money)
	•	Fields: case_id?, payer_id?, payee_id?, amount_cents, currency (default CAD), stripe_payment_intent, status, created_at
	•	RLS:
	•	SELECT: payer_id or payee_id or any participant of case_id
	•	INSERT: payer_id = current user

3) Auth trigger
	•	Function: handle_new_user()
	•	Trigger: on_auth_user_created (AFTER INSERT on auth.users)
	•	Behavior: Creates a profiles row with default role tenant.

4) Storage
	•	Bucket: talhub-docs (private)
	•	Pattern: caseId/userId/timestamp_filename
	•	Access via signed URLs. (No public reads; enforce access in app layer.)

⸻

Security Model (RLS) – How It Works
	•	Single source of truth for case access: presence in case_participants.
	•	If a user is not in case_participants (and not admin), they cannot read/update:
	•	The case
	•	Linked documents, messages, deadlines, consultations
	•	Admin bypasses via role check inside policies (already included).

Implication for UI:
	•	When creating a case, client must also insert (case_id, user_id, role) into case_participants for the creator (and invitees). Otherwise, the creator might create a case but fail RLS when fetching it.

⸻

ERD (Simplified)

profiles ──< case_participants >── cases
   │                                 │
   └──────< documents ───────────────┘
   └──────< messages ────────────────┘
   └──────< deadlines ───────────────┘
cases ──< consultations (→ profiles as lawyer/requester)
cases ──< payments (payer/payee → profiles)


⸻

What You Can Rely On (as you build UI/APIs)
	•	Auth & Profiles
	•	On signup, profiles row is created automatically.
	•	Use @supabase/ssr browser client to keep session in sync.
	•	Case CRUD
	•	Create case → then add creator to case_participants.
	•	Fetch lists/detail with React Query; RLS gates visibility.
	•	Documents
	•	Upload file → store in talhub-docs → insert documents row with storage_path.
	•	Read via time-boxed signed URL (server action preferred).
	•	Delete gated by RLS (participant only) and Storage permissions (app layer).
	•	Messages
	•	Insert rows as participant; subscribe to case channel for realtime.
	•	Deadlines
	•	Straightforward CRUD gated by case participation.
	•	Consultations & Payments
	•	Schemas + RLS are ready for Phase 2 (Stripe integration + lawyer workflows).

⸻

Local Dev & Smoke Tests

Use two test users (different browsers or profiles) to verify isolation.

	1.	Profiles created on signup

select id, email, role from public.profiles limit 5;

	2.	Case creation then participation

	•	Create case (as User A)
	•	Insert case_participants (case_id, user_id, role='tenant') for User A
	•	As User B (not a participant), try to select * from cases where id = ... → should fail (no rows).

	3.	Documents visibility

	•	As User A (participant) upload a file + insert documents row
	•	As User B (non-participant), select * from documents where case_id = ... → no rows.

	4.	Messages realtime

	•	As User A send a message; User B (if participant) receives via Realtime subscription.

	5.	Deadlines RLS

	•	As User A create a deadline; User B (participant) can read; non-participant cannot.

⸻

Operational Notes
	•	Extensions: pgcrypto is available (required for gen_random_uuid()).
	•	Indexes: We’re using UUID PKs; consider adding common indexes as we observe query patterns:
	•	create index on case_participants (user_id);
	•	create index on documents (case_id);
	•	create index on messages (case_id, created_at desc);
	•	create index on deadlines (case_id, due_date);
	•	Backups: Enable PITR (Point-in-Time Recovery) in Supabase project settings.
	•	Email: Use Supabase SMTP or Resend for magic links + notifications (config TBD).

⸻

Known Gaps / TODO (Not blocking MVP scaffolding)
	•	Storage Policies: Relying on private bucket + signed URLs (OK for MVP). Add granular Storage RLS later if needed.
	•	Cron/Notifications: No scheduled jobs yet (deadline reminder emails).
	•	Admin tooling: No admin UI yet (role promotion, case visibility).
	•	Invites: No formal “invite by email” flow; add simple tokenized invite later.
	•	Scraping / TAL import: Not wired; planned as a separate, swappable connector.
	•	Stripe: Schema ready (payments) but not integrated; to be added in Phase 2.
	•	i18n: DB is language-agnostic; app copy will handle FR/EN.

⸻

Example Queries (Dev Console)

Add creator as participant after case insert

insert into public.case_participants (case_id, user_id, role, added_by)
values ('{CASE_UUID}', '{USER_UUID}', 'tenant', '{USER_UUID}');

List cases visible to current user

select c.*
from public.cases c
where exists (
  select 1 from public.case_participants cp
  where cp.case_id = c.id and cp.user_id = auth.uid()
);

Insert a message

insert into public.messages (case_id, sender_id, content)
values ('{CASE_UUID}', auth.uid(), 'Hello from RLS world');

Create a signed URL (server-side concept)

// pseudo-code (server action)
const { data } = await supabase.storage
  .from('talhub-docs')
  .createSignedUrl(storage_path, 60); // 60 seconds


⸻

How to Extend Safely
	•	New feature = new table (UNIX style), link to cases where appropriate, then wrap with RLS that always references case_participants.
	•	Never bypass RLS with the anon client. For cross-case queries (admin, internal tasks), use server role on the server only.
	•	Keep “connectors” (e.g., TAL scraping) modular so they can be swapped or disabled without breaking core flows.

⸻

Authentication Configuration

Password Authentication Setup:
1. Enable Email/Password provider in Supabase Dashboard:
   - Go to Authentication → Providers
   - Enable "Email" provider
   - Configure email templates (optional)

2. Email Confirmation Settings:
   - Authentication → Settings → Email Confirmation
   - Enable "Enable email confirmations" for new signups
   - Set confirmation URL to: {your-domain}/auth/callback

3. Password Requirements:
   - Minimum length: 6 characters (enforced in frontend)
   - Supabase handles password complexity validation

4. Auth Flow:
   - Sign Up: Creates user → sends confirmation email → user clicks link → profile created via trigger
   - Sign In: Email/password authentication → redirects to dashboard
   - Magic Link: Fallback method for passwordless authentication

⸻

Contact Points / Useful Paths
	•	DB: Supabase → SQL Editor → migrations
	•	Storage: Bucket talhub-docs (private)
	•	Auth: Supabase Auth settings (email/password + magic link configured)
	•	Policies: Each table has explicit policies; adjust/add as features require.

⸻
