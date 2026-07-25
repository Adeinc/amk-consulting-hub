import { Link } from "react-router-dom";
import type { Room } from "../../types";
import { Badge, Stamp } from "../ui/Badge";
import { roomImagery } from "../../data/imagery";

export function RoomCard({ room }: { room: Room; index: number }) {
  return (
    <Link
      to={`/rooms/${room.slug}`}
      className="brand-card group relative flex flex-col bg-white border border-border/60 rounded-[20px] overflow-hidden shadow-[var(--shadow-card)]"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={roomImagery[room.id]}
          alt=""
          loading="lazy"
          className="brand-card-image absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {room.combinesWithRoomId && <Badge tone="teal">Combinable</Badge>}
        </div>
        <span className="absolute top-3 right-3">
          <Stamp kind="sample" />
        </span>
        <span className="absolute bottom-3 left-4 text-white font-display text-lg font-extrabold drop-shadow">
          {room.name}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-5">
        <p className="text-sm text-navy/60 leading-relaxed line-clamp-2">{room.description}</p>

        <div className="flex items-center justify-between pt-3 mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-navy/45">From</span>
            <span className="text-xl font-extrabold text-teal-deep">&pound;{room.priceAm}</span>
            <span className="text-xs text-navy/45">/ session</span>
          </div>
          <span className="w-8 h-8 rounded-full gradient-brand text-white flex items-center justify-center text-sm transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
