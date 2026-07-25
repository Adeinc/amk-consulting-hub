import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";

const navLinks = [
  { to: "/rooms", label: "Rooms" },
  { to: "/sign-in", label: "Sign in" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border/70">
      <div className="hidden sm:flex justify-between items-center px-6 lg:px-10 py-2 text-xs font-medium text-navy/55">
        <span>AM, PM &amp; full-day rooms in Manchester</span>
        <span>Booking confirms the moment payment clears</span>
      </div>

      <div className="flex items-center justify-between px-6 lg:px-10 py-4">
        <NavLink to="/" className="inline-flex" onClick={() => setOpen(false)}>
          <Logo amkClassName="h-9" subtitleClassName="h-4" />
        </NavLink>

        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  isActive ? "bg-teal/10 text-teal-deep" : "text-navy/65 hover:text-navy hover:bg-navy/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Button size="sm" variant="primary" className="ml-3" onClick={() => (window.location.href = "/rooms")}>
            Book a room
          </Button>
        </nav>

        <button
          className="md:hidden flex flex-col items-center justify-center gap-1.5 min-w-11 min-h-11 cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block w-6 h-[2px] rounded-full bg-navy transition-transform ${open ? "rotate-45 translate-y-[6.5px]" : ""}`}
          />
          <span className={`block w-6 h-[2px] rounded-full bg-navy transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`block w-6 h-[2px] rounded-full bg-navy transition-transform ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-6 pb-5 border-t border-border">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="py-3 text-base font-semibold text-navy border-b border-border/60 last:border-0"
            >
              {link.label}
            </NavLink>
          ))}
          <Button className="mt-4 w-full" onClick={() => (window.location.href = "/rooms")}>
            Book a room
          </Button>
        </nav>
      )}
    </header>
  );
}
