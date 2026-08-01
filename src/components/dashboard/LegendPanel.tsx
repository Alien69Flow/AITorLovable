import {
  Layers,
  Activity,
  Satellite,
  Radio,
  CloudRain,
  DollarSign,
  Eye,
  Crosshair,
  Landmark,
  Package,
  PawPrint,
  Sparkles,
  Lock,
  type LucideIcon,
} from "lucide-react";
import {
  GlassPanel,
  CategoryChip,
  ToggleRow,
  LedIndicator,
  StatusBadge,
  SectionTitle,
} from "./GlassPanels";
import {
  GLOBE_LAYERS,
  LAYER_GROUPS,
  TIER_LABEL,
  type EnvLayerKey,
  type Tier,
} from "@/lib/globe-layers";

export type LayerKey =
  | "finance"
  | "intel"
  | "conflict"
  | "geopolitical"
  | "logistics"
  | "cryptozoo"
  | "convergence";

export interface LegendCategory {
  key: LayerKey;
  label: string;
  color: string;
  icon: LucideIcon;
}

export const LEGEND_CATEGORIES: LegendCategory[] = [
  { key: "finance", label: "Finance & Tech", color: "#fbbf24", icon: DollarSign },
  { key: "intel", label: "Intel & UAP", color: "#34d399", icon: Eye },
  { key: "conflict", label: "Conflict Zones", color: "#f87171", icon: Crosshair },
  { key: "geopolitical", label: "Geopolitical", color: "#60a5fa", icon: Landmark },
  { key: "logistics", label: "Logistics", color: "#fb923c", icon: Package },
  { key: "cryptozoo", label: "Cryptozoology", color: "#c084fc", icon: PawPrint },
  { key: "convergence", label: "Convergence", color: "#e2e8f0", icon: Sparkles },
];

const DATA_SOURCES = [
  { key: "usgs", label: "USGS Earthquakes", color: "#fbbf24", Icon: Activity, status: "live" },
  { key: "nasa", label: "NASA EONET", color: "#34d399", Icon: Satellite, status: "live" },
  { key: "noaa", label: "NOAA Space Weather", color: "#c084fc", Icon: Radio, status: "live" },
  { key: "owm", label: "OpenWeather Tiles", color: "#22d3ee", Icon: CloudRain, status: "live" },
] as const;

interface LegendPanelProps {
  visibleLayers: Set<LayerKey>;
  onToggleLayer: (key: LayerKey) => void;
  counts?: Record<LayerKey, number>;
  envLayers: Set<EnvLayerKey>;
  onToggleEnvLayer: (key: EnvLayerKey) => void;
  tier: Tier;
  hasAccess: (required: Tier) => boolean;
  onClose?: () => void;
}

export function LegendPanel({
  visibleLayers,
  onToggleLayer,
  counts,
  envLayers,
  onToggleEnvLayer,
  tier,
  hasAccess,
  onClose,
}: LegendPanelProps) {
  return (
    <GlassPanel
      icon={Layers}
      title="Legend & Controls"
      collapsible
      defaultCollapsed={false}
      className="w-full max-w-[300px]"
      glowBorder
      glowColor="#22d3ee"
      headerRight={
        <div className="flex items-center gap-2">
          <span className="text-[8px] uppercase tracking-wider text-amber-400/80">
            {TIER_LABEL[tier]}
          </span>
          <LedIndicator color="#34d399" active size="sm" />
        </div>
      }
      onClose={onClose}
    >
      <div className="space-y-5 max-h-[62vh] overflow-y-auto legend-scroll pr-2">
        {/* Data Categories */}
        <div>
          <SectionTitle>Intelligence Categories</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {LEGEND_CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.key}
                label={cat.label}
                color={cat.color}
                active={visibleLayers.has(cat.key)}
                count={counts?.[cat.key]}
                icon={cat.icon}
                onClick={() => onToggleLayer(cat.key)}
              />
            ))}
          </div>
        </div>

        {/* Explicit layer enumeration, grouped */}
        {LAYER_GROUPS.map((group) => {
          const defs = GLOBE_LAYERS.filter((l) => l.group === group);
          if (!defs.length) return null;
          return (
            <div key={group}>
              <SectionTitle>{group}</SectionTitle>
              <div className="grid grid-cols-1 gap-2">
                {defs.map((def) => {
                  const locked = !hasAccess(def.requiredTier);
                  return (
                    <div key={def.key} className="relative">
                      <ToggleRow
                        icon={def.Icon}
                        label={def.label}
                        color={locked ? "#64748b" : def.color}
                        active={!locked && envLayers.has(def.key)}
                        onChange={() => onToggleEnvLayer(def.key)}
                      />
                      {locked && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 pointer-events-none">
                          <Lock className="w-2.5 h-2.5 text-amber-400" />
                          <span className="text-[7px] uppercase tracking-wider text-amber-400 font-bold">
                            {TIER_LABEL[def.requiredTier]}
                          </span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Live Data Sources */}
        <div>
          <SectionTitle>Live Data Feeds</SectionTitle>
          <div className="space-y-2">
            {DATA_SOURCES.map((src) => (
              <div
                key={src.key}
                className="flex items-center justify-between gap-3 px-3 py-2.5 bg-slate-800/25 border border-slate-700/20 rounded-xl"
              >
                <div className="flex items-center gap-2.5">
                  <src.Icon className="w-4 h-4 shrink-0" style={{ color: src.color }} />
                  <span className="text-[11px] truncate text-white/85">{src.label}</span>
                </div>
                <StatusBadge variant="success" glow>LIVE</StatusBadge>
              </div>
            ))}
          </div>
        </div>

        {/* Active layers summary */}
        <div className="pt-2 border-t border-slate-700/25">
          <div className="flex items-center justify-between text-[9px]">
            <span className="text-slate-500 uppercase tracking-wider">Active Data Layers</span>
            <span className="font-mono text-emerald-400 font-semibold">
              {envLayers.size + visibleLayers.size}
            </span>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
