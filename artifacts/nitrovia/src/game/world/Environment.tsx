import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { DAY_NIGHT_CYCLE_SECONDS } from "@/game/constants";
import { useGameStore } from "@/game/state/store";

const DAY_SKY = new THREE.Color("#7ec8ff");
const SUNSET_SKY = new THREE.Color("#ff9a5a");
const NIGHT_SKY = new THREE.Color("#050818");
const RAIN_SKY = new THREE.Color("#3d4552");

const DAY_FOG = new THREE.Color("#bcdfff");
const NIGHT_FOG = new THREE.Color("#02030c");

function sampleDayPhase(t: number) {
  // t in [0, 1): 0 = midday, 0.25 = dusk, 0.5 = midnight, 0.75 = dawn
  const sun = Math.cos(t * Math.PI * 2) * 0.5 + 0.5; // 1 at noon, 0 at midnight
  return sun;
}

const RAIN_COUNT = 800;

function RainDrops() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const drops = useMemo(
    () =>
      Array.from({ length: RAIN_COUNT }, () => ({
        x: (Math.random() - 0.5) * 220,
        z: (Math.random() - 0.5) * 220,
        y: Math.random() * 60,
        speed: 40 + Math.random() * 20,
      })),
    [],
  );

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      d.y -= d.speed * delta;
      if (d.y < 0) d.y = 60;
      dummy.position.set(d.x, d.y, d.z);
      dummy.rotation.x = Math.PI / 2.2;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, RAIN_COUNT]} frustumCulled={false}>
      <cylinderGeometry args={[0.02, 0.02, 0.9, 4]} />
      <meshBasicMaterial color="#bcd8ff" transparent opacity={0.5} />
    </instancedMesh>
  );
}

/** Drives the day/night cycle, sky color, fog and (optional) rain. Anchored
 * to the player so rain always surrounds the camera regardless of position. */
export function WorldEnvironment({
  followTarget,
}: {
  followTarget: React.RefObject<THREE.Group | null>;
}) {
  const weather = useGameStore((s) => s.weather);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const rainGroupRef = useRef<THREE.Group>(null);
  const skyColorRef = useRef(new THREE.Color());
  const fogColorRef = useRef(new THREE.Color());
  const phaseRef = useRef(0);

  useFrame(({ scene }, delta) => {
    phaseRef.current = (phaseRef.current + delta / DAY_NIGHT_CYCLE_SECONDS) % 1;
    const sunAmount = sampleDayPhase(phaseRef.current);
    const dusk = Math.max(0, 1 - Math.abs(sunAmount - 0.35) * 4);

    const sky = skyColorRef.current;
    if (weather === "rain") {
      sky.copy(RAIN_SKY);
    } else {
      sky.copy(NIGHT_SKY).lerp(DAY_SKY, Math.max(0, sunAmount));
      sky.lerp(SUNSET_SKY, dusk * 0.5);
    }
    scene.background = sky;

    const fog = fogColorRef.current;
    fog.copy(NIGHT_FOG).lerp(DAY_FOG, Math.max(0, sunAmount));
    if (weather === "rain") fog.lerp(RAIN_SKY, 0.6);
    if (!scene.fog) {
      scene.fog = new THREE.Fog(fog.getHex(), 60, weather === "rain" ? 180 : 320);
    } else if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(fog);
      scene.fog.far = weather === "rain" ? 180 : 320;
    }

    const sun = sunRef.current;
    if (sun) {
      const angle = phaseRef.current * Math.PI * 2;
      sun.position.set(Math.cos(angle) * 150, Math.max(20, Math.sin(angle) * 150), 60);
      sun.intensity = weather === "rain" ? 0.35 : 0.4 + Math.max(0, sunAmount) * 1.2;
      sun.color.set(dusk > 0.4 ? "#ffb066" : "#fff3d6");
    }

    const target = followTarget.current;
    if (rainGroupRef.current && target) {
      rainGroupRef.current.position.set(target.position.x, 0, target.position.z);
    }
  });

  return (
    <>
      <ambientLight intensity={0.55} color="#c9d8ff" />
      <directionalLight ref={sunRef} position={[80, 100, 60]} intensity={1.1} castShadow={false} />
      <hemisphereLight args={["#8fb8ff", "#1a1a22", 0.4]} />
      {weather === "rain" && (
        <group ref={rainGroupRef}>
          <RainDrops />
        </group>
      )}
    </>
  );
}
