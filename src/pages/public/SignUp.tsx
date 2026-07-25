import { type FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthShell } from "../../components/layout/AuthShell";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function SignUp() {
  const [params] = useSearchParams();
  const next = params.get("next") ?? "/dashboard";
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO(Milestone 3): wire to supabase.auth.signUp, create profiles + practitioners row, then navigate(next)
    window.setTimeout(() => setLoading(false), 600);
  }

  return (
    <AuthShell eyebrow="Get started" title="Create your account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Full name" name="fullName" autoComplete="name" required />
        <Input label="Email" type="email" name="email" autoComplete="email" required />
        <Input label="Password" type="password" name="password" autoComplete="new-password" required />
        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="text-sm text-navy-ink/55 text-center mt-6">
        Already have an account?{" "}
        <Link to={`/sign-in${next !== "/dashboard" ? `?next=${next}` : ""}`} className="text-teal-deep font-semibold">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
