import { Trophy, Coins, Star, RotateCcw, Home } from "lucide-react";

import { useGameStore } from "@/game/state/store";

export function RaceResults() {
  const result = useGameStore((s) => s.lastRaceResult);
  const setScreen = useGameStore((s) => s.setScreen);

  if (!result) {
    setScreen("menu");
    return null;
  }

  const podium = result.position === 1 ? "¡Ganaste la carrera!" : `Terminaste en el puesto ${result.position}`;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(circle_at_50%_0%,#1c1430_0%,#04050c_75%)] px-6 text-white">
      <Trophy className={`h-16 w-16 ${result.position === 1 ? "text-amber-300" : "text-white/40"}`} />
      <h2 className="text-3xl font-black italic">{podium}</h2>
      <p className="text-sm text-white/50">
        Tiempo total: {result.timeSeconds.toFixed(1)}s · {result.totalRacers} pilotos
      </p>

      <div className="flex gap-4">
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 font-semibold">
          <Coins className="h-4 w-4 text-amber-400" /> +${result.moneyEarned}
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 font-semibold">
          <Star className="h-4 w-4 text-cyan-300" /> +{result.xpEarned} XP
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setScreen("modeSelect")}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-slate-950"
        >
          <RotateCcw className="h-4 w-4" /> Volver a correr
        </button>
        <button
          onClick={() => setScreen("menu")}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-white/10"
        >
          <Home className="h-4 w-4" /> Menú
        </button>
      </div>
    </div>
  );
}
