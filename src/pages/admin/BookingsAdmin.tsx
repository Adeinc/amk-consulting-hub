import { useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import { getAllBookings, cancelBooking, type AdminBookingGroup } from "../../lib/admin";
import { sessionLabels } from "../../data/rooms";
import type { BookingStatus } from "../../types";
import { adminNavItems } from "./navItems";

const statusTone: Record<BookingStatus, "confirm" | "teal" | "alert" | "neutral"> = {
  confirmed: "confirm",
  pending: "teal",
  cancelled: "alert",
  completed: "neutral",
};

function formatDateRange(startIso: string, days: number): string {
  const start = new Date(startIso);
  const end = new Date(startIso);
  end.setDate(end.getDate() + days - 1);
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return days === 1 ? fmt(start) : `${fmt(start)} – ${fmt(end)}`;
}

const columnHelper = createColumnHelper<AdminBookingGroup>();

export function BookingsAdmin() {
  const showToast = useToast();
  const [bookings, setBookings] = useState<AdminBookingGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "startDate", desc: true }]);
  const [cancelling, setCancelling] = useState<AdminBookingGroup | null>(null);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  async function load() {
    const data = await getAllBookings();
    setBookings(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const roomOptions = useMemo(() => {
    const names = [...new Set(bookings.map((b) => b.roomName))].sort();
    return [{ value: "all", label: "All rooms" }, ...names.map((n) => ({ value: n, label: n }))];
  }, [bookings]);

  const filtered = useMemo(
    () =>
      bookings.filter(
        (b) => (statusFilter === "all" || b.status === statusFilter) && (roomFilter === "all" || b.roomName === roomFilter),
      ),
    [bookings, statusFilter, roomFilter],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("practitionerName", {
        header: "Practitioner",
        cell: (info) => (
          <div className="min-w-0">
            <p className="font-semibold text-navy text-sm truncate">{info.getValue()}</p>
            {info.row.original.practitionerEmail && (
              <p className="text-xs text-navy/50 truncate">{info.row.original.practitionerEmail}</p>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("roomName", { header: "Room" }),
      columnHelper.accessor("startDate", {
        header: "Dates",
        cell: (info) => formatDateRange(info.getValue(), info.row.original.days),
      }),
      columnHelper.accessor("session", { header: "Session", cell: (info) => sessionLabels[info.getValue()] }),
      columnHelper.accessor("total", { header: "Price", cell: (info) => `£${info.getValue()}` }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <Badge tone={statusTone[info.getValue()]}>{info.getValue()}</Badge>,
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) =>
          info.row.original.status !== "cancelled" && (
            <Button size="sm" variant="secondary" onClick={() => setCancelling(info.row.original)}>
              Cancel
            </Button>
          ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  async function handleConfirmCancel() {
    if (!cancelling) return;
    setCancelSubmitting(true);
    try {
      await cancelBooking(cancelling.groupId);
      setBookings((prev) => prev.map((b) => (b.groupId === cancelling.groupId ? { ...b, status: "cancelled" } : b)));
      showToast("Booking cancelled", "confirm");
      setCancelling(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't cancel booking", "alert");
    } finally {
      setCancelSubmitting(false);
    }
  }

  return (
    <DashboardShell role="Admin" navItems={adminNavItems} title="Bookings">
      <div className="flex flex-wrap gap-3 mb-6">
        <Select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: "All statuses" },
            { value: "confirmed", label: "Confirmed" },
            { value: "pending", label: "Pending" },
            { value: "cancelled", label: "Cancelled" },
            { value: "completed", label: "Completed" },
          ]}
        />
        <Select label="Room" value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)} options={roomOptions} />
      </div>

      <Card padded={false}>
        {loading ? (
          <div className="p-6 flex flex-col gap-3" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-navy/8 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-navy/45 py-10 text-center">No bookings match these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-border">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="text-left px-4 py-3 font-semibold text-navy/50 text-xs uppercase tracking-wide">
                        {header.isPlaceholder ? null : (
                          <button
                            className={`inline-flex items-center gap-1 ${header.column.getCanSort() ? "cursor-pointer hover:text-navy" : ""}`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{ asc: " ↑", desc: " ↓" }[header.column.getIsSorted() as string] ?? ""}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3.5 text-navy/80 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={!!cancelling} onClose={() => setCancelling(null)} title="Cancel this booking?">
        {cancelling && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-navy/65 leading-relaxed">
              {cancelling.practitionerName} &middot; {cancelling.roomName} &middot;{" "}
              {formatDateRange(cancelling.startDate, cancelling.days)}. This can't be undone from here.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setCancelling(null)} disabled={cancelSubmitting}>
                Keep booking
              </Button>
              <Button variant="danger" className="flex-1" onClick={handleConfirmCancel} disabled={cancelSubmitting}>
                {cancelSubmitting ? "Cancelling…" : "Cancel booking"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}
