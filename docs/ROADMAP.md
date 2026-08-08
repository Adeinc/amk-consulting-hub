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
      applied (`0001_init.sql`, `0002_add_reminder_tracking.sql`, `0003_auto_create_profile.sql`);
      `send-booking-confirmation` and `send-booking-reminder` Edge Functions deployed. Auth is now
      wired into the UI (Milestone 3) — see below.
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
- [x] Wired to Supabase Auth (register / login / password reset, route protection via
      `ProtectedRoute`, real profile read/write on the Profile page). Verified end-to-end in
      browser: sign-up, unconfirmed-account block, confirmation, sign-in, profile save, sign-out,
      and route-protection redirect all tested against the live project.
- [ ] Confirmation/reset emails currently use Supabase's own default templates, not the
      AMK-branded Resend flow — that swap is blocked on the same Edge Function secrets issue
      noted in `EMAIL_SETUP.md` (needs Freda/an Owner-role account to set `RESEND_API_KEY`).
- [x] Practitioner dashboard shell — bookings list still shows sample/mock data (real booking
      writes are Milestone 4)

## Milestone 4 — Booking Engine (core value)

- [x] Rooms table seeded (`0004_booking_group_and_seed_rooms.sql`) — mirrors `data/rooms.ts`'s
      six rooms so bookings have a real `room_id` to reference. `data/rooms.ts` still drives all
      display content (still explicitly client-unconfirmed placeholder pricing/copy); keeping the
      two in sync when pricing changes is a manual step until rooms get an admin-editable home
      (Milestone 6).
- [x] Booking creation flow with conflict prevention (no double-booking) — real writes to the
      `bookings` table, using the unique-index + trigger rules already designed in
      `0001_init.sql`. Verified in browser: a real conflicting booking attempt is blocked with a
      friendly error, not a crash.
- [x] Auto-confirm on payment — bookings write as `status: 'confirmed'` the moment the (still
      simulated) payment step completes, matching the locked business rule. Payment itself is
      still simulated pending Stripe (Milestone 5) — **this means real rooms can be booked for
      free on the live site until Stripe ships**, a deliberate tradeoff to keep the booking UX
      matching its final behaviour early.
- [x] Multi-day bookings — resolved via a `booking_group_id` column (`0004_...sql`): an N-day
      booking is N rows sharing one group id, so the existing per-day conflict rules cover
      multi-day bookings with no changes to that logic. `src/lib/bookings.ts` presents this as a
      single `BookingGroup` to the UI.
- [x] Price integrity — a new `enforce_booking_price` trigger recomputes `bookings.price`
      server-side from the room's real rate on every insert, so a tampered client insert can't
      set an arbitrary price. Verified: client sends `price: 0`, database stores the real rate.
- [x] Booking access codes + QR — real now (derived from the booking's real database id, format
      matches what `send-booking-confirmation`'s email already computes), extending a booking
      keeps the same code. Still needs Freda's input on the actual door-access system/vendor
      before it drives real hardware — the UI doesn't assume or claim to control anything
      physical.
- [ ] Availability engine (a real per-room/date/session calendar view) and blocked dates support
      — not yet built; `AvailabilityBoard.tsx` on the room page remains an explicitly-labelled
      illustrative "sample pattern", not wired to real data

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
