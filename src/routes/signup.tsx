import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock, Mail, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — HackRadar" },
      {
        name: "description",
        content: "Create a free HackRadar account to bookmark hackathons, get deadline reminders, and personalize your feed.",
      },
      { property: "og:title", content: "Sign up — HackRadar" },
      { property: "og:description", content: "Create your free HackRadar account." },
      { property: "og:url", content: "https://hackradar.lovable.app/signup" },
    ],
    links: [{ rel: "canonical", href: "https://hackradar.lovable.app/signup" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return toast.error("Email and password are required.");
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: name.trim() || email.split("@")[0] },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("Check your email to verify your account.");
  };

  if (sent) {
    return (
      <AuthShell
        eyebrow="Almost there"
        title="Verify your email"
        subtitle={`We sent a verification link to ${email}. Click it to activate your account.`}
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
      eyebrow="Get started"
      title="Create your account"
      subtitle="Free forever. No credit card required."
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <Field icon={UserIcon} placeholder="Display name" value={name} onChange={setName} />
        <Field icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
        <Field icon={Lock} type="password" placeholder="Create a password (min 6 chars)" value={password} onChange={setPassword} />
        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-neu-sm hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          Create account
        </button>
      </form>
      <p className="text-xs text-center text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
