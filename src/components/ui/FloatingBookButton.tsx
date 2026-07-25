import { Link, useLocation } from "react-router-dom";

/** Persistent floating call-to-action — always-on-hand invitation to book, the site's signature "moving" touch. */
export function FloatingBookButton() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/rooms/")) return null;

  return (
    <Link
      to="/rooms"
      className="shine fixed! bottom-6 right-6 z-30 flex items-center gap-2 gradient-brand text-white rounded-full pl-5 pr-6 py-3.5 shadow-[var(--shadow-glow)] hover:shadow-[0_16px_36px_-6px_rgba(12,132,150,0.65)] hover:-translate-y-0.5 transition-all animate-[float-glow_6s_ease-in-out_infinite]"
    >
      <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden="true" />
      <span className="text-sm font-bold">Book a room</span>
    </Link>
  );
}
