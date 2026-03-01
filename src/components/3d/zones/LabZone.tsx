import { Text3D, Center } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface ServerRackProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

// 3D representation of a Homelab Server Rack
function ServerRack({ position, rotation }: ServerRackProps) {
  const lightsRef = useRef<THREE.Group>(null);

  // Blink lights randomly to simulate network activity
  useFrame((state) => {
    if (lightsRef.current) {
      const time = state.clock.getElapsedTime();
      lightsRef.current.children.forEach((child, i) => {
        // Random blinking effect
        const material = (child as THREE.Mesh)
          .material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = Math.sin(time * (10 + i)) > 0 ? 2 : 0.2;
      });
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Physical Rack Cabinet */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 4, 1.5]} />
          <meshStandardMaterial color="#1f2937" /> {/* Dark Slate */}
        </mesh>

        {/* Servers (Drawers) inside the rack */}
        {[0.5, 1.2, 1.9, 2.6, 3.3].map((y, idx) => (
          <group key={idx}>
            <mesh position={[0, y, 0.76]}>
              <boxGeometry args={[1.3, 0.5, 0.1]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            {/* Blinking Activity Lights on each server */}
            <group ref={idx === 0 ? lightsRef : null}>
              <mesh position={[-0.4, y, 0.82]}>
                <sphereGeometry args={[0.05]} />
                <meshStandardMaterial color="#10b981" emissive="#10b981" />
              </mesh>
              <mesh position={[-0.2, y, 0.82]}>
                <sphereGeometry args={[0.05]} />
                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" />
              </mesh>
            </group>
          </group>
        ))}
      </RigidBody>

      {/* Label above rack */}
      <Center position={[0, 4.5, 0]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={0.4}
          height={0.1}
        >
          LXC / Docker
          <meshStandardMaterial color="#a78bfa" />
        </Text3D>
      </Center>
    </group>
  );
}

function AIEasel({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="cuboid">
        {/* Easel Stand */}
        <mesh
          position={[0, 1.5, -0.2]}
          rotation={[Math.PI / 12, 0, 0]}
          castShadow
        >
          <boxGeometry args={[0.2, 3, 0.2]} />
          <meshStandardMaterial color="#b45309" /> {/* Wood color */}
        </mesh>

        {/* Glowing Screen/Canvas */}
        <mesh position={[0, 2, 0]} rotation={[Math.PI / 12, 0, 0]} castShadow>
          <boxGeometry args={[2, 1.5, 0.1]} />
          {/* Magenta/Pink glow representing AI Art */}
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={0.5}
          />
        </mesh>
      </RigidBody>

      <Center position={[0, 3.2, 0.2]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={0.3}
          height={0.1}
        >
          AI Generation
          <meshStandardMaterial color="white" />
        </Text3D>
      </Center>
    </group>
  );
}

export default function LabZone() {
  return (
    <group position={[-20, 0, -30]}>
      {" "}
      {/* Spaced out to the back-right */}
      {/* Zone Title */}
      <Center position={[0, 0.5, 5]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={2}
          height={0.5}
        >
          THE LAB
          <meshStandardMaterial color="#10b981" />
        </Text3D>
      </Center>
      {/* Floor pad for the lab */}
      <mesh position={[0, 0.05, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Lab Equipment placed around */}
      <ServerRack position={[-3, 0, -8]} rotation={[0, Math.PI / 6, 0]} />
      <ServerRack position={[3, 0, -8]} rotation={[0, -Math.PI / 6, 0]} />
      <AIEasel position={[0, 0, -3]} rotation={[0, 0, 0]} />
    </group>
  );
}
