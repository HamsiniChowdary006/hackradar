import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Loader2, Mail, Lock, User as UserIcon, Radar } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth-context";

export function AuthModal() {
  const { authModal, closeAuth, openAuth } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(authModal.mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  // Sync mode when opened
  if (authModal.open && authModal.mode !== mode && !busy) {
    // opening the modal via openAuth() switches modes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required.");
      return;
    }
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: name.trim() || email.split("@")[0] },
        },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Account created! Check your email to verify.");
      closeAuth();
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Welcome back!");
      closeAuth();
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. " + (result.error.message ?? ""));
      return;
    }
    if (result.redirected) return;
    setBusy(false);
    toast.success("Signed in with Google!");
    closeAuth();
  };

  return (
    <Dialog open={authModal.open} onOpenChange={(o) => (o ? openAuth(mode) : closeAuth())}>
      <DialogContent
        className="max-w-md p-0 border-0 bg-transparent shadow-none [&>button]:hidden"
        aria-describedby={undefined}
      >
        <VisuallyHidden asChild>
          <DialogTitle>{mode === "signin" ? "Log in" : "Sign up"} to HackRadar</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>Access saved hackathons and notifications.</DialogDescription>
        </VisuallyHidden>
        <div className="neu-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl grid place-items-center neu-card-sm">
              <Radar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-lg font-bold">
                {mode === "signin" ? "Welcome back" : "Create account"}
              </div>
              <div className="text-xs text-muted-foreground">
                {mode === "signin"
                  ? "Sign in to sync your saved hackathons."
                  : "Track hackathons and get personalized alerts."}
              </div>
            </div>
          </div>

          <div className="neu-inset p-1 grid grid-cols-2 gap-1 rounded-2xl">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={
                  "text-sm font-semibold py-2 rounded-xl transition " +
                  (mode === m ? "bg-primary text-primary-foreground shadow-neu-sm" : "text-muted-foreground")
                }
              >
                {m === "signin" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl neu-pressable font-semibold text-sm disabled:opacity-60"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">or email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <Field icon={UserIcon} placeholder="Display name" value={name} onChange={setName} />
            )}
            <Field icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
            <Field
              icon={Lock}
              type="password"
              placeholder={mode === "signup" ? "Create a password (min 6 chars)" : "Password"}
              value={password}
              onChange={setPassword}
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-neu-sm hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "signin" ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="text-[11px] text-center text-muted-foreground">
            By continuing you agree to HackRadar's terms of service.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
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
