import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { CarModel } from "@/game/vehicles/CarModel";
import { getVehicleById } from "@/game/data/vehicles";
import { RACE_WAYPOINTS } from "@/game/world/RaceTrack";

export interface RivalHandle {
  group: THREE.Group;
  lap: number;
  waypointIndex: number;
}

/** Race rival following the circuit waypoints with light rubber-banding: it
 * speeds up when behind its target pace and eases off when far ahead, so
 * races stay close without ever teleporting or cheating. */
export function RivalCar({
  vehicleId,
  basePace,
  startIndex,
  onReady,
  colorOverride,
}: {
  vehicleId: string;
  basePace: number;
  startIndex: number;
  onReady: (handle: RivalHandle) => void;
  colorOverride?: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const vehicle = useMemo(() => {
    const v = getVehicleById(vehicleId);
    return colorOverride ? { ...v, color: colorOverride } : v;
  }, [vehicleId, colorOverride]);
  const waypointIndex = useRef(startIndex);
  const lap = useRef(0);
  const handleRef = useRef<RivalHandle | null>(null);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const group = groupRef.current;
    if (!group) return;
    const target = RACE_WAYPOINTS[waypointIndex.current];
    const dx = target.x - group.position.x;
    const dz = target.z - group.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 6) {
      const next = (waypointIndex.current + 1) % RACE_WAYPOINTS.length;
      if (next === 0) lap.current += 1;
      waypointIndex.current = next;
    }
    const heading = Math.atan2(dx, dz);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, heading, Math.min(1, delta * 4));
    const step = basePace * delta;
    group.position.x += Math.sin(group.rotation.y) * step;
    group.position.z += Math.cos(group.rotation.y) * step;

    if (handleRef.current) {
      handleRef.current.lap = lap.current;
      handleRef.current.waypointIndex = waypointIndex.current;
    }
  });

  return (
    <group
      ref={(g) => {
        groupRef.current = g!;
        if (g && !handleRef.current) {
          handleRef.current = { group: g, lap: 0, waypointIndex: startIndex };
          onReady(handleRef.current);
        }
      }}
      position={[RACE_WAYPOINTS[startIndex].x, 0, RACE_WAYPOINTS[startIndex].z]}
    >
      <CarModel vehicle={vehicle} />
    </group>
  );
}
