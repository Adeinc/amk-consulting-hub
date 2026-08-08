import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthShell } from "../../components/layout/AuthShell";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../lib/supabase";

export function SignUp() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = params.get("next") ?? "/dashboard";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Some projects auto-confirm (session comes back immediately); others require clicking
    // an email link first (no session yet, but no error either) — handle both.
    if (data.session) {
      navigate(next, { replace: true });
    } else {
      setCheckEmail(true);
    }
  }

  if (checkEmail) {
    return (
      <AuthShell eyebrow="Almost there" title="Check your email">
        <p className="text-navy/60 leading-relaxed mb-6">
          We've sent a confirmation link to <strong className="text-navy">{email}</strong>. Click
          it to activate your account, then sign in.
        </p>
        <Link to="/sign-in">
          <Button variant="secondary" className="w-full">
            Back to sign in
          </Button>
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="Get started" title="Create your account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full name"
          name="fullName"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
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
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error ?? undefined}
        />
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
