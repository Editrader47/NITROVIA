import { ArrowLeft, Lock, ShoppingCart, Check } from "lucide-react";

import { VEHICLES } from "@/game/data/vehicles";
import { useGameStore } from "@/game/state/store";
import { CATEGORY_LABEL } from "@/game/screens/labels";

export function Garage() {
  const setScreen = useGameStore((s) => s.setScreen);
  const owned = useGameStore((s) => s.ownedVehicleIds);
  const selected = useGameStore((s) => s.selectedVehicleId);
  const selectVehicle = useGameStore((s) => s.selectVehicle);
  const buyVehicle = useGameStore((s) => s.buyVehicle);
  const level = useGameStore((s) => s.level);
  const money = useGameStore((s) => s.money);

  return (
    <div className="h-screen w-full overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,#151b33_0%,#04050c_75%)] px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setScreen("menu")}
            className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </button>
          <div className="flex items-center gap-4 text-sm font-semibold uppercase tracking-wide text-white/60">
            <span>Nivel {level}</span>
            <span className="text-amber-300">${money.toLocaleString()}</span>
          </div>
        </div>

        <h2 className="mb-1 text-3xl font-black italic">Garaje</h2>
        <p className="mb-6 text-sm text-white/50">Cada categoría se comporta distinto: aceleración, agarre y manejo únicos.</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VEHICLES.map((v) => {
            const isOwned = owned.includes(v.id);
            const isSelected = selected === v.id;
            const canBuy = !isOwned && level >= v.unlockLevel && money >= v.price;
            const locked = !isOwned && level < v.unlockLevel;

            return (
              <div
                key={v.id}
                className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
                  isSelected ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-white/5"
                }`}
              >
                <div
                  className="mb-4 flex h-24 items-center justify-center rounded-xl"
                  style={{ background: `linear-gradient(135deg, ${v.color}33, transparent)` }}
                >
                  <div className="h-8 w-20 rounded-md shadow-lg" style={{ backgroundColor: v.color }} />
                </div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/40">
                  {CATEGORY_LABEL[v.category]}
                </div>
                <div className="mb-3 text-lg font-bold">{v.name}</div>

                <div className="mb-4 space-y-1.5">
                  <Stat label="Velocidad" value={v.stats.topSpeed} max={90} />
                  <Stat label="Aceleración" value={v.stats.acceleration} max={50} />
                  <Stat label="Manejo" value={v.stats.handling} max={4} />
                </div>

                {isOwned ? (
                  <button
                    onClick={() => selectVehicle(v.id)}
                    disabled={isSelected}
                    className={`flex w-full items-center justify-center gap-2 rounded-full py-2 text-sm font-bold uppercase tracking-wide ${
                      isSelected
                        ? "bg-cyan-400 text-slate-950"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-4 w-4" /> Seleccionado
                      </>
                    ) : (
                      "Usar"
                    )}
                  </button>
                ) : locked ? (
                  <div className="flex w-full items-center justify-center gap-2 rounded-full bg-white/5 py-2 text-sm font-semibold text-white/40">
                    <Lock className="h-3.5 w-3.5" /> Nivel {v.unlockLevel}
                  </div>
                ) : (
                  <button
                    onClick={() => buyVehicle(v.id)}
                    disabled={!canBuy}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 py-2 text-sm font-bold uppercase tracking-wide text-slate-950 disabled:opacity-40"
                  >
                    <ShoppingCart className="h-4 w-4" /> ${v.price.toLocaleString()}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="mb-0.5 flex justify-between text-[10px] uppercase tracking-wider text-white/40">
        <span>{label}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
