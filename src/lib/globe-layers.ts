import {
  Wind, Cloud, Gauge, Compass, Thermometer, Droplets,
  Sun, Flame, Activity, Plane, Ship, TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type EnvLayerKey =
  | "atmosphere"
  | "clouds"
  | "isobars"
  | "wind"
  | "temperature"
  | "precipitation"
  | "solarActivity"
  | "wildfires"
  | "earthquakes"
  | "airTraffic"
  | "marineTraffic"
  | "marketData";

export type Tier = "explorer" | "architect" | "alien";

export const TIER_RANK: Record<Tier, number> = { explorer: 0, architect: 1, alien: 2 };
export const TIER_LABEL: Record<Tier, string> = {
  explorer: "Explorer",
  architect: "Architect",
  alien: "Alien",
};

export type LayerGroup =
  | "Atmospheric & Weather"
  | "Space & Cosmos"
  | "OSINT & Hazards"
  | "Markets & Feeds";

export interface GlobeLayerDef {
  key: EnvLayerKey;
  label: string;
  group: LayerGroup;
  color: string;
  Icon: LucideIcon;
  /** OpenWeatherMap tile layer id, proxied server-side */
  owm?: string;
  requiredTier: Tier;
}

export const GLOBE_LAYERS: GlobeLayerDef[] = [
  { key: "atmosphere", label: "Atmosphere", group: "Atmospheric & Weather", color: "#22d3ee", Icon: Wind, requiredTier: "explorer" },
  { key: "clouds", label: "Clouds", group: "Atmospheric & Weather", color: "#7dd3fc", Icon: Cloud, owm: "clouds_new", requiredTier: "explorer" },
  { key: "temperature", label: "Temperature", group: "Atmospheric & Weather", color: "#fb923c", Icon: Thermometer, owm: "temp_new", requiredTier: "explorer" },
  { key: "precipitation", label: "Precipitation", group: "Atmospheric & Weather", color: "#60a5fa", Icon: Droplets, owm: "precipitation_new", requiredTier: "explorer" },
  { key: "isobars", label: "Isobars / Pressure", group: "Atmospheric & Weather", color: "#a5b4fc", Icon: Gauge, owm: "pressure_new", requiredTier: "architect" },
  { key: "wind", label: "Wind Speed & Dir.", group: "Atmospheric & Weather", color: "#6ee7b7", Icon: Compass, owm: "wind_new", requiredTier: "architect" },

  { key: "solarActivity", label: "Solar Activity", group: "Space & Cosmos", color: "#c084fc", Icon: Sun, requiredTier: "architect" },

  { key: "wildfires", label: "Wildfires (FIRMS)", group: "OSINT & Hazards", color: "#fb923c", Icon: Flame, requiredTier: "explorer" },
  { key: "earthquakes", label: "Earthquakes (USGS)", group: "OSINT & Hazards", color: "#fbbf24", Icon: Activity, requiredTier: "explorer" },
  { key: "airTraffic", label: "Air Traffic", group: "OSINT & Hazards", color: "#e2e8f0", Icon: Plane, requiredTier: "explorer" },
  { key: "marineTraffic", label: "Marine Traffic", group: "OSINT & Hazards", color: "#38bdf8", Icon: Ship, requiredTier: "architect" },

  { key: "marketData", label: "Live Market Data", group: "Markets & Feeds", color: "#fbbf24", Icon: TrendingUp, requiredTier: "explorer" },
];

export const LAYER_GROUPS: LayerGroup[] = [
  "Atmospheric & Weather",
  "Space & Cosmos",
  "OSINT & Hazards",
  "Markets & Feeds",
];

export const DEFAULT_ACTIVE_LAYERS: EnvLayerKey[] = [
  "atmosphere",
  "clouds",
  "wildfires",
  "earthquakes",
  "airTraffic",
  "marketData",
];

export function layerDef(key: EnvLayerKey): GlobeLayerDef | undefined {
  return GLOBE_LAYERS.find((l) => l.key === key);
}
