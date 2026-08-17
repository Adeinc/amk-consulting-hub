import { PageShell } from "../../components/layout/PageShell";
import { useSeo } from "../../hooks/useSeo";

export function PrivacyPolicy() {
  useSeo({
    title: "Privacy Policy | AMK Consulting Hub",
    description: "How AMK Consulting Hub collects, uses and protects your personal data when you create an account or book a room.",
    path: "/privacy",
  });

  return (
    <PageShell>
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-navy mb-2">Privacy Policy</h1>
        <p className="text-sm text-navy/45 mb-10">Last updated: 17 August 2026</p>

        <div className="flex flex-col gap-8 text-navy/70 leading-relaxed">
          <p>
            AMK Consulting Hub ("we", "us") operates this website and booking platform. This
            policy explains what personal data we collect, why, and what rights you have over it.
            Full company registration details (legal entity name, company number, VAT status) are
            being finalised and will be added here once confirmed.
          </p>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Account &amp; booking data</h2>
            <p>
              When you create a practitioner account we collect your name, email address, and
              (optionally) phone number. When you book a room we store the room, date, session
              type and price. This data is stored in Supabase, our database provider, with
              access restricted so you can only ever see your own bookings (enforced at the
              database level, not just in this website's interface).
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Payments</h2>
            <p>
              Full payment is taken at the time of booking. Card payment processing via Stripe is
              being connected and is <strong>not yet live</strong> — this section will be updated
              with the specifics of what Stripe collects and processes as soon as it is. We never
              see or store your full card details ourselves.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Emails</h2>
            <p>
              Booking confirmations and reminders are sent via Resend, our transactional email
              provider. This is being connected and is not fully live yet — until it is, some
              emails described elsewhere on this site (booking confirmations, password resets)
              may not be delivered.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Cookies &amp; local storage</h2>
            <p>
              We don't use tracking cookies. When you sign in, your session is kept in your
              browser's local storage (not a cookie) so you stay signed in between visits — this
              is essential to the account/booking feature working and isn't used for tracking.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Analytics</h2>
            <p>No analytics or tracking software is currently installed on this website.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Your rights</h2>
            <p>
              Under UK data protection law you can ask us to access, correct, delete, or export
              the personal data we hold about you, or object to how we use it. To do so, contact
              us using the details below. You can also complain to the Information Commissioner's
              Office (ico.org.uk) if you believe we haven't handled your data properly.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Data retention</h2>
            <p>
              We keep account and booking records for as long as your account is active, and for
              a reasonable period afterwards for accounting and legal purposes.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Changes to this policy</h2>
            <p>
              We'll update this page as our services change — most notably once Stripe and Resend
              are fully connected. Check back periodically for updates.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Contact us</h2>
            <p>
              Questions about this policy or your data:{" "}
              <a href="mailto:info@amkconsultinghub.co.uk" className="text-teal-deep font-semibold">
                info@amkconsultinghub.co.uk
              </a>{" "}
              or 07415 893038.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
