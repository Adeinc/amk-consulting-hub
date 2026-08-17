import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../../components/layout/PageShell";
import { Badge, Stamp } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Reveal } from "../../components/ui/Reveal";
import { AvailabilityBoard } from "../../components/booking/AvailabilityBoard";
import { BookingFlowModal } from "../../components/booking/BookingFlowModal";
import { rooms, sessionLabels, professionalTips } from "../../data/rooms";
import { roomImagery, roomVideos } from "../../data/imagery";
import { useAuth } from "../../hooks/useAuth";
import { useSeo } from "../../hooks/useSeo";

const SITE_URL = "https://amk-consulting-hub.netlify.app";

export function RoomDetail() {
  const { slug } = useParams();
  const { session } = useAuth();
  const navigate = useNavigate();
  const room = rooms.find((r) => r.slug === slug);
  const partner = room?.combinesWithRoomId ? rooms.find((r) => r.id === room.combinesWithRoomId) : undefined;
  const [bookingOpen, setBookingOpen] = useState(false);

  useSeo({
    title: room ? `${room.name} | AMK Consulting Hub` : "Room not found | AMK Consulting Hub",
    description: room
      ? `${room.description} AM £${room.priceAm}, PM £${room.pricePm}, full day £${room.priceFullDay}. Book online at AMK Consulting Hub, Manchester.`
      : "This room couldn't be found.",
    path: `/rooms/${slug}`,
    noindex: !room,
  });

  function handleBookClick() {
    if (!session) {
      navigate(`/sign-in?next=${encodeURIComponent(`/rooms/${slug}`)}`);
      return;
    }
    setBookingOpen(true);
  }

  if (!room) {
    return (
      <PageShell>
        <section className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-extrabold mb-3">Room not found</h1>
          <Link to="/rooms" className="text-sm font-bold text-teal-deep">
            &larr; Back to all rooms
          </Link>
        </section>
      </PageShell>
    );
  }

  const pricing: { type: "am" | "pm" | "full_day"; price: number }[] = [
    { type: "am", price: room.priceAm },
    { type: "pm", price: room.pricePm },
    { type: "full_day", price: room.priceFullDay },
  ];

  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Rooms", item: `${SITE_URL}/rooms` },
      { "@type": "ListItem", position: 3, name: room.name, item: `${SITE_URL}/rooms/${room.slug}` },
    ],
  });

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <nav aria-label="Breadcrumb" className="text-sm font-bold text-navy/55">
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <Link to="/" className="hover:text-navy">
                Home
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li>
              <Link to="/rooms" className="hover:text-navy">
                Rooms
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li aria-current="page" className="text-navy">
              {room.name}
            </li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 mt-6">
          <Reveal>
            <div className="relative rounded-[24px] h-64 sm:h-96 mb-8 overflow-hidden shadow-[var(--shadow-card)]">
              {roomVideos.perRoom[room.id] ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={roomVideos.perRoom[room.id]}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img src={roomImagery[room.id]} alt="" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
              <span className="absolute top-4 right-4">
                <Stamp kind="sample" />
              </span>
              <h1 className="absolute bottom-5 left-6 font-display text-3xl lg:text-4xl font-extrabold text-white drop-shadow">
                {room.name}
              </h1>
            </div>

            <p className="text-navy/65 leading-relaxed mb-8 max-w-xl">{room.description}</p>

            <h2 className="text-sm font-bold text-navy/50 mb-3">Amenities</h2>
            <ul className="flex flex-wrap gap-2 mb-8">
              {room.amenities.map((a) => (
                <li key={a} className="text-sm bg-soft rounded-full px-4 py-1.5 text-navy/75 font-medium">
                  {a}
                </li>
              ))}
            </ul>

            {partner && (
              <div className="gradient-brand text-white rounded-[20px] p-5 mb-8 shadow-[var(--shadow-glow)]">
                <Badge tone="navy">Combinable</Badge>
                <p className="text-sm text-white/90 mt-2 leading-relaxed">
                  This room combines with <strong>{partner.name}</strong> for larger sessions.
                  Combined pairing is confirmed directly with AMK Consulting Hub.
                </p>
              </div>
            )}

            <h2 className="text-sm font-bold text-navy/50 mb-3">Tips for professionals</h2>
            <ul className="flex flex-col gap-2 mb-8">
              {professionalTips.map((tip) => (
                <li key={tip} className="flex items-start gap-2.5 text-sm text-navy/65 leading-relaxed">
                  <span className="text-teal-deep mt-0.5" aria-hidden="true">
                    &bull;
                  </span>
                  {tip}
                </li>
              ))}
            </ul>

            <AvailabilityBoard />
          </Reveal>

          <Reveal delay={150}>
            <aside className="lg:sticky lg:top-24 h-fit bg-white border border-border/60 rounded-[24px] p-6 shadow-[var(--shadow-card)]">
              <p className="text-sm font-bold text-navy/50 mb-4">Session pricing</p>
              <div className="flex flex-col divide-y divide-border mb-6">
                {pricing.map((p) => (
                  <div key={p.type} className="flex items-center justify-between py-3">
                    <span className="text-sm font-semibold text-navy">{sessionLabels[p.type]}</span>
                    <span className="text-lg font-extrabold text-teal-deep">&pound;{p.price}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full" size="lg" onClick={handleBookClick}>
                Book this room
              </Button>
              <p className="text-xs text-navy/45 text-center mt-3">
                New here?{" "}
                <Link to={`/sign-up?next=/rooms/${room.slug}`} className="text-teal-deep font-bold">
                  Create an account
                </Link>{" "}
                to keep a record of your bookings.
              </p>
            </aside>
          </Reveal>
        </div>
      </section>

      <BookingFlowModal room={room} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </PageShell>
  );
}
