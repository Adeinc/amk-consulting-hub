---
name: verify-booking-flow
description: End-to-end browser verification of the real auth + booking engine on AMK Consulting Hub — sign-up, sign-in, booking creation, conflict handling, extension, and cleanup. Use after any change touching auth, bookings, or the admin dashboard, before considering the change verified.
---

# Verify booking flow

The established, repeatable way to verify AMK Consulting Hub's real auth/booking engine against
the live Supabase database, without leaving stale test data behind. Run `check-supabase-session`
first — this skill needs working DB access for the confirm-email and cleanup steps.

## 1. Start the dev server and open the Browser pane

Use `preview_start` with the `amk-consulting-hub` launch config (`.claude/launch.json`), not a
raw `npm run dev` in Bash — the Browser tools can only reach a preview-started server.

## 2. Create a throwaway test account

Use a `+alias` on the real Gmail account already used for this project's testing
(`adelanaoladayosucess992+<something-new>@gmail.com` — pick a fresh, descriptive alias each
time, e.g. `+bookingcheck0822`) so the confirmation email is real and deliverable, not a
fabricated address Supabase will reject.

Sign up through the actual `/sign-up` page in the browser — don't insert rows directly.

## 3. Confirm the email via SQL, not by clicking the link

Gmail's link-prescanning frequently burns the one-time confirmation token before the human
click happens (`otp_expired`). Skip the email entirely and confirm directly:

```bash
supabase db query --linked "update auth.users set email_confirmed_at = now() where email = '<test-email>' and email_confirmed_at is null returning id, email;"
```

## 4. Sign in, then exercise the real flow

- Sign in through `/sign-in` with the test account.
- Book a **multi-day** session on a real room (exercises `booking_group_id` grouping, not just
  a single-day booking).
- On the confirmation screen, confirm the code format is `AMK-{first 8 chars of the primary
  booking id, uppercase}` — this must match what `send-booking-confirmation`'s email template
  computes independently.
- Verify server-side price enforcement: query the inserted rows directly
  (`select price from bookings where booking_group_id = '<group_id>'`) and confirm every row's
  price matches the room's real rate — the client always sends `price: 0`, so seeing anything
  else confirms `enforce_booking_price` is doing its job, not the client.
- Attempt to book the **same room/date/session again** — confirm it fails with the friendly
  "that date is no longer available" message, not a raw error or a silent success.
- From the dashboard, extend the booking by a day — confirm the access code stays identical
  (it's derived from the group's first row, not regenerated per extension).

## 5. Clean up — always, even if a step failed

Bookings must be deleted **before** the user (foreign key: `bookings.practitioner_id` has no
cascade, unlike `profiles`/`practitioners`):

```bash
supabase db query --linked "delete from bookings where practitioner_id = (select id from auth.users where email = '<test-email>'); delete from auth.users where email = '<test-email>';"
```

Confirm both counts are zero afterward. Never leave test bookings or test accounts in the
production database.

## When to also check the admin side

If the change touches `src/lib/admin.ts` or anything under `src/pages/admin/`, promote the test
account to admin before cleanup and walk the admin screens too:

```bash
supabase db query --linked "update profiles set role = 'admin' where id = (select id from auth.users where email = '<test-email>');"
```
