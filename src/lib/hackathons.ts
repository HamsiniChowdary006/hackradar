import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Hackathon = {
  id: string;
  title: string;
  description: string | null;
  source_platform: string;
  source_url: string;
  skill_level: "Beginner" | "Medium" | "Advanced";
  mode: "Online" | "Offline" | "Hybrid";
  city: string | null;
  country: string | null;
  registration_deadline: string | null;
  event_start: string | null;
  event_end: string | null;
  tags: string[] | null;
  fee: string | null;
  is_active: boolean;
  scraped_at: string | null;
  created_at: string;
};

export const SOURCE_PLATFORMS = [
  "Devpost",
  "Unstop",
  "HackerEarth",
  "Devfolio",
  "MLH",
  "Eventbrite",
  "Hack2Skill",
] as const;

export const hackathonsQuery = queryOptions({
  queryKey: ["hackathons"],
  queryFn: async (): Promise<Hackathon[]> => {
    const { data, error } = await supabase
      .from("hackathons" as never)
      .select("*")
      .eq("is_active", true)
      .order("registration_deadline", { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as Hackathon[];
  },
});

export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
