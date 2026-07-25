import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "../../components/layout/AuthShell";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO(Milestone 3): wire to supabase.auth.resetPasswordForEmail, sent via Resend
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  }

  if (sent) {
    return (
      <AuthShell eyebrow="Check your email" title="Reset link sent">
        <p className="text-navy/60 leading-relaxed mb-6">
          If an account exists for <strong className="text-navy">{email}</strong>, we've sent a
          link to reset your password. It'll expire in 60 minutes.
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
    <AuthShell eyebrow="Reset your password" title="Forgot password?">
      <p className="text-navy/55 text-sm leading-relaxed mb-6">
        Enter the email you signed up with and we'll send you a link to reset your password.
      </p>
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
        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>
      <p className="text-sm text-navy-ink/55 text-center mt-6">
        Remembered it?{" "}
        <Link to="/sign-in" className="text-teal-deep font-semibold">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
