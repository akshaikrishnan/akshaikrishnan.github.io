import { RigidBody } from "@react-three/rapier";
import { Grid } from "@react-three/drei";

export default function Ground() {
  return (
    <RigidBody
      type="fixed"
      colliders="cuboid"
      // Friction is important for the car tires
      friction={1}
      restitution={0}
    >
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[200, 1, 200]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      {/* Visual grid to help with scale and movement perception */}
      <Grid
        position={[0, 0.01, 0]}
        args={[200, 200]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6c757d"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#a8b2bd"
        fadeDistance={100}
      />
    </RigidBody>
  );
}
