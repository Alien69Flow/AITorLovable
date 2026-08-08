import {
	Wind, Cloud, Gauge, Compass, Thermometer, Droplets,
	Sun, Flame, Activity, Plane, Ship, TrendingUp,
	Satellite, AlertTriangle, Shield, Landmark, Radio,
	Bitcoin, Zap, Crosshair, Waves, Video, Wifi, 
	Train, Bug, Globe, Radar, Phone, Cable,
	type LucideIcon,
} from "lucide-react";

export type EnvLayerKey =
	// === Atmospheric & Weather ===
	| "atmosphere"
	| "clouds"
	| "isobars"
	| "wind"
	| "temperature"
	| "precipitation"
	// === Space & Cosmos ===
	| "solarActivity"
	| "satellites"
	| "satnogsGroundStations"
	// === OSINT & Hazards ===
	| "wildfires"
	| "earthquakes"
	| "airTraffic"
	| "marineTraffic"
	| "gpsJamming"
	| "internetOutages"
	| "malwareC2"
	// === Intelligence & Security ===
	| "conflictZones"
	| "cctvCameras"
	| "policeScanners"
	| "meshRadio"
	| "telegramOSINT"
	// === Infrastructure ===
	| "nuclearSites"
	| "militaryBases"
	| "underseaCables"
	| "pipelines"
	| "chokepoints"
	| "powerPlants"
	| "dataCenters"
	// === Transportation ===
	| "trainTracking"
	// === Markets & Feeds ===
	| "marketData"
	| "economicCenters"
	// === Advanced OSINT ===
	| "shodanDevices"
	| "sarGroundChange"
	| "supplyChainRisk";

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
	| "Intelligence & Security"
	| "Strategic Infrastructure"
	| "Transportation"
	| "Markets & Feeds"
	| "Advanced OSINT";

export interface globeLayerDef {
	key: EnvLayerKey;
	label: string;
	group: LayerGroup;
	color: string;
	Icon: LucideIcon;
	/** OpenWeatherMap tile layer id, proxied server-side */
	owm?: string;
	requiredTier: Tier;
	/** Data source attribution */
	source?: string;
	/** How fresh is the data */
	freshness?: string;
	/** Brief description */
	description?: string;
}

