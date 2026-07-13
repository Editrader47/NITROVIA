import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface PedestrianRoute {
  x: number;
  z: number;
  axis: "x" | "z";
  range: number;
  speed: number;
  color: string;
}

/** Minimal boxed pedestrian pacing back and forth along a sidewalk segment --
 * ambient life for the residential/park zones. */
export function Pedestrian({ route }: { route: PedestrianRoute }) {
  const groupRef = useRef<THREE.Group>(null!);
  const t = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    t.current += delta * route.speed;
    const offset = Math.sin(t.current) * route.range;
    const group = groupRef.current;
    if (!group) return;
    if (route.axis === "x") {
      group.position.set(route.x + offset, 0, route.z);
      group.rotation.y = Math.cos(t.current) > 0 ? Math.PI / 2 : -Math.PI / 2;
    } else {
      group.position.set(route.x, 0, route.z + offset);
      group.rotation.y = Math.cos(t.current) > 0 ? 0 : Math.PI;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.4, 1.1, 0.3]} />
        <meshStandardMaterial color={route.color} />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#e0ac69" />
      </mesh>
    </group>
  );
}
