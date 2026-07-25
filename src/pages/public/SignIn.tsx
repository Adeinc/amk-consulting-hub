import { type FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthShell } from "../../components/layout/AuthShell";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function SignIn() {
  const [params] = useSearchParams();
  const next = params.get("next") ?? "/dashboard";
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO(Milestone 3): wire to supabase.auth.signInWithPassword, then navigate(next)
    window.setTimeout(() => setLoading(false), 600);
  }

  return (
    <AuthShell eyebrow="Welcome back" title="Sign in">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" name="email" autoComplete="email" required />
        <Input label="Password" type="password" name="password" autoComplete="current-password" required />
        <Link to="/forgot-password" className="text-sm font-semibold text-teal-deep self-end -mt-2">
          Forgot password?
        </Link>
        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="text-sm text-navy-ink/55 text-center mt-6">
        New to AMK Consulting Hub?{" "}
        <Link to={`/sign-up${next !== "/dashboard" ? `?next=${next}` : ""}`} className="text-teal-deep font-semibold">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
