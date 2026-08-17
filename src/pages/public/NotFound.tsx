import { Link } from "react-router-dom";
import { PageShell } from "../../components/layout/PageShell";
import { Button } from "../../components/ui/Button";
import { useSeo } from "../../hooks/useSeo";

export function NotFound() {
  useSeo({
    title: "Page not found | AMK Consulting Hub",
    description: "The page you're looking for doesn't exist or may have moved.",
    path: "/404",
    noindex: true,
  });

  return (
    <PageShell>
      <section className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="font-mono-tight text-sm font-bold text-teal-deep mb-4">404</p>
        <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-navy mb-4">Page not found</h1>
        <p className="text-navy/60 leading-relaxed mb-8">
          That page doesn't exist, or it may have moved. Check the address, or head back to
          somewhere useful below.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/">
            <Button variant="secondary">Back to home</Button>
          </Link>
          <Link to="/rooms">
            <Button>Browse rooms</Button>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
