import { PageShell } from "../../components/layout/PageShell";
import { useSeo } from "../../hooks/useSeo";

export function Terms() {
  useSeo({
    title: "Terms & Conditions | AMK Consulting Hub",
    description: "The terms that apply when you create an account and book a room at AMK Consulting Hub.",
    path: "/terms",
  });

  return (
    <PageShell>
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-navy mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-navy/45 mb-10">Last updated: 17 August 2026</p>

        <div className="flex flex-col gap-8 text-navy/70 leading-relaxed">
          <p>
            These terms apply when you create a practitioner account and book a room with AMK
            Consulting Hub ("we", "us"), at 1 Brickworks, Adlington, Manchester, SK10 4NL. Full
            company registration details are being finalised and will be added here once
            confirmed.
          </p>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">The service</h2>
            <p>
              We provide bookable clinical and therapy rooms in Manchester, in AM, PM or full-day
              sessions. AMK Consulting Hub is CQC registered as a private medical clinic.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Your account</h2>
            <p>
              You're responsible for keeping your account credentials secure and for the accuracy
              of the information you provide, including your self-declared professional
              credentials and insurance status. We may suspend accounts used in breach of these
              terms.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Booking &amp; payment</h2>
            <p>
              Full payment is taken at the time of booking — bookings auto-confirm the moment
              payment clears, with no separate approval step. Card payment processing is being
              connected and is not yet live; while it isn't, no charge is taken and bookings
              confirm without payment. This section will be updated once payment is live.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Cancellations</h2>
            <p>
              Our current cancellation window is 48 hours before your session, though this figure
              is still subject to final confirmation and may change — check this page for the
              current position before relying on it.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Acceptable use</h2>
            <p>
              Rooms must be used lawfully and for the purpose booked. You're responsible for the
              condition of the room during your session and for any damage caused during your
              booking.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Liability</h2>
            <p>
              We provide the space; clinical responsibility for sessions you run in it remains
              yours. Nothing in these terms excludes liability that can't legally be excluded
              under UK law.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Governing law</h2>
            <p>These terms are governed by the law of England and Wales.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Changes to these terms</h2>
            <p>
              We'll update this page as our services change — most notably once payment
              processing is fully live. Check back periodically for updates.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-3">Contact us</h2>
            <p>
              Questions about these terms:{" "}
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
