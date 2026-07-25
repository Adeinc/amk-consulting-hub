// Stripe publishable key only ever lives client-side — the secret key stays server-side
// (a Supabase Edge Function), never in this bundle. Wired at Milestone 5, gated on
// Freda's Stripe account verification (flagged as her highest-priority action).

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export async function getStripe() {
  if (!publishableKey) {
    console.warn("VITE_STRIPE_PUBLISHABLE_KEY is not set — payment cannot be initialised yet.");
    return null;
  }
  const { loadStripe } = await import("@stripe/stripe-js");
  return loadStripe(publishableKey);
}
