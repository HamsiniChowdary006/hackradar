import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback — HackRadar" },
      {
        name: "description",
        content:
          "Send feedback, report a bug, or request a feature for HackRadar. Every message is read.",
      },
      { property: "og:title", content: "Feedback — HackRadar" },
      {
        property: "og:description",
        content: "Bug reports, feature requests, and general feedback for HackRadar.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://hackradar.lovable.app/feedback" }],
  }),
  component: FeedbackPage,
});

type FeedbackType = "bug" | "feature" | "general";

function FeedbackPage() {
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const [type, setType] = useState<FeedbackType>("general");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      toast.error("Please enter a message.");
      return;
    }
    if (trimmed.length > 5000) {
      toast.error("Message must be under 5000 characters.");
      return;
    }
    const trimmedEmail = email.trim();
    if (trimmedEmail && trimmedEmail.length > 255) {
      toast.error("Email is too long.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("feedback").insert({
      feedback_type: type,
      message: trimmed,
      email: trimmedEmail || null,
      user_id: user?.id ?? null,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Couldn't send feedback. Please try again.");
      return;
    }

    setSubmitted(true);
    setMessage("");
    setEmail("");
    setType("general");
  };

  return (
    <AppShell search={search} onSearch={setSearch}>
      <div className="max-w-2xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl grid place-items-center neu-card-sm text-primary">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
              Feedback
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Tell me what you think
            </h1>
          </div>
        </div>

        {submitted ? (
          <div className="neu-card p-8 space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl grid place-items-center neu-card-sm text-success">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Thanks for your feedback!</h2>
            <p className="text-sm text-muted-foreground">
              I read every message.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl neu-pressable text-sm font-semibold"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="neu-card p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-semibold">
                Feedback type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as FeedbackType)}
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-transparent text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="general">General Feedback</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-semibold">
                Message <span className="text-destructive">*</span>
              </label>
              <textarea
                id="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                maxLength={5000}
                placeholder="Tell me what's on your mind…"
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-transparent text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold">
                Email <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                placeholder="you@example.com — if you'd like a reply"
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-transparent text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-neu-sm hover:opacity-95 disabled:opacity-60 transition"
            >
              {submitting ? "Sending…" : "Send feedback"}
            </button>
          </form>
        )}
      </div>
    </AppShell>
  );
}
