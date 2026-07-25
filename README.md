# AMK Consulting Hub — Clinical Room Booking Platform

**Project Code:** MS-001
**Client:** Freda
**Delivered by:** Monedela Software
**Status:** Milestone 1–2 in progress — public site scaffolded, backend not yet wired

## What This Is

A premium booking platform for AMK Consulting Hub, a clinical space business in Manchester
with six bookable rooms. Practitioners browse rooms, check availability, and book AM / PM /
full-day sessions. Bookings **auto-confirm on successful payment** — no manual admin approval
step. The business owner manages everything — rooms, pricing, availability, bookings,
practitioners, payments and reports — from a secure admin dashboard.

This repository is also the reference implementation for **Monedela's reusable room-booking
platform pattern**. Anything generic (booking engine, calendar logic, admin shell, auth,
payments) is written so it can be re-skinned for a future client without a rewrite. Anything
AMK-specific (branding, six-room model) stays isolated and swappable.

> Renamed from "MediSpace" to **AMK Consulting Hub** per the 21 Jul 2026 Planning &
> Confirmation Pack. Domain `amkconsultinghub.co.uk` is owned by the client.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Fast DX, strict typing, small bundles |
| Styling | Tailwind CSS v4 | Design tokens via `@theme`, fast iteration |
| Backend / DB | Supabase (Postgres + Auth + Storage + RLS) | Managed Postgres with row-level security baked in — critical for a healthcare-adjacent app |
| Payments | Stripe | PCI compliance offloaded, full-payment-at-booking flow |
| Transactional email | Resend | Booking confirmations, admin alerts, password resets |
| Hosting | Netlify | Preview deploys per PR, simple CI/CD |
| Source control | GitHub | Protected `main`, PR-based workflow |

## Locked Business Decisions (21 Jul 2026 Planning & Confirmation Pack)

These resolve what was previously open in `docs/FUNCTIONAL_SPEC.md`:

- **Bookings auto-confirm on successful payment** — no manual admin approval step.
- **Full payment is taken at booking**, not a deposit (a deposit flow would break
  auto-confirm, since auto-confirm needs the full amount captured up front).
- **Practitioner credentials are a self-declared Yes/No attestation**, not an uploaded
  document — this is a material simplification versus the original schema design.
- **Brand palette**, sampled from the client's logo: Navy `#0C2A4E`, Teal `#0C8496`, Deep Teal
  `#086878`, Soft Background `#F2F8F8`, Border `#D8E2E2`, Confirmation Green `#16A34A`, Alert
  Red `#DC2626`. Wired as Tailwind theme tokens in `src/index.css`.

## Still Awaiting Client Confirmation

- Final room names, descriptions, and photos (current room content is clearly marked
  `isPlaceholder: true` in `src/data/rooms.ts` and flagged "Sample" in the UI — never treat it
  as final).
- Final AM/PM/full-day pricing per room (current figures sit inside the suggested
  market-benchmark bands only: £70–£110 AM/PM, £140–£210 full day).
- Which two of the six rooms combine, and whether that needs separate pricing.
- Cancellation window (48hrs suggested, matches the schema default, pending confirmation).
- Legal entity name / VAT status, needed before Stripe account creation.
- Target launch month.

## Repository Structure

```
src/
  components/
    ui/            Reusable primitives (Button, Input, Select, Card, Badge, Modal, Toast, Tabs)
    layout/         Header, Footer, PageShell, AuthShell, DashboardShell
    booking/        RoomCard, BookingPreview
  pages/
    public/         Home, RoomsList, RoomDetail, SignIn, SignUp
    practitioner/    Dashboard (My Bookings)
    admin/           AdminDashboard
  lib/              Supabase, Stripe, Resend client stubs (env-var based, no live keys)
  data/             Placeholder room data, brand imagery references
  types/            Shared TypeScript types mirroring the database schema

docs/
  ROADMAP.md            Milestone plan
  FUNCTIONAL_SPEC.md    Full functional specification
  DATABASE_SCHEMA.md    Schema reference + ERD notes
```

`supabase/migrations/` does not exist yet — `0001_init.sql` is tracked in the original
project knowledge only until a Supabase project is provisioned at Milestone 1/3.

## Environments

- **Local dev:** `.env.local` (never committed — copy from `.env.example`)
- **Netlify preview:** one per pull request, connected to a Supabase *dev* project (not yet provisioned)
- **Production:** `main` branch → Netlify production, connected to Supabase *production* project (not yet provisioned)

Supabase dev and production must be **separate projects**, not just separate schemas — this
avoids any risk of test data or test payments touching real client data.

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Stripe keys once provisioned
npm run dev
```

The app runs today with **no backend** — auth, booking, and payment actions are UI-complete
but not wired to Supabase/Stripe yet (see `src/lib/*.ts` for the exact TODOs and milestone
each integration lands at).

## Status

Public site (home, rooms, room detail, sign-in/up) and dashboard/admin shells are built and
type-check cleanly. Supabase, Stripe, and Resend are scaffolded as integration points but not
connected to live services — that starts once Freda's accounts are provisioned (Stripe
verification flagged as her highest-priority action, since business verification delays can
become a Milestone 5 blocker).
