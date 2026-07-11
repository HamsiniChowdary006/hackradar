import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { SOURCE_PLATFORMS } from "@/lib/hackathons";
import { Lock, Send } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit a Hackathon — HackRadar" },
      {
        name: "description",
        content:
          "Suggest a hackathon we're missing. Every submission is manually reviewed by the HackRadar team before it goes live in the public feed.",
      },
      { property: "og:title", content: "Submit a Hackathon — HackRadar" },
      {
        property: "og:description",
        content: "Send us hackathons and tech events to add to the HackRadar feed.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hackradar.lovable.app/submit" },
    ],
    links: [{ rel: "canonical", href: "https://hackradar.lovable.app/submit" }],
  }),
  component: SubmitPage,
});

function SubmitPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user, openAuth, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    source_url: "",
    source_platform: "Devpost",
    description: "",
    skill_level: "Beginner",
    mode: "Online",
    city: "",
    country: "",
    registration_deadline: "",
    event_start: "",
    event_end: "",
    tags: "",
    fee: "Free",
    submitter_email: "",
  });

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.source_url.trim()) {
      toast.error("Title and source URL are required.");
      return;
    }
    setSubmitting(true);
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      registration_deadline: form.registration_deadline || null,
      event_start: form.event_start || null,
      event_end: form.event_end || null,
      city: form.city || null,
      country: form.country || null,
      description: form.description || null,
      submitter_email: form.submitter_email || null,
      submitted_by: user?.id ?? null,
    };
    const { error } = await supabase.from("pending_submissions" as never).insert(payload as never);
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't submit. " + error.message);
      return;
    }
    toast.success("Thanks! Your submission is queued for review.");
    navigate({ to: "/" });
  };

  if (!loading && !user) {
    return (
      <AppShell search={search} onSearch={setSearch}>
        <div className="neu-card p-12 text-center space-y-4 max-w-lg mx-auto mt-10">
          <div className="w-14 h-14 mx-auto rounded-2xl neu-card-sm grid place-items-center text-primary">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold">Log in to submit a hackathon</div>
            <p className="text-sm text-muted-foreground mt-1">
              Signed-in submissions help us keep spam out and follow up with you.
            </p>
          </div>
          <button
            onClick={() => openAuth("signin")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-neu-sm hover:opacity-95"
          >
            Log in to continue
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell search={search} onSearch={setSearch}>
      <div className="mb-8 max-w-2xl">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
          Contribute
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Submit a hackathon</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Know of a great event we're missing? Send it in — we manually review every submission.
        </p>
      </div>


      <form onSubmit={onSubmit} className="neu-card p-6 md:p-8 space-y-5 max-w-3xl">
        <Field label="Hackathon title *" htmlFor="submit-title">
          <Input id="submit-title" value={form.title} onChange={(v) => update("title", v)} placeholder="AI Frontier Hack 2026" />
        </Field>
        <Field label="Source URL *" htmlFor="submit-source-url">
          <Input id="submit-source-url" value={form.source_url} onChange={(v) => update("source_url", v)} placeholder="https://..." />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Source platform" htmlFor="submit-platform">
            <Select
              id="submit-platform"
              value={form.source_platform}
              onChange={(v) => update("source_platform", v)}
              options={[...SOURCE_PLATFORMS, "Other"]}
            />
          </Field>
          <Field label="Skill level" htmlFor="submit-skill">
            <Select
              id="submit-skill"
              value={form.skill_level}
              onChange={(v) => update("skill_level", v)}
              options={["Beginner", "Medium", "Advanced"]}
            />
          </Field>
          <Field label="Mode" htmlFor="submit-mode">
            <Select
              id="submit-mode"
              value={form.mode}
              onChange={(v) => update("mode", v)}
              options={["Online", "Offline", "Hybrid"]}
            />
          </Field>
          <Field label="Fee" htmlFor="submit-fee">
            <Input id="submit-fee" value={form.fee} onChange={(v) => update("fee", v)} placeholder="Free" />
          </Field>
          <Field label="City" htmlFor="submit-city">
            <Input id="submit-city" value={form.city} onChange={(v) => update("city", v)} placeholder="Bengaluru" />
          </Field>
          <Field label="Country" htmlFor="submit-country">
            <Input id="submit-country" value={form.country} onChange={(v) => update("country", v)} placeholder="India" />
          </Field>
          <Field label="Registration deadline" htmlFor="submit-deadline">
            <Input id="submit-deadline" type="date" value={form.registration_deadline} onChange={(v) => update("registration_deadline", v)} />
          </Field>
          <Field label="Event start" htmlFor="submit-start">
            <Input id="submit-start" type="date" value={form.event_start} onChange={(v) => update("event_start", v)} />
          </Field>
          <Field label="Event end" htmlFor="submit-end">
            <Input id="submit-end" type="date" value={form.event_end} onChange={(v) => update("event_end", v)} />
          </Field>
          <Field label="Your email (optional)" htmlFor="submit-email">
            <Input
              id="submit-email"
              type="email"
              value={form.submitter_email}
              onChange={(v) => update("submitter_email", v)}
              placeholder="you@domain.com"
            />
          </Field>
        </div>
        <Field label="Tags (comma-separated)" htmlFor="submit-tags">
          <Input id="submit-tags" value={form.tags} onChange={(v) => update("tags", v)} placeholder="AI, Web3, Climate" />
        </Field>
        <Field label="Description" htmlFor="submit-description">
          <textarea
            id="submit-description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground neu-inset px-4 py-3 rounded-2xl"
            placeholder="What's this hackathon about?"
          />
        </Field>
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-neu-sm hover:opacity-95 disabled:opacity-60 transition"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Submitting…" : "Submit for review"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}

function Field({ label, children, htmlFor }: { label: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="neu-inset px-4 py-2.5">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
      />
    </div>
  );
}

function Select({
  id,
  value,
  onChange,
  options,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="neu-inset px-3 py-2">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent outline-none text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-background text-foreground">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
