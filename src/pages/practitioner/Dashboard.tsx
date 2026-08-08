import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { Badge, Stamp } from "../../components/ui/Badge";
import { Tabs } from "../../components/ui/Tabs";
import { Button } from "../../components/ui/Button";
import { BookingDetailModal } from "../../components/booking/BookingDetailModal";
import { Link } from "react-router-dom";
import { rooms, sessionLabels } from "../../data/rooms";
import { getMyBookingGroups, isBookingGroupPast, type BookingGroup } from "../../lib/bookings";
import type { Room, SessionType, BookingStatus } from "../../types";

const navItems = [
  { to: "/dashboard", label: "My bookings" },
  { to: "/dashboard/profile", label: "Profile" },
];

interface IllustrativeBooking {
  id: string;
  room: Room;
  date: string;
  session: SessionType;
  status: BookingStatus;
}

/** Illustrative sample rows — always shown alongside anything real you've booked, so the tab never looks empty. */
const illustrativeUpcoming: IllustrativeBooking[] = [
  { id: "b1", room: rooms[0], date: "2026-07-28", session: "am", status: "confirmed" },
  { id: "b2", room: rooms[3], date: "2026-08-02", session: "full_day", status: "pending" },
];
const illustrativePast: IllustrativeBooking[] = [
  { id: "b3", room: rooms[2], date: "2026-07-10", session: "pm", status: "completed" },
];

function toBookingGroupShape(b: IllustrativeBooking): BookingGroup {
  const rate = b.session === "am" ? b.room.priceAm : b.session === "pm" ? b.room.pricePm : b.room.priceFullDay;
  return {
    groupId: b.id,
    primaryBookingId: b.id,
    code: `AMK-SAMPLE${b.id.slice(-2).toUpperCase()}`,
    roomId: b.room.id,
    roomName: b.room.name,
    startDate: b.date,
    days: 1,
    session: b.session,
    total: rate,
    status: b.status,
    createdAt: b.date,
  };
}

export function PractitionerDashboard() {
  const [realBookings, setRealBookings] = useState<BookingGroup[]>([]);
  const [viewing, setViewing] = useState<BookingGroup | null>(null);

  useEffect(() => {
    getMyBookingGroups().then(setRealBookings);
  }, []);

  const realUpcoming = realBookings.filter((b) => !isBookingGroupPast(b));
  const realPast = realBookings.filter(isBookingGroupPast);

  const upcoming: BookingGroup[] = [...realUpcoming, ...illustrativeUpcoming.map(toBookingGroupShape)];
  const past: BookingGroup[] = [...realPast, ...illustrativePast.map(toBookingGroupShape)];

  function BookingRow({ booking, isReal }: { booking: BookingGroup; isReal: boolean }) {
    return (
      <div className="flex items-center justify-between py-4 border-b border-border last:border-0 gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-navy truncate">{booking.roomName}</p>
          <p className="text-sm text-navy/55">
            {new Date(booking.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            {booking.days > 1 ? ` · ${booking.days} days` : ""} &middot; {sessionLabels[booking.session]}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isReal ? <Stamp kind="confirmed" /> : <Badge tone="neutral">sample</Badge>}
          <Button size="sm" variant="secondary" onClick={() => setViewing(booking)}>
            View code
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell role="Practitioner" navItems={navItems} title="My bookings">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-navy/55">
          {realBookings.length > 0
            ? "Your real bookings appear above the sample rows below."
            : "Sample data shown — book a room to see it appear here."}
        </p>
        <Link to="/rooms">
          <Button size="sm">Book another room</Button>
        </Link>
      </div>

      <div className="bg-white border border-border/60 rounded-[20px] shadow-[var(--shadow-card)] p-6">
        <Tabs
          tabs={[
            {
              id: "upcoming",
              label: `Upcoming (${upcoming.length})`,
              content: (
                <div>
                  {upcoming.map((b) => (
                    <BookingRow key={b.groupId} booking={b} isReal={realBookings.some((r) => r.groupId === b.groupId)} />
                  ))}
                </div>
              ),
            },
            {
              id: "past",
              label: `History (${past.length})`,
              content: (
                <div>
                  {past.map((b) => (
                    <BookingRow key={b.groupId} booking={b} isReal={realBookings.some((r) => r.groupId === b.groupId)} />
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>

      {viewing && (
        <BookingDetailModal
          booking={viewing}
          extendable={realBookings.some((r) => r.groupId === viewing.groupId) && !isBookingGroupPast(viewing)}
          open={!!viewing}
          onClose={() => setViewing(null)}
          onExtended={(updated) => {
            setRealBookings((prev) => prev.map((b) => (b.groupId === updated.groupId ? updated : b)));
            setViewing(updated);
          }}
        />
      )}
    </DashboardShell>
  );
}
