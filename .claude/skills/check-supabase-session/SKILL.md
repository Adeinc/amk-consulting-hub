---
name: check-supabase-session
description: Preflight check of Supabase CLI auth/project state before any DB-touching task on this project (migrations, verification queries). Use before running `supabase db push` or any `supabase db query --linked` command.
---

# Check Supabase session

Run this **before** any task that needs `supabase db push` or `supabase db query --linked` —
this exact class of failure has repeatedly cost wasted turns on this project: discovering
mid-task that the CLI is authenticated to the wrong account, or that the project is paused,
rather than catching it up front.

## Steps

1. Run:
   ```bash
   supabase projects list
   ```
2. Confirm a project with `"ref":"fzxhkljocnxwowlsyhnf"` (name may vary) appears in the list,
   with `"status":"ACTIVE_HEALTHY"`.

## If the AMK project doesn't appear at all

The CLI is authenticated to the **wrong Supabase account** — this has happened multiple times
this project. Tell the user directly:

> The Supabase CLI is logged into a different account than the one that owns AMK Consulting
> Hub's project. I need a fresh Personal Access Token for the right account
> (supabase.com/dashboard/account/tokens) — once you paste one, I'll run
> `supabase login --token <token>` and retry.

Do not attempt migrations or verification queries until this is resolved — every such attempt
will fail with a permissions/login error that looks unrelated to the real cause.

## If the AMK project appears but isn't `ACTIVE_HEALTHY` (e.g. paused)

This needs **Owner/Administrator-level access on the Supabase project itself** — the CLI
token's account privilege doesn't matter here; free-tier projects auto-pause after ~7 days of
inactivity and only an Owner-role account can restore them via the Dashboard. Tell the user:

> The AMK Supabase project shows as paused, not just unreachable from here. This needs
> whoever has Owner access (confirmed previously as Freda) to log into the Supabase Dashboard
> and click Restore/Resume on the project — I can't do this from the CLI regardless of which
> account it's logged into.

This is also urgent beyond just blocking dev work — a paused project means the **live site**
is down for real visitors too (auth, booking, everything reads from this database).

## If both checks pass

Proceed with the actual task (migration push, verification queries, etc.) normally.
