import { safeFetchJson, usePolledConnector } from "@/lib/connectors";
import type { Earthquake } from "@/hooks/useEarthquakes";

const EMSC_URL =
  "https://www.seismicportal.eu/fdsnws/event/1/query?format=json&limit=50" +
  "&minlat=27&maxlat=45&minlon=-19&maxlon=5";

interface EmscFeature {
  id: string;
  properties: {
    lat: number;
    lon: number;
    depth: number;
    mag: number;
    magtype?: string;
    time: string;
    flynn_region?: string;
    unid?: string;
  };
}

/** EMSC / seismicportal.eu — Iberia + Europe/Mediterranean coverage that USGS under-reports. */
export function useEmscQuakes(enabled = true, intervalMs = 300_000) {
  return usePolledConnector<Earthquake[]>(
    async (signal) => {
      const json = await safeFetchJson<{ features?: EmscFeature[] }>(EMSC_URL, {
        signal,
        timeoutMs: 9000,
      });
      return (json.features ?? []).map((f) => ({
        id: `emsc-${f.properties.unid ?? f.id}`,
        lat: f.properties.lat,
        lon: f.properties.lon,
        magnitude: f.properties.mag ?? 0,
        place: f.properties.flynn_region ?? "Europe / Mediterranean",
        time: new Date(f.properties.time).getTime(),
        depth: f.properties.depth ?? 0,
        url: `https://www.seismicportal.eu/eventdetails.html?unid=${f.properties.unid ?? ""}`,
      }));
    },
    [],
    intervalMs,
    enabled,
  );
}
