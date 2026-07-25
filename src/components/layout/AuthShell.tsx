import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { brandImagery } from "../../data/imagery";
import { Logo } from "../ui/Logo";
import { Reveal } from "../ui/Reveal";

const whyAmk = [
  { icon: "⚡", label: "Confirmed instantly on payment" },
  { icon: "🗓️", label: "AM, PM or full-day, your choice" },
  { icon: "🔒", label: "Secure checkout, cards never stored" },
];

export function AuthShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative flex-col justify-between text-white p-12 xl:p-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center ken-burns"
          style={{ backgroundImage: `url(${brandImagery.authPanel})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 gradient-hero-overlay" aria-hidden="true" />
        <div
          className="float-glow absolute -top-24 -right-24 w-80 h-80 rounded-full bg-teal-bright/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="float-glow-slow absolute bottom-16 -left-16 w-64 h-64 rounded-full bg-teal/20 blur-3xl"
          aria-hidden="true"
        />

        <Reveal>
          <Link to="/" className="relative inline-flex">
            <Logo amkClassName="h-7" subtitleClassName="h-3" />
          </Link>
        </Reveal>

        <div className="relative">
          <Reveal>
            <p className="font-display text-3xl xl:text-4xl font-extrabold leading-tight text-balance mb-4">
              Your Room. Your Hours.
              <br />
              Your Practice.
            </p>
            <p className="text-white/70 max-w-sm leading-relaxed mb-7">
              Fully-equipped clinical and therapy rooms in Manchester — book and pay online,
              confirmed the moment payment clears.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <ul className="flex flex-col gap-3 mb-8">
              {whyAmk.map((item) => (
                <li key={item.label} className="flex items-center gap-3 text-sm text-white/80">
                  <span
                    className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-base shrink-0"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <address className="relative not-italic text-xs text-white/45 leading-relaxed">
            1 Brickworks, Adlington, Manchester, SK10 4NL &middot; 07415 893038
          </address>
        </Reveal>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10 bg-soft">
        <Reveal className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex justify-center mb-10">
            <Logo amkClassName="h-7" subtitleClassName="h-3" />
          </Link>
          <p className="text-sm font-bold uppercase tracking-wide text-teal-deep mb-2">{eyebrow}</p>
          <h1 className="font-display text-3xl font-extrabold mb-8">{title}</h1>
          {children}
        </Reveal>
      </div>
    </div>
  );
}
