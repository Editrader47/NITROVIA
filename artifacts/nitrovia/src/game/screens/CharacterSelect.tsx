import { ArrowLeft, Check } from "lucide-react";

import { CHARACTERS } from "@/game/data/characters";
import { useGameStore } from "@/game/state/store";

export function CharacterSelect() {
  const setScreen = useGameStore((s) => s.setScreen);
  const selected = useGameStore((s) => s.selectedCharacterId);
  const selectCharacter = useGameStore((s) => s.selectCharacter);

  return (
    <div className="h-screen w-full overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,#221530_0%,#04050c_75%)] px-6 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => setScreen("menu")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>

        <h2 className="mb-1 text-3xl font-black italic">Elige tu piloto</h2>
        <p className="mb-6 text-sm text-white/50">Personalización visual — más estilos y opciones llegarán en futuras actualizaciones.</p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CHARACTERS.map((c) => {
            const isSelected = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => selectCharacter(c.id)}
                className={`flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all ${
                  isSelected ? "border-fuchsia-400 bg-fuchsia-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="relative flex h-28 w-full items-center justify-center">
                  <svg viewBox="0 0 60 100" className="h-28">
                    <ellipse cx="30" cy="18" rx="13" ry="15" fill={c.skinTone} />
                    <rect x="12" y="32" width="36" height="42" rx="10" fill={c.outfitColor} />
                    <rect x="8" y="34" width="10" height="34" rx="5" fill={c.outfitColor} />
                    <rect x="42" y="34" width="10" height="34" rx="5" fill={c.outfitColor} />
                    <rect x="15" y="74" width="12" height="20" rx="5" fill="#20232a" />
                    <rect x="33" y="74" width="12" height="20" rx="5" fill="#20232a" />
                  </svg>
                  {isSelected && (
                    <div className="absolute right-1 top-1 rounded-full bg-fuchsia-400 p-1 text-slate-950">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-bold">{c.name}</div>
                  <div className="text-xs uppercase tracking-wide text-white/40">{c.style}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
