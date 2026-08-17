import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingBookButton } from "../ui/FloatingBookButton";
import { SessionReminderPopup } from "../booking/SessionReminderPopup";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-teal-deep focus:text-white focus:font-semibold focus:px-5 focus:py-3 focus:rounded-full"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingBookButton />
      <SessionReminderPopup />
    </div>
  );
}
