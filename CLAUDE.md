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
- **No test suite exists.** Verification is manual: `npx tsc --noEmit && npm run build && npm
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
