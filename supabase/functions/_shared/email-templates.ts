// Server-rendered HTML email templates. Table-based, inline-styled — this is what actually
// renders correctly across Outlook/Gmail/Apple Mail, unlike the Tailwind classes used
// elsewhere in this codebase. Brand colours are hardcoded to match src/index.css's tokens
// since email clients can't read a stylesheet.
//
// LOGO_URL points at the current Netlify URL. Swap to the amkconsultinghub.co.uk domain
// once that's the live hosting URL — see docs/EMAIL_SETUP.md.

const LOGO_URL = "https://amk-consulting-hub.netlify.app/logo-transparent.png";
const NAVY = "#0c2a4e";
const TEAL = "#0c8496";
const TEAL_DEEP = "#086878";
const SOFT = "#f2f8f8";
const BORDER = "#d8e2e2";

function baseLayout(bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${SOFT};font-family:'Public Sans',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid ${BORDER};">
            <tr>
              <td style="background:${NAVY};padding:24px 32px;">
                <img src="${LOGO_URL}" alt="AMK Consulting Hub" height="28" style="display:block;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:${NAVY};font-size:15px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid ${BORDER};color:#8a9aa5;font-size:12px;line-height:1.6;">
                AMK Consulting Hub &middot; 1 Brickworks, Adlington, Manchester, SK10 4NL<br />
                07415 893038 &middot; info@amkconsultinghub.co.uk
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function button(label: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background:${TEAL};background:linear-gradient(125deg, ${NAVY}, ${TEAL});color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:999px;margin-top:8px;">${label}</a>`;
}

export interface BookingEmailData {
  practitionerName: string;
  roomName: string;
  dateLabel: string; // pre-formatted, e.g. "Tue 28 Jul 2026" or "Tue 28 Jul – Thu 30 Jul 2026"
  sessionLabel: string; // "AM", "PM", or "Full day"
  price: number;
  code: string;
  manageUrl: string;
}

export function bookingConfirmedEmail(data: BookingEmailData): { subject: string; html: string } {
  const subject = `Booking confirmed — ${data.roomName}, ${data.dateLabel}`;
  const html = baseLayout(`
    <p style="margin:0 0 16px;font-size:18px;font-weight:800;">Your booking is confirmed</p>
    <p style="margin:0 0 20px;">Hi ${data.practitionerName}, your payment has cleared and the room is yours — no further action needed.</p>
    <table role="presentation" width="100%" style="background:${SOFT};border-radius:14px;margin:0 0 20px;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 4px;font-weight:700;">${data.roomName}</p>
        <p style="margin:0 0 4px;color:#5a6b76;">${data.dateLabel} &middot; ${data.sessionLabel}</p>
        <p style="margin:0;color:#5a6b76;">£${data.price.toFixed(2)} paid</p>
      </td></tr>
    </table>
    <p style="margin:0 0 4px;">Your access code:</p>
    <p style="margin:0 0 20px;font-size:20px;font-weight:800;letter-spacing:0.04em;color:${TEAL_DEEP};">${data.code}</p>
    ${button("View booking", data.manageUrl)}
  `);
  return { subject, html };
}

export function bookingCancelledEmail(data: Pick<BookingEmailData, "practitionerName" | "roomName" | "dateLabel" | "sessionLabel">): {
  subject: string;
  html: string;
} {
  const subject = `Booking cancelled — ${data.roomName}, ${data.dateLabel}`;
  const html = baseLayout(`
    <p style="margin:0 0 16px;font-size:18px;font-weight:800;">Booking cancelled</p>
    <p style="margin:0 0 20px;">Hi ${data.practitionerName}, your booking for <strong>${data.roomName}</strong> on ${data.dateLabel} (${data.sessionLabel}) has been cancelled.</p>
    <p style="margin:0;color:#5a6b76;">If this wasn't you, or you have questions about a refund, contact us at info@amkconsultinghub.co.uk.</p>
  `);
  return { subject, html };
}

export function sessionReminderEmail(data: BookingEmailData): { subject: string; html: string } {
  const subject = `Reminder: ${data.roomName} tomorrow — ${data.sessionLabel}`;
  const html = baseLayout(`
    <p style="margin:0 0 16px;font-size:18px;font-weight:800;">Your session is coming up</p>
    <p style="margin:0 0 20px;">Hi ${data.practitionerName}, a quick reminder about your upcoming session.</p>
    <table role="presentation" width="100%" style="background:${SOFT};border-radius:14px;margin:0 0 20px;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 4px;font-weight:700;">${data.roomName}</p>
        <p style="margin:0;color:#5a6b76;">${data.dateLabel} &middot; ${data.sessionLabel}</p>
      </td></tr>
    </table>
    <p style="margin:0 0 4px;">Your access code:</p>
    <p style="margin:0 0 20px;font-size:20px;font-weight:800;letter-spacing:0.04em;color:${TEAL_DEEP};">${data.code}</p>
    ${button("View booking", data.manageUrl)}
  `);
  return { subject, html };
}
