import { useMemo } from "react";
import * as THREE from "three";

import type { VehicleDefinition } from "@/game/types";

const WHEEL_POSITIONS: [number, number, number][] = [
  [-0.85, 0.42, 1.25],
  [0.85, 0.42, 1.25],
  [-0.85, 0.42, -1.25],
  [0.85, 0.42, -1.25],
];

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.42, 0.42, 0.32, 16]} />
      <meshStandardMaterial color="#111214" />
    </mesh>
  );
}

/** Body-style dimensions and cabin proportions per vehicle category. Cars are
 * built from primitives (per the gamestack guidance) but shaped distinctly
 * enough to read as compact / muscle / SUV / pickup / sport / hyper / classic
 * / electric at a glance. */
function bodyDimensions(style: VehicleDefinition["bodyStyle"]) {
  switch (style) {
    case "hatch":
      return { body: [1.7, 0.7, 3.6], cabin: [1.4, 0.55, 1.8], cabinY: 0.95, cabinZ: 0.2, ground: 0.42 };
    case "muscle":
      return { body: [1.85, 0.62, 4.4], cabin: [1.5, 0.5, 1.9], cabinY: 0.85, cabinZ: -0.2, ground: 0.4 };
    case "suv":
      return { body: [1.9, 1.0, 4.2], cabin: [1.7, 0.7, 2.6], cabinY: 1.3, cabinZ: 0, ground: 0.5 };
    case "pickup":
      return { body: [1.9, 0.85, 4.6], cabin: [1.7, 0.6, 1.8], cabinY: 1.1, cabinZ: 1.1, ground: 0.48 };
    case "sport":
      return { body: [1.8, 0.55, 4.2], cabin: [1.45, 0.42, 1.6], cabinY: 0.78, cabinZ: 0.1, ground: 0.36 };
    case "hyper":
      return { body: [1.9, 0.48, 4.5], cabin: [1.4, 0.38, 1.5], cabinY: 0.68, cabinZ: -0.1, ground: 0.32 };
    case "classic":
      return { body: [1.75, 0.65, 4.3], cabin: [1.4, 0.5, 1.9], cabinY: 0.95, cabinZ: 0.15, ground: 0.42 };
    case "electric":
      return { body: [1.8, 0.58, 4.0], cabin: [1.45, 0.46, 2.0], cabinY: 0.82, cabinZ: 0.05, ground: 0.38 };
    default:
      return { body: [1.7, 0.7, 3.6], cabin: [1.4, 0.55, 1.8], cabinY: 0.95, cabinZ: 0.2, ground: 0.42 };
  }
}

export function CarModel({ vehicle }: { vehicle: VehicleDefinition }) {
  const dims = useMemo(() => bodyDimensions(vehicle.bodyStyle), [vehicle.bodyStyle]);
  const [bw, bh, bd] = dims.body;
  const [cw, ch, cd] = dims.cabin;

  return (
    <group>
      <mesh position={[0, dims.ground + bh / 2, 0]} castShadow>
        <boxGeometry args={[bw, bh, bd]} />
        <meshStandardMaterial color={vehicle.color} metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, dims.cabinY, dims.cabinZ]} castShadow>
        <boxGeometry args={[cw, ch, cd]} />
        <meshStandardMaterial color={vehicle.accentColor} metalness={0.2} roughness={0.3} transparent opacity={0.92} />
      </mesh>
      {/* Headlights */}
      <mesh position={[bw / 2 - 0.25, dims.ground + bh / 2, bd / 2 - 0.05]}>
        <boxGeometry args={[0.15, 0.15, 0.05]} />
        <meshStandardMaterial color="#fff6d6" emissive="#fff6d6" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-(bw / 2 - 0.25), dims.ground + bh / 2, bd / 2 - 0.05]}>
        <boxGeometry args={[0.15, 0.15, 0.05]} />
        <meshStandardMaterial color="#fff6d6" emissive="#fff6d6" emissiveIntensity={1.5} />
      </mesh>
      {/* Taillights */}
      <mesh position={[bw / 2 - 0.25, dims.ground + bh / 2, -(bd / 2 - 0.05)]}>
        <boxGeometry args={[0.15, 0.15, 0.05]} />
        <meshStandardMaterial color="#ff2d2d" emissive="#ff2d2d" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-(bw / 2 - 0.25), dims.ground + bh / 2, -(bd / 2 - 0.05)]}>
        <boxGeometry args={[0.15, 0.15, 0.05]} />
        <meshStandardMaterial color="#ff2d2d" emissive="#ff2d2d" emissiveIntensity={1.2} />
      </mesh>
      {WHEEL_POSITIONS.map((pos, i) => (
        <Wheel key={i} position={pos} />
      ))}
    </group>
  );
}

export function tailColor(color: string) {
  return new THREE.Color(color).multiplyScalar(0.6).getStyle();
}
