import type { ReactNode } from "react";

type Tone = "navy" | "teal" | "confirm" | "alert" | "neutral";

const tones: Record<Tone, string> = {
  navy: "bg-navy text-white",
  teal: "gradient-brand text-white",
  confirm: "bg-confirm/12 text-confirm",
  alert: "bg-alert/12 text-alert",
  neutral: "bg-navy/8 text-navy/70",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

/** Booking/content state — a friendly pill with an icon, not a bureaucratic stamp. */
type StampKind = "confirmed" | "cancelled" | "sample";

const stampStyle: Record<StampKind, string> = {
  confirmed: "bg-confirm/12 text-confirm",
  cancelled: "bg-alert/12 text-alert",
  sample: "bg-navy/8 text-navy/60",
};

const stampLabel: Record<StampKind, string> = {
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  sample: "Sample photo",
};

const stampIcon: Record<StampKind, string> = {
  confirmed: "✓",
  cancelled: "✕",
  sample: "◉",
};

export function Stamp({ kind, className = "" }: { kind: StampKind; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${stampStyle[kind]} ${className}`}
    >
      <span aria-hidden="true">{stampIcon[kind]}</span>
      {stampLabel[kind]}
    </span>
  );
}
