import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useVehicleControls } from "../../hooks/useVehicleControls";

export default function Vehicle() {
  const vehicleRef = useRef<RapierRigidBody>(null);
  const getControls = useVehicleControls();

  // Arcade Physics Constants
  const MAX_SPEED = 15;
  const ACCELERATION_SPEED = 5; // Higher = snappier start
  const STEERING_SPEED = 3;
  const JUMP_FORCE = 15;

  const smoothedCameraPosition = useMemo(
    () => new THREE.Vector3(10, 10, 10),
    [],
  );
  const smoothedCameraTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  // Track speed independently for snappy arcade acceleration
  const speedRef = useRef(0);

  useFrame((state, delta) => {
    if (!vehicleRef.current) return;

    const controls = getControls();
    const body = vehicleRef.current;

    // Wake body up to prevent sleeping
    if (Object.values(controls).some(Boolean)) {
      body.wakeUp();
    }

    // 1. ARCADE ACCELERATION (Snappy start)
    if (controls.forward) {
      speedRef.current = THREE.MathUtils.lerp(
        speedRef.current,
        MAX_SPEED,
        delta * ACCELERATION_SPEED,
      );
    } else if (controls.backward) {
      speedRef.current = THREE.MathUtils.lerp(
        speedRef.current,
        -MAX_SPEED,
        delta * ACCELERATION_SPEED,
      );
    } else if (controls.brake) {
      speedRef.current = THREE.MathUtils.lerp(speedRef.current, 0, delta * 10);
    } else {
      // Coasting to a natural stop
      speedRef.current = THREE.MathUtils.lerp(speedRef.current, 0, delta * 2);
    }

    // 2. ARCADE STEERING
    const isMovingBackward = speedRef.current < -0.1;
    const steeringDirection = isMovingBackward ? -1 : 1;

    // Only steer if moving
    if (Math.abs(speedRef.current) > 0.5) {
      if (controls.left) {
        body.setAngvel(
          { x: 0, y: STEERING_SPEED * steeringDirection, z: 0 },
          true,
        );
      } else if (controls.right) {
        body.setAngvel(
          { x: 0, y: -STEERING_SPEED * steeringDirection, z: 0 },
          true,
        );
      } else {
        body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    } else {
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    // 3. APPLY VELOCITY
    const quaternion = new THREE.Quaternion(
      body.rotation().x,
      body.rotation().y,
      body.rotation().z,
      body.rotation().w,
    );
    const forwardVector = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(quaternion)
      .normalize();
    const currentLinvel = body.linvel();

    // Override X and Z with our snappy speed, but keep Y for gravity/jumping
    body.setLinvel(
      {
        x: forwardVector.x * speedRef.current,
        y: currentLinvel.y,
        z: forwardVector.z * speedRef.current,
      },
      true,
    );

    // 4. JUMP
    if (controls.jump && Math.abs(currentLinvel.y) < 0.1) {
      body.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
    }

    // --- CAMERA FOLLOW LOGIC ---
    const carPosition = body.translation();
    const posVector = new THREE.Vector3(
      carPosition.x,
      carPosition.y,
      carPosition.z,
    );
    const cameraOffset = new THREE.Vector3(12, 12, 12);
    const targetCameraPosition = posVector.clone().add(cameraOffset);

    // CRITICAL FIX: Math.min limits the lerp factor.
    // Without this, tab switching makes delta huge, causing the camera to shoot to infinity (Blue Screen bug)
    const lerpFactor = Math.min(5 * delta, 1);

    smoothedCameraPosition.lerp(targetCameraPosition, lerpFactor);
    smoothedCameraTarget.lerp(posVector, lerpFactor);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);
  });

  const Wheel = ({
    position,
    isLeft,
  }: {
    position: [number, number, number];
    isLeft: boolean;
  }) => (
    <group position={position}>
      {/* Black Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      {/* Metallic Rim */}
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[isLeft ? -0.13 : 0.13, 0, 0]}
      >
        <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );

  return (
    <RigidBody
      ref={vehicleRef}
      colliders="cuboid"
      friction={0} // No friction needed since we manually set velocity
      enabledRotations={[false, true, false]}
      position={[0, 100.0, 0]}
    >
      <group position={[0, -0.2, 0]}>
        {/* Chassis / Lower Body */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.3, 3.4]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Upper Body / Cabin (Glassy look) */}
        <mesh position={[0, 0.7, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.4, 1.5]} />
          <meshStandardMaterial
            color="#000000"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Neon Side Accents (Tron style) */}
        <mesh position={[-0.81, 0.3, 0]}>
          <boxGeometry args={[0.02, 0.05, 2.5]} />
          <meshStandardMaterial
            color="#00ffcc"
            emissive="#00ffcc"
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[0.81, 0.3, 0]}>
          <boxGeometry args={[0.02, 0.05, 2.5]} />
          <meshStandardMaterial
            color="#00ffcc"
            emissive="#00ffcc"
            emissiveIntensity={2}
          />
        </mesh>

        {/* Tail lights (Neon Red) */}
        <mesh position={[0, 0.45, 1.71]}>
          <boxGeometry args={[1.2, 0.08, 0.02]} />
          <meshStandardMaterial
            color="#ff0055"
            emissive="#ff0055"
            emissiveIntensity={4}
          />
        </mesh>

        {/* Headlights (Neon White/Blue) */}
        <mesh position={[-0.6, 0.4, -1.71]}>
          <boxGeometry args={[0.3, 0.1, 0.02]} />
          <meshStandardMaterial
            color="#e0f2fe"
            emissive="#e0f2fe"
            emissiveIntensity={4}
          />
        </mesh>
        <mesh position={[0.6, 0.4, -1.71]}>
          <boxGeometry args={[0.3, 0.1, 0.02]} />
          <meshStandardMaterial
            color="#e0f2fe"
            emissive="#e0f2fe"
            emissiveIntensity={4}
          />
        </mesh>

        {/* Sports Spoiler */}
        <mesh position={[0, 0.9, 1.5]} castShadow>
          <boxGeometry args={[1.5, 0.05, 0.4]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Spoiler Struts */}
        <mesh position={[-0.5, 0.7, 1.5]} castShadow>
          <boxGeometry args={[0.05, 0.4, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.5, 0.7, 1.5]} castShadow>
          <boxGeometry args={[0.05, 0.4, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* 4 Wheels */}
        <Wheel position={[-0.9, 0.3, -1.1]} isLeft={true} />
        <Wheel position={[0.9, 0.3, -1.1]} isLeft={false} />
        <Wheel position={[-0.9, 0.3, 1.2]} isLeft={true} />
        <Wheel position={[0.9, 0.3, 1.2]} isLeft={false} />
      </group>
    </RigidBody>
  );
}
