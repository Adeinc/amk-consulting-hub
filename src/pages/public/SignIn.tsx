import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthShell } from "../../components/layout/AuthShell";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../lib/supabase";
import { useSeo } from "../../hooks/useSeo";

export function SignIn() {
  useSeo({
    title: "Sign In | AMK Consulting Hub",
    description: "Sign in to your AMK Consulting Hub practitioner account.",
    path: "/sign-in",
    noindex: true,
  });

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = params.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (signInError) {
      setError(
        signInError.message === "Email not confirmed"
          ? "Please confirm your email first — check your inbox for the link."
          : "Incorrect email or password.",
      );
      return;
    }
    navigate(next, { replace: true });
  }

  return (
    <AuthShell eyebrow="Welcome back" title="Sign in">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error ?? undefined}
        />
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
