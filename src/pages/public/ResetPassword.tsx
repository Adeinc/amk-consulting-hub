import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "../../components/layout/AuthShell";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../lib/supabase";
import { useSeo } from "../../hooks/useSeo";

/**
 * Landed on from the link in a "forgot password" email. Supabase Auth reads the recovery
 * token from the URL itself and establishes a temporary session — this page just needs to
 * call updateUser with the new password.
 */
export function ResetPassword() {
  useSeo({
    title: "Set a New Password | AMK Consulting Hub",
    description: "Set a new password for your AMK Consulting Hub practitioner account.",
    path: "/reset-password",
    noindex: true,
  });

  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    navigate("/dashboard", { replace: true });
  }

  return (
    <AuthShell eyebrow="Almost there" title="Set a new password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="New password"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error ?? undefined}
        />
        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading ? "Saving…" : "Save new password"}
        </Button>
      </form>
      <p className="text-sm text-navy-ink/55 text-center mt-6">
        <Link to="/sign-in" className="text-teal-deep font-semibold">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
