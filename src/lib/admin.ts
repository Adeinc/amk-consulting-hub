import { supabase } from "./supabase";
import { formatCode } from "./bookings";
import type { BookingStatus, SessionType } from "../types";

async function requireAdminUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to do that.");
  return user.id;
}

// ----------------------------------------------------------------------------
// Rooms
// ----------------------------------------------------------------------------

export interface AdminRoom {
  id: string;
  slug: string;
  name: string;
  description: string;
  amenities: string[];
  priceAm: number;
  pricePm: number;
  priceFullDay: number;
  isActive: boolean;
  displayOrder: number;
}

interface RoomRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  amenities: string[];
  price_am: number;
  price_pm: number;
  price_full_day: number;
  is_active: boolean;
  display_order: number;
}

function mapRoom(r: RoomRow): AdminRoom {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description ?? "",
    amenities: r.amenities,
    priceAm: Number(r.price_am),
    pricePm: Number(r.price_pm),
    priceFullDay: Number(r.price_full_day),
    isActive: r.is_active,
    displayOrder: r.display_order,
  };
}

export async function getAllRooms(): Promise<AdminRoom[]> {
  const { data, error } = await supabase.from("rooms").select("*").order("display_order");
  if (error || !data) return [];
  return (data as RoomRow[]).map(mapRoom);
}

export async function updateRoom(
  id: string,
  updates: { description?: string; priceAm?: number; pricePm?: number; priceFullDay?: number; isActive?: boolean },
): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.priceAm !== undefined) payload.price_am = updates.priceAm;
  if (updates.pricePm !== undefined) payload.price_pm = updates.pricePm;
  if (updates.priceFullDay !== undefined) payload.price_full_day = updates.priceFullDay;
  if (updates.isActive !== undefined) payload.is_active = updates.isActive;

  const { error } = await supabase.from("rooms").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

// ----------------------------------------------------------------------------
// Blocked dates
// ----------------------------------------------------------------------------

export interface BlockedDate {
  id: string;
  roomId: string | null;
  startDate: string;
  endDate: string;
  reason: string | null;
}

interface BlockedDateRow {
  id: string;
  room_id: string | null;
  start_date: string;
  end_date: string;
  reason: string | null;
}

function mapBlockedDate(r: BlockedDateRow): BlockedDate {
  return { id: r.id, roomId: r.room_id, startDate: r.start_date, endDate: r.end_date, reason: r.reason };
}

export async function getBlockedDates(roomId?: string): Promise<BlockedDate[]> {
  let query = supabase.from("blocked_dates").select("*").order("start_date");
  if (roomId) query = query.or(`room_id.eq.${roomId},room_id.is.null`);
  const { data, error } = await query;
  if (error || !data) return [];
  return (data as BlockedDateRow[]).map(mapBlockedDate);
}

export async function addBlockedDate(params: {
  roomId: string | null;
  startDate: string;
  endDate: string;
  reason?: string;
}): Promise<void> {
  const createdBy = await requireAdminUserId();
  const { error } = await supabase.from("blocked_dates").insert({
    room_id: params.roomId,
    start_date: params.startDate,
    end_date: params.endDate,
    reason: params.reason || null,
    created_by: createdBy,
  });
  if (error) throw new Error(error.message);
}

