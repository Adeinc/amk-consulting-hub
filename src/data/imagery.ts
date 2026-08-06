/**
 * Stock photography — free-license Unsplash photos (images.unsplash.com host =
 * Unsplash License, free for commercial use, no attribution required), used as
 * realistic placeholders until the client supplies real photography. These are
 * NOT photos of AMK Consulting Hub's actual rooms — every room the UI renders
 * still carries `isPlaceholder: true` and must keep reading as a sample.
 * Swap for real client photography the moment it's supplied.
 */
export const brandImagery = {
  // Warm, welcoming reception/waiting area — used for the homepage hero and final CTA.
  hero: "https://images.unsplash.com/photo-1746549833489-1adcede33034?w=2400&q=80&auto=format&fit=crop",
  reception: "https://images.unsplash.com/photo-1746549833489-1adcede33034?w=2400&q=80&auto=format&fit=crop",
  authPanel: "https://images.unsplash.com/photo-1659102580399-04013bc5577b?w=1600&q=80&auto=format&fit=crop",
};

/** Per-room stock photo, keyed by room id — see brandImagery's licensing note above. */
export const roomImagery: Record<string, string> = {
  "room-1": "https://images.unsplash.com/photo-1758974643303-df01b895e6a7?w=1600&q=80&auto=format&fit=crop",
  "room-2": "https://images.unsplash.com/photo-1664817550935-79d3b6255a82?w=1600&q=80&auto=format&fit=crop",
  "room-3": "https://images.unsplash.com/photo-1659102580399-04013bc5577b?w=1600&q=80&auto=format&fit=crop",
  "room-4": "https://images.unsplash.com/photo-1723810388971-f8cd6474597f?w=1600&q=80&auto=format&fit=crop",
  "room-5": "https://images.unsplash.com/photo-1704455306251-b4634215d98f?w=1600&q=80&auto=format&fit=crop",
  "room-6": "https://images.unsplash.com/photo-1728342057953-94bfad8f0e7e?w=1600&q=80&auto=format&fit=crop",
};

/**
 * Real location/room video URLs — pending. Freda is sourcing a videographer; nothing here
 * should be fabricated in the meantime. Both the "All rooms" header and each room's detail
 * page are built to use a video the moment a URL is added here, falling back to the current
 * stock photo until then. Fill in and the fallback disappears automatically — no other code
 * changes needed.
 */
export const roomVideos: { allRoomsHeader?: string; perRoom: Record<string, string | undefined> } = {
  allRoomsHeader: undefined,
  perRoom: {
    "room-1": undefined,
    "room-2": undefined,
    "room-3": undefined,
    "room-4": undefined,
    "room-5": undefined,
    "room-6": undefined,
  },
};
