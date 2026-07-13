import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { useGameStore } from "@/game/state/store";
import { MONEY_PER_POSITION, XP_PER_RACE_FINISH, CHECKPOINT_RADIUS } from "@/game/constants";
import { RACE_WAYPOINTS, TOTAL_LAPS } from "@/game/world/RaceTrack";
import type { PlayerTelemetry } from "@/game/vehicles/PlayerCar";
import type { RivalHandle } from "@/game/ai/RivalCar";

interface RaceHudInfo {
  lap: number;
  position: number;
  totalRacers: number;
  elapsedSeconds: number;
}

/** Tracks player checkpoint progress against the fixed circuit, computes live
 * race position against the AI rivals, and finalizes the race (awarding
 * money/XP) once the player completes the required number of laps. Renders
 * nothing -- pure simulation component mounted only during "race" mode. */
export function RaceDirector({
  telemetryRef,
  rivalsRef,
  totalRacers,
  onUpdate,
}: {
  telemetryRef: React.RefObject<PlayerTelemetry | null>;
  rivalsRef: React.RefObject<RivalHandle[]>;
  totalRacers: number;
  onUpdate: (info: RaceHudInfo) => void;
}) {
  const playerCheckpoint = useRef(0);
  const playerLap = useRef(0);
  const elapsed = useRef(0);
  const finished = useRef(false);
  const setScreen = useGameStore((s) => s.setScreen);
  const awardRace = useGameStore((s) => s.awardRace);

  useEffect(() => {
    playerCheckpoint.current = 0;
    playerLap.current = 0;
    elapsed.current = 0;
    finished.current = false;
  }, []);

  useFrame((_, delta) => {
    if (finished.current) return;
    const telemetry = telemetryRef.current;
    if (!telemetry) return;
    elapsed.current += delta;

    const target = RACE_WAYPOINTS[playerCheckpoint.current];
    const dist = Math.hypot(telemetry.position.x - target.x, telemetry.position.z - target.z);
    if (dist < CHECKPOINT_RADIUS) {
      const next = (playerCheckpoint.current + 1) % RACE_WAYPOINTS.length;
      if (next === 0) playerLap.current += 1;
      playerCheckpoint.current = next;
    }

    // Compute position: rank by (laps, checkpoint index) descending, player included.
    const rivals = rivalsRef.current ?? [];
    const scores = [
      { id: "player", score: playerLap.current * RACE_WAYPOINTS.length + playerCheckpoint.current },
      ...rivals.map((r, i) => ({ id: `rival-${i}`, score: r.lap * RACE_WAYPOINTS.length + r.waypointIndex })),
    ];
    scores.sort((a, b) => b.score - a.score);
    const position = scores.findIndex((s) => s.id === "player") + 1;

    onUpdate({
      lap: playerLap.current,
      position: position || 1,
      totalRacers,
      elapsedSeconds: elapsed.current,
    });

    if (playerLap.current >= TOTAL_LAPS) {
      finished.current = true;
      const finalPosition = position || 1;
      const moneyEarned = MONEY_PER_POSITION[Math.min(finalPosition, MONEY_PER_POSITION.length) - 1] ?? 100;
      awardRace(
        {
          position: finalPosition,
          totalRacers,
          timeSeconds: elapsed.current,
          moneyEarned,
          xpEarned: XP_PER_RACE_FINISH,
        },
        "financial-circuit",
      );
      setScreen("raceResults");
    }
  });

  return null;
}
