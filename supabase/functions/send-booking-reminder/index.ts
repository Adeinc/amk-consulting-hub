// Deploy: supabase functions deploy send-booking-reminder --no-verify-jwt
// This one runs on a schedule, not from the browser — Supabase Dashboard → Edge Functions →
// Cron, or a pg_cron job calling it hourly (see docs/EMAIL_SETUP.md for the exact command).
// --no-verify-jwt because a cron trigger has no user JWT to present; it's not reachable with
// useful input from the public internet since it takes no meaningful request body.

import { createClient } from "npm:@supabase/supabase-js@2";
import { sendEmail } from "../_shared/resend-client.ts";
import { sessionReminderEmail } from "../_shared/email-templates.ts";

const sessionLabels: Record<string, string> = { am: "AM", pm: "PM", full_day: "Full day" };

Deno.serve(async () => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().slice(0, 10);

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("id, booking_date, session_type, price, practitioner_id, rooms(name)")
    .eq("booking_date", tomorrowDate)
    .eq("status", "confirmed")
    .is("reminder_sent_at", null);

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let sent = 0;
  for (const booking of bookings ?? []) {
    try {
      const { data: userResult } = await supabase.auth.admin.getUserById(booking.practitioner_id);
      if (!userResult?.user?.email) continue;

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

      const { subject, html } = sessionReminderEmail({
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
      await supabase.from("bookings").update({ reminder_sent_at: new Date().toISOString() }).eq("id", booking.id);
      sent++;
    } catch (err) {
      // One failed reminder shouldn't stop the rest of the batch.
      console.error(`Failed to send reminder for booking ${booking.id}:`, err);
    }
  }

  return new Response(JSON.stringify({ sent, checked: bookings?.length ?? 0 }), { status: 200 });
});
