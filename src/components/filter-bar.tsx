import { X } from "lucide-react";
import { SOURCE_PLATFORMS } from "@/lib/hackathons";

export type Filters = {
  skill: "All" | "Beginner" | "Medium" | "Advanced";
  mode: "All" | "Online" | "Offline" | "Hybrid";
  location: string;
  platforms: string[];
  sort: "deadline" | "newest";
};

export const defaultFilters: Filters = {
  skill: "All",
  mode: "All",
  location: "",
  platforms: [],
  sort: "deadline",
};

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const togglePlatform = (p: string) =>
    update({
      platforms: filters.platforms.includes(p)
        ? filters.platforms.filter((x) => x !== p)
        : [...filters.platforms, p],
    });

  return (
    <div className="neu-card p-5 md:p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <PillGroup
          label="Skill"
          options={["All", "Beginner", "Medium", "Advanced"]}
          value={filters.skill}
          onSelect={(v) => update({ skill: v as Filters["skill"] })}
        />
        <PillGroup
          label="Mode"
          options={["All", "Online", "Offline", "Hybrid"]}
          value={filters.mode}
          onSelect={(v) => update({ mode: v as Filters["mode"] })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
        {filters.mode !== "Online" && (
          <div className="neu-inset px-4 py-2.5">
            <input
              type="text"
              placeholder="Filter by city or country..."
              value={filters.location}
              onChange={(e) => update({ location: e.target.value })}
              className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
          </div>
        )}
        <div className="flex items-center gap-2 md:justify-end">
          <span className="text-xs text-muted-foreground font-medium">Sort:</span>
          <div className="neu-inset flex text-xs font-semibold p-1 rounded-xl">
            {(["deadline", "newest"] as const).map((s) => (
              <button
                key={s}
                onClick={() => update({ sort: s })}
                className={
                  "px-3 py-1.5 rounded-lg transition " +
                  (filters.sort === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground")
                }
              >
                {s === "deadline" ? "Deadline" : "Newest"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
          Source platform
        </div>
        <div className="flex flex-wrap gap-2">
          {SOURCE_PLATFORMS.map((p) => {
            const active = filters.platforms.includes(p);
            return (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={
                  "text-xs font-semibold px-3.5 py-1.5 rounded-full transition " +
                  (active
                    ? "bg-primary text-primary-foreground shadow-neu-sm"
                    : "neu-card-sm text-muted-foreground hover:text-foreground")
                }
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onChange(defaultFilters)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
        >
          <X className="w-3.5 h-3.5" /> Clear all filters
        </button>
      </div>
    </div>
  );
}

function PillGroup({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground shrink-0">
        {label}
      </span>
      <div className="neu-inset flex text-xs font-semibold p-1 rounded-xl overflow-x-auto">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={
              "px-3 py-1.5 rounded-lg transition whitespace-nowrap " +
              (value === opt
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground")
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
