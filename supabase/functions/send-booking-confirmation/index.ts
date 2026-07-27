// Deploy: supabase functions deploy send-booking-confirmation
// Invoked by the client (src/lib/resend.ts) right after a booking auto-confirms on payment.
// Expects a service-role-only call — this function trusts its input, so it must never be
// exposed to anonymous/unauthenticated callers. Verify JWT stays on (Supabase default).

import { createClient } from "npm:@supabase/supabase-js@2";
import { sendEmail } from "../_shared/resend-client.ts";
import { bookingConfirmedEmail } from "../_shared/email-templates.ts";

const sessionLabels: Record<string, string> = { am: "AM", pm: "PM", full_day: "Full day" };

Deno.serve(async (req) => {
  try {
    const { booking_id } = await req.json();
    if (!booking_id) {
      return new Response(JSON.stringify({ error: "booking_id is required" }), { status: 400 });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("id, booking_date, session_type, price, practitioner_id, rooms(name)")
      .eq("id", booking_id)
      .single();

    if (error || !booking) {
      throw new Error(`Booking not found: ${error?.message ?? booking_id}`);
    }

    const { data: userResult, error: userError } = await supabase.auth.admin.getUserById(booking.practitioner_id);
    if (userError || !userResult?.user?.email) {
      throw new Error(`Could not resolve practitioner email: ${userError?.message}`);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", booking.practitioner_id)
      .single();

    const dateLabel = new Date(booking.booking_date).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const { subject, html } = bookingConfirmedEmail({
      practitionerName: profile?.full_name ?? "there",
      // @ts-expect-error rooms is joined as an object via the FK relationship
      roomName: booking.rooms?.name ?? "your room",
      dateLabel,
      sessionLabel: sessionLabels[booking.session_type] ?? booking.session_type,
      price: Number(booking.price),
      code: booking.id.slice(0, 8).toUpperCase(),
      manageUrl: `${Deno.env.get("SITE_URL") ?? "https://amkconsultinghub.co.uk"}/dashboard`,
    });

    await sendEmail({ to: userResult.user.email, subject, html });

    await supabase.from("notifications").insert({
      recipient_id: booking.practitioner_id,
      type: "booking_confirmed",
      title: "Booking confirmed",
      body: subject,
      related_booking_id: booking.id,
    });

    return new Response(JSON.stringify({ sent: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
