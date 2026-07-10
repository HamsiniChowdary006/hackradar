import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bell, CalendarClock, Loader2, Lock, User as UserIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Switch } from "@/components/ui/switch";

type Prefs = {
  user_id: string;
  skill_levels: string[];
  modes: string[];
  preferred_location: string | null;
  deadline_reminders_enabled: boolean;
};

const prefsQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["notification-prefs", userId ?? "anon"],
    enabled: !!userId,
    queryFn: async (): Promise<Prefs | null> => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data as Prefs | null;
    },
  });

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — HackRadar" },
      { name: "description", content: "Manage your profile and notification preferences." },
    ],
  }),
  component: SettingsPage,
});

const SKILLS = ["Beginner", "Medium", "Advanced"] as const;
const MODES = ["Online", "Offline", "Hybrid"] as const;

function SettingsPage() {
  const [search, setSearch] = useState("");
  const { user, profile, openAuth, loading } = useAuth();
  const qc = useQueryClient();
  const { data: prefs } = useQuery(prefsQuery(user?.id));

  const [displayName, setDisplayName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const [skillLevels, setSkillLevels] = useState<string[]>([]);
  const [modes, setModes] = useState<string[]>([]);
  const [preferredLocation, setPreferredLocation] = useState("");
  const [deadlineReminders, setDeadlineReminders] = useState(true);

  useEffect(() => {
    if (profile) setDisplayName(profile.display_name ?? "");
  }, [profile]);

  useEffect(() => {
    if (prefs) {
      setSkillLevels(prefs.skill_levels);
      setModes(prefs.modes);
      setPreferredLocation(prefs.preferred_location ?? "");
      setDeadlineReminders(prefs.deadline_reminders_enabled);
    }
  }, [prefs]);

  const toggle = (list: string[], v: string, set: (l: string[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() || null })
      .eq("id", user.id);
    setSavingProfile(false);
    if (error) return toast.error("Couldn't save profile.");
    qc.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Profile updated.");
  };

  const savePrefs = async () => {
    if (!user) return;
    setSavingPrefs(true);
    const { error } = await supabase.from("notification_preferences").upsert({
      user_id: user.id,
      skill_levels: skillLevels,
      modes,
      preferred_location: preferredLocation.trim() || null,
      deadline_reminders_enabled: deadlineReminders,
    });
    setSavingPrefs(false);
    if (error) return toast.error("Couldn't save preferences.");
    qc.invalidateQueries({ queryKey: ["notification-prefs"] });
    toast.success("Preferences saved.");
  };

  if (!loading && !user) {
    return (
      <AppShell search={search} onSearch={setSearch}>
        <div className="neu-card p-12 text-center space-y-4 max-w-lg mx-auto mt-10">
          <div className="w-14 h-14 mx-auto rounded-2xl neu-card-sm grid place-items-center text-primary">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold">Log in to manage settings</div>
            <p className="text-sm text-muted-foreground mt-1">
              Personalize your feed and control notifications.
            </p>
          </div>
          <button
            onClick={() => openAuth("signin")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-neu-sm hover:opacity-95"
          >
            Log in
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell search={search} onSearch={setSearch}>
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
          Account
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid gap-6 max-w-3xl">
        {/* Profile */}
        <section className="neu-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-card-sm grid place-items-center text-primary">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Profile</h2>
              <p className="text-xs text-muted-foreground">How you appear in HackRadar.</p>
            </div>
          </div>
          <div className="grid gap-3">
            <label className="text-xs font-semibold text-muted-foreground">Email</label>
            <div className="neu-inset px-4 py-3 text-sm text-muted-foreground">{user?.email}</div>
            <label className="text-xs font-semibold text-muted-foreground mt-2">Display name</label>
            <div className="neu-inset px-4 py-3">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            <button
              onClick={saveProfile}
              disabled={savingProfile}
              className="mt-2 self-start px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-neu-sm hover:opacity-95 disabled:opacity-60 flex items-center gap-2"
            >
              {savingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
              Save profile
            </button>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="neu-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-card-sm grid place-items-center text-primary">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Notification preferences</h2>
              <p className="text-xs text-muted-foreground">Choose what shows up in your bell.</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Skill levels
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(skillLevels, s, setSkillLevels)}
                  className={
                    "px-4 py-2 rounded-xl text-sm font-semibold transition " +
                    (skillLevels.includes(s)
                      ? "bg-primary text-primary-foreground shadow-neu-sm"
                      : "neu-pressable text-muted-foreground")
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Modes
            </div>
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => toggle(modes, m, setModes)}
                  className={
                    "px-4 py-2 rounded-xl text-sm font-semibold transition " +
                    (modes.includes(m)
                      ? "bg-primary text-primary-foreground shadow-neu-sm"
                      : "neu-pressable text-muted-foreground")
                  }
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Preferred location
            </label>
            <div className="neu-inset px-4 py-3">
              <input
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. Bengaluru, San Francisco"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between neu-inset px-4 py-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <CalendarClock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-semibold">Deadline reminders</div>
                <div className="text-xs text-muted-foreground">
                  Alerts 2–3 days before a bookmarked hackathon closes.
                </div>
              </div>
            </div>
            <Switch checked={deadlineReminders} onCheckedChange={setDeadlineReminders} />
          </div>

          <button
            onClick={savePrefs}
            disabled={savingPrefs}
            className="self-start px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-neu-sm hover:opacity-95 disabled:opacity-60 flex items-center gap-2"
          >
            {savingPrefs && <Loader2 className="w-4 h-4 animate-spin" />}
            Save preferences
          </button>
        </section>
      </div>
    </AppShell>
  );
}
