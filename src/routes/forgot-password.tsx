import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — HackRadar" },
      { name: "description", content: "Reset your HackRadar password. We'll email you a secure link to set a new one." },
      { property: "og:title", content: "Forgot password — HackRadar" },
      { property: "og:url", content: "https://hackradar.lovable.app/forgot-password" },
    ],
    links: [{ rel: "canonical", href: "https://hackradar.lovable.app/forgot-password" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Enter your email.");
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent(true);
  };

  if (sent) {
    return (
      <AuthShell
        eyebrow="Check your inbox"
        title="Reset link sent"
        subtitle={`If an account exists for ${email}, we sent a reset link. It's valid for 1 hour.`}
      >
        <Link
          to="/login"
          className="block text-center py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-neu-sm hover:opacity-95"
        >
          Back to log in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Password reset"
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to set a new one."
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <Field icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-neu-sm hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          Send reset link
        </button>
      </form>
      <p className="text-xs text-center text-muted-foreground">
        Remembered it?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
