import { PageShell } from "../../components/layout/PageShell";
import { RoomCard } from "../../components/booking/RoomCard";
import { Badge, Stamp } from "../../components/ui/Badge";
import { Reveal } from "../../components/ui/Reveal";
import { rooms } from "../../data/rooms";
import { brandImagery, roomVideos } from "../../data/imagery";
import { useSeo } from "../../hooks/useSeo";

export function RoomsList() {
  useSeo({
    title: "All Rooms | AMK Consulting Hub",
    description: "Six independently priced clinical and therapy rooms in Manchester, including a fully equipped dental treatment room. AM, PM or full-day sessions.",
    path: "/rooms",
  });

  return (
    <PageShell>
      <section className="relative overflow-hidden">
        {roomVideos.allRoomsHeader ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={roomVideos.allRoomsHeader}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div
            className="ken-burns absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${brandImagery.reception})` }}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 gradient-hero-overlay" aria-hidden="true" />

        <Reveal className="relative max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="flex flex-wrap gap-2 mb-4">
            <Stamp kind="sample" />
            <Badge tone="navy">CQC Registered</Badge>
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-extrabold mt-1 mb-4 text-white">All rooms</h1>
          <p className="text-white/75 max-w-xl">
            Six independently priced rooms, including a fully equipped dental treatment room.
            Session length is AM, PM or full day — pick a room to see live pricing and amenities.
          </p>
        </Reveal>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, i) => (
            <Reveal key={room.id} delay={(i % 3) * 90}>
              <RoomCard room={room} index={i} />
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
