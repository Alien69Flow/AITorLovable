## Estado actual verificado

- `GlobeDashboard.tsx` renderiza **solo** `GlobeScene.tsx` (react-globe.gl). `CesiumGlobe.tsx` existe y compila pero **no se usa** en ninguna parte.
- El "duplicado de barras" en la vista Globe es real: hay un **dock de navegación flotante** (Markets/Feed/Alerts/Movers/Tension, líneas 241-260) que repite la `BottomNav` global de `Index.tsx`, más una **barra de ticker crypto propia** además del `LiveTicker`.
- El `LegendPanel` ya lista Atmosphere/Clouds/Isobars/Wind/Temperature/Precipitation, pero **6 de esos toggles apuntan al mismo flag** (`weatherEnabled`): no son capas independientes. Faltan Earthquakes, Solar Activity y Marine Traffic.
- El scroll del legend usa `no-scrollbar` (funciona pero sin barra visible).
- **No existe** `useCredits.ts` ni configuración de wallet (`@reown/appkit` no está en `package.json`). `PricingModal.tsx` es estático, sin comprobación de tier.
- Sí existe en backend la tabla `user_credits` con columna `paid_tier` (`registered | basic | pro | quantum`), que será la fuente de verdad del tier.

---

## 1. Motor híbrido adaptativo

Nuevo `src/components/globe/HybridGlobe.tsx`:
- Usa `useIsMobile()`. Desktop → `CesiumGlobe`, móvil → `GlobeScene`.
- Expone una **única interfaz de props** (capas activas, marcadores, `onHotspotClick`, `onReady`/`flyTo`, `kpIndex`) y la adapta a cada motor.
- Cesium se carga con `React.lazy` + `Suspense` para que el bundle pesado no llegue nunca al móvil.
- `GlobeDashboard` pasa a renderizar `HybridGlobe` en lugar de `GlobeScene`.
- Se amplía `CesiumGlobeProps` para aceptar el mismo set de capas (weather overlays, fires, aircraft, markets, solar) y se unifica el tipo `LayerKey`.

## 2. Limpieza de barras y layout móvil

- Eliminar el dock flotante inferior de `GlobeDashboard` (duplica `BottomNav`).
- Conservar: ticker crypto superior + `LiveTicker` (una sola fila de eventos) + barra de estado inferior.
- Restaurar el punto "LIVE" en **rojo** (`bg-red-500` + pulse) en `LiveTicker`.
- Móvil: los tres botones flotantes (Tension / Legend / Navigate) ya existen; se convierten en un **bottom sheet** deslizable con scroll completo en lugar del overlay superior actual, y se garantiza que ningún panel de escritorio se monte en móvil.

## 3. Enumeración explícita de capas

Nuevo estado central de capas en `GlobeDashboard` (un objeto `layers` con una clave por capa, no flags compartidos):

```text
Atmospheric & Weather : atmosphere · clouds · isobars(pressure) · wind · temperature · precipitation
Space & Cosmos        : solarActivity (Kp/NOAA + Sentry)            [PREMIUM]
OSINT & Hazards       : wildfires(FIRMS) · earthquakes(USGS) · airTraffic(OpenSky) · marineTraffic [PREMIUM]
Markets & Feeds       : marketData
```

- `LegendPanel` se reescribe en secciones colapsables con **scrollbar vertical visible** (`overflow-y-auto` + estilo fino, se quita `no-scrollbar`).
- Cada toggle mapea a su propia capa; en Cesium a su `ImageryLayer` (OWM `clouds_new`, `pressure_new`, `wind_new`, `temp_new`, `precipitation_new` vía el proxy `openweather`, RainViewer para radar) y en react-globe.gl a su equivalente ligero (textura/heatmap/puntos).
- Capas premium: `isobars`, `wind`, `marineTraffic`, `solarActivity` (deep feed).

## 4. Paywall Fase 1 (marcar + bloquear por tier)

- Nuevo `src/hooks/useTier.ts`: lee la sesión de auth y consulta `user_credits.paid_tier`; devuelve `{ tier, hasAccess(required) }`. Invitado → `explorer`.
- `LegendPanel` muestra un **badge de candado** en las capas premium.
- Al pulsar una capa bloqueada: no se activa y se abre `PricingModal` con `reason` contextual ("La capa Wind requiere Architect").
- Si el tier es suficiente, la capa se activa al instante en el globo híbrido.
- `PricingModal` se conecta al tier actual (marca el plan activo). No se añade wallet ni Unlock en esta fase.

## 5. Cosmos: selector Sentry / NASA Eyes / Valhovey

- `SolarSystemTab.tsx` gana un sub-selector de pestañas: **NASA Eyes**, **Sentry** (`sentry.artificialisabel.com`), **Valhovey** (`valhovey.github.io`), cada uno en iframe responsive con estado de carga y fallback "abrir en nueva pestaña" si el sitio bloquea el embebido.
- El toggle "Solar Activity" del `LegendPanel` proyecta métricas de clima espacial (Kp de `useSpaceWeather` + NOAA) sobre el globo.

## Notas técnicas

- Sin claves en el cliente: todas las teselas OWM y Cesium siguen pasando por las Edge Functions `openweather` y `cesium-tiles`.
- Archivos tocados: `GlobeDashboard.tsx`, `LegendPanel.tsx`, `LiveTicker.tsx`, `GlobeScene.tsx`, `CesiumGlobe.tsx`, `PricingModal.tsx`, `SolarSystemTab.tsx`, + nuevos `HybridGlobe.tsx` y `useTier.ts`.
- No se toca la Edge Function `openweather` salvo que falte alguna capa OWM en su allowlist (se comprobará al implementar).
