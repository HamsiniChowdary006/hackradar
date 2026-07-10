import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const savedHackathonIdsQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["saved-hackathons", userId ?? "anon"],
    enabled: !!userId,
    queryFn: async (): Promise<string[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("saved_hackathons")
        .select("hackathon_id")
        .eq("user_id", userId);
      if (error) throw error;
      return (data ?? []).map((r: { hackathon_id: string }) => r.hackathon_id);
    },
  });

export async function toggleBookmark(userId: string, hackathonId: string, isSaved: boolean) {
  if (isSaved) {
    const { error } = await supabase
      .from("saved_hackathons")
      .delete()
      .eq("user_id", userId)
      .eq("hackathon_id", hackathonId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("saved_hackathons")
      .insert({ user_id: userId, hackathon_id: hackathonId });
    if (error) throw error;
  }
}
