import { safeFetchJson, usePolledConnector } from "@/lib/connectors";

export interface SubmarineCable {
  id: string;
  name: string;
  color: string;
  /** Multi-segment paths as [lon, lat] tuples. */
  paths: [number, number][][];
}

const CABLE_GEO =
  "https://raw.githubusercontent.com/telegeography/submarine-cable-map-data/master/public/api/v3/cable/cable-geo.json";

interface CableGeoJson {
  features?: {
    properties?: { id?: string; name?: string; color?: string };
    geometry?: { type: string; coordinates: unknown };
  }[];
}

/** TeleGeography submarine cable map (static GeoJSON, refreshed daily). */
export function useSubmarineCables(enabled: boolean, maxCables = 220) {
  return usePolledConnector<SubmarineCable[]>(
    async (signal) => {
      const json = await safeFetchJson<CableGeoJson>(CABLE_GEO, { signal, timeoutMs: 15000 });
      const cables: SubmarineCable[] = [];
      for (const f of json.features ?? []) {
        const geom = f.geometry;
        if (!geom) continue;
        const raw =
          geom.type === "MultiLineString"
            ? (geom.coordinates as [number, number][][])
            : geom.type === "LineString"
              ? [geom.coordinates as [number, number][]]
              : [];
        // Decimate long polylines: 3D polylines are the expensive part here.
        const paths = raw
          .map((seg) => seg.filter((_, i) => i % 3 === 0 || i === seg.length - 1))
          .filter((seg) => seg.length > 1);
        if (!paths.length) continue;
        cables.push({
          id: String(f.properties?.id ?? cables.length),
          name: f.properties?.name ?? "Submarine cable",
          color: f.properties?.color ?? "#0891b2",
          paths,
        });
        if (cables.length >= maxCables) break;
      }
      if (!cables.length) throw new Error("no cable features");
      return cables;
    },
    [],
    24 * 3600_000,
    enabled,
  );
}
