import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { GlobeScene, type UnifiedHotspotData } from "./GlobeScene";
import type { EnvLayerKey } from "@/lib/globe-layers";
import type { Earthquake } from "@/hooks/useEarthquakes";
import type { NasaEvent } from "@/hooks/useNasaEvents";
import type { UAPSighting } from "@/hooks/useUAPSightings";

const CesiumGlobe = lazy(() =>
  import("./CesiumGlobe").then((m) => ({ default: m.CesiumGlobe }))
);

export interface HybridGlobeProps {
  layers: Set<EnvLayerKey>;
  onHotspotClick?: (d: UnifiedHotspotData | null) => void;
  onReady?: (navigateFn: (lat: number, lng: number, altitude: number) => void) => void;
  externalMarkers?: UnifiedHotspotData[];
  kpIndex?: number;
  earthquakes?: Earthquake[];
  nasaEvents?: NasaEvent[];
  sightings?: UAPSighting[];
}

function GlobeFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/70 animate-pulse">
        Initializing GIS engine…
      </span>
    </div>
  );
}

export function HybridGlobe({
  layers,
  onHotspotClick,
  onReady,
  externalMarkers,
  kpIndex = 0,
  earthquakes = [],
  nasaEvents = [],
  sightings = [],
}: HybridGlobeProps) {
  const isMobile = useIsMobile();
  const [flyTo, setFlyTo] = useState<{ lat: number; lon: number; alt: number } | null>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const cesiumNavigate = useCallback((lat: number, lng: number, altitude: number) => {
    // react-globe.gl altitude is in earth radii; Cesium expects metres.
    setFlyTo({ lat, lon: lng, alt: Math.max(150_000, altitude * 6_371_000) });
  }, []);

  // Expose the navigation function for the desktop (Cesium) engine.
  useEffect(() => {
    if (isMobile) return;
    onReadyRef.current?.(cesiumNavigate);
  }, [isMobile, cesiumNavigate]);

  if (isMobile) {
    return (
      <GlobeScene
        layers={layers}
        onHotspotClick={onHotspotClick}
        onReady={onReady}
        externalMarkers={externalMarkers}
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      <Suspense fallback={<GlobeFallback />}>
        <CesiumGlobe
          envLayers={layers}
          onHotspotClick={onHotspotClick as any}
          sightings={sightings}
          flyTo={flyTo}
          kpIndex={layers.has("solarActivity") ? kpIndex : 0}
          earthquakes={layers.has("earthquakes") ? earthquakes : []}
          nasaEvents={layers.has("wildfires") ? nasaEvents : []}
        />
      </Suspense>
    </div>
  );
}
