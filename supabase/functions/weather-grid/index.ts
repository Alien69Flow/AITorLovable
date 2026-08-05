// Weather Grid for Zaragoza - 7x7 grid sampling
// Sampling atmospheric data around Zaragoza coordinates
import { guardPublic } from "../_shared/guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Zaragoza center coordinates
const ZARAGOZA_CENTER = { lat: 41.6561, lon: -0.8773 };
const GRID_SIZE = 7; // 7x7 grid
const GRID_SPREAD = 2.0; // degrees spread in each direction

const KEY = Deno.env.get("OPENWEATHER_API_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  
  const blocked = guardPublic(req, corsHeaders, 300); // 5 min cache
  if (blocked) return blocked;
  
  if (!KEY) {
    return new Response(JSON.stringify({ error: "OPENWEATHER_API_KEY missing" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  
  try {
    // Generate 7x7 grid coordinates around Zaragoza
    const grid = [];
    const step = (GRID_SPREAD * 2) / (GRID_SIZE - 1);
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const lat = ZARAGOZA_CENTER.lat - GRID_SPREAD + (i * step);
        const lon = ZARAGOZA_CENTER.lon - GRID_SPREAD + (j * step);
        grid.push({ lat: Math.round(lat * 1000) / 1000, lon: Math.round(lon * 1000) / 1000 });
      }
    }
    
    // Fetch weather for all grid points (batch requests)
    const weatherData = await Promise.all(
      grid.map(async (point) => {
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${point.lat}&lon=${point.lon}&appid=${KEY}&units=metric`;
          const response = await fetch(url);
          
          if (!response.ok) return null;
          
          const data = await response.json();
          return {
            lat: point.lat,
            lon: point.lon,
            temp: data.main?.temp ?? null,
            humidity: data.main?.humidity ?? null,
            pressure: data.main?.pressure ?? null,
            clouds: data.clouds?.all ?? null,
            windSpeed: data.wind?.speed ?? null,
            windDir: data.wind?.deg ?? null,
            weather: data.weather?.[0]?.main ?? null,
            description: data.weather?.[0]?.description ?? null,
            visibility: data.visibility ?? null,
          };
        } catch {
          return null;
        }
      })
    );
    
    // Filter out failed requests
    const validData = weatherData.filter(Boolean);
    
    // Calculate grid statistics
    const temps = validData.map(d => d.temp).filter(t => t !== null) as number[];
    const humidities = validData.map(d => d.humidity).filter(h => h !== null) as number[];
    
    const stats = {
      avgTemp: temps.length ? Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10 / 10 : null,
      minTemp: temps.length ? Math.min(...temps) : null,
      maxTemp: temps.length ? Math.max(...temps) : null,
      avgHumidity: humidities.length ? Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length) : null,
      centerTemp: validData[24]?.temp ?? null, // Center of grid
      centerWeather: validData[24]?.weather ?? null,
    };
    
    return new Response(JSON.stringify({
      gridSize: GRID_SIZE,
      center: ZARAGOZA_CENTER,
      spread: GRID_SPREAD,
      grid: validData,
      stats,
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
    });
    
  } catch (err) {
    console.error("Weather grid error:", err);
    return new Response(JSON.stringify({
      error: "Failed to fetch weather grid",
      timestamp: new Date().toISOString(),
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
