import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { BookingDetailModal } from "./BookingDetailModal";
import { getMockBookings, type MockBooking } from "../../lib/mockBookings";

/** Session time windows, matching AvailabilityBoard's labels. */
const sessionWindows: Record<string, { start: number; end: number; label: string }> = {
  am: { start: 8, end: 13, label: "AM" },
  pm: { start: 13, end: 18, label: "PM" },
  full_day: { start: 8, end: 18, label: "full-day" },
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function findActiveBooking(bookings: MockBooking[]): MockBooking | null {
  const today = todayIso();
  const hour = new Date().getHours() + new Date().getMinutes() / 60;

  return (
    bookings.find((b) => {
      const end = new Date(b.startDate);
      end.setDate(end.getDate() + b.days - 1);
      const endIso = end.toISOString().slice(0, 10);
      if (today < b.startDate || today > endIso) return false;

      const window = sessionWindows[b.session];
      return hour >= window.start && hour <= window.end;
    }) ?? null
  );
}

/**
 * A live "you're on site right now" reminder — like Ringo's parking-time nudge — that
 * surfaces on any page while today falls inside one of the practitioner's booked sessions.
 * Client-side only (mock bookings via localStorage); real version needs Milestone 4's
 * bookings table to know true session state server-side.
 */
export function SessionReminderPopup() {
  const [booking, setBooking] = useState<MockBooking | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [extending, setExtending] = useState(false);

  useEffect(() => {
    function check() {
      setBooking(findActiveBooking(getMockBookings()));
    }
    check();
    const id = window.setInterval(check, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!booking || dismissed) return null;

  const window_ = sessionWindows[booking.session];

  return (
    <>
      <div
        role="status"
        className="fixed bottom-6 left-6 z-30 max-w-xs bg-white border border-border/60 rounded-2xl shadow-[var(--shadow-lift)] p-4"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-bold text-navy">
            You're on-site &middot; {booking.roomName}
          </p>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="shrink-0 text-navy/40 hover:text-navy text-lg leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>
        <p className="text-xs text-navy/55 mb-3">
          Your {window_.label} session runs until {window_.end}:00 today. Need more time, or want
          to line up your next session?
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setExtending(true)}>
            Extend
          </Button>
          <Link to="/rooms">
            <Button size="sm" variant="secondary">
              Book another
            </Button>
          </Link>
        </div>
      </div>

      {extending && (
        <BookingDetailModal
          booking={booking}
          extendable
          open={extending}
          onClose={() => setExtending(false)}
          onExtended={(updated) => {
            setBooking(updated);
          }}
        />
      )}
    </>
  );
}
