import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";

export interface StaticCollider {
  x: number;
  z: number;
  radius: number;
}

interface CollidersApi {
  register: (colliders: StaticCollider[]) => void;
  getAll: () => StaticCollider[];
}

const CollidersContext = createContext<CollidersApi | null>(null);

export function CollidersProvider({ children }: { children: ReactNode }) {
  const listRef = useRef<StaticCollider[]>([]);

  const api = useMemo<CollidersApi>(
    () => ({
      register: (colliders) => {
        listRef.current = listRef.current.concat(colliders);
      },
      getAll: () => listRef.current,
    }),
    [],
  );

  return <CollidersContext.Provider value={api}>{children}</CollidersContext.Provider>;
}

export function useColliders(): CollidersApi {
  const ctx = useContext(CollidersContext);
  if (!ctx) {
    throw new Error("useColliders must be used within a CollidersProvider");
  }
  return ctx;
}

/** Resolve a circular collision by pushing (x, z) out of any overlapping static collider. */
export function resolveStaticCollision(
  x: number,
  z: number,
  selfRadius: number,
  colliders: StaticCollider[],
): { x: number; z: number; hit: boolean } {
  let outX = x;
  let outZ = z;
  let hit = false;
  for (const c of colliders) {
    const dx = outX - c.x;
    const dz = outZ - c.z;
    const distSq = dx * dx + dz * dz;
    const minDist = c.radius + selfRadius;
    if (distSq < minDist * minDist) {
      const dist = Math.sqrt(distSq) || 0.001;
      const push = minDist - dist;
      outX += (dx / dist) * push;
      outZ += (dz / dist) * push;
      hit = true;
    }
  }
  return { x: outX, z: outZ, hit };
}
