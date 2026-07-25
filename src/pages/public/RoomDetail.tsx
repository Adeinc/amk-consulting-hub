import { Link, useParams } from "react-router-dom";
import { PageShell } from "../../components/layout/PageShell";
import { Badge, Stamp } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Reveal } from "../../components/ui/Reveal";
import { AvailabilityBoard } from "../../components/booking/AvailabilityBoard";
import { rooms, sessionLabels } from "../../data/rooms";
import { roomImagery } from "../../data/imagery";

export function RoomDetail() {
  const { slug } = useParams();
  const room = rooms.find((r) => r.slug === slug);
  const partner = room?.combinesWithRoomId ? rooms.find((r) => r.id === room.combinesWithRoomId) : undefined;

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

  return (
    <PageShell>
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <Link to="/rooms" className="text-sm font-bold text-navy/55 hover:text-navy">
          &larr; All rooms
        </Link>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 mt-6">
          <Reveal>
            <div className="relative rounded-[24px] h-64 sm:h-96 mb-8 overflow-hidden shadow-[var(--shadow-card)]">
              <img src={roomImagery[room.id]} alt="" className="absolute inset-0 w-full h-full object-cover" />
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
              <Link to={`/sign-in?next=/rooms/${room.slug}`}>
                <Button className="w-full" size="lg">
                  Sign in to book
                </Button>
              </Link>
              <p className="text-xs text-navy/45 text-center mt-3">
                New here?{" "}
                <Link to={`/sign-up?next=/rooms/${room.slug}`} className="text-teal-deep font-bold">
                  Create an account
                </Link>
              </p>
            </aside>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
