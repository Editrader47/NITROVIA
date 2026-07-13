import { create } from "zustand";
import { persist } from "zustand/middleware";

import { VEHICLES } from "@/game/data/vehicles";
import { STORAGE_KEY, XP_PER_LEVEL } from "@/game/constants";
import type { GameMode, GameScreen, RaceResult } from "@/game/types";

interface ProgressionState {
  level: number;
  xp: number;
  money: number;
  ownedVehicleIds: string[];
  selectedVehicleId: string;
  selectedCharacterId: string;
  bestLapTimes: Record<string, number>;
}

interface GameState extends ProgressionState {
  screen: GameScreen;
  mode: GameMode;
  lastRaceResult: RaceResult | null;
  weather: "clear" | "rain";
  wantedLevel: number;

  setScreen: (screen: GameScreen) => void;
  setMode: (mode: GameMode) => void;
  selectVehicle: (id: string) => void;
  selectCharacter: (id: string) => void;
  buyVehicle: (id: string) => boolean;
  awardRace: (result: RaceResult, trackId: string) => void;
  resetSave: () => void;
  toggleWeather: () => void;
  setWantedLevel: (level: number) => void;
}

const defaultProgression: ProgressionState = {
  level: 1,
  xp: 0,
  money: 2500,
  ownedVehicleIds: ["city-hatch"],
  selectedVehicleId: "city-hatch",
  selectedCharacterId: "kai",
  bestLapTimes: {},
};

function levelForXp(xp: number): number {
  return Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...defaultProgression,
      screen: "menu",
      mode: "freeroam",
      lastRaceResult: null,
      weather: "clear",
      wantedLevel: 0,

      setScreen: (screen) => set({ screen }),
      setMode: (mode) => set({ mode }),

      selectVehicle: (id) => {
        if (get().ownedVehicleIds.includes(id)) {
          set({ selectedVehicleId: id });
        }
      },

      selectCharacter: (id) => set({ selectedCharacterId: id }),

      buyVehicle: (id) => {
        const vehicle = VEHICLES.find((v) => v.id === id);
        const state = get();
        if (!vehicle) return false;
        if (state.ownedVehicleIds.includes(id)) return true;
        if (state.level < vehicle.unlockLevel) return false;
        if (state.money < vehicle.price) return false;
        set({
          money: state.money - vehicle.price,
          ownedVehicleIds: [...state.ownedVehicleIds, id],
        });
        return true;
      },

      awardRace: (result, trackId) => {
        const state = get();
        const nextXp = state.xp + result.xpEarned;
        const best = state.bestLapTimes[trackId];
        set({
          money: state.money + result.moneyEarned,
          xp: nextXp,
          level: levelForXp(nextXp),
          lastRaceResult: result,
          bestLapTimes:
            best === undefined || result.timeSeconds < best
              ? { ...state.bestLapTimes, [trackId]: result.timeSeconds }
              : state.bestLapTimes,
        });
      },

      resetSave: () => set({ ...defaultProgression }),

      toggleWeather: () =>
        set((state) => ({ weather: state.weather === "clear" ? "rain" : "clear" })),

      setWantedLevel: (level) => set({ wantedLevel: Math.max(0, Math.min(3, level)) }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        level: state.level,
        xp: state.xp,
        money: state.money,
        ownedVehicleIds: state.ownedVehicleIds,
        selectedVehicleId: state.selectedVehicleId,
        selectedCharacterId: state.selectedCharacterId,
        bestLapTimes: state.bestLapTimes,
      }),
    },
  ),
);