export const GLOBE_LAYERS: globeLayerDef[] = [
	// === Atmospheric & Weather ===
	{ 
		key: "atmosphere", 
		label: "Atmosphere", 
		group: "Atmospheric & Weather", 
		color: "#22d3ee", 
		Icon: Wind, 
		requiredTier: "explorer",
		description: "Earth's atmospheric halo glow"
	},
	{ 
		key: "clouds", 
		label: "Clouds", 
		group: "Atmospheric & Weather", 
		color: "#7dd3fc", 
		Icon: Cloud, 
		owm: "clouds_new", 
		requiredTier: "explorer",
		source: "OpenWeatherMap",
		freshness: "15 min",
		description: "Live cloud coverage from OpenWeatherMap"
	},
	{ 
		key: "temperature", 
		label: "Temperature", 
		group: "Atmospheric & Weather", 
		color: "#fb923c", 
		Icon: Thermometer, 
		owm: "temp_new", 
		requiredTier: "explorer",
		source: "OpenWeatherMap",
		freshness: "15 min",
		description: "Global surface temperature map"
	},
	{ 
		key: "precipitation", 
		label: "Precipitation", 
		group: "Atmospheric & Weather", 
		color: "#60a5fa", 
		Icon: Droplets, 
		owm: "precipitation_new", 
		requiredTier: "explorer",
		source: "OpenWeatherMap",
		freshness: "15 min",
		description: "Rain, snow, and precipitation intensity"
	},
	{ 
		key: "isobars", 
		label: "Isobars / Pressure", 
		group: "Atmospheric & Weather", 
		color: "#a5b4fc", 
		Icon: Gauge, 
		owm: "pressure_new", 
		requiredTier: "architect",
		source: "OpenWeatherMap",
		freshness: "15 min",
		description: "Barometric pressure lines and gradients"
	},
	{ 
		key: "wind", 
		label: "Wind Speed & Dir.", 
		group: "Atmospheric & Weather", 
		color: "#6ee7b7", 
		Icon: Compass, 
		owm: "wind_new", 
		requiredTier: "architect",
		source: "OpenWeatherMap",
		freshness: "15 min",
		description: "Global wind patterns and direction"
	},

	// === Space & Cosmos ===
	{ 
		key: "solarActivity", 
		label: "Solar Activity", 
		group: "Space & Cosmos", 
		color: "#c084fc", 
		Icon: Sun, 
		requiredTier: "architect",
		source: "NOAA SWPC",
		freshness: "30 min",
		description: "Kp index and aurora borealis intensity"
	},
	{ 
		key: "satellites", 
		label: "Satellite Tracking", 
		group: "Space & Cosmos", 
		color: "#8b5cf6", 
		Icon: Satellite, 
		requiredTier: "architect",
		source: "Space-Track.org",
		freshness: "1 hour",
		description: "Active satellite positions - military, SAR, SIGINT"
	},
	{ 
		key: "satnogsGroundStations", 
		label: "SatNOGS Ground Stations", 
		group: "Space & Cosmos", 
		color: "#06b6d4", 
		Icon: Radio, 
		requiredTier: "alien",
		source: "SatNOGS Network",
		freshness: "Real-time",
		description: "Amateur radio ground stations for satellite comms"
	},

	// === OSINT & Hazards ===
	{ 
		key: "wildfires", 
		label: "Wildfires (FIRMS)", 
		group: "OSINT & Hazards", 
		color: "#fb923c", 
		Icon: Flame, 
		requiredTier: "explorer",
		source: "NASA FIRMS",
		freshness: "3 hours",
		description: "Active wildfire detection from NASA"
	},
	{ 
		key: "earthquakes", 
		label: "Earthquakes (USGS)", 
		group: "OSINT & Hazards", 
		color: "#fbbf24", 
		Icon: Activity, 
		requiredTier: "explorer",
		source: "USGS",
		freshness: "5 min",
		description: "Real-time earthquake data from USGS"
	},
	{ 
		key: "airTraffic", 
		label: "Air Traffic", 
		group: "OSINT & Hazards", 
		color: "#e2e8f0", 
		Icon: Plane, 
		requiredTier: "explorer",
		source: "OpenSky Network",
		freshness: "2 min",
		description: "Live flight tracking - military, private, commercial"
	},
	{ 
		key: "marineTraffic", 
		label: "Marine Traffic", 
		group: "OSINT & Hazards", 
		color: "#38bdf8", 
		Icon: Ship, 
		requiredTier: "architect",
		source: "VesselFinder / AIS",
		freshness: "3 min",
		description: "Ship tracking via AIS - fishing, yachts, military"
	},
	{ 
		key: "gpsJamming", 
		label: "GPS Jamming Zones", 
		group: "OSINT & Hazards", 
		color: "#ef4444", 
		Icon: Wifi, 
		requiredTier: "architect",
		source: "ShadowBroker ADS-B Analysis",
		freshness: "Real-time",
		description: "Real-time GPS interference detection zones"
	},
	{ 
		key: "internetOutages", 
		label: "Internet Outages", 
		group: "OSINT & Hazards", 
		color: "#dc2626", 
		Icon: Globe, 
		requiredTier: "architect",
		source: "Oracle Internet Intelligence",
		freshness: "15 min",
		description: "Real-time internet disruption events"
	},
	{ 
		key: "malwareC2", 
		label: "Malware C2 Hotspots", 
		group: "OSINT & Hazards", 
		color: "#dc2626", 
		Icon: Bug, 
		requiredTier: "alien",
		source: "Abuse.ch Feodo + URLhaus",
		freshness: "1 hour",
		description: "Malware command & control server locations"
	},

	// === Intelligence & Security ===
	{ 
		key: "conflictZones", 
		label: "Conflict Zones", 
		group: "Intelligence & Security", 
		color: "#dc2626", 
		Icon: Crosshair, 
		requiredTier: "architect",
		source: "UCDP / ACLED",
		freshness: "Daily",
		description: "Active armed conflict zones and events"
	},
	{ 
		key: "cctvCameras", 
		label: "Public CCTV Cameras", 
		group: "Intelligence & Security", 
		color: "#fbbf24", 
		Icon: Video, 
		requiredTier: "architect",
		source: "Insecam / Public Streams",
		freshness: "Static",
		description: "Publicly accessible CCTV cameras worldwide"
	},
	{ 
		key: "policeScanners", 
		label: "Police Scanner Feeds", 
		group: "Intelligence & Security", 
		color: "#f59e0b", 
		Icon: Radio, 
		requiredTier: "architect",
		source: "Broadcastify",
		freshness: "Real-time",
		description: "Live police/fire/EMS scanner feeds"
	},
	{ 
		key: "meshRadio", 
		label: "Mesh Radio Nodes", 
		group: "Intelligence & Security", 
		color: "#10b981", 
		Icon: Wifi, 
		requiredTier: "architect",
		source: "Meshtastic / APRS",
		freshness: "Real-time",
		description: "Amateur mesh radio network nodes"
	},
	{ 
		key: "telegramOSINT", 
		label: "Telegram OSINT", 
		group: "Intelligence & Security", 
		color: "#0088cc", 
		Icon: Phone, 
		requiredTier: "alien",
		source: "Public Telegram Channels",
		freshness: "1 hour",
		description: "Geoparsed conflict/social media from Telegram"
	},

	// === Strategic Infrastructure ===
	{ 
		key: "nuclearSites", 
		label: "Nuclear Sites", 
		group: "Strategic Infrastructure", 
		color: "#7c3aed", 
		Icon: AlertTriangle, 
		requiredTier: "alien",
		source: "IAEA / World Nuclear Association",
		freshness: "Static",
		description: "Nuclear facilities and power plants"
	},
	{ 
		key: "militaryBases", 
		label: "Military Bases", 
		group: "Strategic Infrastructure", 
		color: "#4b5563", 
		Icon: Shield, 
		requiredTier: "alien",
		source: "ShadowBroker Registry",
		freshness: "Static",
		description: "Major military installations worldwide"
	},
	{ 
		key: "underseaCables", 
		label: "Undersea Cables", 
		group: "Strategic Infrastructure", 
		color: "#0891b2", 
		Icon: Cable, 
		requiredTier: "architect",
		source: "TeleGeography",
		freshness: "Static",
		description: "Submarine communications cables"
	},
	{ 
		key: "pipelines", 
		label: "Pipelines", 
		group: "Strategic Infrastructure", 
		color: "#ca8a04", 
		Icon: Landmark, 
		requiredTier: "architect",
		source: "Global Energy Infrastructure",
		freshness: "Static",
		description: "Major oil and gas pipelines"
	},
	{ 
		key: "chokepoints", 
		label: "Strategic Chokepoints", 
		group: "Strategic Infrastructure", 
		color: "#ea580c", 
		Icon: Zap, 
		requiredTier: "architect",
		source: "ShadowBroker Registry",
		freshness: "Static",
		description: "Critical maritime straits and canals"
	},
	{ 
		key: "powerPlants", 
		label: "Power Plants", 
		group: "Strategic Infrastructure", 
		color: "#fbbf24", 
		Icon: Radar, 
		requiredTier: "architect",
		source: "World Power Plant Database",
		freshness: "Static",
		description: "35,000+ power plants worldwide"
	},
	{ 
		key: "dataCenters", 
		label: "Data Centers", 
		group: "Strategic Infrastructure", 
		color: "#3b82f6", 
		Icon: Globe, 
		requiredTier: "architect",
		source: "DataCenterMap / Cloudscene",
		freshness: "Static",
		description: "Major data center locations"
	},

	// === Transportation ===
	{ 
		key: "trainTracking", 
		label: "Train Tracking", 
		group: "Transportation", 
		color: "#f97316", 
		Icon: Train, 
		requiredTier: "explorer",
		source: "Amtrak / DigiTraffic",
		freshness: "Real-time",
		description: "Live train positions - US Amtrak, Europe"
	},

	// === Markets & Feeds ===
	{ 
		key: "marketData", 
		label: "Live Market Data", 
		group: "Markets & Feeds", 
		color: "#fbbf24", 
		Icon: TrendingUp, 
		requiredTier: "explorer",
		source: "CoinGecko",
		freshness: "1 min",
		description: "Cryptocurrency and market data"
	},
	{ 
		key: "economicCenters", 
		label: "Economic Centers", 
		group: "Markets & Feeds", 
		color: "#10b981", 
		Icon: TrendingUp, 
		requiredTier: "explorer",
		source: "World Bank / IMF",
		freshness: "Static",
		description: "Major financial and economic hubs"
	},

	// === Advanced OSINT ===
	{ 
		key: "shodanDevices", 
		label: "Shodan Devices", 
		group: "Advanced OSINT", 
		color: "#dc2626", 
		Icon: Bug, 
		requiredTier: "alien",
		source: "Shodan (API Key Required)",
		freshness: "Real-time",
		description: "Internet-connected devices - cameras, SCADA, databases"
	},
	{ 
		key: "sarGroundChange", 
		label: "SAR Ground Change", 
		group: "Advanced OSINT", 
		color: "#7c3aed", 
		Icon: Satellite, 
		requiredTier: "alien",
		source: "NASA OPERA / Copernicus EGMS",
		freshness: "12 days",
		description: "Millimeter-scale ground deformation detection"
	},
	{ 
		key: "supplyChainRisk", 
		label: "Supply Chain Risk", 
		group: "Advanced OSINT", 
		color: "#f59e0b", 
		Icon: AlertTriangle, 
		requiredTier: "alien",
		source: "ShadowBroker Analysis",
		freshness: "Daily",
		description: "Semiconductor/battery fab risk scoring"
	},
];

export const LAYER_GROUPS: LayerGroup[] = [
	"Atmospheric & Weather",
	"Space & Cosmos",
	"OSINT & Hazards",
	"Intelligence & Security",
	"Strategic Infrastructure",
	"Transportation",
	"Markets & Feeds",
	"Advanced OSINT",
];

export const DEFAULT_ACTIVE_LAYERS: EnvLayerKey[] = [
	"atmosphere",
	"clouds",
	"temperature",
	"wildfires",
	"earthquakes",
	"airTraffic",
	"marineTraffic",
	"marketData",
];

export function layerDef(key: EnvLayerKey): globeLayerDef | undefined {
	return GLOBE_LAYERS.find((l) => l.key === key);
}
