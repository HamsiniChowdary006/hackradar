// Lovable Cloud Edge Function: fetch-unstop-hackathons
// Runs the Apify Unstop scraper actor at most once every 24h, dedupes results,
// and inserts new hackathons into the `hackathons` table.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const APIFY_ACTOR_ID =
  Deno.env.get("APIFY_UNSTOP_ACTOR_ID") ?? "trusted_offshoot~unstop-hackathon-scraper";
const SOURCE = "Unstop";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type ApifyItem = Record<string, unknown>;

interface HackathonInsert {
  title: string;
  description: string | null;
  source_platform: string;
  source_url: string;
  skill_level: string;
  mode: string;
  city: string | null;
  country: string | null;
  registration_deadline: string | null;
  event_start: string | null;
  event_end: string | null;
  tags: string[] | null;
  fee: string | null;
  scraped_at: string;
}

function pickString(obj: ApifyItem, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function toDate(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  const d = new Date(v);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function normalizeMode(v: string | null): string {
  if (!v) return "Online";
  const s = v.toLowerCase();
  if (s.includes("hybrid")) return "Hybrid";
  if (s.includes("in-person") || s.includes("offline") || s.includes("onsite")) return "Offline";
  return "Online";
}

function normalizeSkill(v: string | null): string {
  if (!v) return "Medium";
  const s = v.toLowerCase();
  if (s.includes("begin")) return "Beginner";
  if (s.includes("adv") || s.includes("expert")) return "Advanced";
  return "Medium";
}

function mapItem(item: ApifyItem): HackathonInsert | null {
  const title = pickString(item, "title", "name", "opportunity_title");
  const source_url = pickString(item, "url", "source_url", "link", "opportunity_url");
  if (!title || !source_url) return null;

  const tagsRaw = item.tags ?? item.themes ?? item.topics ?? item.categories;
  const tags = Array.isArray(tagsRaw)
    ? (tagsRaw.filter((t) => typeof t === "string") as string[])
    : null;

  return {
    title,
    description: pickString(item, "description", "summary", "about"),
    source_platform: SOURCE,
    source_url,
    skill_level: normalizeSkill(pickString(item, "skill_level", "difficulty", "level")),
    mode: normalizeMode(pickString(item, "mode", "location_type", "format", "type")),
    city: pickString(item, "city"),
    country: pickString(item, "country"),
    registration_deadline: toDate(
      item.registration_deadline ?? item.deadline ?? item.registrationDeadline ?? item.end_date,
    ),
    event_start: toDate(item.event_start ?? item.startDate ?? item.start_date),
    event_end: toDate(item.event_end ?? item.endDate ?? item.end_date),
    tags,
    fee: pickString(item, "fee", "price", "registration_fee"),
    scraped_at: new Date().toISOString(),
  };
}

async function runApifyActor(token: string): Promise<ApifyItem[]> {
  const url = `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${token}`;
  console.log(
    `Calling Apify API URL: https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=***`,
  );

  const runRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  if (!runRes.ok) {
    const text = await runRes.text();
    if (runRes.status === 404) {
      throw new Error(
        `Apify actor '${APIFY_ACTOR_ID}' not found (404). ` +
          `Verify the actor ID uses the 'username~actor-name' format and is published.`,
      );
    }
    throw new Error(`Apify run failed: ${runRes.status} ${text}`);
  }

  const data = await runRes.json();
  return Array.isArray(data) ? (data as ApifyItem[]) : [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    const APIFY_TOKEN = Deno.env.get("APIFY_API_TOKEN");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!APIFY_TOKEN || !SUPABASE_URL || !SERVICE_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing required environment variables" }),
        { status: 500, headers: jsonHeaders },
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // 1. 24-hour throttle check
    const { data: log } = await supabase
      .from("scrape_log")
      .select("last_run_at")
      .eq("source_platform", SOURCE)
      .maybeSingle();

    if (log?.last_run_at) {
      const hoursSince = (Date.now() - new Date(log.last_run_at).getTime()) / 36e5;
      if (hoursSince < 24) {
        const msg = "Skipped: already ran within 24 hours";
        console.log(msg, { hoursSince });
        return new Response(
          JSON.stringify({ skipped: true, reason: msg, hoursSince }),
          { headers: jsonHeaders },
        );
      }
    }

    // 2. Run Apify actor
    console.log(`Running Apify actor ${APIFY_ACTOR_ID}`);
    const items = await runApifyActor(APIFY_TOKEN);
    console.log(`Apify returned ${items.length} items`);

    // 3. Map + dedupe + insert
    let inserted = 0;
    let duplicates = 0;
    let invalid = 0;

    for (const raw of items) {
      const row = mapItem(raw);
      if (!row) {
        invalid++;
        continue;
      }

      const dupQuery = supabase
        .from("hackathons")
        .select("id")
        .eq("title", row.title)
        .limit(1);
      const { data: existing } = row.event_start
        ? await dupQuery.eq("event_start", row.event_start)
        : await dupQuery.is("event_start", null);

      if (existing && existing.length > 0) {
        duplicates++;
        continue;
      }

      const { error: insertErr } = await supabase.from("hackathons").insert(row);
      if (insertErr) {
        console.error("Insert failed", { title: row.title, error: insertErr.message });
        continue;
      }
      inserted++;
    }

    // 4. Update scrape_log
    const status = `ok: inserted=${inserted} duplicates=${duplicates} invalid=${invalid}`;
    await supabase.from("scrape_log").upsert({
      source_platform: SOURCE,
      last_run_at: new Date().toISOString(),
      last_run_status: status,
    });

    console.log(status);
    return new Response(
      JSON.stringify({
        skipped: false,
        inserted,
        duplicates,
        invalid,
        total: items.length,
      }),
      { headers: jsonHeaders },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("fetch-unstop-hackathons error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
});
