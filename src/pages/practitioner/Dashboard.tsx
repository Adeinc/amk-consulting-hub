import { DashboardShell } from "../../components/layout/DashboardShell";
import { Badge, Stamp } from "../../components/ui/Badge";
import { Tabs } from "../../components/ui/Tabs";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { rooms, sessionLabels } from "../../data/rooms";
import type { Room, SessionType, BookingStatus } from "../../types";

const navItems = [
  { to: "/dashboard", label: "My bookings" },
  { to: "/dashboard", label: "Profile" },
];

interface MockBooking {
  id: string;
  room: Room;
  date: string;
  session: SessionType;
  status: BookingStatus;
}

/** Mock bookings — pre-backend scaffolding. Real data arrives with Milestone 4 (booking engine). */
const mockUpcoming: MockBooking[] = [
  { id: "b1", room: rooms[0], date: "2026-07-28", session: "am", status: "confirmed" },
  { id: "b2", room: rooms[3], date: "2026-08-02", session: "full_day", status: "pending" },
];
const mockPast: MockBooking[] = [
  { id: "b3", room: rooms[2], date: "2026-07-10", session: "pm", status: "completed" },
];

function BookingRow({ booking }: { booking: MockBooking }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div>
        <p className="font-semibold text-navy">{booking.room.name}</p>
        <p className="text-sm text-navy/55">
          {new Date(booking.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} &middot;{" "}
          {sessionLabels[booking.session]}
        </p>
      </div>
      {booking.status === "confirmed" || booking.status === "cancelled" ? (
        <Stamp kind={booking.status} />
      ) : (
        <Badge tone={booking.status === "pending" ? "teal" : "neutral"}>{booking.status}</Badge>
      )}
    </div>
  );
}

export function PractitionerDashboard() {
  return (
    <DashboardShell role="Practitioner" navItems={navItems} title="My bookings">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-navy/55">Sample data shown — connects to real bookings at Milestone 4.</p>
        <Link to="/rooms">
          <Button size="sm">Book another room</Button>
        </Link>
      </div>

      <div className="bg-white border border-border/60 rounded-[20px] shadow-[var(--shadow-card)] p-6">
        <Tabs
          tabs={[
            {
              id: "upcoming",
              label: `Upcoming (${mockUpcoming.length})`,
              content:
                mockUpcoming.length > 0 ? (
                  <div>{mockUpcoming.map((b) => <BookingRow key={b.id} booking={b} />)}</div>
                ) : (
                  <p className="text-sm text-navy/55 py-8 text-center">No upcoming bookings yet.</p>
                ),
            },
            {
              id: "past",
              label: `Past (${mockPast.length})`,
              content: <div>{mockPast.map((b) => <BookingRow key={b.id} booking={b} />)}</div>,
            },
          ]}
        />
      </div>
    </DashboardShell>
  );
}
