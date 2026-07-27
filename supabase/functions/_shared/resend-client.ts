// Thin wrapper around Resend's REST API. Deno's global fetch is enough — no SDK dependency.
// RESEND_API_KEY and FROM_EMAIL are Edge Function secrets (`supabase secrets set`), never
// exposed to the browser. See docs/EMAIL_SETUP.md for exactly what to set once Freda's
// Resend account and domain verification are in place.

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailArgs): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail = Deno.env.get("FROM_EMAIL") ?? "AMK Consulting Hub <bookings@amkconsultinghub.co.uk>";

  if (!apiKey) {
    // Mirrors src/lib/resend.ts's client-side stub: fail loud in logs, not in the caller's flow.
    console.error("RESEND_API_KEY is not set — email not sent.", { to, subject });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: fromEmail, to, subject, html }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error ${response.status}: ${body}`);
  }
}
