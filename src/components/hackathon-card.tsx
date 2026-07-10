import { Bookmark, Calendar, ExternalLink, MapPin, Radio } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { daysUntil, type Hackathon } from "@/lib/hackathons";
import { savedHackathonIdsQuery, toggleBookmark } from "@/lib/bookmarks";
import { useAuth } from "@/lib/auth-context";
import { useHydrated } from "@/lib/use-hydrated";

const skillColor: Record<string, string> = {
  Beginner: "bg-success/15 text-success",
  Medium: "bg-warning/15 text-warning",
  Advanced: "bg-primary/15 text-primary",
};

const modeIcon: Record<string, string> = {
  Online: "🌐",
  Offline: "📍",
  Hybrid: "🔀",
};

export function HackathonCard({
  h,
  onOpen,
}: {
  h: Hackathon;
  onOpen: (h: Hackathon) => void;
}) {
  const hydrated = useHydrated();
  const { user, openAuth } = useAuth();
  const qc = useQueryClient();
  const { data: savedIds = [] } = useQuery(savedHackathonIdsQuery(user?.id));
  const isSaved = savedIds.includes(h.id);

  const days = hydrated ? daysUntil(h.registration_deadline) : null;
  const location =
    h.mode === "Online" ? "Online" : [h.city, h.country].filter(Boolean).join(", ") || "TBA";

  const deadlineChip =
    days === null
      ? null
      : days < 0
        ? { label: "Closed", cls: "bg-muted text-muted-foreground" }
        : days === 0
          ? { label: "Closes today", cls: "bg-destructive/15 text-destructive" }
          : days <= 3
            ? { label: `${days}d left`, cls: "bg-destructive/15 text-destructive" }
            : days <= 7
              ? { label: `${days}d left`, cls: "bg-warning/15 text-warning" }
              : { label: `${days}d left`, cls: "bg-success/15 text-success" };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return openAuth("signin");
    try {
      await toggleBookmark(user.id, h.id, isSaved);
      qc.invalidateQueries({ queryKey: ["saved-hackathons"] });
      toast.success(isSaved ? "Removed from saved" : "Saved!");
    } catch (err) {
      toast.error("Couldn't update bookmark.");
    }
  };

  return (
    <article className="neu-card p-6 flex flex-col gap-4 h-full">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full neu-card-sm text-muted-foreground">
          {h.source_platform}
        </span>
        <div className="flex items-center gap-2">
          {deadlineChip && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${deadlineChip.cls}`}>
              {deadlineChip.label}
            </span>
          )}
          <button
            onClick={handleBookmark}
            aria-label={isSaved ? "Remove bookmark" : "Save hackathon"}
            className={
              "w-8 h-8 rounded-xl grid place-items-center neu-pressable transition " +
              (isSaved ? "text-primary" : "text-muted-foreground")
            }
          >
            <Bookmark className={"w-4 h-4 " + (isSaved ? "fill-current" : "")} />
          </button>
        </div>
      </div>

      <button onClick={() => onOpen(h)} className="text-left group min-w-0">
        <h3 className="text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {h.title}
        </h3>
        {h.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{h.description}</p>
        )}
      </button>

      <div className="flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${skillColor[h.skill_level]}`}
        >
          {h.skill_level}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
          <Radio className="w-3 h-3" /> {modeIcon[h.mode]} {h.mode}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground mt-auto pt-2 border-t border-border/60">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
        {h.event_start && (
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{formatRange(h.event_start, h.event_end)}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onOpen(h)}
          className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-xl neu-pressable"
        >
          View Details
        </button>
        <a
          href={h.source_url}
          target="_blank"
          rel="noreferrer noopener"
          className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-primary text-primary-foreground grid place-items-center hover:opacity-95 transition"
          aria-label="Open source"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}

function formatRange(start: string, end: string | null) {
  const s = new Date(start + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", timeZone: "UTC" };
  const sStr = s.toLocaleDateString("en-US", opts);
  if (!end || end === start) return sStr;
  const e = new Date(end + "T00:00:00");
  return `${sStr} – ${e.toLocaleDateString("en-US", opts)}`;
}
