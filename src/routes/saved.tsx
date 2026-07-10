import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { HackathonListing } from "@/components/hackathon-listing";
import { hackathonsQuery } from "@/lib/hackathons";
import { Bookmark } from "lucide-react";

export const Route = createFileRoute("/saved")({
  loader: ({ context }) => context.queryClient.ensureQueryData(hackathonsQuery),
  head: () => ({
    meta: [
      { title: "Saved Hackathons — HackRadar" },
      { name: "description", content: "Your bookmarked hackathons." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hackradar-saved");
      if (raw) setSavedIds(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <AppShell search={search} onSearch={setSearch}>
      <div className="mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl grid place-items-center neu-card-sm text-primary">
          <Bookmark className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Saved</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hackathons you've bookmarked for later.
          </p>
        </div>
      </div>
      {savedIds.length === 0 ? (
        <div className="neu-card p-12 text-center space-y-3">
          <p className="text-muted-foreground">
            You haven't saved any hackathons yet. Bookmarks sync locally to this device.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Browse hackathons →
          </Link>
        </div>
      ) : (
        <Suspense fallback={<div className="neu-card p-10 text-center text-muted-foreground">Loading…</div>}>
          <HackathonListing
            search={search}
            filterFn={(h) => savedIds.includes(h.id)}
            emptyLabel="No saved hackathons match your filters."
          />
        </Suspense>
      )}
    </AppShell>
  );
}
