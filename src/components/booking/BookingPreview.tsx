import { useState } from "react";
import { sessionLabels } from "../../data/rooms";

const sessions: { id: "am" | "pm" | "full_day"; label: string; time: string; price: number }[] = [
  { id: "am", label: sessionLabels.am, time: "08:00–13:00", price: 75 },
  { id: "pm", label: sessionLabels.pm, time: "13:00–18:00", price: 75 },
  { id: "full_day", label: sessionLabels.full_day, time: "08:00–18:00", price: 145 },
];

/** Dramatizes the core mechanism on the homepage: pick a session, watch it confirm instantly. */
export function BookingPreview() {
  const [selected, setSelected] = useState<"am" | "pm" | "full_day">("am");
  const [confirmed, setConfirmed] = useState(false);
  const current = sessions.find((s) => s.id === selected)!;

  return (
    <div className="relative bg-white/95 backdrop-blur-xl border border-white/40 rounded-[24px] shadow-[var(--shadow-lift)] p-6 w-full max-w-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-navy/45 mb-1">
        Today &middot; Oak Room
      </p>
      <p className="font-display text-lg font-extrabold text-navy mb-4">Pick a session</p>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setSelected(s.id);
              setConfirmed(false);
            }}
            className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 px-2 py-2.5 transition-all cursor-pointer ${
              selected === s.id
                ? "border-teal bg-teal/8 text-teal-deep scale-[1.03]"
                : "border-transparent bg-soft text-navy/60 hover:border-teal/30"
            }`}
          >
            <span className="text-sm font-bold">{s.label}</span>
            <span className="text-[0.65rem] text-navy/40">{s.time}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => setConfirmed(true)}
        className="shine relative w-full overflow-hidden rounded-full gradient-brand text-white py-3 text-sm font-bold shadow-[0_8px_20px_-6px_rgba(12,132,150,0.55)] hover:shadow-[0_12px_28px_-6px_rgba(12,132,150,0.7)] transition-shadow cursor-pointer"
      >
        Book &amp; pay &pound;{current.price}
      </button>

      <div className="mt-3 h-8 flex items-center">
        {confirmed && (
          <span className="success-pop flex items-center gap-2 text-confirm font-bold text-sm">
            <span className="relative flex items-center justify-center w-5 h-5">
              <span className="success-ring absolute inset-0 rounded-full bg-confirm/40" />
              <svg viewBox="0 0 24 24" className="relative w-5 h-5">
                <circle cx="12" cy="12" r="11" fill="currentColor" className="text-confirm" />
                <path
                  d="M7 12.5l3 3 7-7"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="success-check"
                />
              </svg>
            </span>
            Booking confirmed instantly
          </span>
        )}
      </div>
    </div>
  );
}
