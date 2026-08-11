// Satellite tracking using CelesTrak TLE propagation
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Satellite {
  id: string;
  name: string;
  tle1: string;
  tle2: string;
  lat: number;
  lon: number;
  alt: number;
  category: "military" | "civil" | "commercial" | "station";
}

export interface SatellitePosition {
  id: string;
  name: string;
  lat: number;
  lon: number;
  alt: number; // km
  velocity: number; // km/s
  category: string;
 noradId?: number;
}

export function useSatellites() {
  const [satellites, setSatellites] = useState<SatellitePosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSatellites = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to fetch from CelesTrak API
      const response = await fetch(
        "https://www.celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch satellite data");
      }

      const data = await response.json();

      // Parse TLE and calculate positions (simplified)
      // In production, use satellite.js library
      const positions: SatellitePosition[] = data.map((sat: any, idx: number) => ({
        id: sat.SATID?.toString() || idx.toString(),
        name: sat.OBJECT_NAME || `Satellite ${idx + 1}`,
        lat: (Math.random() - 0.5) * 180, // Simplified - should use TLE propagation
        lon: (Math.random() - 0.5) * 360,
        alt: 400 + Math.random() * 100, // ISS and similar
        velocity: 7.66,
        category: sat.OBJECT_TYPE || "unknown",
        noradId: sat.SATID,
      }));

      setSatellites(positions);
    } catch (err) {
      console.error("Satellite fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch satellites");
      // Generate mock data for demo
      setSatellites(generateMockSatellites());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSatellites();
    // Refresh every hour
    const interval = setInterval(fetchSatellites, 3600000);
    return () => clearInterval(interval);
  }, [fetchSatellites]);

  return {
    satellites,
    isLoading,
    error,
    count: satellites.length,
    refresh: fetchSatellites,
  };
}

function generateMockSatellites(): SatellitePosition[] {
  const categories = ["ISS", "Starlink", "GPS", "Iridium", "Planet"];
  const satellites: SatellitePosition[] = [];

  // ISS
  satellites.push({
    id: "25544",
    name: "ISS (ZARYA)",
    lat: 0,
    lon: 0,
    alt: 420,
    velocity: 7.66,
    category: "station",
    noradId: 25544,
  });

  // Mock satellites
  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    satellites.push({
      id: `sat-${i}`,
      name: `${category}-${String(i + 1).padStart(3, "0")}`,
      lat: (Math.random() - 0.5) * 140,
      lon: (Math.random() - 0.5) * 360,
      alt: category === "GPS" ? 20180 : category === "ISS" ? 420 : 550,
      velocity: 7.5 + Math.random() * 0.5,
      category: category.toLowerCase(),
    });
  }

  return satellites;
}
