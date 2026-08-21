import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { getBookingCountsByRoom, getTodayBookingCount, getUpcomingWeekOccupancy, type RoomBookingCount } from "../../lib/admin";
import { adminNavItems } from "./navItems";

export function AdminDashboard() {
  const [todayCount, setTodayCount] = useState<number | null>(null);
  const [occupancy, setOccupancy] = useState<number | null>(null);
  const [roomCounts, setRoomCounts] = useState<RoomBookingCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTodayBookingCount(), getUpcomingWeekOccupancy(), getBookingCountsByRoom()]).then(
      ([today, occ, counts]) => {
        setTodayCount(today);
        setOccupancy(occ);
        setRoomCounts(counts);
        setLoading(false);
      },
    );
  }, []);

  const stats = [
    { label: "Today's bookings", value: todayCount, accent: "bg-teal" },
    { label: "Next 7 days' occupancy", value: occupancy === null ? null : `${occupancy}%`, accent: "bg-navy" },
  ];

  return (
    <DashboardShell role="Admin" navItems={adminNavItems} title="Overview">
      <p className="text-sm text-navy/55 mb-6">
        Real booking data. No revenue figure yet — Stripe isn't connected, so no payment has actually been collected.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative bg-white border border-border/70 rounded-[20px] shadow-[var(--shadow-card)] overflow-hidden p-6 pl-7"
          >
            <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${s.accent}`} aria-hidden="true" />
            <p className="font-mono-tight text-xs font-semibold uppercase tracking-wide text-navy/45 mb-2">{s.label}</p>
            <p className="font-mono-tight text-3xl font-bold text-navy">{loading || s.value === null ? "—" : s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border/70 rounded-[20px] shadow-[var(--shadow-card)] p-6">
        <p className="font-display text-lg font-bold mb-1">Bookings by room</p>
        <p className="text-sm text-navy/55 mb-4">Active and pending bookings, all time.</p>
        {loading ? (
          <div className="h-64 rounded-2xl bg-navy/8 animate-pulse" aria-hidden="true" />
        ) : roomCounts.length === 0 ? (
          <p className="text-sm text-navy/45 py-10 text-center">No bookings yet.</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomCounts} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8e2e2" vertical={false} />
                <XAxis dataKey="roomName" tick={{ fontSize: 12, fill: "#0c2a4e99" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#0c2a4e99" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #d8e2e2", fontSize: 13 }}
                  cursor={{ fill: "#0c849610" }}
                />
                <Bar dataKey="count" name="Bookings" fill="#0c8496" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
