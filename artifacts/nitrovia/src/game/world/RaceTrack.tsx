import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { CHECKPOINT_RADIUS } from "@/game/constants";

export interface TrackWaypoint {
  x: number;
  z: number;
}

export interface RampSpot {
  x: number;
  z: number;
  rotation: number;
}

// A rectangular circuit through the financial/residential core -- always
// clear of the outer zones (port/airport/mountain/beach) which sit past |x|
// or |z| > 100.
export const RACE_WAYPOINTS: TrackWaypoint[] = [
  { x: -40, z: -40 },
  { x: 40, z: -40 },
  { x: 80, z: -20 },
  { x: 80, z: 40 },
  { x: 40, z: 80 },
  { x: -40, z: 80 },
  { x: -80, z: 40 },
  { x: -80, z: -20 },
];

export const RACE_RAMPS: RampSpot[] = [
  { x: 40, z: -40, rotation: 0 },
  { x: -80, z: 10, rotation: Math.PI / 2 },
];

export const TOTAL_LAPS = 3;

function CheckpointGate({
  waypoint,
  index,
  active,
}: {
  waypoint: TrackWaypoint;
  index: number;
  active: boolean;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 1.5;
      const mat = ringRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = active ? 1.6 + Math.sin(clock.elapsedTime * 6) * 0.4 : 0.4;
    }
  });

  return (
    <group position={[waypoint.x, 2.2, waypoint.z]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[CHECKPOINT_RADIUS, 0.35, 12, 32]} />
        <meshStandardMaterial
          color={active ? "#ffd60a" : "#38bdf8"}
          emissive={active ? "#ffd60a" : "#38bdf8"}
          emissiveIntensity={active ? 1.6 : 0.4}
        />
      </mesh>
      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
        <meshStandardMaterial color="#000000" transparent opacity={0} />
      </mesh>
    </group>
  );
}

export function RaceTrackVisual({ activeCheckpoint }: { activeCheckpoint: number }) {
  return (
    <group>
      {RACE_WAYPOINTS.map((wp, i) => (
        <CheckpointGate key={i} waypoint={wp} index={i} active={i === activeCheckpoint} />
      ))}
      {RACE_RAMPS.map((r, i) => (
        <Ramp key={i} {...r} />
      ))}
    </group>
  );
}

export function Ramp({ x, z, rotation }: RampSpot) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.75, 0]} rotation={[-0.35, 0, 0]} castShadow>
        <boxGeometry args={[7, 0.4, 9]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      <mesh position={[0, 0.2, -4]}>
        <boxGeometry args={[7, 0.4, 1.5]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
    </group>
  );
}

export function useTrackColliderRegistration(): RampSpot[] {
  // Ramps are launch triggers, not solid colliders, so nothing to register.
  return useMemo(() => RACE_RAMPS, []);
}
