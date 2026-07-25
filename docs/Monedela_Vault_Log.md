# Monedela Vault Log

Template fields per session, most recent first.

---

**Project:** AMK Consulting Hub — Clinical Room Booking Platform
**Project Code:** MS-001
**Session:** 1 (first billable build session — Milestone 1 + Milestone 2 scope)
**Date:** 23 Jul 2026
**Status:** In progress — public site built, backend not yet connected

**Completed:**
- Reviewed MS-001 Complete Export (Claude Project knowledge dump): confirmed no application
  code existed anywhere prior to this session — foundation phase was documentation + one SQL
  migration only.
- Scaffolded the real Milestone 1 project: Vite + React 18 + TypeScript + Tailwind CSS v4 at
  `~/amk-consulting-hub`, replacing the earlier disconnected prototype build output.
- Wired Tailwind design tokens to the locked brand palette (Navy `#0C2A4E`, Teal `#0C8496`,
  Deep Teal `#086878`, Soft `#F2F8F8`, Border `#D8E2E2`, Confirm `#16A34A`, Alert `#DC2626`)
  and the Fraunces + Inter type pairing carried over from the approved prototype.
- Built reusable UI primitives (Button, Input, Select, Card, Badge, Modal, Toast, Tabs) and
  layout shells (Header, Footer, PageShell, AuthShell, DashboardShell).
- Built the public site: Home, Rooms listing, Room detail, Sign in, Sign up — mobile-first,
  distinctive (not a generic SaaS template), all room content clearly flagged as sample
  content pending client sign-off.
- Built Practitioner dashboard and Admin dashboard shells with mock data.
- Scaffolded Supabase, Stripe (publishable-key-only), and Resend (server-side-only) client
  integration points — env-var based, no live keys, `.env.example` provided.
- Added atmospheric brand photography (free-license Unsplash stock, credited in
  `src/data/imagery.ts`) to the hero, auth panel, and rooms banner — explicitly not
  represented as real photos of AMK Consulting Hub's actual rooms.
- Corrected `README.md`, `docs/ROADMAP.md`, `docs/FUNCTIONAL_SPEC.md`,
  `docs/DATABASE_SCHEMA.md`, and `supabase/migrations/0001_init.sql` to reflect the rebrand
  and the 21 Jul 2026 locked decisions (auto-confirm on payment, full payment at booking,
  self-declared credential attestation) — none of this was in the original project files yet.
- Verified: `tsc --noEmit` clean, `npm run build` clean, manual check of all five routes in
  browser at desktop and mobile widths.

**In Progress:**
- Nothing left mid-implementation this session; next work is genuinely new scope (see Next
  Actions).

**Files Changed:**
New project at `~/amk-consulting-hub` — see `README.md` → Repository Structure for the full
tree. Key files: `src/index.css` (design tokens), `src/App.tsx` (routing),
`src/data/rooms.ts` (placeholder room data, all flagged), `src/data/imagery.ts` (stock photo
credits), `src/lib/{supabase,stripe,resend}.ts` (integration stubs),
`supabase/migrations/0001_init.sql` (corrected schema), `docs/*.md` (corrected specs).

**Technical Decisions:**
- Tailwind v4 (`@theme` in CSS, `@tailwindcss/vite` plugin) rather than v3 + PostCSS config —
  simpler setup, no `tailwind.config.js` needed.
- `documents` table redesigned as `practitioners.credentials_attested boolean` — the original
  file-upload/review schema no longer matches the locked self-declared-attestation decision.
  Flagged clearly in `docs/DATABASE_SCHEMA.md` as a deliberate schema change, not an omission.
- Placeholder room data carries an explicit `isPlaceholder: boolean` field consumed by the UI
  (visible "Sample" badges) rather than being silently indistinguishable from real content.
- Stock photography used for atmosphere only, sourced from Unsplash (free license, no
  attribution required), never applied to a specific room's own detail page — those stay on
  the abstract "sample photo pending" treatment since claiming a specific stock photo *is* a
  specific room would misrepresent the client's actual space.

**Risks:**
- AI image generation was unavailable this session (workspace out of credits) — atmospheric
  imagery is stock photography, not custom-generated brand photography. Worth revisiting once
  credits are available, or once Freda supplies real room photography (which supersedes both).
- Final budget sign-off status is still unconfirmed per `ROADMAP.md`'s Milestone 1 gate — only
  the 50% deposit is confirmed. Recommend confirming this explicitly before further billable
  work, independent of this session's output.
- No backend exists yet — every "book", "sign in", and "sign up" action in the current build
  is UI-only. This is expected at this milestone but should not be mistaken for a functioning
  booking system if shared with the client for feedback.

**Next Actions:**
1. Confirm final budget sign-off status with Freda (separate from the deposit already received).
2. Provision Supabase dev + prod projects under Freda's account, add Monedela as collaborator.
3. Wire Supabase Auth to the existing Sign in / Sign up UI (Milestone 3).
4. Build the contact/enquiry form and Terms/Privacy placeholder pages (remaining Milestone 2 scope).
5. Chase the still-open client confirmations: final room names/pricing/photos, which rooms
   combine, cancellation window, legal entity name for Stripe.
6. If desired, regenerate the atmospheric imagery as custom AI photography once image
   generation credits are available, or replace with real client photography when supplied.

**Vault Update:** Logged.
