import { Link } from "react-router-dom";
import { PageShell } from "../../components/layout/PageShell";
import { Reveal } from "../../components/ui/Reveal";
import { Accordion } from "../../components/ui/Accordion";
import { faqs } from "../../data/faq";
import { useSeo } from "../../hooks/useSeo";

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

export function Faq() {
  useSeo({
    title: "FAQ | AMK Consulting Hub",
    description: "Answers to common questions about booking, paying for, and cancelling clinical and therapy rooms at AMK Consulting Hub.",
    path: "/faq",
  });

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <Reveal>
          <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-navy mb-4">Frequently asked questions</h1>
          <p className="text-navy/60 leading-relaxed mb-10">
            Can't find what you need?{" "}
            <a href="mailto:info@amkconsultinghub.co.uk" className="text-teal-deep font-semibold">
              Email us
            </a>{" "}
            or see our <Link to="/contact" className="text-teal-deep font-semibold">contact details</Link>.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <Accordion items={faqs} />
        </Reveal>
      </section>
    </PageShell>
  );
}
