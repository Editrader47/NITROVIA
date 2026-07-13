import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TrafficLightPost {
  x: number;
  z: number;
  rotation: number;
  offset: number;
}

const CYCLE = 8; // seconds per red/green phase

function TrafficLight({ x, z, rotation, offset }: TrafficLightPost) {
  const redRef = useRef<THREE.Mesh>(null);
  const greenRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const phase = ((clock.elapsedTime + offset) % (CYCLE * 2)) < CYCLE;
    const redMat = redRef.current?.material as THREE.MeshStandardMaterial | undefined;
    const greenMat = greenRef.current?.material as THREE.MeshStandardMaterial | undefined;
    if (redMat) redMat.emissiveIntensity = phase ? 2.2 : 0.05;
    if (greenMat) greenMat.emissiveIntensity = phase ? 0.05 : 2.2;
  });

  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 4.4, 6]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      <mesh position={[0, 4.2, 0.35]}>
        <boxGeometry args={[0.4, 0.9, 0.4]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh ref={redRef} position={[0, 4.5, 0.58]}>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial color="#ff2222" emissive="#ff2222" emissiveIntensity={0.05} />
      </mesh>
      <mesh ref={greenRef} position={[0, 4.05, 0.58]}>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial color="#22ff66" emissive="#22ff66" emissiveIntensity={0.05} />
      </mesh>
    </group>
  );
}

/** Traffic-light posts placed at the main avenue intersections. Purely
 * atmospheric in v1 (traffic AI does not yet obey them). */
export function TrafficLights() {
  const posts = useMemo<TrafficLightPost[]>(() => {
    const list: TrafficLightPost[] = [];
    const crossings = [-80, -40, 40, 80];
    for (const x of crossings) {
      for (const z of crossings) {
        list.push({ x: x + 6, z: z + 6, rotation: 0, offset: (x + z) * 0.05 });
        list.push({ x: x - 6, z: z - 6, rotation: Math.PI, offset: (x + z) * 0.05 + 4 });
      }
    }
    return list;
  }, []);

  return (
    <group>
      {posts.map((p, i) => (
        <TrafficLight key={i} {...p} />
      ))}
    </group>
  );
}
