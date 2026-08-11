import { useEffect, useRef, useState } from "react";
import * as satellite from "satellite.js";

export interface SatellitePosition {
  id: string;
  name: string;
  lat: number;
  lon: number;
  altKm: number;
}

const TLE_SOURCES = [
  "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle",
  "https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle",
];

type Rec = { name: string; satrec: satellite.SatRec };

async function loadTles(): Promise<Rec[]> {
  const out: Rec[] = [];
  for (const url of TLE_SOURCES) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const lines = (await res.text()).split("\n").map((l) => l.trim()).filter(Boolean);
      for (let i = 0; i + 2 < lines.length; i += 3) {
        if (!lines[i + 1].startsWith("1 ") || !lines[i + 2].startsWith("2 ")) continue;
        try {
          out.push({
            name: lines[i],
            satrec: satellite.twoline2satrec(lines[i + 1], lines[i + 2]),
          });
        } catch { /* skip malformed */ }
      }
    } catch { /* source unavailable */ }
  }
  return out.slice(0, 160);
}

/** Propagates a small catalogue of TLEs client-side (no API key needed). */
export function useSatellites(enabled: boolean) {
  const [positions, setPositions] = useState<SatellitePosition[]>([]);
  const recsRef = useRef<Rec[]>([]);

  useEffect(() => {
    if (!enabled) {
      setPositions([]);
      return;
    }
    let cancelled = false;
    let timer: number | undefined;

    const tick = () => {
      const now = new Date();
      const gmst = satellite.gstime(now);
      const next: SatellitePosition[] = [];
      recsRef.current.forEach((r, i) => {
        try {
          const pv = satellite.propagate(r.satrec, now);
          if (!pv || typeof pv.position === "boolean" || !pv.position) return;
          const geo = satellite.eciToGeodetic(pv.position as satellite.EciVec3<number>, gmst);
          next.push({
            id: `sat-${i}`,
            name: r.name,
            lat: satellite.degreesLat(geo.latitude),
            lon: satellite.degreesLong(geo.longitude),
            altKm: geo.height,
          });
        } catch { /* skip decayed objects */ }
      });
      if (!cancelled) setPositions(next);
    };

    (async () => {
      if (!recsRef.current.length) recsRef.current = await loadTles();
      if (cancelled) return;
      tick();
      timer = window.setInterval(tick, 5000);
    })();

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [enabled]);

  return positions;
}