import { useEffect, useMemo } from "react";
import * as THREE from "three";

import { WORLD_HALF_SIZE, BLOCK_SIZE } from "@/game/constants";
import { mulberry32 } from "@/game/world/rng";
import { useColliders, type StaticCollider } from "@/game/world/colliders";
import { TrafficLights } from "@/game/world/TrafficLights";

interface BoxProp {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: string;
  radius: number;
}

function generateGrid(
  rng: () => number,
  opts: {
    xRange: [number, number];
    zRange: [number, number];
    cell: number;
    margin: number;
    minH: number;
    maxH: number;
    colors: string[];
    skipChance?: number;
  },
): BoxProp[] {
  const items: BoxProp[] = [];
  const { xRange, zRange, cell, margin, minH, maxH, colors, skipChance = 0.15 } = opts;
  for (let x = xRange[0]; x <= xRange[1]; x += cell) {
    for (let z = zRange[0]; z <= zRange[1]; z += cell) {
      if (rng() < skipChance) continue;
      const w = cell - margin * 2;
      const d = cell - margin * 2;
      const h = minH + rng() * (maxH - minH);
      const color = colors[Math.floor(rng() * colors.length)];
      items.push({ x, z, w, d, h, color, radius: Math.max(w, d) / 2 });
    }
  }
  return items;
}

function BuildingBlocks({ items }: { items: BoxProp[] }) {
  return (
    <group>
      {items.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color={b.color} />
        </mesh>
      ))}
    </group>
  );
}

