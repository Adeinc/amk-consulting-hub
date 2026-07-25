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
      over from the approved prototype. Typography upgraded from the prototype's Fraunces +
      Inter to **Frank Ruhl Libre + Hanken Grotesk** — a deliberate choice to move off the
      most common AI-generated-UI font pairing and give the brand a more distinctive voice;
      confirmed with the client contact directing this build.
- [x] Reusable UI primitives: Button, Input, Select, Card, Modal, Badge, Toast, Tabs
- [x] Base layout: Header, Footer, responsive nav
- [ ] Supabase project provisioned (dev + prod), auth configured — blocked on Freda's Supabase account
- [ ] CI: Netlify preview deploys wired to GitHub PRs
- [ ] Deployed to Netlify with a live URL

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
- [ ] Notification system (booking confirmed, cancelled, reminder)
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
reception vs admin-only access, practitioner self-registration vs admin-added, door automation
timing, legal entity name/VAT status, target launch month. See README's "Still Awaiting Client
Confirmation" section — do not treat any of this as decided.
