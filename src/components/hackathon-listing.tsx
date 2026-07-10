import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { hackathonsQuery, type Hackathon } from "@/lib/hackathons";
import { HackathonCard } from "./hackathon-card";
import { FilterBar, defaultFilters, type Filters } from "./filter-bar";
import { HackathonDetailModal } from "./hackathon-detail-modal";

export function HackathonListing({
  search,
  filterFn,
  emptyLabel = "No hackathons match your filters.",
}: {
  search: string;
  filterFn?: (h: Hackathon) => boolean;
  emptyLabel?: string;
}) {
  const { data } = useSuspenseQuery(hackathonsQuery);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selected, setSelected] = useState<Hackathon | null>(null);

  const filtered = useMemo(() => {
    let list = data;
    if (filterFn) list = list.filter(filterFn);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          (h.description ?? "").toLowerCase().includes(q) ||
          (h.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
          (h.city ?? "").toLowerCase().includes(q) ||
          (h.country ?? "").toLowerCase().includes(q),
      );
    }
    if (filters.skill !== "All") list = list.filter((h) => h.skill_level === filters.skill);
    if (filters.mode !== "All") list = list.filter((h) => h.mode === filters.mode);
    if (filters.location.trim()) {
      const q = filters.location.toLowerCase();
      list = list.filter(
        (h) =>
          (h.city ?? "").toLowerCase().includes(q) ||
          (h.country ?? "").toLowerCase().includes(q),
      );
    }
    if (filters.platforms.length)
      list = list.filter((h) => filters.platforms.includes(h.source_platform));
    if (filters.sort === "deadline") {
      list = [...list].sort((a, b) =>
        (a.registration_deadline ?? "9999").localeCompare(b.registration_deadline ?? "9999"),
      );
    } else {
      list = [...list].sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    return list;
  }, [data, filters, search, filterFn]);

  return (
    <div className="space-y-6">
      <FilterBar filters={filters} onChange={setFilters} />
      {filtered.length === 0 ? (
        <div className="neu-card p-12 text-center text-muted-foreground">{emptyLabel}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {filtered.map((h) => (
            <HackathonCard key={h.id} h={h} onOpen={setSelected} />
          ))}
        </div>
      )}
      <HackathonDetailModal
        hackathon={selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </div>
  );
}
