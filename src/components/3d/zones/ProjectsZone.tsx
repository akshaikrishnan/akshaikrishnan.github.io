import { Text3D } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import PhysicsLettersText from "../PhysicsLettersText";
import { BUBBLE_TITLE_FONT } from "../constants/fonts";

interface KioskProps {
  position: [number, number, number];
  title: string;
  techStack: string;
  color: string;
}

function ProjectKiosk({ position, title, techStack, color }: KioskProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2, 2.5, 2]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </RigidBody>

      <group ref={meshRef} position={[0, 3, 0]}>
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
          <mesh visible={false}>
            <boxGeometry args={[6, 6, 6]} />
          </mesh>
        </RigidBody>

        {!hovered && (
          <group position={[-title.length * 0.12, 2, 0]}>
            <Text3D font={BUBBLE_TITLE_FONT} size={0.4} height={0.1}>
              {title}
              <meshStandardMaterial color="white" />
            </Text3D>
          </group>
        )}

        {hovered && (
          <group position={[0, 2, 0]}>
            <group position={[-title.length * 0.15, 0, 0]}>
              <Text3D font={BUBBLE_TITLE_FONT} size={0.5} height={0.1}>
                {title}
                <meshStandardMaterial color="#60a5fa" />
              </Text3D>
            </group>
            <group position={[-techStack.length * 0.09, -0.8, 0]}>
              <Text3D font={BUBBLE_TITLE_FONT} size={0.3} height={0.1}>
                {techStack}
                <meshStandardMaterial color="#94a3b8" />
              </Text3D>
            </group>
          </group>
        )}
      </group>
    </group>
  );
}

export default function ProjectsZone() {
  return (
    <group position={[-30, 0, 20]}>
      <PhysicsLettersText
        text="PROJECTS"
        position={[0, 1.3, -10]}
        size={0.95}
        height={0.25}
        color="#ef4444"
      />

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
