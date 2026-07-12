import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { SOURCE_PLATFORMS } from "@/lib/hackathons";
import { Radar, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About HackRadar — Tracking hackathons across major platforms" },
      {
        name: "description",
        content:
          "HackRadar is a single feed for hackathons and tech events pulled from Devpost, Unstop, HackerEarth, Devfolio, MLH, Eventbrite and Hack2Skill — so developers never miss an opportunity.",
      },
      { property: "og:title", content: "About HackRadar — Tracking hackathons across major platforms" },
      {
        property: "og:description",
        content:
          "How HackRadar aggregates hackathons from every major platform into one clean, filterable feed.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hackradar.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://hackradar.lovable.app/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [search, setSearch] = useState("");
  return (
    <AppShell search={search} onSearch={setSearch}>
      <div className="max-w-3xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl grid place-items-center neu-card-sm text-primary">
            <Radar className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
              About
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              About HackRadar — Tracking hackathons across major platforms
            </h1>
          </div>
        </div>

        <div className="neu-card p-6 md:p-8 space-y-4">
          <p className="text-base leading-relaxed">
            HackRadar tracks hackathons across major platforms so you never miss an opportunity.
            One clean feed, filterable by skill, mode, and location — so you spend less time
            googling and more time building.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is a passion project. It's not affiliated with any of the source platforms — we
            just point you to the original listing so you can register there directly.
          </p>
        </div>

        <div className="neu-card p-6 md:p-8">
          <h2 className="text-sm uppercase tracking-widest font-bold text-muted-foreground mb-4">
            Sources tracked
          </h2>
          <div className="flex flex-wrap gap-2">
            {SOURCE_PLATFORMS.map((s) => (
              <span
                key={s}
                className="text-sm font-semibold px-4 py-2 rounded-full neu-card-sm text-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="neu-card p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl grid place-items-center neu-card-sm text-primary shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold">Got feedback?</h2>
              <p className="text-sm text-muted-foreground">
                Bug, feature idea, or just a note — I read every message.
              </p>
            </div>
          </div>
          <Link
            to="/feedback"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-neu-sm hover:opacity-95 shrink-0"
          >
            Send feedback
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
