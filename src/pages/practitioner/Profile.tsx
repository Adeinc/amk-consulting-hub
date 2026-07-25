import { useState } from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";

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
  const [name, setName] = useState("Alex Practitioner");
  const [email, setEmail] = useState("alex@example.com");
  const [phone, setPhone] = useState("");
  const [credentialsConfirmed, setCredentialsConfirmed] = useState(true);
  const [notifyConfirmations, setNotifyConfirmations] = useState(true);
  const [notifyReminders, setNotifyReminders] = useState(true);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    // TODO(Milestone 3/7): persist to Supabase; notification preferences drive Resend sends.
    window.setTimeout(() => {
      setSaving(false);
      showToast("Profile saved", "confirm");
    }, 500);
  }

  return (
    <DashboardShell role="Practitioner" navItems={navItems} title="Profile">
      <p className="text-sm text-navy/55 mb-6">Sample data shown — connects to your real account at Milestone 3.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <p className="font-display text-lg font-bold mb-4">Account details</p>
          <div className="flex flex-col gap-4">
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
      </div>
    </DashboardShell>
  );
}
