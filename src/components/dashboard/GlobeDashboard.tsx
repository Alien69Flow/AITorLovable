import { useState, useCallback, useRef } from "react";
import { LiveTicker } from "./LiveTicker";
import { GlobeOverlay } from "./GlobeOverlay";
import { GlobeScene, UnifiedHotspotData } from "../globe/GlobeScene";
import { TacticalConsole } from "./TacticalConsole";
import { LegendPanel, type LayerKey } from "./LegendPanel";
import { NavigatePanel } from "./NavigatePanel";
import { ChatFeedPanel } from "./ChatFeedPanel";
import { OsintTickerBar } from "./OsintTickerBar";
import { useUnifiedIntel } from "@/hooks/useUnifiedIntel";
import { Volume2, TrendingUp, Radio, Bell, Activity, Globe, Layers, Cpu, Wifi, CircleCheck as CheckCircle2, Crosshair, Compass } from "lucide-react";
import { NavPill, LedIndicator } from "./GlassPanels";

type MobilePanel = "tension" | "legend" | "navigate" | null;

export function GlobeDashboard() {
  const [selectedHotspot, setSelectedHotspot] = useState<UnifiedHotspotData | null>(null);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null);
  const {
    earthquakes,
    nasaEvents,
    cryptoPrices,
    spaceWeather,
    counts,
    eventMarkers,
    tickerItems,
    events: osintEvents,
  } = useUnifiedIntel();
  const [visibleLayers, setVisibleLayers] = useState<Set<LayerKey>>(
    new Set(["finance", "intel", "conflict", "geopolitical", "logistics", "cryptozoo", "convergence"])
  );
  const [cloudsEnabled, setCloudsEnabled] = useState(true);
  const [weatherEnabled, setWeatherEnabled] = useState(true);
  const [firesEnabled, setFiresEnabled] = useState(true);
  const [aircraftEnabled, setAircraftEnabled] = useState(true);
  const [marketsEnabled, setMarketsEnabled] = useState(true);
  const globeNavRef = useRef<((lat: number, lng: number, alt: number) => void) | null>(null);

  const toggleLayer = useCallback((key: LayerKey) => {
    setVisibleLayers(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const handleNavigate = useCallback((lat: number, lng: number, altitude: number) => {
    globeNavRef.current?.(lat, lng, altitude);
  }, []);

  const handleGlobeReady = useCallback((navFn: (lat: number, lng: number, altitude: number) => void) => {
    globeNavRef.current = navFn;
  }, []);

  const toggleMobilePanel = useCallback((panel: Exclude<MobilePanel, null>) => {
    setMobilePanel(prev => (prev === panel ? null : panel));
  }, []);

  const activeLayerCount = [
    cloudsEnabled,
    weatherEnabled,
    firesEnabled,
    aircraftEnabled,
    marketsEnabled,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col flex-1 min-h-0 relative bg-black overflow-hidden">
      {/* Crypto Ticker - Premium Header */}
      <div className="flex items-center gap-3 md:gap-5 px-2 md:px-4 py-1.5 md:py-2 border-b border-slate-700/30 overflow-x-auto backdrop-blur-2xl bg-slate-950/70 no-scrollbar z-20">
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <Cpu className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
          <span className="text-[8px] md:text-[9px] uppercase tracking-wider text-slate-500 font-medium hidden md:inline">
            Live Markets
          </span>
        </div>
        {cryptoPrices.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-1.5 md:gap-2 shrink-0 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg bg-slate-800/30 border border-slate-700/20"
          >
            <span className="font-mono font-bold text-amber-400 text-[10px] md:text-[11px]">
              {c.symbol}
            </span>
            <span className="font-mono text-slate-300 text-[9px] md:text-[10px]">
              ${c.price.toLocaleString()}
            </span>
            <span
              className={`font-mono text-[8px] md:text-[9px] ${c.change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {c.change24h >= 0 ? "+" : ""}
              {c.change24h.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      {/* Live Ticker */}
      <LiveTicker spaceWeather={spaceWeather} earthquakes={earthquakes} nasaEvents={nasaEvents} />

      {/* Main content area */}
      <div className="flex flex-1 min-h-0 relative">
        {/* GLOBE 3D */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <GlobeScene
            onHotspotClick={setSelectedHotspot}
            onReady={handleGlobeReady}
            externalMarkers={eventMarkers}
            cloudsEnabled={cloudsEnabled}
            weatherEnabled={weatherEnabled}
            firesEnabled={firesEnabled}
            aircraftEnabled={aircraftEnabled}
            marketsEnabled={marketsEnabled}
          />
        </div>

        {/* OVERLAY: Tension badge + hotspot popup */}
        <GlobeOverlay
          selectedHotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
          spaceWeather={spaceWeather}
          earthquakeCount={earthquakes.length}
          nasaEventCount={nasaEvents.length}
        />

        {/* =================================================== */}
        {/* MOBILE LAYOUT: compact icon buttons + floating sheet  */}
        {/* (hidden md:hidden — only shows below 768px)           */}
        {/* =================================================== */}
        <div className="md:hidden">
          {/* Compact panel buttons - top left */}
          <div className="absolute top-2 left-2 z-30 flex flex-col gap-1.5 pointer-events-auto">
            <button
              onClick={() => toggleMobilePanel("tension")}
              className={`flex items-center justify-center w-9 h-9 rounded-xl backdrop-blur-2xl border transition-all ${
                mobilePanel === "tension"
                  ? "bg-slate-800/70 border-cyan-400/50 shadow-[0_0_16px_rgba(34,211,238,0.3)]"
                  : "bg-slate-950/80 border-slate-700/40 hover:border-slate-500/50"
              }`}
              aria-label="Tension console"
            >
              <Crosshair className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={() => toggleMobilePanel("legend")}
              className={`flex items-center justify-center w-9 h-9 rounded-xl backdrop-blur-2xl border transition-all ${
                mobilePanel === "legend"
                  ? "bg-slate-800/70 border-cyan-400/50 shadow-[0_0_16px_rgba(34,211,238,0.3)]"
                  : "bg-slate-950/80 border-slate-700/40 hover:border-slate-500/50"
              }`}
              aria-label="Legend and controls"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={() => toggleMobilePanel("navigate")}
              className={`flex items-center justify-center w-9 h-9 rounded-xl backdrop-blur-2xl border transition-all ${
                mobilePanel === "navigate"
                  ? "bg-slate-800/70 border-cyan-400/50 shadow-[0_0_16px_rgba(34,211,238,0.3)]"
                  : "bg-slate-950/80 border-slate-700/40 hover:border-slate-500/50"
              }`}
              aria-label="Navigate"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* Floating overlay panel */}
          {mobilePanel && (
            <>
              {/* Backdrop to close on tap-outside */}
              <div
                className="absolute inset-0 z-40"
                onClick={() => setMobilePanel(null)}
              />
              <div className="absolute top-14 left-2 right-2 z-50 pointer-events-auto max-h-[60vh] overflow-y-auto no-scrollbar">
                {mobilePanel === "tension" && (
                  <TacticalConsole forceExpanded onClose={() => setMobilePanel(null)} />
                )}
                {mobilePanel === "legend" && (
                  <LegendPanel
                    visibleLayers={visibleLayers}
                    onToggleLayer={toggleLayer}
                    counts={counts}
                    cloudsEnabled={cloudsEnabled}
                    onToggleClouds={() => setCloudsEnabled(v => !v)}
                    weatherEnabled={weatherEnabled}
                    onToggleWeather={() => setWeatherEnabled(v => !v)}
                    firesEnabled={firesEnabled}
                    onToggleFires={() => setFiresEnabled(v => !v)}
                    aircraftEnabled={aircraftEnabled}
                    onToggleAircraft={() => setAircraftEnabled(v => !v)}
                    marketsEnabled={marketsEnabled}
                    onToggleMarkets={() => setMarketsEnabled(v => !v)}
                    onClose={() => setMobilePanel(null)}
                  />
                )}
                {mobilePanel === "navigate" && (
                  <div className="w-full">
                    <NavigatePanel
                      onNavigate={handleNavigate}
                      forceOpen
                      onClose={() => setMobilePanel(null)}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* =================================================== */}
        {/* DESKTOP LAYOUT: original left panels                  */}
        {/* (hidden below 768px — md:flex / md:block)             */}
        {/* =================================================== */}
        <div className="hidden md:block absolute top-3 left-3 z-30 space-y-2.5 pointer-events-none">
          <div className="pointer-events-auto">
            <TacticalConsole />
          </div>
          <div className="pointer-events-auto">
            <LegendPanel
              visibleLayers={visibleLayers}
              onToggleLayer={toggleLayer}
              counts={counts}
              cloudsEnabled={cloudsEnabled}
              onToggleClouds={() => setCloudsEnabled(v => !v)}
              weatherEnabled={weatherEnabled}
              onToggleWeather={() => setWeatherEnabled(v => !v)}
              firesEnabled={firesEnabled}
              onToggleFires={() => setFiresEnabled(v => !v)}
              aircraftEnabled={aircraftEnabled}
              onToggleAircraft={() => setAircraftEnabled(v => !v)}
              marketsEnabled={marketsEnabled}
              onToggleMarkets={() => setMarketsEnabled(v => !v)}
            />
          </div>
          <div className="pointer-events-auto">
            <NavigatePanel onNavigate={handleNavigate} />
          </div>
        </div>

        {/* CENTER BOTTOM: Premium Nav Dock (compact on mobile) */}
        <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-[calc(100vw-1rem)]">
          <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-2xl backdrop-blur-2xl border border-slate-700/40 bg-slate-900/60 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500 cursor-pointer hover:text-slate-300 transition-colors shrink-0" />
            <div className="w-px h-4 md:h-5 bg-slate-700/40 mx-0.5 md:mx-1" />
            <NavPill icon={TrendingUp} label="Markets" />
            <NavPill icon={Radio} label="Feed" active />
            <NavPill icon={Bell} label="Alerts" />
            <NavPill icon={Activity} label="Movers" />
            <NavPill icon={Globe} label="Tension" highlight={spaceWeather.kpIndex > 4 ? "#c084fc" : undefined} />
            <div className="w-px h-4 md:h-5 bg-slate-700/40 mx-0.5 md:mx-1" />
            <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-xl bg-slate-800/40 border border-slate-700/30 shrink-0">
              <Layers className="w-3 md:w-3.5 h-3 md:h-3.5 text-cyan-400" />
              <span className="text-[9px] text-slate-400 uppercase tracking-wider hidden md:inline">Layers</span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {activeLayerCount}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Chat Feed (desktop only) */}
        <div className="absolute right-0 top-0 h-full z-20 pointer-events-none hidden md:block">
          <div className="pointer-events-auto h-full">
            <ChatFeedPanel earthquakes={earthquakes} nasaEvents={nasaEvents} osintEvents={osintEvents} />
          </div>
        </div>
      </div>

      {/* OSINT Ticker Bar */}
      <OsintTickerBar tickerItems={tickerItems} earthquakes={earthquakes} nasaEvents={nasaEvents} />

      {/* Status Bar - Premium Footer */}
      <div className="flex items-center justify-between px-2 md:px-5 py-1.5 md:py-2 border-t border-slate-700/30 bg-slate-950/70 backdrop-blur-2xl z-30">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Wifi className="w-3 md:w-3.5 h-3 md:h-3.5 text-slate-500" />
            <span className="text-[8px] md:text-[9px] text-slate-400 uppercase tracking-wider font-medium hidden md:inline">
              Aerospace OSINT Interface
            </span>
          </div>
          <div className="text-[8px] text-slate-600 font-mono">v2.0.1</div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-4">
          <div className="flex items-center gap-1 md:gap-2 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg bg-slate-800/40 border border-slate-700/20">
            <LedIndicator color="#34d399" active size="xs" />
            <span className="text-[8px] md:text-[9px] text-slate-400 font-mono">NASA</span>
            <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-400" />
          </div>
          <div className="flex items-center gap-1 md:gap-2 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg bg-slate-800/40 border border-slate-700/20">
            <LedIndicator color="#34d399" active size="xs" />
            <span className="text-[8px] md:text-[9px] text-slate-400 font-mono">USGS</span>
            <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-400" />
          </div>
          <div className="flex items-center gap-1 md:gap-2 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg bg-slate-800/40 border border-slate-700/20">
            <LedIndicator color="#34d399" active size="xs" />
            <span className="text-[8px] md:text-[9px] text-slate-400 font-mono">NOAA</span>
            <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
