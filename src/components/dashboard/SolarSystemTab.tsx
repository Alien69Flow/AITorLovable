import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Orbit, Sun, Radar } from "lucide-react";

const SOURCES = [
  {
    id: "nasa",
    label: "NASA Eyes",
    Icon: Orbit,
    url: "https://eyes.nasa.gov/apps/solar-system/#/home",
    desc: "Solar system explorer",
  },
  {
    id: "sentry",
    label: "Sentry",
    Icon: Radar,
    url: "https://sentry.artificialisabel.com/",
    desc: "Impact risk monitoring",
  },
  {
    id: "valhovey",
    label: "Valhovey",
    Icon: Sun,
    url: "https://valhovey.github.io/",
    desc: "Solar activity visualiser",
  },
] as const;

type SourceId = (typeof SOURCES)[number]["id"];

export function SolarSystemTab() {
  const [active, setActive] = useState<SourceId>("nasa");
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const timerRef = useRef<number | null>(null);

  const source = SOURCES.find((s) => s.id === active)!;

  // If the iframe never fires onLoad the site is most likely blocking embedding.
  useEffect(() => {
    setLoading(true);
    setBlocked(false);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setBlocked((b) => (b ? b : true)), 9000);
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [active]);

  const onLoaded = () => {
    setLoading(false);
    setBlocked(false);
    if (timerRef.current) window.clearTimeout(timerRef.current);
  };

  return (
    <div className="relative flex flex-col w-full h-full flex-1 min-h-0">
      {/* Source selector */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-slate-700/30 bg-slate-950/70 backdrop-blur-xl overflow-x-auto no-scrollbar">
        {SOURCES.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] uppercase tracking-wider transition-all shrink-0 ${
              active === s.id
                ? "bg-slate-800/70 border-cyan-400/50 text-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.25)]"
                : "bg-slate-900/40 border-slate-700/30 text-slate-400 hover:text-slate-200"
            }`}
          >
            <s.Icon className="w-3.5 h-3.5" />
            {s.label}
          </button>
        ))}
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-wider text-slate-500 hover:text-cyan-300 shrink-0"
        >
          <ExternalLink className="w-3 h-3" /> Abrir
        </a>
      </div>

      <div className="relative flex-1 min-h-0">
        {loading && !blocked && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-background">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="w-16 h-16 rounded-full" />
              <span className="text-xs font-heading text-primary neon-text-green tracking-wider uppercase animate-pulse">
                Loading {source.label}…
              </span>
            </div>
          </div>
        )}

        {blocked && loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20 bg-background/95 px-6 text-center">
            <source.Icon className="w-8 h-8 text-cyan-400" />
            <p className="text-xs text-slate-400 max-w-xs">
              {source.label} no permite incrustarse en esta ventana.
            </p>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-cyan-400/40 bg-slate-900/70 text-[11px] uppercase tracking-wider text-cyan-300 hover:bg-slate-800/70"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Abrir {source.label}
            </a>
          </div>
        )}

        <iframe
          key={source.id}
          src={source.url}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
          onLoad={onLoaded}
          title={`${source.label} — ${source.desc}`}
        />
      </div>
    </div>
  );
}
