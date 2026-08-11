// Conflict events from UCDP/ACLED/Liveuamap/WorldMonitor
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ConflictCategory = 
  | "strike"
  | "missile"
  | "air"
  | "naval"
  | "fire"
  | "infrastructure"
  | "diplomacy"
  | "protest"
  | "riot";

export interface ConflictEvent {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  location: string;
  country: string;
  category: ConflictCategory;
  severity: "low" | "medium" | "high" | "critical";
  source: string;
  reliability: number; // 0-100
  timestamp: string;
  imageUrl?: string;
  url?: string;
  casualties?: number;
}

const CATEGORY_EMOJI: Record<ConflictCategory, string> = {
  strike: "💥",
  missile: "🚀",
  air: "🛩️",
  naval: "🚢",
  fire: "🔥",
  infrastructure: "⚡",
  diplomacy: "🕊️",
  protest: "📢",
  riot: "⚠️",
};

export function useConflicts() {
  const [events, setEvents] = useState<ConflictEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchConflicts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try Supabase edge function first
      const { data, error: fnError } = await supabase.functions.invoke("osint-aggregator", {
        body: { type: "conflicts" },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.events) {
        setEvents(data.events);
        setLastUpdate(new Date(data.timestamp));
      } else {
        // Fallback to mock data
        setEvents(generateMockConflicts());
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Conflict fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch conflicts");
      // Use mock data on error
      setEvents(generateMockConflicts());
      setLastUpdate(new Date());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConflicts();
    // Refresh every 30 minutes
    const interval = setInterval(fetchConflicts, 1800000);
    return () => clearInterval(interval);
  }, [fetchConflicts]);

  const getEventsByCategory = useCallback((category: ConflictCategory) => {
    return events.filter(e => e.category === category);
  }, [events]);

  const getEventsBySeverity = useCallback((severity: ConflictEvent["severity"]) => {
    return events.filter(e => e.severity === severity);
  }, [events]);

  return {
    events,
    isLoading,
    error,
    lastUpdate,
    count: events.length,
    refresh: fetchConflicts,
    getEventsByCategory,
    getEventsBySeverity,
    categoryEmoji: CATEGORY_EMOJI,
  };
}

function generateMockConflicts(): ConflictEvent[] {
  const conflicts: ConflictEvent[] = [
    {
      id: "1",
      title: "Airstrike in Northern Gaza",
      description: "Israeli Air Force conducted precision strikes on militant infrastructure in northern Gaza Strip.",
      lat: 31.5,
      lng: 34.5,
      location: "Gaza Strip",
      country: "Palestine",
      category: "air",
      severity: "high",
      source: "IDF Spokesperson",
      reliability: 85,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      casualties: 12,
    },
    {
      id: "2",
      title: "Drone Attack on Russian Oil Refinery",
      description: "Ukrainian drones targeted an oil refinery in Russia's Krasnodar region.",
      lat: 45.0,
      lng: 39.0,
      location: "Krasnodar Krai",
      country: "Russia",
      category: "strike",
      severity: "medium",
      source: "Ukrainian Military",
      reliability: 78,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "3",
      title: "Red Sea Naval Incident",
      description: "US Navy intercepted Houthi anti-ship missiles in the Red Sea.",
      lat: 14.0,
      lng: 42.5,
      location: "Red Sea",
      country: "Yemen",
      category: "naval",
      severity: "critical",
      source: "USCENTCOM",
      reliability: 92,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: "4",
      title: "Wildfire Near Military Base",
      description: "Wildfire approaching Russian airbase in Syria's Homs province.",
      lat: 34.7,
      lng: 38.2,
      location: "Homs Province",
      country: "Syria",
      category: "fire",
      severity: "medium",
      source: "Syrian Observatory",
      reliability: 70,
      timestamp: new Date(Date.now() - 5400000).toISOString(),
    },
    {
      id: "5",
      title: "Power Grid Attack in Ukraine",
      description: "Russian missiles targeted critical infrastructure in Kyiv's power grid.",
      lat: 50.4,
      lng: 30.5,
      location: "Kyiv",
      country: "Ukraine",
      category: "infrastructure",
      severity: "high",
      source: "Ukrainian Energy Ministry",
      reliability: 88,
      timestamp: new Date(Date.now() - 900000).toISOString(),
      casualties: 3,
    },
    {
      id: "6",
      title: "Peace Talks Resume",
      description: "Diplomatic negotiations restarted between conflicting parties.",
      lat: 35.6,
      lng: 139.7,
      location: "Tokyo",
      country: "Japan",
      category: "diplomacy",
      severity: "low",
      source: "UN Mediation",
      reliability: 95,
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: "7",
      title: "Anti-Government Protests",
      description: "Thousands march in capital demanding government resignation.",
      lat: 51.5,
      lng: -0.1,
      location: "London",
      country: "United Kingdom",
      category: "protest",
      severity: "low",
      source: "Reuters",
      reliability: 85,
      timestamp: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: "8",
      title: "Border Clash",
      description: "Armed confrontation between security forces at disputed border.",
      lat: 33.3,
      lng: 44.3,
      location: "Iraq-Iran Border",
      country: "Iraq",
      category: "riot",
      severity: "medium",
      source: "Al Jazeera",
      reliability: 72,
      timestamp: new Date(Date.now() - 21600000).toISOString(),
    },
  ];

  return conflicts;
}

export { CATEGORY_EMOJI };
