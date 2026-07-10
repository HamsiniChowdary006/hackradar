import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, ExternalLink, MapPin, Tag, Wallet } from "lucide-react";
import { daysUntil, type Hackathon } from "@/lib/hackathons";

export function HackathonDetailModal({
  hackathon,
  onOpenChange,
}: {
  hackathon: Hackathon | null;
  onOpenChange: (open: boolean) => void;
}) {
  const open = !!hackathon;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl neu-card border-0 p-0 overflow-hidden">
        {hackathon && (
          <div className="p-6 md:p-8 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                {hackathon.source_platform}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary">
                {hackathon.skill_level}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                {hackathon.mode}
              </span>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl leading-tight">{hackathon.title}</DialogTitle>
            </DialogHeader>
            {hackathon.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {hackathon.description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow
                icon={MapPin}
                label="Location"
                value={
                  hackathon.mode === "Online"
                    ? "Online"
                    : [hackathon.city, hackathon.country].filter(Boolean).join(", ") || "TBA"
                }
              />
              <InfoRow
                icon={Calendar}
                label="Event dates"
                value={
                  hackathon.event_start
                    ? formatDate(hackathon.event_start) +
                      (hackathon.event_end && hackathon.event_end !== hackathon.event_start
                        ? ` → ${formatDate(hackathon.event_end)}`
                        : "")
                    : "TBA"
                }
              />
              <InfoRow
                icon={Calendar}
                label="Registration deadline"
                value={
                  hackathon.registration_deadline
                    ? `${formatDate(hackathon.registration_deadline)} · ${
                        daysUntil(hackathon.registration_deadline) ?? 0
                      } days left`
                    : "Rolling"
                }
              />
              <InfoRow icon={Wallet} label="Fee" value={hackathon.fee ?? "Free"} />
            </div>

            {hackathon.tags && hackathon.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Tag className="w-3.5 h-3.5" /> Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {hackathon.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <a
              href={hackathon.source_url}
              target="_blank"
              rel="noreferrer noopener"
              className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3.5 rounded-2xl bg-primary text-primary-foreground shadow-neu-sm hover:opacity-95 transition"
            >
              Go to {hackathon.source_platform}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="neu-inset px-4 py-3">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <div className="text-sm font-semibold mt-1 truncate">{value}</div>
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
