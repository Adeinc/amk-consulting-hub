// Resend calls must happen server-side (Supabase Edge Function) — never call the Resend
// API with a real key from the browser bundle. This client-side stub documents the
// call shape so the Edge Function integration at Milestone 3 has an agreed contract.

export interface SendEmailInput {
  to: string;
  subject: string;
  template: "booking-confirmed" | "booking-cancelled" | "verify-email" | "password-reset";
  data: Record<string, unknown>;
}

export async function sendTransactionalEmail(input: SendEmailInput) {
  // TODO(Milestone 3/5): POST to a Supabase Edge Function that holds the real Resend key
  // and renders the named template server-side.
  console.warn("sendTransactionalEmail is not wired to a backend yet.", input);
}
