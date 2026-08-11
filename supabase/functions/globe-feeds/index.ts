// Aggregated public globe feeds (internet outages).
import { guardPublic } from "../_shared/guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const IODA = "https://api.ioda.inetintel.cc.gatech.edu/v2/outages/summary";

async function outages() {
  const until = Math.floor(Date.now() / 1000);
  const from = until - 24 * 3600;
  const res = await fetch(
    `${IODA}?from=${from}&until=${until}&entityType=country&limit=40`,
    { signal: AbortSignal.timeout(9000) },
  );
  if (!res.ok) throw new Error(`IODA ${res.status}`);
  const json = await res.json();
  return (json?.data ?? [])
    .filter((d: any) => d?.entity?.code && (d?.event_cnt ?? 0) > 0)
    .map((d: any) => ({
      code: String(d.entity.code).toUpperCase(),
      name: d.entity.name as string,
      events: d.event_cnt as number,
      score: Math.round(d?.scores?.overall ?? 0),
    }));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const blocked = guardPublic(req, corsHeaders, 60);
  if (blocked) return blocked;

  const feed = new URL(req.url).searchParams.get("feed") ?? "outages";
  try {
    if (feed !== "outages") {
      return new Response(JSON.stringify({ error: "unknown feed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await outages();
    return new Response(JSON.stringify({ outages: data, timestamp: new Date().toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=600" },
    });
  } catch (err) {
    console.error("globe-feeds error:", err);
    return new Response(
      JSON.stringify({ outages: [], error: String(err).slice(0, 200), timestamp: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});