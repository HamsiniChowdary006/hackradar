import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { HackathonListing } from "@/components/hackathon-listing";
import { hackathonsQuery } from "@/lib/hackathons";
import { savedHackathonIdsQuery } from "@/lib/bookmarks";
import { useAuth } from "@/lib/auth-context";
import { Bookmark, Lock } from "lucide-react";

export const Route = createFileRoute("/saved")({
  loader: ({ context }) => context.queryClient.ensureQueryData(hackathonsQuery),
  head: () => ({
    meta: [
      { title: "Saved Hackathons — HackRadar" },
      {
        name: "description",
        content:
          "Your bookmarked hackathons in one place. Sign in once and your saved events sync across every device you use HackRadar on.",
      },
      { property: "og:title", content: "Saved Hackathons — HackRadar" },
      {
        property: "og:description",
        content: "Bookmarked hackathons that sync across every device.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hackradar.lovable.app/saved" },
    ],
    links: [{ rel: "canonical", href: "https://hackradar.lovable.app/saved" }],
  }),
  component: SavedPage,
});

function SavedPage() {
  const [search, setSearch] = useState("");
  const { user, openAuth, loading } = useAuth();
  const { data: savedIds = [] } = useQuery(savedHackathonIdsQuery(user?.id));

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

      {!loading && !user ? (
        <div className="neu-card p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 mx-auto rounded-2xl neu-card-sm grid place-items-center text-primary">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold">Log in to see saved hackathons</div>
            <p className="text-sm text-muted-foreground mt-1">
              Your bookmarks sync across every device you use.
            </p>
          </div>
          <button
            onClick={() => openAuth("signin")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-neu-sm hover:opacity-95"
          >
            Log in
          </button>
        </div>
      ) : savedIds.length === 0 ? (
        <div className="neu-card p-12 text-center space-y-3">
          <p className="text-muted-foreground">
            You haven't saved any hackathons yet.
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
