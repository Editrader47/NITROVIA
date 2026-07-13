import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { CarModel } from "@/game/vehicles/CarModel";
import { getVehicleById } from "@/game/data/vehicles";
import type { TrackWaypoint } from "@/game/world/RaceTrack";

export interface TrafficRoute {
  loop: TrackWaypoint[];
  speed: number;
  vehicleId: string;
  startIndex: number;
}

/** Ambient city traffic driving a fixed loop of waypoints, purely visual life
 * for free-roam driving (no collision with the player to keep v1 forgiving). */
export function TrafficCar({ route }: { route: TrafficRoute }) {
  const groupRef = useRef<THREE.Group>(null!);
  const targetIndex = useRef(route.startIndex);
  const vehicle = useMemo(() => getVehicleById(route.vehicleId), [route.vehicleId]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const target = route.loop[targetIndex.current];
    const dx = target.x - group.position.x;
    const dz = target.z - group.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 3) {
      targetIndex.current = (targetIndex.current + 1) % route.loop.length;
      return;
    }
    const heading = Math.atan2(dx, dz);
    group.rotation.y = heading;
    const step = Math.min(dist, route.speed * delta);
    group.position.x += Math.sin(heading) * step;
    group.position.z += Math.cos(heading) * step;
  });

  return (
    <group ref={groupRef} position={[route.loop[route.startIndex].x, 0, route.loop[route.startIndex].z]}>
      <CarModel vehicle={vehicle} />
    </group>
  );
}
