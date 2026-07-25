import type { Room, SessionType } from "../types";

/**
 * A local, browser-only stand-in for the real booking store — persists to
 * localStorage so a booking made on the room page shows up in the dashboard
 * and profile without a page reload losing it. Replaced by Supabase at
 * Milestone 4 (booking engine).
 */
export interface MockBooking {
  id: string;
  code: string;
  roomId: string;
  roomName: string;
  startDate: string; // ISO date
  days: number;
  session: SessionType;
  total: number;
  createdAt: string;
}

const STORAGE_KEY = "amk_mock_bookings";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (I, O, 0, 1)
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `AMK-${code}`;
}

export function getMockBookings(): MockBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockBooking[]) : [];
  } catch {
    return [];
  }
}

function saveAll(bookings: MockBooking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function createMockBooking(params: {
  room: Room;
  startDate: string;
  days: number;
  session: SessionType;
  total: number;
}): MockBooking {
  const booking: MockBooking = {
    id: `b-${Date.now()}`,
    code: generateCode(),
    roomId: params.room.id,
    roomName: params.room.name,
    startDate: params.startDate,
    days: params.days,
    session: params.session,
    total: params.total,
    createdAt: new Date().toISOString(),
  };
  const all = getMockBookings();
  all.unshift(booking);
  saveAll(all);
  return booking;
}

/** Extending a booking issues a fresh access code/QR for the additional days, per AMK's door-access process. */
export function extendMockBooking(id: string, extraDays: number, extraCost: number): MockBooking | null {
  const all = getMockBookings();
  const index = all.findIndex((b) => b.id === id);
  if (index === -1) return null;
  const updated: MockBooking = {
    ...all[index],
    days: all[index].days + extraDays,
    total: all[index].total + extraCost,
    code: generateCode(),
  };
  all[index] = updated;
  saveAll(all);
  return updated;
}

export function bookingReferenceQrValue(booking: MockBooking): string {
  return `AMK-BOOKING:${booking.code}`;
}
