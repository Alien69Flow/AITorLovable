import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserLocation } from "./useUserLocation";

export interface WeatherPoint {
  lat: number;
  lon: number;
  temp: number | null;
  humidity: number | null;
  pressure: number | null;
  clouds: number | null;
  windSpeed: number | null;
  windDir: number | null;
  weather: string | null;
  description: string | null;
  visibility: number | null;
}

export interface WeatherGridResponse {
  gridSize: number;
  center: { lat: number; lon: number };
  spread: number;
  grid: WeatherPoint[];
  stats: {
    avgTemp: number | null;
    minTemp: number | null;
    maxTemp: number | null;
    avgHumidity: number | null;
    centerTemp: number | null;
    centerWeather: string | null;
  };
  timestamp: string;
}

export function useWeatherGrid() {
  const [grid, setGrid] = useState<WeatherPoint[]>([]);
  const [stats, setStats] = useState<WeatherGridResponse["stats"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { location } = useUserLocation();

  const fetchWeatherGrid = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Usar ubicación del usuario o fallback a Zaragoza
      const lat = location?.lat ?? 41.6561;
      const lon = location?.lon ?? -0.8773;

      const { data, error: fnError } = await supabase.functions.invoke<WeatherGridResponse>("weather-grid", {
        body: { lat, lon },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data) {
        setGrid(data.grid || []);
        setStats(data.stats || null);
        setLastUpdate(new Date(data.timestamp));
      }
    } catch (err) {
      console.error("Weather grid fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch weather grid");
    } finally {
      setIsLoading(false);
    }
  }, [location?.lat, location?.lon]);

  useEffect(() => {
    if (location) {
      fetchWeatherGrid();
    }
  }, [location, fetchWeatherGrid]);

  useEffect(() => {
    // Refresh every 5 minutes
    const interval = setInterval(fetchWeatherGrid, 300000);
    return () => clearInterval(interval);
  }, [fetchWeatherGrid]);

  return {
    grid,
    stats,
    isLoading,
    error,
    lastUpdate,
    refresh: fetchWeatherGrid,
    count: grid.length,
    centerTemp: stats?.centerTemp,
    centerWeather: stats?.centerWeather,
    userLocation: location,
  };
}
