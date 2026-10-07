# Tushar Gahlout — Portfolio

TanStack Start + React + Tailwind, with a Supabase database for projects and hackathon photos.

## One-time database setup (about 5 minutes)

1. Create a free project at https://supabase.com.
2. Dashboard → **SQL Editor** → New query → paste everything from `supabase.sql` → **Run**.
3. Dashboard → **Authentication → Users → Add user** → create a user with email `rajputtushar119@gmail.com` and a password you choose. Then **Authentication → Providers → Email** and turn **off** "Allow new users to sign up".
4. Dashboard → **Project Settings → API** → copy the **Project URL** and the **anon public** key.
5. Put them in `.env` (copy `.env.example`) and also in your host's environment variables:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
6. `bun install` (or `npm install`) to pull in `@supabase/supabase-js`, then redeploy.

## Using it

Open `https://your-site/?admin`, sign in with the owner email + password.
- **Projects** section: an "Add a project" form appears (image, links, tech). Projects go live for everyone instantly; each has a Delete button.
- **Hackathons** section: an "Add photos" button appears on each card.

Only the owner account can write (enforced by Row Level Security in the database); visitors can only read.

## Contact form
Set `VITE_WEB3FORMS_KEY` (free key from https://web3forms.com).
