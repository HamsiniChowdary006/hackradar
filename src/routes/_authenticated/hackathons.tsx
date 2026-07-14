import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ExternalLink, MapPin, Calendar, Tag, Layers, Globe2, Clock } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { hackathonsQuery, daysUntil, type Hackathon } from "@/lib/hackathons";

export const Route = createFileRoute("/hackathons")({
  loader: ({ context }) => context.queryClient.ensureQueryData(hackathonsQuery),
  head: () => ({
    meta: [
      { title: "All Registered Hackathons — HackRadar" },
      {
        name: "description",
        content:
          "Full directory of every hackathon in HackRadar with dates, mode, location, skill level, tags, and direct links to the original registration page.",
      },
      { property: "og:title", content: "All Registered Hackathons — HackRadar" },
      {
        property: "og:description",
        content:
          "Every hackathon HackRadar has picked up, with full details and direct registration links.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hackradar.lovable.app/hackathons" },
    ],
    links: [{ rel: "canonical", href: "https://hackradar.lovable.app/hackathons" }],
  }),
  errorComponent: ({ error }) => (
    <AppShell>
      <div className="neu-card p-8 text-center text-destructive" role="alert">
        {error.message}
      </div>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <div className="neu-card p-8 text-center text-muted-foreground">No hackathons found.</div>
    </AppShell>
  ),
  component: HackathonsPage,
});

function HackathonsPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
          Directory
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          All registered hackathons
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Every hackathon in HackRadar with full details and a direct link to the source.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="neu-card p-10 text-center text-muted-foreground">Loading…</div>
        }
      >
        <HackathonList />
      </Suspense>
    </AppShell>
  );
}

function HackathonList() {
  const { data } = useSuspenseQuery(hackathonsQuery);

  if (data.length === 0) {
    return (
      <div className="neu-card p-10 text-center text-muted-foreground">
        No hackathons yet — check back soon.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{data.length}</span> hackathons
      </div>
      <ul className="space-y-4">
        {data.map((h) => (
          <li key={h.id}>
            <HackathonRow h={h} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function HackathonRow({ h }: { h: Hackathon }) {
  const dLeft = daysUntil(h.registration_deadline);
  const location = [h.city, h.country].filter(Boolean).join(", ") || h.mode;

  return (
    <article className="neu-card p-6 md:p-7 space-y-4">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
            <span className="px-2.5 py-1 rounded-full neu-card-sm text-primary">
              {h.source_platform}
            </span>
            <span className="px-2.5 py-1 rounded-full neu-card-sm">{h.skill_level}</span>
            <span className="px-2.5 py-1 rounded-full neu-card-sm">{h.mode}</span>
            {!h.is_active && (
              <span className="px-2.5 py-1 rounded-full neu-card-sm text-destructive">
                Inactive
              </span>
            )}
          </div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight leading-snug">
            {h.title}
          </h2>
        </div>
        <a
          href={h.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-neu-sm hover:opacity-95 shrink-0"
        >
          Visit <ExternalLink className="w-4 h-4" />
        </a>
      </header>

      {h.description && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {h.description}
        </p>
      )}

      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
        <Detail icon={MapPin} label="Location" value={location} />
        <Detail
          icon={Calendar}
          label="Event"
          value={formatRange(h.event_start, h.event_end)}
        />
        <Detail
          icon={Clock}
          label="Registration"
          value={
            h.registration_deadline
              ? `${formatDate(h.registration_deadline)}${
                  dLeft !== null && dLeft >= 0 ? ` · ${dLeft}d left` : ""
                }`
              : "—"
          }
        />
        <Detail icon={Layers} label="Fee" value={h.fee || "Free"} />
      </dl>

      {h.tags && h.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
          {h.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-medium px-2.5 py-1 rounded-full neu-card-sm text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <footer className="flex items-center justify-between gap-4 pt-2 border-t border-border/60 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5" />
          <a
            href={h.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground hover:underline truncate max-w-[60vw]"
          >
            {h.source_url}
          </a>
        </span>
        {h.scraped_at && <span>Updated {formatDate(h.scraped_at)}</span>}
      </footer>
    </article>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="neu-inset p-3 rounded-xl">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="text-sm font-medium truncate">{value}</div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso.length <= 10 ? iso + "T00:00:00" : iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatRange(start: string | null, end: string | null): string {
  if (!start && !end) return "—";
  if (start && end) return `${formatDate(start)} → ${formatDate(end)}`;
  return formatDate((start || end)!);
}
