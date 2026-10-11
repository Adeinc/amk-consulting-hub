# AMK Consulting Hub — orientation for Claude Code

This file exists to save a fresh session the re-exploration this project has needed repeatedly.
It points at the real docs rather than duplicating them — read those for actual content.

## Facts that get assumed wrong

- **Vite SPA, not Next.js.** Client-side `<BrowserRouter>` (react-router-dom v7), no SSR. Every
  route ships the same static `index.html`; per-route SEO is handled by `src/hooks/useSeo.ts`.
- **Custom component system, not shadcn/ui.** `src/components/ui/*` (Button, Input, Select,
  Card, Modal, Toast, Tabs, Accordion, Toggle, Textarea) is the whole design system, specced in
  `DESIGN.md`. Don't introduce shadcn/Radix — it would duplicate what already exists.
- **GSAP, not Motion/Framer Motion.** Scroll reveals and hover micro-interactions are GSAP +
  `@gsap/react` + hand-written CSS transitions (see `DESIGN.md`'s "Always-Alive Rule").
- **`oxlint`, not ESLint.** `npm run lint` runs oxlint.
- **No test suite exists.** Verification is manual: `npx tsc -b && npm run build && npm
  run lint`, then a browser walkthrough — see `.claude/skills/verify-booking-flow/`.

## Where the real context lives

- `PRODUCT.md` — who this is for, what's confirmed vs. placeholder, brand commitments.
- `DESIGN.md` — the actual design system, with named rules and explicit do/don'ts (a prior
  design revision was rejected by the client as "flat, cold, generic" — don't regress toward it).
- `docs/ROADMAP.md` — milestone status; check this before assuming a feature is or isn't built.
- `docs/DATABASE_SCHEMA.md` / `supabase/migrations/*.sql` — schema and RLS. RLS policies are
  usually already there for what you'd expect — check before adding a new migration for
  something that already has a policy.
- `docs/EMAIL_SETUP.md` — Resend/Supabase email wiring status.
- `README.md` — tech stack table, environment setup.

## The recurring gotcha: Supabase access

This project has repeatedly hit two distinct Supabase problems that look like the same error
but aren't: the CLI authenticated to the wrong account entirely, and the project's own
free-tier auto-pause requiring Owner-role Dashboard access to restore. Run the
`check-supabase-session` skill before any migration push or DB verification query — it exists
specifically because this has cost real time more than once.

## Test data discipline

Any throwaway test account created during verification (see `verify-booking-flow` skill) must
be cleaned up from the production database before finishing — delete `bookings` rows first
(no cascade from `practitioners`), then the `auth.users` row (cascades to `profiles`/
`practitioners`).

## Standing rules (Monedela house standard)

These apply to every task in this repo. The owner is Ola (product owner, Monedela Ltd).

- **Truth mode.** When reporting back, keep these separate: what you inspected, what you changed, what you verified locally, what is confirmed live, and what is still blocked or depends on the owner. Never describe a local change, migration file, mock-up or unconnected integration as live.
- **Secrets.** Never read or write `.env*` files, private keys or service-account JSON — a hook in `.claude/hooks/protect-secrets.mjs` blocks this; use `.env.example` to see variable names. Never put a service-role key, secret key or webhook secret in browser or mobile code, or in a `NEXT_PUBLIC_` / `VITE_` / `EXPO_PUBLIC_` variable.
- **Verify before saying "done".** Run the check commands listed in this file and say which ones passed. A post-edit hook already runs a quick check after each edit; it does not replace the full check.
- **Production and data.** Before any migration, SQL, deploy or webhook change, confirm which project and environment you are connected to. Prefer a migration file (or a database branch) over changing production directly. Ask first before changing production data, deploying, spending money, exposing a service publicly or sending messages on the owner's behalf.
- **Bugs.** Trace the whole path (UI → logic → API/server → database → email/notifications → live config) instead of patching the visible symptom.
- **Security docs.** When doing security work, keep `docs/security/` (Security.md, Auth.md, Data Security.md, Threat Model.md, Security Checklist.md) up to date — create them if missing. Implement and test one rule at a time; never mark a check PASS without evidence.
- **UX.** Before building new screens, write or update the UX docs (UX-BRIEF.md, userflow.md, DESIGN-SYSTEM.md, COMPONENTS.md, SCREEN-SPECS.md). Before launch, run the UX finish audit and log decisions in `docs/ux-audit.md`.
- **Launch.** Run the UK pre-launch gate (legal, privacy, security, accessibility, payments, marketing, vendors/AI, IP, store/web, go/no-go) with evidence before launch and after major changes.
- **Scope.** Reuse the project's existing patterns, keep commits small and focused, and don't rewrite unrelated code. Prefer free-tier or low-cost options unless the owner says otherwise.
