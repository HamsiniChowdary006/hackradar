import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { HackathonListing } from "@/components/hackathon-listing";
import { hackathonsQuery } from "@/lib/hackathons";

export const Route = createFileRoute("/browse")({
  loader: ({ context }) => context.queryClient.ensureQueryData(hackathonsQuery),
  head: () => ({
    meta: [
      { title: "Browse Hackathons — HackRadar" },
      { name: "description", content: "Filter hackathons by skill level, mode, location and platform." },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const [search, setSearch] = useState("");
  return (
    <AppShell search={search} onSearch={setSearch}>
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
          Browse
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">All hackathons</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Filter across every source and find your next build.
        </p>
      </div>
      <Suspense fallback={<div className="neu-card p-10 text-center text-muted-foreground">Loading…</div>}>
        <HackathonListing search={search} />
      </Suspense>
    </AppShell>
  );
}
