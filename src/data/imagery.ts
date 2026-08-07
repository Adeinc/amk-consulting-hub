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
 * Room header videos — stock placeholders (free-license Pexels video, pexels.com host,
 * re-encoded locally for web size), standing in until Freda's videographer delivers real
 * footage. NOT footage of AMK's actual rooms.
 *
 * These were hand-checked frame-by-frame before use: an earlier batch of "generic clinic
 * interior" search results turned out to be real, identifiable footage of an actual
 * (unrelated) clinic with its own signage and staff visible — those were discarded rather
 * than shipped. What's here is verified clean: no people, no readable branding/signage.
 * Swap the URLs for real videos the moment they exist — no other code changes needed.
 */
export const roomVideos: { allRoomsHeader?: string; perRoom: Record<string, string | undefined> } = {
  allRoomsHeader: "/videos/room-meeting.mp4",
  perRoom: {
    "room-1": "/videos/room-meeting.mp4",
    "room-2": "/videos/room-meeting.mp4",
    "room-3": "/videos/room-meeting.mp4",
    "room-4": "/videos/room-conference.mp4",
    "room-5": "/videos/room-conference.mp4",
    "room-6": "/videos/room-rowan.mp4",
  },
};
