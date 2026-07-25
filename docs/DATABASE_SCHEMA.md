# Database Schema Reference — MS-001 AMK Consulting Hub

Source of truth: `supabase/migrations/0001_init.sql`. This document explains the *why* behind
the schema; the SQL file is what actually gets applied. **Not yet applied to a live Supabase
project** — provisioning is gated on Milestone 1.

## Entity Overview

```
profiles (1) ──< practitioners (1:1, role=practitioner)
profiles (1) ──< notifications

rooms (1) ──< room_images
rooms (1) ──< bookings
rooms (1) ──< blocked_dates (nullable — null = applies to all rooms)

practitioners (1) ──< bookings
bookings (1) ──< payments (1:1 in practice, modelled 1:many for refund flexibility)

settings — single row, admin-editable
audit_logs — append-only, admin-readable
```

## Key Design Decisions

### Why `profiles` is separate from `auth.users`
Supabase's `auth.users` is managed by the auth system and shouldn't be extended directly for
app data. `profiles` mirrors it 1:1 (`id` is a foreign key to `auth.users.id`) and holds
everything the app needs — role, name, phone, avatar.

### Why `practitioners` is separate from `profiles`
`profiles.role` distinguishes practitioner vs admin, but only practitioners need profession,
registration number, bio, and a credentials attestation flag. Splitting this out keeps
`profiles` lean.

### Booking conflict prevention — enforced at the database, not just the UI
The single most important integrity rule in the system: **two practitioners must never be
able to book the same room/date/session.**

Two mechanisms enforce it:
1. A **partial unique index** on `(room_id, booking_date, session_type)` filtered to
   `status in ('pending','confirmed')` — the database physically rejects a duplicate slot.
2. A **trigger** (`prevent_full_day_conflicts`) handles the case a plain unique index can't
   express: a full-day booking must block both AM and PM, and an AM or PM booking must be
   blocked if the room already has a full-day booking that date.

### Booking status lifecycle
`pending → confirmed → completed`, with `cancelled` reachable from `pending` or `confirmed`.
**Auto-confirm on payment is now the locked default** (21 Jul 2026 pack) —
`settings.auto_confirm_on_payment` defaults to `true` below, not `false` as originally drafted.

### Payments as their own table, not columns on `bookings`
A booking can have a failed payment attempt followed by a successful one, or a later partial
refund. Modelling `payments` as its own table keeps that full history instead of overwriting
it, which matters for financial reconciliation.

### RLS is the real access control layer
Every table has Row Level Security enabled. The `is_admin()` helper function (marked
`security definer`) is used across policies. Practitioners can only read/write rows tied to
their own `auth.uid()`; public tables (`rooms`, `room_images`, `blocked_dates`, `settings`)
allow anonymous `select` since visitors need to browse without logging in.

### `documents` is repurposed for a self-declared attestation, not file uploads
**Changed by the 21 Jul 2026 pack.** The original design modelled `documents` as uploaded
credential files (`storage_path`, admin `status` review, `reviewed_by`). The locked decision
is a **self-declared Yes/No attestation** instead — the practitioner asserts they hold valid
credentials/insurance; nothing is uploaded or reviewed. This schema keeps a slimmer
`practitioners.credentials_attested boolean` column and drops the original `documents` table's
review workflow. If the client later requires actual document verification, that's an
additive migration, not a revert.

### `settings` as a single-row table
Business-wide configuration lives in one enforced-single-row table rather than scattered
environment variables, so Freda can change the cancellation policy from the admin Settings
page without a code deployment.

## What's Deliberately Deferred

- **Multi-currency support** — `payments.currency` defaults to `gbp` but isn't otherwise built
  out, since AMK Consulting Hub is single-currency at launch.
- **Recurring blocked dates** — `blocked_dates` supports a date range but not a recurrence
  rule. Additive migration if needed.
- **Soft deletes** — rooms/practitioners use `is_active` flags rather than deletion,
  preserving booking history integrity.
- **Document upload/verification** — deferred per the self-declared attestation decision
  above; would be an additive migration if the client's requirements change.
