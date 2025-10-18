TALHub Mock Data Overview (For Pair Programmer)

This document explains what mock / seed data currently exists in the Supabase database for the TALHub MVP. The goal is to help you understand what entities, users, and relationships are already populated so you can safely develop and test features locally without depending on production data.

⸻

1. Overview

The seed data is inserted using the Supabase SQL block in /sql/seed_talhub.sql. It creates test users, demo cases, and sample records across all key tables:
	•	profiles
	•	cases
	•	case_participants
	•	documents
	•	messages
	•	deadlines
	•	consultations
	•	payments

The mock data simulates a realistic landlord–tenant dispute and a renovation / relocation case handled by a lawyer. All data is non-sensitive and randomly generated for testing UI flows, permissions, and relational logic.

⸻

2. Test Users

Role	Email	Full Name	Notes
Tenant	tenant@example.com	Test Tenant	Used as the primary user for tenant-facing views.
Landlord	landlord@example.com	Test Landlord	Used to test opposing-party interactions.
Lawyer	lawyer@example.com	Test Lawyer	Used to test professional user roles and RLS visibility.

These users exist in auth.users and are mirrored in public.profiles with role-based metadata.

⸻

3. Cases

Case Title	Type	Status	Created By	Summary
Non-payment dispute – Apt 3B	non_payment	active	Landlord	Tenant owes 3 months rent; a payment plan is being discussed.
Renovation / temporary relocation	renovation	draft	Tenant	Landlord planning major renovations; tenant exploring relocation rights.

Each case has a generated UUID (gen_random_uuid()) and links to the participants below.

⸻

4. Case Participants

Case	User	Role	Added By
Non-payment dispute	Landlord	landlord	Landlord
Non-payment dispute	Tenant	tenant	Landlord
Non-payment dispute	Lawyer	lawyer	Landlord
Renovation	Tenant	tenant	Tenant

This structure tests RLS (Row-Level Security) to ensure users only see cases where they are participants.

⸻

5. Documents

Case	Uploaded By	Name	Type	Example Path	Size
Non-payment	Landlord	Lease_2023.pdf	lease	case/{case_id}/landlord/lease_2023.pdf	120 KB
Non-payment	Tenant	Payment_Receipts_Jan-Mar.pdf	invoice	case/{case_id}/tenant/receipts_q1.pdf	88 KB
Renovation	Tenant	Notice_of_Renovation.jpg	notice	case/{case_id}/tenant/reno_notice.jpg	420 KB

These mock files simulate uploaded evidence or supporting documents. You can safely extend or replace them in development.

⸻

6. Messages

Case	Sender	Type	Content
Non-payment	Landlord	text	“Hello, can we arrange a payment plan to avoid further action?”
Non-payment	Tenant	text	“Yes, I can do $400 on the 1st and $400 on the 15th for the next two months.”
Non-payment	Lawyer	system	“Lawyer added to case and reviewing documents.”
Renovation	Tenant	text	“Landlord mentioned ‘major renos’. What are my rights for temp relocation & return?”

These entries are useful for testing real-time messaging, notifications, or activity feeds.

⸻

7. Deadlines

Case	Title	Due Date	Created By
Non-payment	File proof of payment plan	+7 days	Landlord
Non-payment	Proposed consent agreement draft	+10 days	Lawyer
Renovation	Prepare evidence of habitability issues	+5 days	Tenant

Used to test task views, reminders, or case tracking components.

⸻

8. Consultations (Phase 2)

Case	Requested By	Lawyer	Status	Notes
Renovation	Tenant	Lawyer	requested	30-minute paid consult re: relocation compensation

This prepares the database for future consultation booking or Stripe integration.

⸻

9. Payments (Phase 2)

Case	Payer	Payee	Amount (CAD)	Status
Renovation	Tenant	Lawyer	75.00	created

Used to wire up mock transactions and ensure UI binding with payments table works.

⸻

10. Indexes Created

The SQL seed adds idempotent indexes to improve lookup performance:
	•	idx_cp_user → on case_participants (user_id)
	•	idx_docs_case → on documents (case_id)
	•	idx_msgs_case_created → on messages (case_id, created_at desc)
	•	idx_deadlines_case_due → on deadlines (case_id, due_date)

⸻

11. Validation Steps

After seeding:
	1.	Log in as each of the 3 users in the app.
	2.	Verify case visibility matches their participant role.
	3.	Confirm you can read/write messages only within cases you are part of.
	4.	Check Supabase tables for correct RLS enforcement.

⸻

Summary

This mock data forms a full E2E skeleton of the TALHub tenant–landlord dispute flow. It’s safe to iterate on UI components, RLS tests, and backend functions without breaking real data.

When adding new mock data, keep it idempotent (on conflict do nothing or on conflict (id) do update) and match role ownership patterns shown here.