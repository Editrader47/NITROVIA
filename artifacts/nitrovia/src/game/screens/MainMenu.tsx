import { Flame, Car, User, RotateCcw } from "lucide-react";

import { useGameStore } from "@/game/state/store";

export function MainMenu() {
  const setScreen = useGameStore((s) => s.setScreen);
  const resetSave = useGameStore((s) => s.resetSave);
  const money = useGameStore((s) => s.money);
  const level = useGameStore((s) => s.level);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_20%,#1c2340_0%,#050611_70%)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:repeating-linear-gradient(115deg,transparent,transparent_38px,rgba(56,189,248,0.08)_39px,rgba(56,189,248,0.08)_40px)]" />

      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 text-cyan-300">
          <Flame className="h-8 w-8" />
          <span className="text-sm font-semibold uppercase tracking-[0.5em]">Carreras urbanas</span>
        </div>
        <h1 className="bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-amber-300 bg-clip-text text-7xl font-black italic tracking-tight text-transparent drop-shadow-[0_0_40px_rgba(56,189,248,0.35)] sm:text-8xl">
          NITROVIA
        </h1>
        <p className="mt-2 max-w-md text-center text-sm text-white/60">
          Ciudad abierta, conducción arcade, drift, nitro y carreras callejeras. Fácil de aprender, difícil de dominar.
        </p>
      </div>

      <div className="relative z-10 mt-10 flex flex-col gap-3">
        <button
          onClick={() => setScreen("modeSelect")}
          className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-10 py-4 text-lg font-bold uppercase tracking-wide text-slate-950 shadow-[0_0_40px_rgba(56,189,248,0.4)] transition-transform hover:scale-105"
        >
          Jugar
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => setScreen("garage")}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-wide backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <Car className="h-4 w-4" /> Garaje
          </button>
          <button
            onClick={() => setScreen("character")}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-wide backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <User className="h-4 w-4" /> Piloto
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-10 flex items-center gap-6 text-xs uppercase tracking-widest text-white/40">
        <span>Nivel {level}</span>
        <span>${money.toLocaleString()}</span>
        <button
          onClick={resetSave}
          className="flex items-center gap-1 text-white/30 transition-colors hover:text-white/70"
        >
          <RotateCcw className="h-3 w-3" /> Reiniciar progreso
        </button>
      </div>
    </div>
  );
}
