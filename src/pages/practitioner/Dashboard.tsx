import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { Badge, Stamp } from "../../components/ui/Badge";
import { Tabs } from "../../components/ui/Tabs";
import { Button } from "../../components/ui/Button";
import { BookingDetailModal } from "../../components/booking/BookingDetailModal";
import { Link } from "react-router-dom";
import { rooms, sessionLabels } from "../../data/rooms";
import { roomImagery, roomVideos } from "../../data/imagery";
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

function formatDateRange(startIso: string, days: number): string {
  const start = new Date(startIso);
  const end = new Date(startIso);
  end.setDate(end.getDate() + days - 1);
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return days === 1 ? fmt(start) : `${fmt(start)} – ${fmt(end)}`;
}

/** The dashboard's one hero moment — same photo-led card language as RoomCard, applied to
 * "what's my next session", the practitioner's actual first question on login. */
function NextSessionCard({ booking, onView }: { booking: BookingGroup; onView: () => void }) {
  const room = rooms.find((r) => r.name === booking.roomName);
  const video = room ? roomVideos.perRoom[room.id] : undefined;
  const photo = room ? roomImagery[room.id] : undefined;

  return (
    <div className="brand-card relative flex flex-col sm:flex-row bg-white border border-border/60 rounded-[20px] overflow-hidden shadow-[var(--shadow-card)] mb-6">
      <div className="relative h-40 sm:h-auto sm:w-72 shrink-0 overflow-hidden">
        {video ? (
          <video
            className="brand-card-image absolute inset-0 w-full h-full object-cover"
            src={video}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img src={photo} alt="" className="brand-card-image absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-navy/55 via-transparent to-transparent" />
        <span className="absolute top-3 right-3">
          <Stamp kind="sample" />
        </span>
      </div>
      <div className="flex-1 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-teal-deep mb-1.5">Your next session</p>
          <p className="font-display text-xl font-extrabold text-navy mb-1 truncate">{booking.roomName}</p>
          <p className="text-sm text-navy/60">
            {formatDateRange(booking.startDate, booking.days)}
            {booking.days > 1 ? ` · ${booking.days} days` : ""} &middot; {sessionLabels[booking.session]}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Stamp kind="confirmed" />
          <Button size="sm" onClick={onView}>
            View code
          </Button>
        </div>
      </div>
    </div>
  );
}

function NextSessionSkeleton() {
  return (
    <div
      className="flex flex-col sm:flex-row bg-white border border-border/60 rounded-[20px] overflow-hidden shadow-[var(--shadow-card)] mb-6 animate-pulse"
      aria-hidden="true"
    >
      <div className="h-40 sm:h-auto sm:w-72 shrink-0 bg-navy/8" />
      <div className="flex-1 p-6">
        <div className="h-3 w-28 bg-navy/8 rounded-full mb-3" />
        <div className="h-5 w-40 bg-navy/8 rounded-full mb-2" />
        <div className="h-4 w-56 bg-navy/8 rounded-full" />
      </div>
    </div>
  );
}

function BookingRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0 gap-3 animate-pulse" aria-hidden="true">
      <div className="min-w-0 flex-1">
        <div className="h-4 w-32 bg-navy/8 rounded-full mb-2" />
        <div className="h-3 w-48 bg-navy/8 rounded-full" />
      </div>
      <div className="h-9 w-24 bg-navy/8 rounded-full shrink-0" />
    </div>
  );
}

export function PractitionerDashboard() {
  const [realBookings, setRealBookings] = useState<BookingGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<BookingGroup | null>(null);

  useEffect(() => {
    getMyBookingGroups().then((data) => {
      setRealBookings(data);
      setLoading(false);
    });
  }, []);

  const realUpcoming = realBookings.filter((b) => !isBookingGroupPast(b)).sort((a, b) => a.startDate.localeCompare(b.startDate));
  const realPast = realBookings.filter(isBookingGroupPast);
  const nextSession = realUpcoming[0];

  const upcoming: BookingGroup[] = [
    ...realUpcoming.filter((b) => b.groupId !== nextSession?.groupId),
    ...illustrativeUpcoming.map(toBookingGroupShape),
  ];
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
          {loading
            ? "Loading your bookings…"
            : realBookings.length > 0
              ? "Your real bookings appear above the sample rows below."
              : "Sample data shown — book a room to see it appear here."}
        </p>
        <Link to="/rooms">
          <Button size="sm">Book another room</Button>
        </Link>
      </div>

      {loading ? <NextSessionSkeleton /> : nextSession && <NextSessionCard booking={nextSession} onView={() => setViewing(nextSession)} />}

      <div className="bg-white border border-border/60 rounded-[20px] shadow-[var(--shadow-card)] p-6">
        <Tabs
          tabs={[
            {
              id: "upcoming",
              label: loading ? "Upcoming" : `Upcoming (${upcoming.length})`,
              content: (
                <div>
                  {loading && <BookingRowSkeleton />}
                  {!loading &&
                    upcoming.map((b) => (
                      <BookingRow key={b.groupId} booking={b} isReal={realBookings.some((r) => r.groupId === b.groupId)} />
                    ))}
                </div>
              ),
            },
            {
              id: "past",
              label: loading ? "History" : `History (${past.length})`,
              content: (
                <div>
                  {loading && <BookingRowSkeleton />}
                  {!loading &&
                    past.map((b) => (
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
