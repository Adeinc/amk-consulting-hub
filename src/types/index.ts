// Mirrors supabase/migrations/0001_init.sql — keep in sync with the schema, not the other way round.

export type UserRole = "practitioner" | "admin";

export type SessionType = "am" | "pm" | "full_day";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded" | "partially_refunded";

export interface Profile {
  id: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface Practitioner {
  id: string;
  profession?: string;
  registrationNumber?: string;
  bio?: string;
  /** Self-declared Yes/No attestation per the 21 Jul 2026 pack — not an uploaded document. */
  credentialsAttested: boolean;
}

export interface Room {
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
  /** Placeholder content flag — true until client-confirmed content replaces it. */
  isPlaceholder: boolean;
  combinesWithRoomId?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  practitionerId: string;
  bookingDate: string;
  sessionType: SessionType;
  status: BookingStatus;
  price: number;
  notes?: string;
}
