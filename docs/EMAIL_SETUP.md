# Email Setup — What's Built vs. What's Left to Connect

## Done (06 Aug 2026)

- **Templates, functions, client call sites** — all built (see below for what each does).
- **Supabase project provisioned**: `fzxhkljocnxwowlsyhnf` (eu-west-3).
- **Database migrations applied** — `0001_init.sql`, `0002_add_reminder_tracking.sql`.
- **Both Edge Functions deployed**: `send-booking-confirmation`, `send-booking-reminder`.
- **Resend account created**: `info@amkconsultinghub.co.uk`.
- **Frontend wired**: `.env.local` has the real `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## What's built

- **Templates** — `supabase/functions/_shared/email-templates.ts`: booking confirmed, booking
  cancelled, session reminder. On-brand (navy/teal), table-based HTML for email client
  compatibility.
- **`send-booking-confirmation`** — Edge Function. Called from the client the moment a booking
  (or an extension) confirms. Looks up the booking + room + practitioner, sends the email,
  logs it to the `notifications` table.
- **`send-booking-reminder`** — Edge Function, designed to run on a schedule. Finds tomorrow's
  confirmed bookings that haven't had a reminder yet, sends one, marks it sent (`bookings.reminder_sent_at`)
  so it never double-sends.
- **Client-side call sites** — `BookingFlowModal` and `BookingDetailModal` already call
  `sendBookingConfirmationEmail(bookingId)` (`src/lib/resend.ts`) at the right moments. These
  will start actually sending mail the moment the secrets below are set — no code change needed.

## The one thing still outstanding: secrets

The CLI token in use doesn't have Supabase's secrets-management privilege (a role/permission
thing, not a setup mistake) — someone with sufficient access needs to add three secrets via the
dashboard:

**[supabase.com/dashboard/project/fzxhkljocnxwowlsyhnf/settings/functions](https://supabase.com/dashboard/project/fzxhkljocnxwowlsyhnf/settings/functions)**
→ Secrets → add:

| Key | Value |
|---|---|
| `RESEND_API_KEY` | (the Resend key, generated 06 Aug 2026) |
| `FROM_EMAIL` | `AMK Consulting Hub <info@amkconsultinghub.co.uk>` |
| `SITE_URL` | `https://amk-consulting-hub.netlify.app` (or the custom domain, once live there) |

Once those three are set, booking confirmations start sending for real on the next booking made
through the site.

## Still to do after that

**1. Schedule the reminder function** — in the Supabase Dashboard under Edge Functions → your
function → Cron, set it to run hourly (`0 * * * *`). Alternatively, a `pg_cron` job calling
`net.http_post` against the function's URL works too if you'd rather manage it in SQL.

**2. Resend domain verification** — add `amkconsultinghub.co.uk` as a sending domain in Resend
and add the DNS records it gives you (domain verification + DKIM), so mail sends from
`info@amkconsultinghub.co.uk` instead of a shared/default address and doesn't land in spam.

**3. Point `LOGO_URL` at the real domain** — `supabase/functions/_shared/email-templates.ts`
currently references the Netlify URL for the logo image (emails need an absolute, publicly
reachable image URL). Update it once `amkconsultinghub.co.uk` is the live hosting domain.

**4. Supabase Auth's own emails (sign-up verification, password reset)** — these aren't custom
Edge Functions; Supabase Auth sends them itself. Two things to do in the Supabase Dashboard
under Authentication → Emails:
- Set custom SMTP to Resend's SMTP relay (uses the same API key/domain from step 2)
- Optionally restyle the built-in templates to match the brand — not required to function,
  Supabase's defaults work fine as a starting point
