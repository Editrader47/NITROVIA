import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";

import { Controls } from "@/game/state/controls";
import { GRAVITY, WORLD_HALF_SIZE } from "@/game/constants";
import type { VehicleDefinition } from "@/game/types";
import { CarModel } from "@/game/vehicles/CarModel";
import { useColliders, resolveStaticCollision } from "@/game/world/colliders";
import { RACE_RAMPS } from "@/game/world/RaceTrack";

export interface PlayerTelemetry {
  speed: number; // world units/sec, signed
  speedKmh: number;
  nitro: number; // 0..1
  drifting: boolean;
  airborne: boolean;
  position: THREE.Vector3;
  heading: number;
}

export interface PlayerCarHandle {
  group: THREE.Group;
  telemetry: PlayerTelemetry;
}

const NITRO_DRAIN = 0.45; // per second while boosting
const NITRO_DRIFT_GAIN = 0.35; // per second while drifting
const NITRO_IDLE_GAIN = 0.05;

export function PlayerCar({
  vehicle,
  onReady,
  startPosition = [0, 0, 0],
  startHeading = 0,
}: {
  vehicle: VehicleDefinition;
  onReady: (handle: PlayerCarHandle) => void;
  startPosition?: [number, number, number];
  startHeading?: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const [, getControls] = useKeyboardControls<Controls>();
  const colliders = useColliders();
  const { camera } = useThree();

  const velocity = useRef(new THREE.Vector3());
  const speed = useRef(0);
  const heading = useRef(startHeading);
  const verticalVelocity = useRef(0);
  const airborne = useRef(false);
  const nitroAmount = useRef(1);
  const cameraYaw = useRef(startHeading);
  const rampCooldown = useRef(0);

  const telemetry = useMemo<PlayerTelemetry>(
    () => ({
      speed: 0,
      speedKmh: 0,
      nitro: 1,
      drifting: false,
      airborne: false,
      position: new THREE.Vector3(...startPosition),
      heading: startHeading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...startPosition);
      groupRef.current.rotation.y = startHeading;
      heading.current = startHeading;
      cameraYaw.current = startHeading;
      onReady({ group: groupRef.current, telemetry });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const group = groupRef.current;
    if (!group) return;
    const controls = getControls();

    const stats = vehicle.stats;
    const throttle = controls.forward ? 1 : controls.back ? -1 : 0;
    const steerInput = (controls.left ? 1 : 0) - (controls.right ? 1 : 0);
    const handbrake = controls.handbrake;
    const wantsNitro = controls.nitro && nitroAmount.current > 0.02;

    // --- Longitudinal speed ---
    const maxSpeed = stats.topSpeed * (wantsNitro ? stats.nitroPower : 1);
    if (throttle > 0) {
      speed.current += stats.acceleration * delta;
    } else if (throttle < 0) {
      if (speed.current > 0.5) {
        speed.current -= stats.braking * delta;
      } else {
        speed.current -= stats.acceleration * 0.6 * delta;
      }
    } else {
      // natural drag
      speed.current -= Math.sign(speed.current) * stats.braking * 0.35 * delta;
      if (Math.abs(speed.current) < 0.4) speed.current = 0;
    }
    speed.current = THREE.MathUtils.clamp(speed.current, -maxSpeed * 0.4, maxSpeed);

    // --- Nitro meter ---
    if (wantsNitro && Math.abs(speed.current) > 1) {
      nitroAmount.current = Math.max(0, nitroAmount.current - NITRO_DRAIN * delta);
    } else if (handbrake && Math.abs(speed.current) > 5) {
      nitroAmount.current = Math.min(1, nitroAmount.current + NITRO_DRIFT_GAIN * delta);
    } else {
      nitroAmount.current = Math.min(1, nitroAmount.current + NITRO_IDLE_GAIN * delta);
    }

    // --- Steering & drift ---
    const speedFactor = THREE.MathUtils.clamp(Math.abs(speed.current) / (stats.topSpeed * 0.5), 0.15, 1);
    const isDrifting = handbrake && Math.abs(speed.current) > 6 && Math.abs(steerInput) > 0.1;
    const gripSteerMultiplier = isDrifting ? 1 + (1 - stats.driftGrip) * 0.9 : 1;
    const turnRate = stats.handling * speedFactor * gripSteerMultiplier * (speed.current < 0 ? -1 : 1);
    heading.current += steerInput * turnRate * delta;

    // --- Integrate horizontal position ---
    const forward = new THREE.Vector3(Math.sin(heading.current), 0, Math.cos(heading.current));
    let moveX = forward.x * speed.current * delta;
    let moveZ = forward.z * speed.current * delta;

    if (isDrifting) {
      // Slide sideways relative to heading while drifting for a visible arc.
      const lateral = new THREE.Vector3(Math.cos(heading.current), 0, -Math.sin(heading.current));
      const slideAmount = steerInput * Math.abs(speed.current) * 0.28 * delta;
      moveX += lateral.x * slideAmount;
      moveZ += lateral.z * slideAmount;
    }

    let nextX = group.position.x + moveX;
    let nextZ = group.position.z + moveZ;

    nextX = THREE.MathUtils.clamp(nextX, -WORLD_HALF_SIZE, WORLD_HALF_SIZE);
    nextZ = THREE.MathUtils.clamp(nextZ, -WORLD_HALF_SIZE, WORLD_HALF_SIZE);

    const resolved = resolveStaticCollision(nextX, nextZ, 1.6, colliders.getAll());
    if (resolved.hit) {
      speed.current *= 0.35;
    }

    // --- Ramps / jumps ---
    rampCooldown.current = Math.max(0, rampCooldown.current - delta);
    if (!airborne.current && rampCooldown.current <= 0) {
      for (const ramp of RACE_RAMPS) {
        const dx = resolved.x - ramp.x;
        const dz = resolved.z - ramp.z;
        if (Math.hypot(dx, dz) < 4.5 && Math.abs(speed.current) > 12) {
          verticalVelocity.current = 12 + Math.abs(speed.current) * 0.15;
          airborne.current = true;
          rampCooldown.current = 1.2;
          break;
        }
      }
    }

    // --- Vertical integration (gravity / jumps) ---
    let nextY = group.position.y;
    if (airborne.current || nextY > 0.001) {
      verticalVelocity.current += GRAVITY * delta;
      nextY += verticalVelocity.current * delta;
      if (nextY <= 0) {
        nextY = 0;
        verticalVelocity.current = 0;
        airborne.current = false;
      }
    }

    group.position.set(resolved.x, nextY, resolved.z);
    group.rotation.set(
      isDrifting ? -steerInput * 0.05 : 0,
      heading.current,
      isDrifting ? -steerInput * 0.12 : 0,
    );

    // --- Chase camera ---
    let yawDiff = heading.current - cameraYaw.current;
    while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
    while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
    cameraYaw.current += yawDiff * Math.min(1, delta * 4);
    const camDistance = 8 + Math.min(4, Math.abs(speed.current) * 0.05);
    const camHeight = 3.4;
    const camBack = new THREE.Vector3(Math.sin(cameraYaw.current), 0, Math.cos(cameraYaw.current)).multiplyScalar(
      -camDistance,
    );
    const desiredCamPos = new THREE.Vector3(resolved.x, nextY, resolved.z).add(camBack).add(
      new THREE.Vector3(0, camHeight, 0),
    );
    camera.position.lerp(desiredCamPos, Math.min(1, delta * 5));
    const lookTarget = new THREE.Vector3(resolved.x, nextY + 1.1, resolved.z);
    camera.lookAt(lookTarget);

    // --- Telemetry for HUD/race logic ---
    telemetry.speed = speed.current;
    telemetry.speedKmh = Math.abs(speed.current) * 3.2;
    telemetry.nitro = nitroAmount.current;
    telemetry.drifting = isDrifting;
    telemetry.airborne = airborne.current;
    telemetry.position.set(resolved.x, nextY, resolved.z);
    telemetry.heading = heading.current;
  });

  return (
    <group ref={groupRef}>
      <CarModel vehicle={vehicle} />
    </group>
  );
}
