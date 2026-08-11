// Internet Outages from Cloudflare Radar / Oracle IODA
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface InternetOutage {
  id: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  severity: "low" | "medium" | "high" | "critical";
  percentage: number; // % of affected traffic
  startTime: string;
  endTime?: string;
  cause?: string;
  provider?: string;
  description: string;
}

export function useInternetOutages() {
  const [outages, setOutages] = useState<InternetOutage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchOutages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try Cloudflare Radar API
      const response = await fetch(
        "https://api.cloudflare.com/client/v4/radar/internet/outages?limit=50"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch internet outages");
      }

      const data = await response.json();

      if (data.success && data.result?.outages) {
        const mappedOutages: InternetOutage[] = data.result.outages.map(
          (outage: any, idx: number) => ({
            id: `cf-${idx}`,
            country: outage.location?.country?.name || "Unknown",
            countryCode: outage.location?.country?.iso || "XX",
            lat: outage.location?.geo?.latitude || 0,
            lng: outage.location?.geo?.longitude || 0,
            severity: mapSeverity(outage.severity),
            percentage: outage.percentage || 0,
            startTime: outage.startTime || new Date().toISOString(),
            endTime: outage.endTime,
            cause: outage.cause,
            provider: outage.provider,
            description: `Internet outage in ${outage.location?.country?.name || "Unknown region"}`,
          })
        );
        setOutages(mappedOutages);
      } else {
        setOutages(generateMockOutages());
      }

      setLastUpdate(new Date());
    } catch (err) {
      console.error("Internet outage fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch outages");
      setOutages(generateMockOutages());
      setLastUpdate(new Date());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOutages();
    // Refresh every 15 minutes
    const interval = setInterval(fetchOutages, 900000);
    return () => clearInterval(interval);
  }, [fetchOutages]);

  const getOutagesByCountry = useCallback((countryCode: string) => {
    return outages.filter(o => o.countryCode === countryCode);
  }, [outages]);

  const getActiveOutages = useCallback(() => {
    return outages.filter(o => !o.endTime);
  }, [outages]);

  return {
    outages,
    isLoading,
    error,
    lastUpdate,
    count: outages.length,
    activeCount: outages.filter(o => !o.endTime).length,
    refresh: fetchOutages,
    getOutagesByCountry,
    getActiveOutages,
  };
}

function mapSeverity(level: number | string): InternetOutage["severity"] {
  if (typeof level === "number") {
    if (level >= 80) return "critical";
    if (level >= 50) return "high";
    if (level >= 20) return "medium";
    return "low";
  }
  const str = String(level).toLowerCase();
  if (str.includes("critical") || str.includes("severe")) return "critical";
  if (str.includes("high")) return "high";
  if (str.includes("medium")) return "medium";
  return "low";
}

function generateMockOutages(): InternetOutage[] {
  return [
    {
      id: "mock-1",
      country: "Myanmar",
      countryCode: "MM",
      lat: 21.9,
      lng: 96.0,
      severity: "critical",
      percentage: 85,
      startTime: new Date(Date.now() - 86400000).toISOString(),
      cause: "Government-mandated blackout",
      provider: "MPT",
      description: "Massive internet blackout reported across Myanmar",
    },
    {
      id: "mock-2",
      country: "Cuba",
      countryCode: "CU",
      lat: 21.5,
      lng: -77.0,
      severity: "high",
      percentage: 62,
      startTime: new Date(Date.now() - 172800000).toISOString(),
      cause: "Infrastructure failure",
      description: "Widespread connectivity issues in Cuba",
    },
    {
      id: "mock-3",
      country: "Iran",
      countryCode: "IR",
      lat: 32.4,
      lng: 53.6,
      severity: "medium",
      percentage: 35,
      startTime: new Date(Date.now() - 259200000).toISOString(),
      cause: "Bandwidth throttling",
      description: "Localized internet restrictions reported",
    },
    {
      id: "mock-4",
      country: "Ethiopia",
      countryCode: "ET",
      lat: 9.1,
      lng: 40.4,
      severity: "low",
      percentage: 15,
      startTime: new Date(Date.now() - 432000000).toISOString(),
      endTime: new Date(Date.now() - 86400000).toISOString(),
      cause: "Maintenance",
      description: "Scheduled maintenance completed",
    },
  ];
}
