import { useEffect, useState } from "react";
import { Gauge, Zap, Droplets, Pause, Trophy, Coins } from "lucide-react";

import { useGameStore } from "@/game/state/store";
import type { PlayerTelemetry } from "@/game/vehicles/PlayerCar";
import { TOTAL_LAPS } from "@/game/world/RaceTrack";

interface RaceHudInfo {
  lap: number;
  position: number;
  totalRacers: number;
  elapsedSeconds: number;
}

export function HUD({
  telemetryRef,
  race,
}: {
  telemetryRef: React.RefObject<PlayerTelemetry | null>;
  race: RaceHudInfo | null;
}) {
  const money = useGameStore((s) => s.money);
  const level = useGameStore((s) => s.level);
  const weather = useGameStore((s) => s.weather);
  const toggleWeather = useGameStore((s) => s.toggleWeather);
  const setScreen = useGameStore((s) => s.setScreen);

  const [display, setDisplay] = useState({ speedKmh: 0, nitro: 1, drifting: false, airborne: false });

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const t = telemetryRef.current;
      if (t) {
        setDisplay({ speedKmh: t.speedKmh, nitro: t.nitro, drifting: t.drifting, airborne: t.airborne });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [telemetryRef]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 select-none font-sans text-white">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-4">
        <div className="flex gap-2">
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-sm">
            <Coins className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold tabular-nums">${money.toLocaleString()}</span>
          </div>
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-sm">
            <Trophy className="h-4 w-4 text-cyan-300" />
            <span className="text-sm font-semibold tabular-nums">Nv. {level}</span>
          </div>
        </div>

        {race && (
          <div className="pointer-events-auto flex flex-col items-center gap-1 rounded-2xl bg-black/60 px-6 py-2 backdrop-blur-sm">
            <span className="text-xs uppercase tracking-widest text-cyan-300">
              Vuelta {Math.min(race.lap + 1, TOTAL_LAPS)}/{TOTAL_LAPS}
            </span>
            <span className="text-2xl font-black tabular-nums">{race.elapsedSeconds.toFixed(1)}s</span>
            <span className="text-xs text-white/70">
              Posición {race.position}/{race.totalRacers}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={toggleWeather}
            className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-sm hover:bg-black/70"
          >
            <Droplets className={`h-4 w-4 ${weather === "rain" ? "text-sky-300" : "text-white/50"}`} />
          </button>
          <button
            onClick={() => setScreen("modeSelect")}
            className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-sm hover:bg-black/70"
          >
            <Pause className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bottom-left speed/nitro cluster */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2">
        <div className="flex items-end gap-2 rounded-2xl bg-black/55 px-5 py-3 backdrop-blur-sm">
          <Gauge className="mb-1 h-5 w-5 text-white/60" />
          <span className="text-4xl font-black leading-none tabular-nums">{Math.round(display.speedKmh)}</span>
          <span className="mb-1 text-sm text-white/60">km/h</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 backdrop-blur-sm">
          <Zap className={`h-4 w-4 ${display.nitro > 0.15 ? "text-fuchsia-400" : "text-white/30"}`} />
          <div className="h-2 w-32 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-[width]"
              style={{ width: `${display.nitro * 100}%` }}
            />
          </div>
        </div>
        {display.drifting && (
          <span className="w-fit rounded-full bg-fuchsia-500/80 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Drift
          </span>
        )}
        {display.airborne && (
          <span className="w-fit rounded-full bg-cyan-500/80 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Salto
          </span>
        )}
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-6 right-6 rounded-xl bg-black/45 px-4 py-2 text-right text-[11px] leading-5 text-white/60 backdrop-blur-sm">
        <div>WASD / Flechas — conducir</div>
        <div>Espacio — freno de mano (drift)</div>
        <div>Shift — nitro</div>
      </div>
    </div>
  );
}
