import { DashboardShell } from "../../components/layout/DashboardShell";
import { Card } from "../../components/ui/Card";
import { Badge, Stamp } from "../../components/ui/Badge";
import { rooms } from "../../data/rooms";

const navItems = [
  { to: "/admin", label: "Overview" },
  { to: "/admin", label: "Rooms" },
  { to: "/admin", label: "Bookings" },
  { to: "/admin", label: "Calendar" },
  { to: "/admin", label: "Practitioners" },
  { to: "/admin", label: "Payments" },
  { to: "/admin", label: "Reports" },
  { to: "/admin", label: "Settings" },
];

/** Mock overview stats — pre-backend scaffolding, wires to real data at Milestone 6. */
const stats = [
  { label: "Today's bookings", value: "5" },
  { label: "This week's occupancy", value: "62%" },
  { label: "Revenue this week", value: "£1,240" },
];

export function AdminDashboard() {
  return (
    <DashboardShell role="Admin" navItems={navItems} title="Overview">
      <p className="text-sm text-navy/55 mb-6">Sample data shown — connects to Supabase at Milestone 6.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="font-mono-tight text-xs font-semibold uppercase text-navy/45 mb-2">{s.label}</p>
            <p className="font-mono-tight text-3xl font-bold text-navy">{s.value}</p>
          </Card>
        ))}
      </div>

      <Card padded={false}>
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <p className="font-display text-lg font-bold">Rooms</p>
          <Stamp kind="sample" />
        </div>
        <div className="divide-y divide-border">
          {rooms.map((room) => (
            <div key={room.id} className="flex items-center justify-between px-6 py-3.5">
              <div>
                <p className="font-semibold text-navy text-sm">{room.name}</p>
                <p className="font-mono-tight text-xs text-navy/50">
                  AM &pound;{room.priceAm} &middot; PM &pound;{room.pricePm} &middot; Full day &pound;{room.priceFullDay}
                </p>
              </div>
              <Badge tone={room.isActive ? "confirm" : "neutral"}>{room.isActive ? "Active" : "Inactive"}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}
