import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Resets scroll to the top on every route change — SPA navigation otherwise keeps the old scroll position. */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
