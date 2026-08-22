import { useState, useCallback } from "react";
import { Eye, Satellite, Flame, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export type VisualMode = "default" | "satellite" | "flir" | "nvg" | "crt";

interface VisualModeConfig {
  key: VisualMode;
  label: string;
  icon: typeof Eye;
  filterClass: string;
}

const MODES: VisualModeConfig[] = [
  { key: "default", label: "DEFAULT", icon: Eye, filterClass: "" },
  {
    key: "satellite",
    label: "SAT",
    icon: Satellite,
    filterClass: "visual-mode-satellite",
  },
  {
    key: "flir",
    label: "FLIR",
    icon: Flame,
    filterClass: "visual-mode-flir",
  },
  {
    key: "nvg",
    label: "NVG",
    icon: Moon,
    filterClass: "visual-mode-nvg",
  },
  {
    key: "crt",
    label: "CRT",
    icon: Monitor,
    filterClass: "visual-mode-crt",
  },
];

export function getVisualModeClass(mode: VisualMode): string {
  return MODES.find((m) => m.key === mode)?.filterClass ?? "";
}

interface VisualModeToggleProps {
  mode?: VisualMode;
  onModeChange?: (mode: VisualMode) => void;
  className?: string;
}

export function VisualModeToggle({
  mode: controlledMode,
  onModeChange,
  className,
}: VisualModeToggleProps) {
  const [internalMode, setInternalMode] = useState<VisualMode>("default");
  const mode = controlledMode ?? internalMode;

  const handleSelect = useCallback(
    (m: VisualMode) => {
      if (controlledMode === undefined) setInternalMode(m);
      onModeChange?.(m);
    },
    [controlledMode, onModeChange]
  );

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 rounded-xl backdrop-blur-2xl border border-slate-700/40 bg-slate-900/60 shadow-[0_4px_16px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      {MODES.map((m) => {
        const Icon = m.icon;
        const active = mode === m.key;
        return (
          <button
            key={m.key}
            onClick={() => handleSelect(m.key)}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
              active
                ? "bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 border border-transparent"
            )}
            title={m.label}
            aria-label={`Visual mode: ${m.label}`}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        );
      })}
    </div>
  );
}
