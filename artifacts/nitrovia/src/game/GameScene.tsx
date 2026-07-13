import { useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import * as THREE from "three";

import { Controls, CONTROL_KEY_MAP } from "@/game/state/controls";
import { useGameStore } from "@/game/state/store";
import { getVehicleById } from "@/game/data/vehicles";
import { CollidersProvider } from "@/game/world/colliders";
import { City } from "@/game/world/City";
import { WorldEnvironment } from "@/game/world/Environment";
import { RaceTrackVisual, RACE_WAYPOINTS, TOTAL_LAPS } from "@/game/world/RaceTrack";
import { PlayerCar, type PlayerCarHandle, type PlayerTelemetry } from "@/game/vehicles/PlayerCar";
import { TrafficCar, type TrafficRoute } from "@/game/ai/TrafficCar";
import { Pedestrian, type PedestrianRoute } from "@/game/ai/Pedestrian";
import { RivalCar, type RivalHandle } from "@/game/ai/RivalCar";
import { PoliceCar } from "@/game/ai/PoliceCar";
import { HUD } from "@/game/hud/HUD";
import { RaceDirector } from "@/game/systems/RaceDirector";

const TRAFFIC_ROUTES: TrafficRoute[] = [
  {
    loop: [
      { x: -80, z: -160 },
      { x: 80, z: -160 },
      { x: 80, z: -100 },
      { x: -80, z: -100 },
    ],
    speed: 9,
    vehicleId: "trailhawk",
    startIndex: 0,
  },
  {
    loop: [
      { x: -40, z: -40 },
      { x: 40, z: -40 },
      { x: 40, z: 40 },
      { x: -40, z: 40 },
    ],
    speed: 11,
    vehicleId: "retro-classic",
    startIndex: 1,
  },
  {
    loop: [
      { x: 150, z: -60 },
      { x: 230, z: -60 },
      { x: 230, z: 0 },
      { x: 150, z: 0 },
    ],
    speed: 8,
    vehicleId: "haulmaster",
    startIndex: 0,
  },
];

const PEDESTRIAN_ROUTES: PedestrianRoute[] = [
  { x: -60, z: -140, axis: "x", range: 30, speed: 0.4, color: "#f97316" },
  { x: 60, z: -180, axis: "x", range: 24, speed: 0.5, color: "#22d3ee" },
  { x: -20, z: 150, axis: "z", range: 40, speed: 0.35, color: "#a855f7" },
  { x: 20, z: 200, axis: "x", range: 30, speed: 0.45, color: "#facc15" },
];

const RIVAL_SETUP = [
  { vehicleId: "raptor-gt", color: "#38bdf8", pace: 24 },
  { vehicleId: "raptor-gt", color: "#f43f5e", pace: 23 },
  { vehicleId: "raptor-gt", color: "#a3e635", pace: 25 },
];

export function GameScene() {
  const mode = useGameStore((s) => s.mode);
  const selectedVehicleId = useGameStore((s) => s.selectedVehicleId);
  const wantedLevel = useGameStore((s) => s.wantedLevel);
  const vehicle = useMemo(() => getVehicleById(selectedVehicleId), [selectedVehicleId]);

  const playerRef = useRef<PlayerCarHandle | null>(null);
  const telemetryRef = useRef<PlayerTelemetry | null>(null);
  const rivalsRef = useRef<RivalHandle[]>([]);
  const [raceHud, setRaceHud] = useState<{ lap: number; position: number; totalRacers: number; elapsedSeconds: number } | null>(
    mode === "race" ? { lap: 0, position: 1, totalRacers: RIVAL_SETUP.length + 1, elapsedSeconds: 0 } : null,
  );

  const startPos: [number, number, number] =
    mode === "race" ? [RACE_WAYPOINTS[0].x, 0, RACE_WAYPOINTS[0].z - 8] : [0, 0, -20];

  return (
    <div className="relative h-screen w-full bg-black">
      <KeyboardControls map={CONTROL_KEY_MAP}>
        <Canvas
          shadows
          camera={{ fov: 62, near: 0.1, far: 700 }}
          gl={{ antialias: true, powerPreference: "default", failIfMajorPerformanceCaveat: false }}
        >
          <CollidersProvider>
            <City />
            <WorldEnvironment followTarget={{ current: playerRef.current?.group ?? null }} />

            {mode === "race" && <RaceTrackVisual activeCheckpoint={raceHud?.lap ?? 0} />}

            <PlayerCar
              vehicle={vehicle}
              startPosition={startPos}
              startHeading={0}
              onReady={(handle) => {
                playerRef.current = handle;
                telemetryRef.current = handle.telemetry;
              }}
            />

            {mode === "freeroam" &&
              TRAFFIC_ROUTES.map((route, i) => <TrafficCar key={i} route={route} />)}
            {mode === "freeroam" &&
              PEDESTRIAN_ROUTES.map((route, i) => <Pedestrian key={i} route={route} />)}

            {mode === "race" &&
              RIVAL_SETUP.map((r, i) => (
                <RivalCar
                  key={i}
                  vehicleId={r.vehicleId}
                  colorOverride={r.color}
                  basePace={r.pace}
                  startIndex={(i + 1) % RACE_WAYPOINTS.length}
                  onReady={(handle) => {
                    rivalsRef.current[i] = handle;
                  }}
                />
              ))}

            {mode === "freeroam" && wantedLevel > 0 && telemetryRef.current && (
              <PoliceCar target={telemetryRef.current.position} speed={30 + wantedLevel * 4} />
            )}

            {mode === "race" && (
              <RaceDirector
                telemetryRef={telemetryRef}
                rivalsRef={rivalsRef}
                totalRacers={RIVAL_SETUP.length + 1}
                onUpdate={setRaceHud}
              />
            )}
          </CollidersProvider>
        </Canvas>
      </KeyboardControls>

      <HUD telemetryRef={telemetryRef} race={raceHud} />
    </div>
  );
}
