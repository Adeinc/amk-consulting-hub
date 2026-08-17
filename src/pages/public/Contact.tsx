import { PageShell } from "../../components/layout/PageShell";
import { Reveal } from "../../components/ui/Reveal";
import { useSeo } from "../../hooks/useSeo";

const ADDRESS = "1 Brickworks, Adlington, Manchester, SK10 4NL";
const MAPS_QUERY = encodeURIComponent(ADDRESS);

export function Contact() {
  useSeo({
    title: "Contact & Directions | AMK Consulting Hub",
    description: "Find AMK Consulting Hub in Manchester — address, phone, email, and directions to our clinical and therapy rooms.",
    path: "/contact",
  });

  return (
    <PageShell>
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <Reveal>
          <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-navy mb-4">Contact &amp; directions</h1>
          <p className="text-navy/60 leading-relaxed max-w-xl mb-10">
            Get in touch, or find us — a semi-rural setting around 25 minutes from Manchester
            city centre by road, and under 10 minutes from Manchester Airport, with ample
            on-site parking.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10">
          <Reveal delay={100}>
            <div className="bg-white border border-border/60 rounded-[24px] p-6 shadow-[var(--shadow-card)]">
              <p className="text-sm font-bold text-navy/50 mb-4">Get in touch</p>
              <address className="not-italic flex flex-col gap-4 text-navy/75">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-navy/40 mb-1">Address</p>
                  <p className="leading-relaxed">
                    1 Brickworks
                    <br />
                    Adlington, Manchester
                    <br />
                    SK10 4NL
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-navy/40 mb-1">Phone</p>
                  <a href="tel:+447415893038" className="text-teal-deep font-semibold">
                    07415 893038
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-navy/40 mb-1">Email</p>
                  <a href="mailto:info@amkconsultinghub.co.uk" className="text-teal-deep font-semibold">
                    info@amkconsultinghub.co.uk
                  </a>
                </div>
              </address>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full mt-6 font-semibold rounded-full px-6 py-3 text-[0.95rem] gradient-brand text-white"
              >
                Get directions
              </a>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="rounded-[24px] overflow-hidden border border-border/60 shadow-[var(--shadow-card)] h-80 lg:h-full min-h-80">
              <iframe
                title="Map showing AMK Consulting Hub's location"
                src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
