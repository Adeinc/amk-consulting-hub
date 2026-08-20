import { DashboardShell } from "../../components/layout/DashboardShell";
import { Card } from "../../components/ui/Card";
import { Badge, Stamp } from "../../components/ui/Badge";
import { rooms } from "../../data/rooms";

const navItems = [
  { to: "/admin", label: "Overview" },
  { to: "/admin", label: "Rooms" },
  { to: "/admin", label: "Bookings", disabled: true },
  { to: "/admin", label: "Calendar", disabled: true },
  { to: "/admin", label: "Practitioners", disabled: true },
  { to: "/admin", label: "Payments", disabled: true },
  { to: "/admin", label: "Reports", disabled: true },
  { to: "/admin", label: "Settings", disabled: true },
];

/** Mock overview stats — pre-backend scaffolding, wires to real data at Milestone 6. */
const stats = [
  { label: "Today's bookings", value: "5", accent: "bg-teal" },
  { label: "This week's occupancy", value: "62%", accent: "bg-navy" },
  { label: "Revenue this week", value: "£1,240", accent: "bg-confirm" },
];

export function AdminDashboard() {
  return (
    <DashboardShell role="Admin" navItems={navItems} title="Overview">
      <p className="text-sm text-navy/55 mb-6">Sample data shown — connects to Supabase at Milestone 6.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative bg-white border border-border/70 rounded-[20px] shadow-[var(--shadow-card)] overflow-hidden p-6 pl-7"
          >
            <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${s.accent}`} aria-hidden="true" />
            <p className="font-mono-tight text-xs font-semibold uppercase tracking-wide text-navy/45 mb-2">{s.label}</p>
            <p className="font-mono-tight text-3xl font-bold text-navy">{s.value}</p>
          </div>
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
