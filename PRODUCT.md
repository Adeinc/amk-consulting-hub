# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Practitioners** (therapists, counsellors, and other healthcare professionals) who need to rent a clinical room in Manchester for AM, PM, or full-day sessions with their own clients. They are booking on their own behalf, often between other appointments, and need to see real-time availability and get a confirmed slot fast — not submit a request and wait for someone to call back.
- **Freda**, the business owner (Administrator role), who manages the six rooms, pricing, availability, bookings, practitioners, payments, and reporting from a secure admin dashboard. She is not a technical user.
- Anonymous visitors browsing rooms/pricing before creating an account (no login required to view; login required to book).

## Product Purpose

A booking platform for AMK Consulting Hub, a six-room clinical space business in Manchester. Practitioners browse rooms, check live availability, and book AM/PM/full-day sessions. Bookings **auto-confirm the moment payment clears** — there is no manual admin approval step in the loop. Success = a practitioner can go from "I need a room next Tuesday afternoon" to a confirmed, paid booking in a couple of minutes, with zero back-and-forth.

## Positioning

Instant, no-hassle booking is the core mechanism: real-time availability plus auto-confirm-on-payment removes the "submit and wait" friction that generic room-booking tools (Skedda, Mindbody) and informal arrangements (a phone call, a Facebook post) both have. That's paired with two supporting claims the design should carry:

- **Room quality & trust** — these are purpose-fitted clinical rooms in a specific, known Manchester location, not a spare office being sublet. The site should read as professional and reassuring, appropriate for healthcare-adjacent use.
- **Flexibility** — AM/PM/full-day session granularity, plus two rooms (Clinical Suite A & B) that combine into a larger space, fit awkward or larger-scale schedules that rigid single-slot competitors don't.

This is also the reference implementation for Monedela's reusable room-booking platform pattern — generic booking/calendar/admin logic is built to be re-skinned for future clients without a rewrite; AMK-specific branding and the six-room model stay isolated and swappable. This affects code structure, not the visual brief.

## Operating Context

- Booking journey: select room → select date → select AM/PM/full-day → real-time availability check → Stripe checkout (full payment, not a deposit) → auto-confirm → Resend confirmation email.
- Practitioners self-declare credentials/insurance as a Yes/No attestation — nothing is uploaded or reviewed.
- Admin manages rooms, pricing, blocked dates, bookings, practitioners, payments (Stripe reconciliation), and reports from a dashboard shell.
- Cancellation window: 48 hours (suggested default, pending final client confirmation).
- Supabase RLS enforces access control at the database layer, not just in the UI — relevant because this handles healthcare-adjacent personal data and payments.

## Capabilities and Constraints

- Exactly six rooms, each independently priced per session type; two of the six (Clinical Suite A & B) can combine. One room is a dedicated **Dental Treatment Room** (confirmed by the client) — dental chair, overhead light, sterilisation area.
- The combined Clinical Suite A + B space is **not clinical-use-only** (client-confirmed): it's positioned as a flexible multipurpose event space, suitable for meetings, training days, and conference-style events, in addition to bigger clinical sessions.
- Final room names, descriptions, and photos are **not yet client-confirmed** — current room content in `src/data/rooms.ts` is explicitly placeholder (`isPlaceholder: true`) and must keep reading as a sample, not a finished lineup, wherever it renders. Room photography is currently stock (free-license Unsplash, see `src/data/imagery.ts`), standing in for real photography.
- Final pricing is not confirmed — the client has said it still needs market analysis; current figures sit inside suggested market-benchmark bands only (£70–£110 AM/PM, £140–£210 full day). Keep pricing clearly provisional wherever it renders.
- Location facts, client-confirmed: semi-rural setting, ~25 minutes from Manchester city centre by road, under 10 minutes from Manchester Airport, ample on-site parking.
- No known physical-accessibility facts yet (step-free access, hearing loop, etc.) — do not assert any. Digital accessibility target is WCAG AA (contrast, keyboard nav, labelled inputs) per the functional spec.
- Backend (Supabase/Stripe/Resend) is stubbed, not wired — this phase of work is the public-facing visual/UX layer.
- Mobile responsiveness down to 375px width is a hard requirement, booking journey especially.

## Brand Commitments

- Name: **AMK Consulting Hub** (renamed from "MediSpace" — do not reintroduce the old name).
- Palette sampled from the client's logo, already wired as Tailwind tokens in `src/index.css`: Navy `#0C2A4E`, Teal `#0C8496`, Deep Teal `#086878`, Soft Background `#F2F8F8`, Border `#D8E2E2`, Confirmation Green `#16A34A`, Alert Red `#DC2626`. These are binding — preserve the palette identity even while elevating how it's used.
- Domain: `amkconsultinghub.co.uk`.

## Evidence on Hand

- Room content (`src/data/rooms.ts`) and pricing are placeholder/illustrative only — must visibly read as "Sample" and never be presented as final.
- No real room photography exists yet. Redesign should use tasteful, high-quality stand-in imagery/visual treatment that clearly isn't claiming to be the real rooms, so the layout doesn't depend on assets that don't exist yet and there's no rework once real photos arrive.
- No testimonials, case studies, or press exist — do not fabricate any.

## Product Principles

1. Speed and certainty beat everything else in the booking journey — every screen should make "this will be fast and it will definitely be confirmed" obvious.
2. Read as a trustworthy, professional clinical-space operator, not a generic marketplace template — healthcare-adjacent, calm, credible.
3. Never blur placeholder content (rooms, pricing, photos) into looking final — the client and visitors must always be able to tell what's real.
4. Design decisions that are generic booking/admin/calendar mechanics should stay reusable for future clients; only AMK-specific branding should be treated as swappable skin.

## Accessibility & Inclusion

No product-specific physical-accessibility facts are confirmed yet — do not state any (e.g. step-free access, hearing loop) until the client confirms them. Digital target: WCAG AA (contrast, keyboard-navigable forms, labelled inputs), per the functional spec.
