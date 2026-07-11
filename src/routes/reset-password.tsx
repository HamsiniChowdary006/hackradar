import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — HackRadar" },
      { name: "description", content: "Set a new password for your HackRadar account." },
      { property: "og:title", content: "Reset password — HackRadar" },
      { property: "og:url", content: "https://hackradar.lovable.app/reset-password" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://hackradar.lovable.app/reset-password" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  // Supabase parses the recovery hash and fires a PASSWORD_RECOVERY event.
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // If user landed here via a hash link, session may already exist
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");
    if (password !== confirm) return toast.error("Passwords don't match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. You're signed in.");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <AuthShell
      eyebrow="New password"
      title="Set a new password"
      subtitle={ready ? "Choose something strong and memorable." : "Waiting for a valid reset link…"}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <Field icon={Lock} type="password" placeholder="New password" value={password} onChange={setPassword} />
        <Field icon={Lock} type="password" placeholder="Confirm password" value={confirm} onChange={setConfirm} />
        <button
          type="submit"
          disabled={busy || !ready}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-neu-sm hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          Update password
        </button>
      </form>
    </AuthShell>
  );
}
