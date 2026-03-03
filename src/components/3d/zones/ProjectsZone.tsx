import { Text3D, Center } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

interface KioskProps {
  position: [number, number, number];
  title: string;
  techStack: string;
  color: string;
}

function ProjectKiosk({ position, title, techStack, color }: KioskProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Make the top part of the kiosk spin slowly
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Physical Base */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2, 2.5, 2]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </RigidBody>

      {/* Spinning Display Area */}
      <group ref={meshRef} position={[0, 3, 0]}>
        {/* Floating Hologram Base */}
        <mesh>
          <octahedronGeometry args={[1.5]} />
          <meshStandardMaterial
            color={hovered ? "white" : color}
            wireframe={!hovered}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>

        <RigidBody
          type="fixed"
          colliders="cuboid"
          sensor
          onIntersectionEnter={() => setHovered(true)}
          onIntersectionExit={() => setHovered(false)}
        >
          {/* Invisible trigger to expand details */}
          <mesh visible={false}>
            <boxGeometry args={[6, 6, 6]} />
          </mesh>
        </RigidBody>

        {/* Floating Title (Always visible) */}
        {!hovered && (
          <Center position={[0, 2, 0]}>
            <Text3D
              font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
              size={0.4}
              height={0.1}
            >
              {title}
              <meshStandardMaterial color="white" />
            </Text3D>
          </Center>
        )}

        {/* Hovered Details */}
        {hovered && (
          <group position={[0, 2, 0]}>
            <Center position={[0, 0, 0]}>
              <Text3D
                font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
                size={0.5}
                height={0.1}
              >
                {title}
                <meshStandardMaterial color="#60a5fa" />
              </Text3D>
            </Center>
            <Center position={[0, -0.8, 0]}>
              <Text3D
                font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
                size={0.3}
                height={0.1}
              >
                {techStack}
                <meshStandardMaterial color="#94a3b8" />
              </Text3D>
            </Center>
          </group>
        )}
      </group>
    </group>
  );
}

export default function ProjectsZone() {
  return (
    <group position={[-30, 0, 20]}>
      {" "}
      {/* Spaced out to the back-left */}
      <Center position={[0, 1.5, -10]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={2}
          height={0.5}
        >
          PROJECTS
          <meshStandardMaterial color="#ef4444" />
        </Text3D>
      </Center>
      {/* Triangular placement of kiosks */}
      <ProjectKiosk
        position={[0, 0, 0]}
        title="UAE Supermarket E-Com"
        techStack="Next.js, Tailwind, MongoDB"
        color="#a855f7"
      />
      <ProjectKiosk
        position={[-10, 0, 10]}
        title="UAE Eyewear E-Com"
        techStack="Next.js SSR, next-intl"
        color="#ec4899"
      />
      <ProjectKiosk
        position={[10, 0, 10]}
        title="Learning App CMS"
        techStack="Angular 16, RxJS, PrimeNG"
        color="#14b8a6"
      />
    </group>
  );
}
