# Functional Specification — MS-001 AMK Consulting Hub

**Version:** 0.2 — updated to reflect the 21 Jul 2026 Planning & Confirmation Pack
**Owner:** Monedela Software

## 1. Purpose

Defines exactly what the system does, for whom, and how success is measured per feature. This
is the contract between what was scoped and what gets built — any change here is a scope
change and should be logged as one.

## 2. User Roles

| Role | Description | Auth required |
|---|---|---|
| Visitor | Anonymous browser | No |
| Practitioner | Healthcare professional who books rooms | Yes |
| Administrator | Business owner (Freda) — manages everything | Yes, elevated |

Role is stored on `profiles.role` and enforced both in the UI (route guards) and at the
database level (Supabase RLS policies) — UI guards alone are never sufficient for a system
handling payments and personal data.

## 3. Booking Model

- **Rooms:** exactly six, each independently priced and independently manageable (name,
  description, images, amenities, active/inactive status). Final names/descriptions/photos
  are not yet client-confirmed — see `README.md`.
- **Session types:** AM, PM, Full-day. Each room has its own price per session type. A
  full-day booking blocks both AM and PM for that room.
- **Booking states:** `pending` → `confirmed` → `completed`, with `cancelled` reachable from
  `pending` or `confirmed`.
  - `pending`: created by practitioner, payment not yet cleared.
  - `confirmed`: **auto-confirmed the moment payment clears** — no admin approval step
    (locked decision, resolves the former Open Question #1).
  - `cancelled`: cancelled by practitioner (where policy allows) or admin.
  - `completed`: session date has passed with a confirmed booking.
- **Conflict rule:** a room cannot hold two overlapping bookings in `pending` or `confirmed`
  state for the same session slot. Enforced at the database layer (not just the UI) via a
  constraint on `room_id + date + session_type`, since two practitioners could otherwise race
  to book the same slot.
- **Blocked dates:** admin can block a date (or date range) per room or across all rooms.

## 4. Public Features

### 4.1 Homepage
Hero, value proposition, six-room showcase, call to action to browse/book. Built at
Milestone 2 — distinctive, mobile-first, not a generic template render.

### 4.2 Rooms Page
Grid of six rooms with photo, name, short description, starting price. Built.

### 4.3 Room Details Page
Image gallery (placeholder pending real photos), full description, amenities, AM/PM/full-day
pricing. Live availability indicator does not require login to *view*, only to *book*.
"Book this room" CTA routes to sign-in/register if not authenticated, preserving intent via a
`?next=` redirect back to the same room after auth. Built.

### 4.4 Booking Journey
1. Select room → select date → select session type (AM/PM/Full-day)
2. System checks real-time availability
3. Practitioner confirms details, reviews price
4. **Full payment via Stripe checkout** (resolves former Open Question #2 — not a deposit)
5. Booking **auto-confirms** on successful payment (resolves former Open Question #1)
6. Confirmation email via Resend

### 4.5 Login / Register
Email + password via Supabase Auth. Email verification required before first booking.
Password reset flow. UI built at Milestone 3; not yet wired to Supabase.

### 4.6 Contact / Enquiry
Not yet built. Simple form → stored + emailed to admin via Resend. Spam protection (honeypot
minimum).

### 4.7 Terms / Privacy
Not yet built. Placeholder pages at launch; client to supply/approve final legal copy before
go-live (launch blocker, not a build blocker).

## 5. Practitioner Features

- **Account:** create/manage profile (name, contact details, profession).
- **My Bookings:** list of upcoming and past bookings, status per booking. UI built with mock
  data; wires to real data at Milestone 4.
- **Cancel/request change:** allowed only where policy permits (cancellation window — 48
  hours suggested, matches the schema default, pending final confirmation).
- **Credential attestation:** **self-declared Yes/No** — the practitioner attests they hold
  valid credentials/insurance; nothing is uploaded or reviewed by admin. This resolves the
  former Open Question #4 and is a material change from the original document-upload design
  (see `docs/DATABASE_SCHEMA.md`).

## 6. Admin Features

Dashboard overview, manage rooms (CRUD, images, pricing), manage bookings, calendar view,
block dates, manage practitioners/customers, payments view (Stripe reconciliation), reports,
settings (business hours, default pricing, cancellation window). Overview shell built with
mock data at Milestone 6 scope; full CRUD not yet built.

## 7. Non-Functional Requirements

| Requirement | Standard |
|---|---|
| Mobile responsiveness | All pages usable at 375px width minimum; booking journey fully mobile-optimised |
| Security | Supabase RLS on every table; no client-side-only access control; Stripe handles all card data (no PAN ever touches our servers) |
| Performance | Public pages should target a fast Lighthouse performance score; booking availability checks must be near-instant |
| Accessibility | Sensible contrast, keyboard-navigable forms, labelled inputs — WCAG AA as a target |
| Auditability | Admin actions that change bookings/payments are logged to `audit_logs` with actor, action, timestamp |
| Data protection | Practitioner personal data is healthcare-adjacent — treat as sensitive by default |

## 8. Explicit Out of Scope (for this phase)

Native mobile apps, multi-location support beyond six rooms, SMS notifications (Resend email
only unless requested as a change), practitioner-to-practitioner messaging.

## 9. Resolved Questions (previously open, locked in the 21 Jul 2026 pack)

1. ~~Payment taken at booking (auto-confirm) or admin approves first?~~ → **Auto-confirm on
   payment.**
2. ~~Deposit or full payment?~~ → **Full payment at booking** (a deposit flow would break
   auto-confirm, since it needs the full amount captured up front).
3. ~~Cancellation window?~~ → 48 hours suggested, matches the schema default — pending final
   confirmation, not yet fully locked.
4. ~~Practitioner credentials mandatory documents or optional/trust-based?~~ → **Self-declared
   Yes/No attestation**, not uploaded documents.

## 10. Still Open

5. Final six room names, descriptions, and pricing.
6. Which two of the six rooms combine, and whether that needs separate pricing.
7. Screening questions on the booking form.
8. Reception login vs admin-only access.
9. Practitioner self-registration vs admin-added practitioners.
10. Door automation timing — launch feature or post-launch add-on (Codelocks NetCode or TTLock).
11. Legal entity name/VAT status for Stripe setup.
12. Target launch month.
