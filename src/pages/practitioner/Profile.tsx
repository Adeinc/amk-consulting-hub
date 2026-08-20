import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";
import { QrCode } from "../../components/booking/QrCode";
import { BookingDetailModal } from "../../components/booking/BookingDetailModal";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { getMyBookingGroups, bookingGroupQrValue, isBookingGroupPast, type BookingGroup } from "../../lib/bookings";
import { sessionLabels } from "../../data/rooms";

const navItems = [
  { to: "/dashboard", label: "My bookings" },
  { to: "/dashboard/profile", label: "Profile" },
];

function Toggle({ checked, onChange, label, detail }: { checked: boolean; onChange: () => void; label: string; detail: string }) {
  return (
    <label className="flex items-center justify-between gap-4 py-3.5 border-b border-border last:border-0 cursor-pointer">
      <div>
        <p className="font-semibold text-navy text-sm">{label}</p>
        <p className="text-xs text-navy/50">{detail}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`shrink-0 w-11 h-6 rounded-full transition-colors relative cursor-pointer ${checked ? "gradient-brand" : "bg-navy/15"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </label>
  );
}

export function Profile() {
  const showToast = useToast();
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [credentialsConfirmed, setCredentialsConfirmed] = useState(false);
  const [notifyConfirmations, setNotifyConfirmations] = useState(true);
  const [notifyReminders, setNotifyReminders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bookings, setBookings] = useState<BookingGroup[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [viewing, setViewing] = useState<BookingGroup | null>(null);

  useEffect(() => {
    getMyBookingGroups().then((data) => {
      setBookings(data);
      setBookingsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name);
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("practitioners")
      .select("credentials_attested")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setCredentialsConfirmed(data.credentials_attested);
      });
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);

    const [{ error: profileError }, { error: practitionerError }] = await Promise.all([
      supabase.from("profiles").update({ full_name: name, phone: phone || null }).eq("id", user.id),
      supabase.from("practitioners").update({ credentials_attested: credentialsConfirmed }).eq("id", user.id),
    ]);

    setSaving(false);
    if (profileError || practitionerError) {
      showToast(profileError?.message ?? practitionerError?.message ?? "Couldn't save changes", "alert");
      return;
    }
    await refreshProfile();
    // TODO(Milestone 7): persist notification preferences once a column exists to drive Resend sends.
    showToast("Profile saved", "confirm");
  }

  return (
    <DashboardShell role="Practitioner" navItems={navItems} title="Profile">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <p className="font-display text-lg font-bold mb-4">Account details</p>
          <div className="flex flex-col gap-4">
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" type="email" value={user?.email ?? ""} disabled />
            <Input label="Phone (optional)" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="mt-5 pt-5 border-t border-border">
            <Toggle
              checked={credentialsConfirmed}
              onChange={() => setCredentialsConfirmed((v) => !v)}
              label="Professional credentials & insurance"
              detail="Self-declared Yes/No — nothing to upload."
            />
          </div>

          <Button className="w-full mt-6" disabled={saving} onClick={handleSave}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </Card>

        <Card>
          <p className="font-display text-lg font-bold mb-1">Notifications</p>
          <p className="text-sm text-navy/55 mb-3">Choose what AMK Consulting Hub emails you about.</p>
          <Toggle
            checked={notifyConfirmations}
            onChange={() => setNotifyConfirmations((v) => !v)}
            label="Booking confirmations"
            detail="Sent the moment a booking auto-confirms on payment."
          />
          <Toggle
            checked={notifyReminders}
            onChange={() => setNotifyReminders((v) => !v)}
            label="Session reminders"
            detail="A reminder email ahead of each upcoming session."
          />
        </Card>

        <Card className="lg:col-span-2">
          <p className="font-display text-lg font-bold mb-1">My booking codes</p>
          <p className="text-sm text-navy/55 mb-4">
            Your access code and QR for each booking — also emailed to you when a booking or
            extension is confirmed.
          </p>
          {bookingsLoading ? (
            <div className="grid sm:grid-cols-2 gap-4" aria-hidden="true">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-center gap-4 bg-soft rounded-2xl p-4 animate-pulse">
                  <div className="w-14 h-14 rounded-lg bg-navy/8 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-28 bg-navy/8 rounded-full mb-2" />
                    <div className="h-3 w-36 bg-navy/8 rounded-full mb-2" />
                    <div className="h-3 w-20 bg-navy/8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-navy/45 py-6 text-center">
              No bookings yet — book a room to get your first access code.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div key={b.groupId} className="flex items-center gap-4 bg-soft rounded-2xl p-4">
                  <QrCode value={bookingGroupQrValue(b)} size={56} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy text-sm truncate">{b.roomName}</p>
                    <p className="text-xs text-navy/55 mb-1">
                      {new Date(b.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      {b.days > 1 ? ` · ${b.days}d` : ""} &middot; {sessionLabels[b.session]}
                    </p>
                    <p className="font-mono-tight text-xs font-bold text-teal-deep">{b.code}</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => setViewing(b)}>
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {viewing && (
        <BookingDetailModal
          booking={viewing}
          extendable={!isBookingGroupPast(viewing)}
          open={!!viewing}
          onClose={() => setViewing(null)}
          onExtended={(updated) => {
            setBookings((prev) => prev.map((b) => (b.groupId === updated.groupId ? updated : b)));
            setViewing(updated);
          }}
        />
      )}
    </DashboardShell>
  );
}
