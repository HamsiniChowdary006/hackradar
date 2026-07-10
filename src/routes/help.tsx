import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { HelpCircle } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — HackRadar" },
      { name: "description", content: "Frequently asked questions about HackRadar." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "How often is the feed updated?",
    a: "Our scraping pipeline refreshes multiple times a day. Individual platforms may update at different cadences.",
  },
  {
    q: "Can I register directly on HackRadar?",
    a: "No — HackRadar always links out to the original platform. Registration happens there.",
  },
  {
    q: "How do I suggest a hackathon we're missing?",
    a: "Use the Submit a Hackathon page. Every submission is manually reviewed before it goes live.",
  },
  {
    q: "Do you offer notifications?",
    a: "Not yet — this is on the roadmap. For now, bookmark hackathons on the Saved page.",
  },
];

function HelpPage() {
  const [search, setSearch] = useState("");
  return (
    <AppShell search={search} onSearch={setSearch}>
      <div className="max-w-3xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl grid place-items-center neu-card-sm text-primary">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
              Help
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">FAQ</h1>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="neu-card p-6">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="neu-card p-6 text-center">
          <p className="text-sm text-muted-foreground">Still stuck?</p>
          <Link
            to="/submit"
            className="inline-flex mt-3 items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Send us a hackathon or feedback →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
