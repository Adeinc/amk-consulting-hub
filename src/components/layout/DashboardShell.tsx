import { type ReactNode, useState } from "react";
import { flushSync } from "react-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface NavItem {
  to: string;
  label: string;
}

export function DashboardShell({
  role,
  navItems,
  title,
  children,
}: {
  role: "Practitioner" | "Admin";
  navItems: NavItem[];
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    // Force the navigation to commit synchronously before clearing the session —
    // otherwise ProtectedRoute reacts to session becoming null while still mounted
    // and its own redirect to /sign-in wins the race.
    flushSync(() => {
      navigate("/", { replace: true });
    });
    await signOut();
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-soft">
      <aside
        className={`lg:w-64 lg:shrink-0 gradient-navy-teal text-white flex flex-col ${open ? "block" : "hidden"} lg:flex fixed lg:static inset-0 z-40`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link to="/" className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-extrabold">AMK</span>
            <span className="text-xs font-semibold text-teal-bright">Hub</span>
          </Link>
          <button
            className="lg:hidden flex items-center justify-center min-w-11 min-h-11 -mr-2 text-white/60 text-xl cursor-pointer"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        <p className="px-6 pt-5 pb-2 text-xs font-bold uppercase tracking-wider text-white/35">
          {role} area
        </p>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 text-sm font-semibold rounded-full transition-all ${
                  isActive ? "bg-white text-navy shadow-lg" : "text-white/65 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-6 py-5 border-t border-white/10 flex flex-col gap-2">
          <Link to="/" className="text-sm font-medium text-white/55 hover:text-white">
            &larr; Back to site
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm font-medium text-white/55 hover:text-white text-left cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between bg-white border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden flex flex-col items-center justify-center gap-1.5 min-w-11 min-h-11 -ml-2 cursor-pointer"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <span className="block w-5 h-[2px] rounded-full bg-navy" />
              <span className="block w-5 h-[2px] rounded-full bg-navy" />
              <span className="block w-5 h-[2px] rounded-full bg-navy" />
            </button>
            <h1 className="font-display text-xl font-extrabold">{title}</h1>
          </div>
          <div
            className="w-9 h-9 rounded-full gradient-brand text-white flex items-center justify-center text-sm font-bold shadow-[var(--shadow-glow)]"
            title={profile?.full_name}
          >
            {profile?.full_name?.[0]?.toUpperCase() ?? (role === "Admin" ? "A" : "P")}
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
