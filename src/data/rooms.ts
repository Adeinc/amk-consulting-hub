import type { Room } from "../types";

/**
 * PLACEHOLDER CONTENT — none of this is client-confirmed.
 * Per the MS-001 export (Section 5): room names, final pricing, photos, and
 * which rooms combine are all still open. Every room here carries
 * `isPlaceholder: true` and the UI must surface that — never let a visitor
 * (or the client) mistake this for the real room lineup.
 *
 * Pricing sits inside the suggested market-benchmark bands only
 * (AM/PM £70–£110, full day £140–£210) — illustrative, not confirmed.
 */
export const rooms: Room[] = [
  {
    id: "room-1",
    slug: "consulting-room-one",
    name: "Consulting Room One",
    description: "A quiet, naturally lit room suited to one-to-one consultation and talking therapies.",
    amenities: ["Couch", "Sink", "Storage", "Natural light", "Wi-Fi"],
    priceAm: 75,
    pricePm: 75,
    priceFullDay: 145,
    isActive: true,
    displayOrder: 1,
    isPlaceholder: true,
  },
  {
    id: "room-2",
    slug: "consulting-room-two",
    name: "Consulting Room Two",
    description: "Compact treatment room with easy access, suited to shorter clinical sessions.",
    amenities: ["Couch", "Sink", "Storage", "Wi-Fi"],
    priceAm: 70,
    pricePm: 70,
    priceFullDay: 140,
    isActive: true,
    displayOrder: 2,
    isPlaceholder: true,
  },
  {
    id: "room-3",
    slug: "therapy-room",
    name: "Therapy Room",
    description: "Softer-toned room for talking therapy and counselling sessions.",
    amenities: ["Two armchairs", "Side table", "Natural light", "Wi-Fi"],
    priceAm: 72,
    pricePm: 72,
    priceFullDay: 148,
    isActive: true,
    displayOrder: 3,
    isPlaceholder: true,
  },
  {
    id: "room-4",
    slug: "clinical-suite-a",
    name: "Clinical Suite A",
    description: "Larger clinical room with additional bench space, one of two rooms that can combine.",
    amenities: ["Couch", "Sink", "Bench space", "Storage", "Wi-Fi"],
    priceAm: 95,
    pricePm: 95,
    priceFullDay: 180,
    isActive: true,
    displayOrder: 4,
    isPlaceholder: true,
    combinesWithRoomId: "room-5",
  },
  {
    id: "room-5",
    slug: "clinical-suite-b",
    name: "Clinical Suite B",
    description: "Adjoins Clinical Suite A to form a larger combined space for bigger sessions or equipment.",
    amenities: ["Couch", "Sink", "Bench space", "Storage", "Wi-Fi"],
    priceAm: 95,
    pricePm: 95,
    priceFullDay: 180,
    isActive: true,
    displayOrder: 5,
    isPlaceholder: true,
    combinesWithRoomId: "room-4",
  },
  {
    id: "room-6",
    slug: "dental-treatment-room",
    name: "Dental Treatment Room",
    description: "Fully equipped dental treatment room with chair, overhead light and sterilisation area — specified for dental and equipment-heavy procedures.",
    amenities: ["Dental chair", "Overhead light", "Sink", "Sterilisation area", "Storage", "Wi-Fi"],
    priceAm: 110,
    pricePm: 110,
    priceFullDay: 210,
    isActive: true,
    displayOrder: 6,
    isPlaceholder: true,
  },
];

export const sessionLabels: Record<string, string> = {
  am: "AM",
  pm: "PM",
  full_day: "Full day",
};
