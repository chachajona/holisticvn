# Supabase setup

1. Create a new Supabase project and set the URL, publishable key and service-role key in Vercel.
2. Apply `supabase/migrations/20260828120000_initial_crm.sql` using the Supabase CLI or SQL editor.
3. Invite the first owner with Supabase Auth, then promote their profile to `admin` using the bootstrap command at the end of the migration.
4. Configure Auth URL and redirect URL to the production domain and preview domain.

RLS is the source of truth: Staff can only select/update leads assigned to them and only create notes on those leads. Admins manage all CRM records and profiles.
