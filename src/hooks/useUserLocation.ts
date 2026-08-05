import { useState, useEffect } from "react";

export interface UserLocation {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
  accuracy?: number;
}

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      // Fallback a Zaragoza si no hay geolocalización
      setLocation({
        lat: 41.6561,
        lon: -0.8773,
        city: "Zaragoza",
        country: "Spain",
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Reverse geocoding para obtener ciudad
        let city = "Unknown";
        let country = "Unknown";
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "User-Agent": "AiTor-v69" } }
          );
          if (response.ok) {
            const data = await response.json();
            city = data.address?.city || data.address?.town || data.address?.village || "Unknown";
            country = data.address?.country || "Unknown";
          }
        } catch {
          // Si falla el geocoding, usamos coordenadas
        }

        setLocation({
          lat: latitude,
          lon: longitude,
          city,
          country,
          accuracy,
        });
        setLoading(false);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        // Fallback a Zaragoza
        setLocation({
          lat: 41.6561,
          lon: -0.8773,
          city: "Zaragoza",
          country: "Spain",
        });
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache 5 minutos
      }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return {
    location,
    loading,
    error,
    refresh: fetchLocation,
  };
}
