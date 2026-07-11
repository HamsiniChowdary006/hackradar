import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Radar, Settings as SettingsIcon, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { savedHackathonIdsQuery } from "@/lib/bookmarks";
import { hackathonsQuery, type Hackathon } from "@/lib/hackathons";
import { StatCard } from "@/components/stat-card";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — HackRadar" },
      { name: "description", content: "Your personalized HackRadar dashboard: saved hackathons, upcoming deadlines, and quick actions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [search, setSearch] = useState("");
  const { user, profile } = useAuth();
  const { data: saved = [] } = useQuery(savedHackathonIdsQuery(user?.id));
  const { data: all = [] as Hackathon[] } = useQuery(hackathonsQuery);

  const upcoming = all
    .filter((h) => h.registration_deadline && new Date(h.registration_deadline) >= new Date())
    .sort((a, b) => new Date(a.registration_deadline!).getTime() - new Date(b.registration_deadline!).getTime())
    .slice(0, 3);

  const name = profile?.display_name || user?.email?.split("@")[0] || "there";

  return (
    <AppShell search={search} onSearch={setSearch}>
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
          Dashboard
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome back, {name} 👋</h1>
        <p className="text-sm text-muted-foreground mt-2">Here's what's happening on HackRadar today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard label="Saved" value={saved.length.toString()} icon={Bookmark} accent="primary" />
        <StatCard label="Live now" value={all.filter((h) => h.is_active).length.toString()} icon={Radar} accent="success" />
        <StatCard label="Total tracked" value={all.length.toString()} icon={Sparkles} accent="warning" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="neu-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Closing soon</h2>
            <Link to="/browse" className="text-xs font-semibold text-primary hover:underline">Browse all</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((h) => (
                <li key={h.id} className="neu-inset px-4 py-3 rounded-2xl">
                  <div className="text-sm font-semibold truncate">{h.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Deadline {new Date(h.registration_deadline!).toLocaleDateString()} · {h.source_platform}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="neu-card p-6 space-y-4">
          <h2 className="text-lg font-bold">Quick actions</h2>
          <div className="grid gap-3">
            <QuickLink to="/saved" icon={Bookmark} label="Saved hackathons" desc="Your bookmarked events" />
            <QuickLink to="/settings" icon={SettingsIcon} label="Notification settings" desc="Tune your alerts and preferences" />
            <QuickLink to="/submit" icon={Sparkles} label="Submit a hackathon" desc="Share an event with the community" />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function QuickLink({ to, icon: Icon, label, desc }: { to: string; icon: typeof Bookmark; label: string; desc: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 neu-pressable px-4 py-3 rounded-2xl transition"
    >
      <div className="w-10 h-10 rounded-xl neu-card-sm grid place-items-center text-primary shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold truncate">{label}</div>
        <div className="text-xs text-muted-foreground truncate">{desc}</div>
      </div>
    </Link>
  );
}
