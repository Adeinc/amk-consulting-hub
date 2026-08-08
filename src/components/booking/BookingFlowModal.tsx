import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { QrCode } from "./QrCode";
import { createBooking, bookingGroupQrValue, type BookingGroup } from "../../lib/bookings";
import { sendBookingConfirmationEmail } from "../../lib/resend";
import { sessionLabels } from "../../data/rooms";
import type { Room, SessionType } from "../../types";

type Step = "details" | "summary" | "payment" | "confirmation";

function tomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function rateFor(room: Room, session: SessionType): number {
  if (session === "am") return room.priceAm;
  if (session === "pm") return room.pricePm;
  return room.priceFullDay;
}

function formatDateRange(startIso: string, days: number): string {
  const start = new Date(startIso);
  const end = new Date(startIso);
  end.setDate(end.getDate() + days - 1);
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return days === 1 ? fmt(start) : `${fmt(start)} – ${fmt(end)}`;
}

export function BookingFlowModal({ room, open, onClose }: { room: Room; open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>("details");
  const [startDate, setStartDate] = useState(tomorrowIso());
  const [days, setDays] = useState(1);
  const [session, setSession] = useState<SessionType>("am");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingGroup | null>(null);

  const rate = rateFor(room, session);
  const total = rate * days;

  function reset() {
    setStep("details");
    setStartDate(tomorrowIso());
    setDays(1);
    setSession("am");
    setPaying(false);
    setError(null);
    setBooking(null);
  }

  function handleClose() {
    onClose();
    window.setTimeout(reset, 250);
  }

  async function handlePay() {
    setPaying(true);
    setError(null);
    // TODO(Milestone 5): replace with real Stripe payment — this does not charge a card.
    window.setTimeout(async () => {
      try {
        const created = await createBooking({ roomSlug: room.slug, roomName: room.name, startDate, days, session });
        setBooking(created);
        setStep("confirmation");
        void sendBookingConfirmationEmail(created.primaryBookingId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong — please try again.");
      } finally {
        setPaying(false);
      }
    }, 900);
  }

  const titles: Record<Step, string> = {
    details: "Pick your dates",
    summary: "Review your booking",
    payment: "Payment method",
    confirmation: "Booking confirmed",
  };

  return (
    <Modal open={open} onClose={handleClose} title={titles[step]}>
      {step === "details" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-navy/55">{room.name}</p>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-navy/80">Start date</span>
            <input
              type="date"
              value={startDate}
              min={tomorrowIso()}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-2xl border-2 border-transparent bg-soft px-4 py-3 text-[0.95rem] text-navy focus:outline-none focus:bg-white focus:border-teal"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-navy/80">Number of days</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDays((d) => Math.max(1, d - 1))}
                className="w-11 h-11 rounded-full bg-soft text-navy font-bold text-lg cursor-pointer"
                aria-label="Fewer days"
              >
                &minus;
              </button>
              <span className="w-10 text-center font-bold text-navy text-lg">{days}</span>
              <button
                type="button"
                onClick={() => setDays((d) => Math.min(14, d + 1))}
                className="w-11 h-11 rounded-full bg-soft text-navy font-bold text-lg cursor-pointer"
                aria-label="More days"
              >
                +
              </button>
              <span className="text-xs text-navy/45">up to 14 consecutive days</span>
            </div>
          </label>

          <Select
            label="Session"
            value={session}
            onChange={(e) => setSession(e.target.value as SessionType)}
            options={[
              { value: "am", label: `${sessionLabels.am} — £${room.priceAm}/day` },
              { value: "pm", label: `${sessionLabels.pm} — £${room.pricePm}/day` },
              { value: "full_day", label: `${sessionLabels.full_day} — £${room.priceFullDay}/day` },
            ]}
          />

          <div className="flex items-center justify-between rounded-2xl bg-soft px-4 py-3.5 mt-1">
            <span className="text-sm font-semibold text-navy/70">
              {days} {days === 1 ? "day" : "days"} &times; &pound;{rate}
            </span>
            <span className="text-xl font-extrabold text-teal-deep">&pound;{total}</span>
          </div>

          <Button size="lg" className="mt-1" onClick={() => setStep("summary")}>
            Continue
          </Button>
        </div>
      )}

      {step === "summary" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-soft p-5 flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-navy/55">Room</span>
              <span className="font-semibold text-navy">{room.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-navy/55">Dates</span>
              <span className="font-semibold text-navy">{formatDateRange(startDate, days)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-navy/55">Session</span>
              <span className="font-semibold text-navy">{sessionLabels[session]}</span>
            </div>
            <div className="flex justify-between text-sm pt-3 border-t border-border">
              <span className="text-navy/55">
                {days} {days === 1 ? "day" : "days"} &times; &pound;{rate}
              </span>
              <span className="font-extrabold text-teal-deep text-lg">&pound;{total}</span>
            </div>
          </div>
          <p className="text-xs text-navy/45 leading-relaxed">
            Your booking auto-confirms the moment payment clears — no separate approval step.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setStep("details")}>
              Back
            </Button>
            <Button className="flex-1" onClick={() => setStep("payment")}>
              Confirm &amp; pay
            </Button>
          </div>
        </div>
      )}

      {step === "payment" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border-2 border-teal bg-teal/5 px-4 py-3.5 flex items-center justify-between">
            <span className="text-sm font-semibold text-navy">Pay by card</span>
            <span className="text-xs font-bold text-teal-deep">via Stripe</span>
          </div>
          <p className="text-xs text-navy/45 leading-relaxed">
            You'll be taken to a secure Stripe checkout to complete payment. AMK Consulting Hub
            never sees or stores your card details.
          </p>
          <div className="flex items-center justify-between rounded-2xl bg-soft px-4 py-3.5">
            <span className="text-sm font-semibold text-navy/70">Total due today</span>
            <span className="text-xl font-extrabold text-teal-deep">&pound;{total}</span>
          </div>
          {error && <p className="text-sm text-alert font-semibold">{error}</p>}
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" disabled={paying} onClick={() => setStep("summary")}>
              Back
            </Button>
            <Button className="flex-1" disabled={paying} onClick={handlePay}>
              {paying ? "Processing…" : `Pay £${total}`}
            </Button>
          </div>
        </div>
      )}

      {step === "confirmation" && booking && (
        <div className="flex flex-col items-center text-center gap-4">
          <span className="success-pop relative flex items-center justify-center w-14 h-14">
            <span className="success-ring absolute inset-0 rounded-full bg-confirm/40" />
            <svg viewBox="0 0 24 24" className="relative w-14 h-14">
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
          <div>
            <p className="font-display text-xl font-extrabold text-navy mb-1">Booking confirmed</p>
            <p className="text-sm text-navy/55">
              {room.name} &middot; {formatDateRange(booking.startDate, booking.days)} &middot; {sessionLabels[booking.session]}
            </p>
          </div>

          <QrCode value={bookingGroupQrValue(booking)} />

          <div className="bg-soft rounded-2xl px-5 py-3 font-mono-tight text-lg font-bold text-navy tracking-wide">
            {booking.code}
          </div>

          <p className="text-xs text-navy/45 leading-relaxed max-w-xs">
            Show this code or QR at reception, or use it at the door on arrival. It's saved to
            your profile and we've emailed a copy for your records.
          </p>

          <Button className="w-full" onClick={handleClose}>
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
}
