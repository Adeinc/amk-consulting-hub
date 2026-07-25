import { Fragment, useState } from "react";

interface DayCol {
  label: string;
  date: string;
}

const days: DayCol[] = Array.from({ length: 6 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    label: d.toLocaleDateString("en-GB", { weekday: "short" }),
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }),
  };
});

const sessionRows: { id: "am" | "pm" | "full_day"; label: string }[] = [
  { id: "am", label: "AM" },
  { id: "pm", label: "PM" },
  { id: "full_day", label: "Full" },
];

/** Illustrative booked cells — a fixed, deterministic sample pattern (no backend yet). */
const bookedSet = new Set(["am-1", "pm-2", "full_day-0", "am-4", "pm-4"]);

/**
 * The departure-board signature component: availability rendered as a
 * room-status board with a flip reveal. Sample data only — booking is
 * wired at Milestone 4.
 */
export function AvailabilityBoard() {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="bg-white border border-border/60 rounded-[20px] shadow-[var(--shadow-card)] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-navy/70">Live availability</p>
        <p className="text-xs font-medium text-navy/35">Sample pattern shown</p>
      </div>

      <div className="grid grid-cols-[3rem_repeat(6,1fr)] gap-1.5">
        <div />
        {days.map((d) => (
          <div key={d.date} className="text-center">
            <p className="text-xs font-bold text-navy/55">{d.label}</p>
            <p className="text-[0.65rem] text-navy/35">{d.date}</p>
          </div>
        ))}

        {sessionRows.map((row) => (
          <Fragment key={row.id}>
            <div className="flex items-center text-xs font-bold text-navy/60">{row.label}</div>
            {days.map((_, colIndex) => {
              const key = `${row.id}-${colIndex}`;
              const booked = bookedSet.has(key);
              const isPicked = picked === key;
              return (
                <button
                  key={key}
                  disabled={booked}
                  onClick={() => setPicked(key)}
                  style={{ animationDelay: `${(colIndex + sessionRows.indexOf(row) * 6) * 35}ms` }}
                  className={`ledger-flip h-10 rounded-xl border-2 text-center transition-all ${
                    booked
                      ? "bg-navy/5 border-transparent cursor-not-allowed"
                      : isPicked
                        ? "gradient-brand border-transparent text-white scale-105 shadow-[var(--shadow-glow)] cursor-pointer"
                        : "bg-soft border-transparent hover:border-teal/50 cursor-pointer"
                  }`}
                  aria-label={booked ? "Booked" : isPicked ? "Selected" : "Available"}
                >
                  {booked ? (
                    <span className="text-[0.6rem] font-semibold text-navy/35">Full</span>
                  ) : isPicked ? (
                    <span className="text-[0.6rem] font-bold text-white">Held</span>
                  ) : null}
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
