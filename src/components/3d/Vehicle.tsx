import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useVehicleControls } from "../../hooks/useVehicleControls";

export default function Vehicle() {
  const vehicleRef = useRef<RapierRigidBody>(null);
  const getControls = useVehicleControls();

  // Constants for vehicle tuning
  const ENGINE_POWER = 15;
  const STEERING_SPEED = 3;
  const BRAKE_POWER = 2;
  const JUMP_FORCE = 8;

  // We use a smoothed camera position so it doesn't jerk
  // The camera will try to follow the vehicle from an isometric perspective
  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(10, 10, 10),
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!vehicleRef.current) return;

    const controls = getControls();

    // Physics body calculations
    const body = vehicleRef.current;
    const linerVelocity = body.linvel(); // Current velocity

    // 1. Forward / Backward (Impulse applied relative to current rotation)
    // Create a vector representing "forward" in local space
    const forwardVector = new THREE.Vector3(0, 0, -1);

    // Get the current rotation of the rigid body as a quaternion
    const quaternion = new THREE.Quaternion(
      body.rotation().x,
      body.rotation().y,
      body.rotation().z,
      body.rotation().w,
    );

    // Apply the rotation to the forward vector
    forwardVector.applyQuaternion(quaternion);
    forwardVector.normalize();

    if (controls.forward) {
      body.applyImpulse(
        {
          x: forwardVector.x * ENGINE_POWER * delta,
          y: 0,
          z: forwardVector.z * ENGINE_POWER * delta,
        },
        true,
      );
    }

    if (controls.backward) {
      body.applyImpulse(
        {
          x: -forwardVector.x * ENGINE_POWER * delta,
          y: 0,
          z: -forwardVector.z * ENGINE_POWER * delta,
        },
        true,
      );
    }

    // 2. Steering (Torque applied on the Y axis)
    // Only steer when we are moving to simulate real car mechanics roughly
    const speed = Math.sqrt(linerVelocity.x ** 2 + linerVelocity.z ** 2);
    const isMoving = speed > 0.5;

    // Determine steering direction based on forward/backward movement
    // If moving backward, invert steering
    const isMovingBackward = controls.backward && !controls.forward;
    const steeringMultiplier = isMovingBackward ? -1 : 1;

    if (isMoving && controls.left) {
      body.applyTorqueImpulse(
        { x: 0, y: STEERING_SPEED * steeringMultiplier * delta, z: 0 },
        true,
      );
    }

    if (isMoving && controls.right) {
      body.applyTorqueImpulse(
        { x: 0, y: -STEERING_SPEED * steeringMultiplier * delta, z: 0 },
        true,
      );
    }

    // 3. Jump (Impulse up) - Basic check if close to ground based on Y velocity
    if (controls.jump && Math.abs(linerVelocity.y) < 0.1) {
      body.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
    }

    // 4. Brakes (Apply dampening force opposite to velocity)
    if (controls.brake) {
      body.applyImpulse(
        {
          x: -linerVelocity.x * BRAKE_POWER * delta,
          y: 0,
          z: -linerVelocity.z * BRAKE_POWER * delta,
        },
        true,
      );
    }

    // --- CAMERA FOLLOW LOGIC ---

    // Get current vehicle position
    const carPosition = body.translation();
    const posVector = new THREE.Vector3(
      carPosition.x,
      carPosition.y,
      carPosition.z,
    );

    // Desired camera position: behind and above the car (isometric-ish angle)
    const cameraOffset = new THREE.Vector3(12, 12, 12);
    const targetCameraPosition = posVector.clone().add(cameraOffset);

    // Smoothly interpolate the camera position
    smoothedCameraPosition.lerp(targetCameraPosition, 5 * delta);
    // Smoothly interpolate where the camera looks (slightly ahead of the car)
    smoothedCameraTarget.lerp(posVector, 5 * delta);

    // Apply to Three.js camera
    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);
  });

  return (
    <RigidBody
      ref={vehicleRef}
      colliders="cuboid"
      // Mass properties
      mass={2}
      // Linear damping helps the car come to a stop naturally when releasing gas
      linearDamping={2.0}
      // Angular damping stops it from spinning infinitely
      angularDamping={3.0}
      // Very important: prevent the car from flipping over by ignoring X and Z rotation physics
      enabledRotations={[false, true, false]}
      position={[0, 0.5, 0]}
    >
      <group>
        {/* Placeholder Car Body */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.8, 3]} />
          <meshStandardMaterial color="indianred" />
        </mesh>

        {/* Cabin */}
        <mesh position={[0, 0.9, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.5, 1.5]} />
          <meshStandardMaterial color="darkred" />
        </mesh>

        {/* Wheels Placeholder */}
        <mesh position={[-0.8, 0.2, 1]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.8, 0.2, 1]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[-0.8, 0.2, -1]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.8, 0.2, -1]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#333" />
        </mesh>

        {/* Headlights indication for orientation */}
        <mesh position={[-0.5, 0.5, -1.51]}>
          <planeGeometry args={[0.3, 0.2]} />
          <meshStandardMaterial
            color="yellow"
            emissive="yellow"
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[0.5, 0.5, -1.51]}>
          <planeGeometry args={[0.3, 0.2]} />
          <meshStandardMaterial
            color="yellow"
            emissive="yellow"
            emissiveIntensity={2}
          />
        </mesh>
      </group>
    </RigidBody>
  );
}
