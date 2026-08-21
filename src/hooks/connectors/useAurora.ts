import { safeFetchJson, usePolledConnector } from "@/lib/connectors";

export interface AuroraCell {
  lat: number;
  lon: number;
  /** Aurora probability 0-100 */
  probability: number;
}

export interface AuroraMesh {
  observationTime: string;
  forecastTime: string;
  cells: AuroraCell[];
}

const OVATION_URL = "https://services.swpc.noaa.gov/json/ovation_aurora_latest.json";

interface OvationResponse {
  "Observation Time": string;
  "Forecast Time": string;
  coordinates: [number, number, number][];
}

const EMPTY: AuroraMesh = { observationTime: "", forecastTime: "", cells: [] };

/**
 * NOAA Ovation aurora mesh. The raw grid is 1x1 degree (~65k cells) — we
 * decimate it aggressively so the GPU never sees more than a few hundred points.
 */
export function useAurora(enabled: boolean, intervalMs = 600_000, minProbability = 12) {
  return usePolledConnector<AuroraMesh>(
    async (signal) => {
      const json = await safeFetchJson<OvationResponse>(OVATION_URL, { signal, timeoutMs: 12000 });
      const cells: AuroraCell[] = [];
      const coords = json.coordinates ?? [];
      for (let i = 0; i < coords.length; i += 5) {
        const [lon, lat, prob] = coords[i];
        if (prob < minProbability) continue;
        cells.push({ lat, lon: lon > 180 ? lon - 360 : lon, probability: prob });
      }
      cells.sort((a, b) => b.probability - a.probability);
      return {
        observationTime: json["Observation Time"] ?? "",
        forecastTime: json["Forecast Time"] ?? "",
        cells: cells.slice(0, 400),
      };
    },
    EMPTY,
    intervalMs,
    enabled,
  );
}
