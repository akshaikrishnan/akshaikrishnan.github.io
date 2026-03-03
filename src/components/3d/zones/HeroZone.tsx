import { Text3D } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useState } from "react";
import PhysicsLettersText from "../PhysicsLettersText";
import { BUBBLE_TITLE_FONT } from "../constants/fonts";

interface TriggerButtonProps {
  position: [number, number, number];
  label: string;
  url: string;
  color: string;
}

function TriggerButton({ position, label, url, color }: TriggerButtonProps) {
  const [hovered, setHovered] = useState(false);

  const handleIntersectionEnter = () => {
    setHovered(true);
  };

  const handleIntersectionLeave = () => {
    setHovered(false);
  };

  return (
    <group position={position}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[2, 0.1, 2]}
          position={[0, 0.1, 0]}
          sensor
          onIntersectionEnter={handleIntersectionEnter}
          onIntersectionExit={handleIntersectionLeave}
        />

        <mesh
          position={[0, 0.1, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => window.open(url, "_blank")}
        >
          <boxGeometry args={[4, 0.2, 4]} />
          <meshStandardMaterial
            color={hovered ? "#ffffff" : color}
            emissive={hovered ? color : "#000000"}
          />
        </mesh>
      </RigidBody>

      <group position={[-label.length * 0.13, 0.45, 0]}>
        <Text3D font={BUBBLE_TITLE_FONT} size={0.45} height={0.1}>
          {label}
          <meshStandardMaterial color="white" />
        </Text3D>
      </group>
    </group>
  );
}

export default function HeroZone() {
  return (
    <group position={[0, 0, 0]}>
      <PhysicsLettersText
        text="AKSHAI KRISHNAN"
        position={[0, 4.2, -10]}
        size={1.4}
        height={0.35}
        color="#3b82f6"
      />

      <PhysicsLettersText
        text="Full-Stack Developer"
        position={[0, 2.2, -10]}
        size={0.55}
        height={0.16}
        color="#94a3b8"
      />

      <TriggerButton
        position={[-6, 0, -5]}
        label="GitHub"
        url="https://github.com/akshaikrishnan"
        color="#333333"
      />
      <TriggerButton
        position={[0, 0, -5]}
        label="LinkedIn"
        url="https://www.linkedin.com/in/akshaikrishnan/"
        color="#0077b5"
      />
      <TriggerButton
        position={[6, 0, -5]}
        label="Portfolio"
        url="https://akshai.dev"
        color="#10b981"
      />
    </group>
  );
}
