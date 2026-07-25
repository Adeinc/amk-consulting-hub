/** Suspense fallback while a lazy-loaded route chunk downloads — matters most on slow connections. */
export function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-soft">
      <span className="w-10 h-10 rounded-full border-4 border-teal/20 border-t-teal animate-spin" aria-label="Loading" />
    </div>
  );
}
