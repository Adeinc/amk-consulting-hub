// Resend calls happen server-side only (Supabase Edge Functions) — the browser never holds
// a real Resend API key. This module just invokes the right Edge Function; see
// supabase/functions/send-booking-confirmation and send-booking-reminder for the actual
// sending logic, and docs/EMAIL_SETUP.md for what's left to connect once Freda's Resend
// account and domain are ready.

import { supabase } from "./supabase";

export async function sendBookingConfirmationEmail(bookingId: string) {
  const { error } = await supabase.functions.invoke("send-booking-confirmation", {
    body: { booking_id: bookingId },
  });
  if (error) {
    // Expected until Milestone 3/5 (Supabase provisioned, function deployed, Resend connected).
    console.warn("send-booking-confirmation not reachable yet:", error.message);
  }
}