export async function removeBlockedDate(id: string): Promise<void> {
  const { error } = await supabase.from("blocked_dates").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ----------------------------------------------------------------------------
// Bookings (all practitioners)
// ----------------------------------------------------------------------------

export interface AdminBookingGroup {
  groupId: string;
  primaryBookingId: string;
  code: string;
  roomId: string;
  roomName: string;
  practitionerId: string;
  practitionerName: string;
  practitionerEmail: string | null;
  startDate: string;
  days: number;
  session: SessionType;
  total: number;
  status: BookingStatus;
}

interface AdminBookingRow {
  id: string;
  room_id: string;
  practitioner_id: string;
  booking_date: string;
  session_type: SessionType;
  status: BookingStatus;
  price: number;
  booking_group_id: string;
  rooms: { name: string } | null;
}

export async function getAllBookings(): Promise<AdminBookingGroup[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("id, room_id, practitioner_id, booking_date, session_type, status, price, booking_group_id, rooms(name)")
    .order("booking_date", { ascending: false });

  if (error || !data) return [];

  const rows = data as unknown as AdminBookingRow[];
  const practitionerIds = [...new Set(rows.map((r) => r.practitioner_id))];

  const { data: profileRows } = await supabase.from("profiles").select("id, full_name, email").in("id", practitionerIds);
  const profileMap = new Map((profileRows ?? []).map((p) => [p.id, p]));

  const groups = new Map<string, AdminBookingRow[]>();
  for (const row of rows) {
    const list = groups.get(row.booking_group_id) ?? [];
    list.push(row);
    groups.set(row.booking_group_id, list);
  }

  return [...groups.values()]
    .map((groupRows): AdminBookingGroup => {
      const sorted = [...groupRows].sort((a, b) => a.booking_date.localeCompare(b.booking_date));
      const primary = sorted[0];
      const profile = profileMap.get(primary.practitioner_id);
      return {
        groupId: primary.booking_group_id,
        primaryBookingId: primary.id,
        code: formatCode(primary.id),
        roomId: primary.room_id,
        roomName: primary.rooms?.name ?? "Room",
        practitionerId: primary.practitioner_id,
        practitionerName: profile?.full_name ?? "Unknown",
        practitionerEmail: profile?.email ?? null,
        startDate: primary.booking_date,
        days: sorted.length,
        session: primary.session_type,
        total: sorted.reduce((sum, r) => sum + Number(r.price), 0),
        status: primary.status,
      };
    })
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export async function cancelBooking(groupId: string, reason?: string): Promise<void> {
  const cancelledBy = await requireAdminUserId();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", cancelled_reason: reason || null, cancelled_by: cancelledBy })
    .eq("booking_group_id", groupId);
  if (error) throw new Error(error.message);
}

// ----------------------------------------------------------------------------
// Practitioners
// ----------------------------------------------------------------------------

export interface AdminPractitioner {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  credentialsAttested: boolean;
  createdAt: string;
}

export async function getAllPractitioners(): Promise<AdminPractitioner[]> {
  const { data: profileRows, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, is_active, created_at")
    .eq("role", "practitioner")
    .order("created_at", { ascending: false });

  if (error || !profileRows) return [];

  const ids = profileRows.map((p) => p.id);
  const { data: practitionerRows } = await supabase.from("practitioners").select("id, credentials_attested").in("id", ids);
  const credMap = new Map((practitionerRows ?? []).map((p) => [p.id, p.credentials_attested as boolean]));

  return profileRows.map((p) => ({
    id: p.id,
    fullName: p.full_name,
    email: p.email,
    phone: p.phone,
    isActive: p.is_active,
    credentialsAttested: credMap.get(p.id) ?? false,
    createdAt: p.created_at,
  }));
}

export async function setPractitionerActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase.from("profiles").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);
}

// ----------------------------------------------------------------------------
// Settings
// ----------------------------------------------------------------------------

export interface AdminSettings {
  businessName: string;
  cancellationWindowHours: number;
  autoConfirmOnPayment: boolean;
  businessHours: Record<string, unknown>;
}

interface SettingsRow {
  business_name: string;
  cancellation_window_hours: number;
  auto_confirm_on_payment: boolean;
  business_hours: Record<string, unknown>;
}

export async function getSettings(): Promise<AdminSettings | null> {
  const { data, error } = await supabase.from("settings").select("*").single();
  if (error || !data) return null;
  const row = data as SettingsRow;
  return {
    businessName: row.business_name,
    cancellationWindowHours: row.cancellation_window_hours,
    autoConfirmOnPayment: row.auto_confirm_on_payment,
    businessHours: row.business_hours,
  };
}

export async function updateSettings(updates: { businessName?: string; cancellationWindowHours?: number }): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (updates.businessName !== undefined) payload.business_name = updates.businessName;
  if (updates.cancellationWindowHours !== undefined) payload.cancellation_window_hours = updates.cancellationWindowHours;

  const { error } = await supabase.from("settings").update(payload).eq("id", true);
  if (error) throw new Error(error.message);
}

// ----------------------------------------------------------------------------
// Overview stats — all computed from real bookings/rooms data, nothing invented.
// No revenue figure here: Stripe isn't live, so no real payment has been collected yet.
// ----------------------------------------------------------------------------

export interface RoomBookingCount {
  roomName: string;
  count: number;
}

export async function getBookingCountsByRoom(): Promise<RoomBookingCount[]> {
  const { data, error } = await supabase.from("bookings").select("room_id, rooms(name)").in("status", ["confirmed", "pending"]);

  if (error || !data) return [];

  const counts = new Map<string, number>();
  for (const row of data as unknown as { room_id: string; rooms: { name: string } | null }[]) {
    const name = row.rooms?.name ?? "Unknown";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()].map(([roomName, count]) => ({ roomName, count }));
}

export async function getTodayBookingCount(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const { count, error } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("booking_date", today)
    .in("status", ["confirmed", "pending"]);
  if (error) return 0;
  return count ?? 0;
}

/** Occupied room-days over the next 7 days, as a % of (active rooms × 7). A rolling window,
 * not a calendar week — simpler and equally meaningful for a small booking site. */
export async function getUpcomingWeekOccupancy(): Promise<number> {
  const start = new Date();
  const startIso = start.toISOString().slice(0, 10);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const endIso = end.toISOString().slice(0, 10);

  const [{ data: bookingRows }, { data: roomRows }] = await Promise.all([
    supabase
      .from("bookings")
      .select("room_id, booking_date")
      .in("status", ["confirmed", "pending"])
      .gte("booking_date", startIso)
      .lte("booking_date", endIso),
    supabase.from("rooms").select("id").eq("is_active", true),
  ]);

  const activeRoomCount = roomRows?.length ?? 0;
  if (activeRoomCount === 0) return 0;

  const occupiedRoomDays = new Set((bookingRows ?? []).map((b) => `${b.room_id}:${b.booking_date}`)).size;
  return Math.round((occupiedRoomDays / (activeRoomCount * 7)) * 100);
}
