import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useToast } from "../../components/ui/Toast";
import { getAllPractitioners, setPractitionerActive, type AdminPractitioner } from "../../lib/admin";
import { adminNavItems } from "./navItems";

/** A bare inline switch, no label/border row — Toggle's own wrapper doesn't compose well
 * nested inside a compact list row like this one. */
function InlineSwitch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex items-center gap-2 cursor-pointer"
    >
      <span className="text-xs font-semibold text-navy/60">{label}</span>
      <span className={`w-11 h-6 rounded-full transition-colors relative ${checked ? "gradient-brand" : "bg-navy/15"}`}>
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </span>
    </button>
  );
}

export function PractitionersAdmin() {
  const showToast = useToast();
  const [practitioners, setPractitioners] = useState<AdminPractitioner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPractitioners().then((data) => {
      setPractitioners(data);
      setLoading(false);
    });
  }, []);

  async function handleToggleActive(p: AdminPractitioner) {
    const next = !p.isActive;
    setPractitioners((prev) => prev.map((x) => (x.id === p.id ? { ...x, isActive: next } : x)));
    try {
      await setPractitionerActive(p.id, next);
      showToast(next ? "Practitioner reactivated" : "Practitioner deactivated", "confirm");
    } catch (err) {
      setPractitioners((prev) => prev.map((x) => (x.id === p.id ? { ...x, isActive: !next } : x)));
      showToast(err instanceof Error ? err.message : "Couldn't update this practitioner", "alert");
    }
  }

  return (
    <DashboardShell role="Admin" navItems={adminNavItems} title="Practitioners">
      <Card padded={false}>
        {loading ? (
          <div className="p-6 flex flex-col gap-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-navy/8 animate-pulse" />
            ))}
          </div>
        ) : practitioners.length === 0 ? (
          <p className="text-sm text-navy/45 py-10 text-center">No practitioners have registered yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {practitioners.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="font-semibold text-navy text-sm truncate">{p.fullName}</p>
                  <p className="text-xs text-navy/55 truncate">{p.email ?? "No email on file"}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge tone={p.credentialsAttested ? "confirm" : "neutral"}>
                    {p.credentialsAttested ? "Credentials confirmed" : "Not attested"}
                  </Badge>
                  <InlineSwitch
                    checked={p.isActive}
                    onChange={() => handleToggleActive(p)}
                    label={p.isActive ? "Active" : "Deactivated"}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardShell>
  );
}
