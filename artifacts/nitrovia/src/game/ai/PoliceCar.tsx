import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { CarModel } from "@/game/vehicles/CarModel";
import { getVehicleById } from "@/game/data/vehicles";

const POLICE_VEHICLE = { ...getVehicleById("iron-bull"), color: "#0f172a", accentColor: "#ffffff" };

/** Simple pursuit AI: chases the player's current position directly. Spawned
 * only while the player has an active wanted level (see HUD "wanted" system).
 * This is deliberately simple in v1 -- straight-line pursuit with siren
 * lights, not full pathfinding. */
export function PoliceCar({ target, speed = 34 }: { target: THREE.Vector3; speed?: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.Mesh>(null);
  const vehicle = useMemo(() => POLICE_VEHICLE, []);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const dx = target.x - group.position.x;
    const dz = target.z - group.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist > 1.5) {
      const heading = Math.atan2(dx, dz);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, heading, Math.min(1, delta * 3));
      const step = Math.min(dist, speed * delta);
      group.position.x += Math.sin(group.rotation.y) * step;
      group.position.z += Math.cos(group.rotation.y) * step;
    }
    if (lightRef.current) {
      const mat = lightRef.current.material as THREE.MeshStandardMaterial;
      mat.color.set(Math.sin(clock.elapsedTime * 10) > 0 ? "#ff2222" : "#2255ff");
      mat.emissive.copy(mat.color);
    }
  });

  return (
    <group ref={groupRef} position={[target.x + 20, 0, target.z + 20]}>
      <CarModel vehicle={vehicle} />
      <mesh ref={lightRef} position={[0, 1.15, 0]}>
        <boxGeometry args={[0.5, 0.15, 0.3]} />
        <meshStandardMaterial color="#ff2222" emissive="#ff2222" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}
