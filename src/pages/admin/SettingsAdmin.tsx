import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";
import { getSettings, updateSettings, type AdminSettings } from "../../lib/admin";
import { adminNavItems } from "./navItems";

const settingsSchema = z.object({
  businessName: z.string().min(2, "Required"),
  cancellationWindowHours: z.coerce.number().int().min(0, "Must be 0 or more"),
});
type SettingsFormInput = z.input<typeof settingsSchema>;
type SettingsFormOutput = z.output<typeof settingsSchema>;

export function SettingsAdmin() {
  const showToast = useToast();
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormInput, unknown, SettingsFormOutput>({ resolver: zodResolver(settingsSchema) });

  useEffect(() => {
    getSettings().then((data) => {
      setSettings(data);
      if (data) reset({ businessName: data.businessName, cancellationWindowHours: data.cancellationWindowHours });
      setLoading(false);
    });
  }, [reset]);

  async function onSubmit(values: SettingsFormOutput) {
    try {
      await updateSettings(values);
      showToast("Settings saved", "confirm");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't save settings", "alert");
    }
  }

  return (
    <DashboardShell role="Admin" navItems={adminNavItems} title="Settings">
      <Card className="max-w-xl">
        {loading ? (
          <div className="flex flex-col gap-4" aria-hidden="true">
            <div className="h-12 rounded-2xl bg-navy/8 animate-pulse" />
            <div className="h-12 rounded-2xl bg-navy/8 animate-pulse" />
          </div>
        ) : !settings ? (
          <p className="text-sm text-navy/45 py-6 text-center">Couldn't load settings.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Business name" {...register("businessName")} error={errors.businessName?.message} />
            <Input
              label="Cancellation window (hours)"
              type="number"
              min="0"
              step="1"
              hint="How far ahead of a session a practitioner can still cancel."
              {...register("cancellationWindowHours")}
              error={errors.cancellationWindowHours?.message}
            />
            <Input
              label="Auto-confirm on payment"
              value={settings.autoConfirmOnPayment ? "On — locked business decision" : "Off"}
              disabled
              hint="Not admin-editable — bookings auto-confirming on payment is a locked decision, not a toggle."
            />
            <Button type="submit" className="mt-2" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save settings"}
            </Button>
          </form>
        )}
      </Card>
    </DashboardShell>
  );
}
