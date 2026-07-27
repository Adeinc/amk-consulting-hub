# Email Setup — What's Built vs. What's Left to Connect

All the email logic is written and ready. Nothing below involves writing code — it's account
setup, secrets, and two CLI commands. This is deliberate: it lets this work happen now, ahead
of Freda's Resend/Supabase accounts, so connecting them later is fast.

## Already built

- **Templates** — `supabase/functions/_shared/email-templates.ts`: booking confirmed, booking
  cancelled, session reminder. On-brand (navy/teal), table-based HTML for email client
  compatibility.
- **`send-booking-confirmation`** — Edge Function. Called from the client the moment a booking
  (or an extension) confirms. Looks up the booking + room + practitioner, sends the email,
  logs it to the `notifications` table.
- **`send-booking-reminder`** — Edge Function, designed to run on a schedule. Finds tomorrow's
  confirmed bookings that haven't had a reminder yet, sends one, marks it sent (`bookings.reminder_sent_at`,
  added in `0002_add_reminder_tracking.sql`) so it never double-sends.
- **Client-side call sites** — `BookingFlowModal` and `BookingDetailModal` already call
  `sendBookingConfirmationEmail(bookingId)` (`src/lib/resend.ts`) at the right moments. Right
  now this just logs a warning and does nothing, because there's no real Supabase project or
  deployed function yet to answer the call — that's expected, not a bug.

## What's actually left (once Freda's accounts exist)

**1. Resend account + domain**
- Create a Resend account, add `amkconsultinghub.co.uk` as a sending domain
- Add the DNS records Resend gives you (domain verification + DKIM) to the domain's DNS
- Once verified, generate a Resend API key

**2. Supabase secrets** (once the Supabase project itself is provisioned — separate item, not email-specific)
```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxx
supabase secrets set FROM_EMAIL="AMK Consulting Hub <bookings@amkconsultinghub.co.uk>"
supabase secrets set SITE_URL=https://amkconsultinghub.co.uk
```

**3. Deploy the functions**
```bash
supabase functions deploy send-booking-confirmation
supabase functions deploy send-booking-reminder --no-verify-jwt
```

**4. Schedule the reminder function** — in the Supabase Dashboard under Edge Functions → your
function → Cron, set it to run hourly (`0 * * * *`). Alternatively, a `pg_cron` job calling
`net.http_post` against the function's URL works too if you'd rather manage it in SQL.

**5. Point `LOGO_URL` at the real domain** — `supabase/functions/_shared/email-templates.ts`
currently references the Netlify URL for the logo image (emails need an absolute, publicly
reachable image URL). Update it once `amkconsultinghub.co.uk` is the live hosting domain.

**6. Supabase Auth's own emails (sign-up verification, password reset)** — these aren't custom
Edge Functions; Supabase Auth sends them itself. Two things to do in the Supabase Dashboard
under Authentication → Emails:
- Set custom SMTP to Resend's SMTP relay (uses the same API key/domain from step 1)
- Optionally restyle the built-in templates to match the brand — not required to function,
  Supabase's defaults work fine as a starting point

Nothing else needs touching in the codebase for any of this — every step above is
configuration on Resend's and Supabase's own dashboards, or a one-line CLI command.