function GroundPatch({
  x,
  z,
  w,
  d,
  color,
  y = 0.01,
}: {
  x: number;
  z: number;
  w: number;
  d: number;
  color: string;
  y?: number;
}) {
  return (
    <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function StreetGrid() {
  const lines = useMemo(() => {
    const items: { x: number; z: number; horizontal: boolean }[] = [];
    for (let v = -WORLD_HALF_SIZE; v <= WORLD_HALF_SIZE; v += BLOCK_SIZE) {
      items.push({ x: v, z: 0, horizontal: false });
      items.push({ x: 0, z: v, horizontal: true });
    }
    return items;
  }, []);

  return (
    <group>
      {lines.map((l, i) => (
        <mesh
          key={i}
          position={[l.x, 0.03, l.z]}
          rotation={[-Math.PI / 2, 0, l.horizontal ? 0 : Math.PI / 2]}
        >
          <planeGeometry args={[0.5, WORLD_HALF_SIZE * 2]} />
          <meshStandardMaterial color="#e2c94a" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function Trees({ items }: { items: { x: number; z: number; scale: number }[] }) {
  return (
    <group>
      {items.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.scale}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.25, 0.32, 2.4, 6]} />
            <meshStandardMaterial color="#5a3a22" />
          </mesh>
          <mesh position={[0, 3, 0]}>
            <coneGeometry args={[1.6, 3.2, 8]} />
            <meshStandardMaterial color="#2f7d3a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PalmTrees({ items }: { items: { x: number; z: number }[] }) {
  return (
    <group>
      {items.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh position={[0, 2, 0]} rotation={[0.12, 0, 0.08]}>
            <cylinderGeometry args={[0.16, 0.24, 4, 6]} />
            <meshStandardMaterial color="#8a6a3a" />
          </mesh>
          <mesh position={[0.2, 4.1, 0.1]}>
            <sphereGeometry args={[1.1, 8, 6]} />
            <meshStandardMaterial color="#3fae4e" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Full urban world: financial core, residential belt, port, airport, park,
 * mountain and beach, plus a bridge and an underpass ("tunnel"). Registers
 * every solid prop into the shared collider list once on mount. */
export function City() {
  const colliders = useColliders();

  const financial = useMemo(
    () =>
      generateGrid(mulberry32(11), {
        xRange: [-60, 60],
        zRange: [-60, 60],
        cell: BLOCK_SIZE,
        margin: 7,
        minH: 18,
        maxH: 58,
        colors: ["#3b4a63", "#4a5b7a", "#5c7099", "#2c3648"],
        skipChance: 0.08,
      }),
    [],
  );

  const residential = useMemo(
    () =>
      generateGrid(mulberry32(22), {
        xRange: [-180, 180],
        zRange: [-220, -100],
        cell: BLOCK_SIZE,
        margin: 9,
        minH: 4,
        maxH: 9,
        colors: ["#c96a4b", "#d9a441", "#8f9779", "#b5573b", "#c2a878"],
        skipChance: 0.2,
      }),
    [],
  );

  const port = useMemo(
    () =>
      generateGrid(mulberry32(33), {
        xRange: [150, 250],
        zRange: [-80, 20],
        cell: 20,
        margin: 4,
        minH: 5,
        maxH: 12,
        colors: ["#8f5a2b", "#3c6478", "#b5601f", "#5a5a5a"],
        skipChance: 0.15,
      }),
    [],
  );

  const cranes = useMemo(
    () => [
      { x: 240, z: 60, w: 2, d: 2, h: 22, color: "#e0a52b", radius: 3 },
      { x: 240, z: 90, w: 2, d: 2, h: 26, color: "#e0a52b", radius: 3 },
      { x: 210, z: 100, w: 2, d: 2, h: 20, color: "#e0a52b", radius: 3 },
    ],
    [],
  );

  const parkTrees = useMemo(() => {
    const rng = mulberry32(44);
    return Array.from({ length: 60 }, () => ({
      x: -130 + rng() * 260,
      z: 100 + rng() * 150,
      scale: 0.8 + rng() * 0.6,
    })).filter((t) => Math.hypot(t.x, t.z - 175) < 130);
  }, []);

  const beachPalms = useMemo(() => {
    const rng = mulberry32(55);
    return Array.from({ length: 24 }, () => ({
      x: -250 + rng() * 90,
      z: 150 + rng() * 100,
    }));
  }, []);

  useEffect(() => {
    const toCollider = (b: BoxProp): StaticCollider => ({ x: b.x, z: b.z, radius: b.radius });
    colliders.register([
      ...financial.map(toCollider),
      ...residential.map(toCollider),
      ...port.map(toCollider),
      ...cranes.map(toCollider),
      // Airport control tower
      { x: -230, z: -20, radius: 4 },
      // Mountain mass
      { x: 205, z: 205, radius: 62 },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group>
      {/* Base asphalt for the whole map */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[WORLD_HALF_SIZE * 2 + 40, WORLD_HALF_SIZE * 2 + 40]} />
        <meshStandardMaterial color="#33343c" />
      </mesh>

      <StreetGrid />
      <TrafficLights />

      {/* Financial district */}
      <GroundPatch x={0} z={0} w={140} d={140} color="#3a3f4d" />
      <BuildingBlocks items={financial} />

      {/* Residential belt */}
      <GroundPatch x={0} z={-160} w={400} d={140} color="#4a4030" />
      <BuildingBlocks items={residential} />

      {/* Port + water inlet + bridge */}
      <GroundPatch x={200} z={-30} w={110} d={120} color="#565656" />
      <mesh position={[200, 0.02, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 40]} />
        <meshStandardMaterial color="#1f5c7a" />
      </mesh>
      <mesh position={[200, 2.6, -5]} receiveShadow>
        <boxGeometry args={[16, 0.6, 44]} />
        <meshStandardMaterial color="#8a8f99" />
      </mesh>
      <mesh position={[200, 2.9, -27]}>
        <boxGeometry args={[16, 1.2, 0.4]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      <mesh position={[200, 2.9, 17]}>
        <boxGeometry args={[16, 1.2, 0.4]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      <BuildingBlocks items={port} />
      <BuildingBlocks items={cranes} />

      {/* Airport */}
      <GroundPatch x={-200} z={-20} w={110} d={160} color="#26272c" />
      <mesh position={[-200, 0.03, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 140]} />
        <meshStandardMaterial color="#1b1c20" />
      </mesh>
      <mesh position={[-230, 12, -20]}>
        <cylinderGeometry args={[3, 4, 24, 10]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[-230, 25.5, -20]}>
        <boxGeometry args={[7, 3, 7]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Park */}
      <GroundPatch x={0} z={175} w={280} d={150} color="#2f6b3a" />
      <mesh position={[40, 0.02, 175]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[18, 24]} />
        <meshStandardMaterial color="#2a6fa0" />
      </mesh>
      <Trees items={parkTrees} />

      {/* Beach + ocean */}
      <GroundPatch x={-200} z={200} w={110} d={120} color="#d9c48c" />
      <mesh position={[-200, 0.005, 250]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[130, 60]} />
        <meshStandardMaterial color="#1f6fa0" />
      </mesh>
      <PalmTrees items={beachPalms} />

      {/* Mountain */}
      <mesh position={[205, 0, 205]}>
        <coneGeometry args={[62, 55, 24]} />
        <meshStandardMaterial color="#5c6b4d" />
      </mesh>
      <mesh position={[205, 45, 205]}>
        <coneGeometry args={[22, 20, 24]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Underpass linking financial and residential zones */}
      <group position={[0, 0, -88]}>
        <mesh position={[-14, 3, 0]}>
          <boxGeometry args={[2, 6, 2]} />
          <meshStandardMaterial color="#4b4b52" />
        </mesh>
        <mesh position={[14, 3, 0]}>
          <boxGeometry args={[2, 6, 2]} />
          <meshStandardMaterial color="#4b4b52" />
        </mesh>
        <mesh position={[0, 6.3, 0]}>
          <boxGeometry args={[32, 1.2, 10]} />
          <meshStandardMaterial color="#6b6b74" />
        </mesh>
      </group>
    </group>
  );
}
