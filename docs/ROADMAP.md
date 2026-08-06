# Development Roadmap — MS-001 AMK Consulting Hub

**Status:** Milestone 1–2 in progress
**Prerequisite for Milestone 1 start:** Signed final budget + initial payment received —
50% deposit received 22 Jul 2026; final budget sign-off status to be confirmed before further
billable work.

This roadmap sequences work so the client sees a working, deployable system early and often.

---

## Milestone 0 — Foundation (complete)

- Repository structure and conventions
- Development roadmap (this document)
- Functional specification
- Database schema design

## Milestone 1 — Project Setup & Design System (in progress)

- [x] Vite + React + TypeScript project initialised
- [x] Tailwind config with AMK Consulting Hub design tokens (brand palette, spacing) carried
      over from the approved prototype. Typography is **Public Sans + JetBrains Mono**
      (revised from an earlier Fraunces + Inter pass, then a brief Frank Ruhl Libre + Hanken
      Grotesk pass) — Public Sans for display/body, JetBrains Mono reserved strictly for
      numeric data in the admin dashboard. See `DESIGN.md` for the full rationale.
- [x] Reusable UI primitives: Button, Input, Select, Card, Modal, Badge, Toast, Tabs
- [x] Base layout: Header, Footer, responsive nav
- [x] Supabase project provisioned (`fzxhkljocnxwowlsyhnf`, eu-west-3) — one project so far, not yet
      split into separate dev/prod projects (see README's environments note); schema migrations
      applied (`0001_init.sql`, `0002_add_reminder_tracking.sql`); `send-booking-confirmation` and
      `send-booking-reminder` Edge Functions deployed. Auth not yet wired into the UI (still
      Milestone 3 work) — the project exists and is reachable, the app doesn't call it yet.
- [x] Repository on GitHub (`github.com/Adeinc/amk-consulting-hub`, public — Netlify's
      private-repo plan only trusts pushes from its one connected contributor account, which
      blocked builds pushed from a collaborator; made public to unblock CI rather than upgrade
      plan), Netlify linked for continuous deployment — every push to `main` auto-deploys,
      PRs get preview URLs
- [x] Deployed to Netlify with a live URL (`amk-consulting-hub.netlify.app`)

## Milestone 2 — Public Site (in progress)

- [x] Homepage (upgrades the approved prototype — distinctive, mobile-first)
- [x] Rooms listing page (six rooms, sample pricing — final pricing pending client)
- [x] Room details page (amenities, AM/PM/full-day pricing; photo gallery pending real photos)
- [ ] Contact / enquiry form (sends via Resend to admin inbox) — not yet built
- [ ] Terms & Privacy placeholder pages — not yet built

## Milestone 3 — Authentication & Practitioner Accounts

- [x] Sign in / sign up UI built
- [ ] Wire to Supabase Auth (register / login / password reset)
- [ ] Email verification flow (Resend)
- [x] Practitioner dashboard shell (mock data)

## Milestone 4 — Booking Engine (core value)

- [ ] Availability engine: AM / PM / full-day session logic across six rooms
- [ ] Blocked dates support
- [ ] Booking creation flow with conflict prevention (no double-booking) — schema-level rule
      already designed in `0001_init.sql`
- [ ] Pending vs confirmed booking states — **auto-confirm on payment is now the locked
      default** (see Section 4 below), not admin-approved
- [ ] Multi-day bookings (a practitioner books N consecutive days in one go, priced as
      days × session rate) — the frontend flow, summary, and pricing are prototyped
      (`BookingFlowModal.tsx`) against mock data; `0001_init.sql`'s `bookings` table models
      one date per row, so this needs real schema design (a date range vs. one row per day)
      once the booking engine is actually built
- [ ] Booking access codes + QR — prototyped end-to-end on mock data (booking confirmation,
      profile/dashboard display, and an "extend" flow that issues a fresh code). Needs Freda's
      input on the actual door-access system/vendor before this becomes real — the UI doesn't
      assume or claim to control any physical hardware

## Milestone 5 — Payments

- [ ] Stripe integration — **full payment at booking**, not a deposit (locked decision)
- [ ] Payment status synced to booking record
- [ ] Payment confirmation emails (Resend)
- Gated on Freda's Stripe account verification — flagged as her highest-priority action, since
  business verification delays can become a blocker here

## Milestone 6 — Admin Dashboard

- [x] Dashboard overview shell (mock data)
- [ ] Manage rooms (CRUD, images, pricing per session type)
- [ ] Manage bookings, calendar view, block dates
- [ ] Manage practitioners/customers, payments view, reports, settings

## Milestone 7 — Hardening, Notifications

- [ ] Practitioner credential attestation — **self-declared Yes/No, not a document upload**
      (locked decision; changes the original `documents` table's purpose, see
      `docs/DATABASE_SCHEMA.md`)
- [x] Notification system built ahead of accounts existing (booking confirmed, cancelled,
      reminder) — Edge Functions, on-brand HTML templates, and client call sites are all
      written; only account setup and two deploy commands are left, see `docs/EMAIL_SETUP.md`
- [ ] Audit log, full RLS policy review, accessibility and mobile QA pass

## Milestone 8 — Launch

- [ ] Production Supabase project, production Stripe keys, custom domain
      (`amkconsultinghub.co.uk`, already owned by the client) on Netlify
- [ ] Client training session + handover documentation
- [ ] Go-live checklist, 2-week hypercare window

---

## Locked Decisions (21 Jul 2026 Planning & Confirmation Pack)

1. Rebrand: MediSpace → **AMK Consulting Hub**, propagated across code and docs.
2. Bookings **auto-confirm on successful payment** — no manual admin approval step.
3. Practitioner credentials are **self-declared Yes/No attestation**, not uploaded documents.
4. **Full payment at booking**, not a deposit.
5. Brand palette locked (see README).

## Open Items Still Awaiting Freda's Confirmation

Final room names/pricing, which rooms combine, cancellation window, screening questions,
reception vs admin-only access, practitioner self-registration vs admin-added, legal entity
name/VAT status, target launch month. See README's "Still Awaiting Client Confirmation"
section — do not treat any of this as decided.

**Door access, specifically:** what physical system does AMK actually use (keypad, smart lock,
intercom, staffed reception only)? Does it have an API/integration path, or is a code only ever
read by a human at reception? This determines whether "access code + QR" becomes a real
door-unlock mechanism or stays a reception-facing reference code — a materially different build.
