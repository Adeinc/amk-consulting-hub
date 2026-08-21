import { supabase } from "./supabase";
import type { BookingStatus, SessionType } from "../types";

/**
 * bookings.booking_date models one date per row (see 0004_booking_group_and_seed_rooms.sql) —
 * a multi-day booking is N rows sharing one booking_group_id. BookingGroup is the
 * client-facing view over those rows: one object per booking, however many days it spans.
 */
export interface BookingGroup {
  groupId: string;
  primaryBookingId: string;
  code: string;
  roomId: string;
  roomName: string;
  startDate: string; // ISO date
  days: number;
  session: SessionType;
  total: number;
  status: BookingStatus;
  createdAt: string;
}

export function formatCode(bookingId: string): string {
  return `AMK-${bookingId.slice(0, 8).toUpperCase()}`;
}

export function addDays(iso: string, n: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

async function requireUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to do that.");
  return user.id;
}

export async function createBooking(params: {
  roomSlug: string;
  roomName: string;
  startDate: string;
  days: number;
  session: SessionType;
}): Promise<BookingGroup> {
  const practitionerId = await requireUserId();

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id")
    .eq("slug", params.roomSlug)
    .single();
  if (roomError || !room) throw new Error("That room couldn't be found.");

  const groupId = crypto.randomUUID();
  const rows = Array.from({ length: params.days }).map((_, i) => ({
    room_id: room.id,
    practitioner_id: practitionerId,
    booking_date: addDays(params.startDate, i),
    session_type: params.session,
    status: "confirmed" as const,
    booking_group_id: groupId,
    // Overwritten server-side by the enforce_booking_price trigger — never trusted from the client.
    price: 0,
  }));

  const { data: inserted, error } = await supabase
    .from("bookings")
    .insert(rows)
    .select("id, booking_date, price")
    .order("booking_date", { ascending: true });

  if (error || !inserted || inserted.length === 0) {
    throw new Error("That date is no longer available — please pick another.");
  }

  const primary = inserted[0];
  return {
    groupId,
    primaryBookingId: primary.id,
    code: formatCode(primary.id),
    roomId: room.id,
    roomName: params.roomName,
    startDate: params.startDate,
    days: params.days,
    session: params.session,
    total: inserted.reduce((sum, r) => sum + Number(r.price), 0),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
}

export async function extendBooking(current: BookingGroup, extraDays: number): Promise<BookingGroup> {
  const practitionerId = await requireUserId();
  const lastDate = addDays(current.startDate, current.days - 1);

  const rows = Array.from({ length: extraDays }).map((_, i) => ({
    room_id: current.roomId,
    practitioner_id: practitionerId,
    booking_date: addDays(lastDate, i + 1),
    session_type: current.session,
    status: "confirmed" as const,
    booking_group_id: current.groupId,
    price: 0,
  }));

  const { data: inserted, error } = await supabase.from("bookings").insert(rows).select("price");

  if (error || !inserted) {
    throw new Error("Couldn't extend — one of those dates is no longer available.");
  }

  return {
    ...current,
    days: current.days + extraDays,
    total: current.total + inserted.reduce((sum, r) => sum + Number(r.price), 0),
  };
}

interface BookingRow {
  id: string;
  room_id: string;
  booking_date: string;
  session_type: SessionType;
  status: BookingStatus;
  price: number;
  booking_group_id: string;
  rooms: { name: string } | null;
}

export async function getMyBookingGroups(): Promise<BookingGroup[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("id, room_id, booking_date, session_type, status, price, booking_group_id, rooms(name)")
    .eq("practitioner_id", user.id)
    .order("booking_date", { ascending: true });

  if (error || !data) return [];

  const groups = new Map<string, BookingRow[]>();
  for (const row of data as unknown as BookingRow[]) {
    const list = groups.get(row.booking_group_id) ?? [];
    list.push(row);
    groups.set(row.booking_group_id, list);
  }

  return [...groups.values()]
    .map((rows): BookingGroup => {
      const sorted = [...rows].sort((a, b) => a.booking_date.localeCompare(b.booking_date));
      const primary = sorted[0];
      return {
        groupId: primary.booking_group_id,
        primaryBookingId: primary.id,
        code: formatCode(primary.id),
        roomId: primary.room_id,
        roomName: primary.rooms?.name ?? "Room",
        startDate: primary.booking_date,
        days: sorted.length,
        session: primary.session_type,
        total: sorted.reduce((sum, r) => sum + Number(r.price), 0),
        status: primary.status,
        createdAt: primary.booking_date,
      };
    })
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export function bookingGroupQrValue(booking: BookingGroup): string {
  return `AMK-BOOKING:${booking.code}`;
}

export function isBookingGroupPast(booking: BookingGroup): boolean {
  const end = addDays(booking.startDate, booking.days - 1);
  return end < new Date().toISOString().slice(0, 10);
}
