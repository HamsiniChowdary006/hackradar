import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock, Mail, Radar } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth-context";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Log in — HackRadar" },
      {
        name: "description",
        content: "Log in to HackRadar to save hackathons, get deadline reminders, and personalize your feed.",
      },
      { property: "og:title", content: "Log in — HackRadar" },
      { property: "og:description", content: "Sign in to your HackRadar account." },
      { property: "og:url", content: "https://hackradar.lovable.app/login" },
    ],
    links: [{ rel: "canonical", href: "https://hackradar.lovable.app/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: redirect ?? "/dashboard", replace: true });
  }, [user, loading, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return toast.error("Email and password are required.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: redirect ?? "/dashboard", replace: true });
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      return toast.error("Google sign-in failed. " + (result.error.message ?? ""));
    }
    if (result.redirected) return;
    setBusy(false);
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to HackRadar"
      subtitle="Sync saved hackathons and personalized alerts across devices."
    >
      <button
        type="button"
        onClick={handleGoogle}
        disabled={busy}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl neu-pressable font-semibold text-sm disabled:opacity-60"
      >
        <GoogleIcon /> Continue with Google
      </button>
      <Divider />
      <form onSubmit={handleSubmit} className="space-y-3">
        <Field icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
        <Field icon={Lock} type="password" placeholder="Password" value={password} onChange={setPassword} />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-neu-sm hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          Log in
        </button>
      </form>
      <p className="text-xs text-center text-muted-foreground">
        New to HackRadar?{" "}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6 text-sm font-semibold text-muted-foreground">
          <div className="w-9 h-9 rounded-2xl neu-card-sm grid place-items-center">
            <Radar className="w-4 h-4 text-primary" />
          </div>
          HackRadar
        </Link>
        <div className="neu-card p-8 space-y-6">
          <div className="text-center space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              {eyebrow}
            </div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  icon: typeof Mail;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="neu-inset flex items-center gap-3 px-4 py-3">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
      />
    </div>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-muted-foreground uppercase tracking-widest">or email</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5.1l-6-5c-2 1.4-4.4 2.1-6.9 2.1-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.4 39.6 16.1 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.1 4.1-3.9 5.4l6 5c-.4.4 6.6-4.8 6.6-14.4 0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
