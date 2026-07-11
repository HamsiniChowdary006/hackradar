import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarClock, Globe2, MapPin, Radar } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { HackathonListing } from "@/components/hackathon-listing";
import { hackathonsQuery, daysUntil } from "@/lib/hackathons";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(hackathonsQuery),
  head: () => ({
    meta: [
      { title: "HackRadar — Every hackathon, one feed" },
      {
        name: "description",
        content:
          "Browse hackathons and tech events from Devpost, Unstop, HackerEarth, Devfolio, MLH, Eventbrite and Hack2Skill — filtered by skill level, mode, and location.",
      },
      { property: "og:title", content: "HackRadar — Every hackathon, one feed" },
      {
        property: "og:description",
        content: "One browsable, filterable feed of hackathons aggregated from every major platform.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hackradar.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://hackradar.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "HackRadar — Every hackathon, one feed",
          description:
            "Aggregated hackathons from Devpost, Unstop, HackerEarth, Devfolio, MLH, Eventbrite and Hack2Skill.",
          url: "https://hackradar.lovable.app/",
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [search, setSearch] = useState("");
  return (
    <AppShell search={search} onSearch={setSearch}>
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
            Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Every hackathon, one feed.
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">
            HackRadar aggregates hackathons and tech events from Devpost, Unstop, HackerEarth,
            Devfolio, MLH, Eventbrite and Hack2Skill — so you never miss an opportunity.
          </p>
        </div>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsRow />
      </Suspense>

      <div className="mt-10 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Upcoming hackathons</h2>
      </div>
      <Suspense fallback={<div className="neu-card p-10 text-center text-muted-foreground">Loading…</div>}>
        <HackathonListing search={search} />
      </Suspense>
    </AppShell>
  );
}

function StatsRow() {
  const { data } = useSuspenseQuery(hackathonsQuery);
  const hydrated = useHydrated();
  const total = data.length;
  const closingWeek = hydrated
    ? data.filter((h) => {
        const d = daysUntil(h.registration_deadline);
        return d !== null && d >= 0 && d <= 7;
      }).length
    : 0;
  const online = data.filter((h) => h.mode === "Online").length;
  const offline = data.filter((h) => h.mode === "Offline" || h.mode === "Hybrid").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      <StatCard label="Hackathons tracked" value={total} icon={Radar} trend="+12%" accent="primary" />
      <StatCard label="Closing this week" value={hydrated ? closingWeek : "—"} icon={CalendarClock} accent="warning" />
      <StatCard label="Online events" value={online} icon={Globe2} accent="success" />
      <StatCard label="Offline / hybrid" value={offline} icon={MapPin} accent="muted" />
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="neu-card p-6 h-32 animate-pulse" />
      ))}
    </div>
  );
}
