import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { QrCode } from "./QrCode";
import { extendMockBooking, bookingReferenceQrValue, type MockBooking } from "../../lib/mockBookings";
import { sendBookingConfirmationEmail } from "../../lib/resend";
import { sessionLabels } from "../../data/rooms";

type Mode = "view" | "extend-select" | "extend-pay" | "extend-done";

function formatDateRange(startIso: string, days: number): string {
  const start = new Date(startIso);
  const end = new Date(startIso);
  end.setDate(end.getDate() + days - 1);
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return days === 1 ? fmt(start) : `${fmt(start)} – ${fmt(end)}`;
}

export function BookingDetailModal({
  booking,
  extendable,
  open,
  onClose,
  onExtended,
}: {
  booking: MockBooking;
  extendable: boolean;
  open: boolean;
  onClose: () => void;
  onExtended?: (updated: MockBooking) => void;
}) {
  const [mode, setMode] = useState<Mode>("view");
  const [extraDays, setExtraDays] = useState(1);
  const [paying, setPaying] = useState(false);
  const [current, setCurrent] = useState(booking);

  const rate = Math.round(current.total / current.days);
  const extraCost = rate * extraDays;

  function handleClose() {
    onClose();
    window.setTimeout(() => {
      setMode("view");
      setExtraDays(1);
    }, 250);
  }

  function handlePayExtension() {
    setPaying(true);
    // TODO(Milestone 5): real Stripe charge for the extension amount.
    window.setTimeout(() => {
      const updated = extendMockBooking(current.id, extraDays, extraCost);
      if (updated) {
        setCurrent(updated);
        onExtended?.(updated);
        // No-ops until Milestone 4 (real bookings table) — see src/lib/resend.ts.
        void sendBookingConfirmationEmail(updated.id);
      }
      setPaying(false);
      setMode("extend-done");
    }, 900);
  }

  const titles: Record<Mode, string> = {
    view: "Your booking",
    "extend-select": "Extend this booking",
    "extend-pay": "Payment method",
    "extend-done": "Extended",
  };

  return (
    <Modal open={open} onClose={handleClose} title={titles[mode]}>
      {mode === "view" && (
        <div className="flex flex-col items-center text-center gap-4">
          <p className="text-sm text-navy/55">
            {current.roomName} &middot; {formatDateRange(current.startDate, current.days)} &middot;{" "}
            {sessionLabels[current.session]}
          </p>
          <QrCode value={bookingReferenceQrValue(current)} />
          <div className="bg-soft rounded-2xl px-5 py-3 font-mono-tight text-lg font-bold text-navy tracking-wide">
            {current.code}
          </div>
          <p className="text-xs text-navy/45 leading-relaxed max-w-xs">
            Show this code or QR at reception, or use it at the door on arrival.
          </p>
          {extendable && (
            <Button variant="secondary" className="w-full" onClick={() => setMode("extend-select")}>
              Extend booking
            </Button>
          )}
          <Button className="w-full" onClick={handleClose}>
            Close
          </Button>
        </div>
      )}

      {mode === "extend-select" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-navy/55">Add extra days to {current.roomName}, starting right after your current stay.</p>
          <div className="flex items-center gap-3 justify-center">
            <button
              type="button"
              onClick={() => setExtraDays((d) => Math.max(1, d - 1))}
              className="w-11 h-11 rounded-full bg-soft text-navy font-bold text-lg cursor-pointer"
              aria-label="Fewer days"
            >
              &minus;
            </button>
            <span className="w-10 text-center font-bold text-navy text-lg">{extraDays}</span>
            <button
              type="button"
              onClick={() => setExtraDays((d) => Math.min(14, d + 1))}
              className="w-11 h-11 rounded-full bg-soft text-navy font-bold text-lg cursor-pointer"
              aria-label="More days"
            >
              +
            </button>
            <span className="text-xs text-navy/45">extra {extraDays === 1 ? "day" : "days"}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-soft px-4 py-3.5">
            <span className="text-sm font-semibold text-navy/70">
              {extraDays} &times; &pound;{rate}
            </span>
            <span className="text-xl font-extrabold text-teal-deep">&pound;{extraCost}</span>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setMode("view")}>
              Back
            </Button>
            <Button className="flex-1" onClick={() => setMode("extend-pay")}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {mode === "extend-pay" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border-2 border-teal bg-teal/5 px-4 py-3.5 flex items-center justify-between">
            <span className="text-sm font-semibold text-navy">Pay by card</span>
            <span className="text-xs font-bold text-teal-deep">via Stripe</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-soft px-4 py-3.5">
            <span className="text-sm font-semibold text-navy/70">Extension total</span>
            <span className="text-xl font-extrabold text-teal-deep">&pound;{extraCost}</span>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" disabled={paying} onClick={() => setMode("extend-select")}>
              Back
            </Button>
            <Button className="flex-1" disabled={paying} onClick={handlePayExtension}>
              {paying ? "Processing…" : `Pay £${extraCost}`}
            </Button>
          </div>
        </div>
      )}

      {mode === "extend-done" && (
        <div className="flex flex-col items-center text-center gap-4">
          <p className="text-sm text-navy/70 font-semibold">
            Extended to {formatDateRange(current.startDate, current.days)} — a fresh access code has been issued.
          </p>
          <QrCode value={bookingReferenceQrValue(current)} />
          <div className="bg-soft rounded-2xl px-5 py-3 font-mono-tight text-lg font-bold text-navy tracking-wide">
            {current.code}
          </div>
          <p className="text-xs text-navy/45 leading-relaxed max-w-xs">
            Your previous code no longer works — use this one from now on.
          </p>
          <Button className="w-full" onClick={handleClose}>
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
}
