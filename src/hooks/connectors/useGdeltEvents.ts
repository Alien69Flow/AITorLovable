import { safeFetchJson, usePolledConnector } from "@/lib/connectors";

export interface GdeltEvent {
  id: string;
  title: string;
  url: string;
  domain: string;
  lat: number;
  lon: number;
  location: string;
  date: string;
}

const GDELT_URL =
  "https://api.gdeltproject.org/api/v2/doc/doc?query=sourcelang:eng&mode=artlist" +
  "&format=geojson&maxrecords=100&timespan=24h";

interface GdeltGeoJson {
  features?: {
    properties?: {
      name?: string;
      html?: string;
      urltone?: number;
      shareimage?: string;
      url?: string;
      domain?: string;
      seendate?: string;
    };
    geometry?: { coordinates?: [number, number] };
  }[];
}

function extractUrl(html?: string, fallback?: string): string {
  if (fallback) return fallback;
  const m = html?.match(/href="([^"]+)"/);
  return m?.[1] ?? "";
}

function extractTitle(html?: string, name?: string): string {
  const m = html?.match(/>([^<]+)<\/a>/);
  return (m?.[1] ?? name ?? "GDELT event").trim();
}

/** GDELT 2.0 geolocated news events (24h window). */
export function useGdeltEvents(enabled: boolean, intervalMs = 600_000) {
  return usePolledConnector<GdeltEvent[]>(
    async (signal) => {
      const json = await safeFetchJson<GdeltGeoJson>(GDELT_URL, { signal, timeoutMs: 12000 });
      const out: GdeltEvent[] = [];
      (json.features ?? []).forEach((f, i) => {
        const c = f.geometry?.coordinates;
        if (!c || !Number.isFinite(c[0]) || !Number.isFinite(c[1])) return;
        out.push({
          id: `gdelt-${i}`,
          title: extractTitle(f.properties?.html, f.properties?.name),
          url: extractUrl(f.properties?.html, f.properties?.url),
          domain: f.properties?.domain ?? "gdeltproject.org",
          lat: c[1],
          lon: c[0],
          location: f.properties?.name ?? "",
          date: f.properties?.seendate ?? "",
        });
      });
      if (!out.length) throw new Error("no geolocated articles");
      return out;
    },
    [],
    intervalMs,
    enabled,
  );
}
