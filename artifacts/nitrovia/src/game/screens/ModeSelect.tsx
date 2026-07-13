import { ArrowLeft, Flag, Compass } from "lucide-react";

import { useGameStore } from "@/game/state/store";

export function ModeSelect() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setMode = useGameStore((s) => s.setMode);

  const start = (mode: "freeroam" | "race") => {
    setMode(mode);
    setScreen("playing");
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(circle_at_50%_0%,#101833_0%,#04050c_75%)] px-6 text-white">
      <button
        onClick={() => setScreen("menu")}
        className="absolute left-6 top-6 flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>

      <h2 className="text-3xl font-black italic">Elige tu modo</h2>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={() => start("race")}
          className="group flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:border-fuchsia-400 hover:bg-fuchsia-400/10"
        >
          <Flag className="h-8 w-8 text-fuchsia-400" />
          <div className="text-xl font-bold">Carrera callejera</div>
          <p className="text-sm text-white/50">3 vueltas contra 3 rivales por el centro financiero. Gana dinero y experiencia.</p>
        </button>
        <button
          onClick={() => start("freeroam")}
          className="group flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:border-cyan-400 hover:bg-cyan-400/10"
        >
          <Compass className="h-8 w-8 text-cyan-400" />
          <div className="text-xl font-bold">Exploración libre</div>
          <p className="text-sm text-white/50">Recorre la ciudad completa: puerto, aeropuerto, parque, montaña y playa.</p>
        </button>
      </div>
    </div>
  );
}
