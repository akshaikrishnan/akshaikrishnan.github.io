import { Text3D, Center } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useState } from "react";

interface TriggerButtonProps {
  position: [number, number, number];
  label: string;
  url: string;
  color: string;
}

// A 3D button that triggers when the car drives over it
function TriggerButton({ position, label, url, color }: TriggerButtonProps) {
  const [hovered, setHovered] = useState(false);

  const handleIntersectionEnter = (e: any) => {
    //add hover class
    setHovered(true);
    // window.open(url, "_blank");
  };

  const handleIntersectionLeave = (e: any) => {
    //remove hover class
    setHovered(false);
  };

  return (
    <group position={position}>
      {/* 2. Disable auto-colliders by setting colliders={false} */}
      <RigidBody type="fixed" colliders={false}>
        {/* 3. Add manual CuboidCollider. Args are HALF of your BoxGeometry [4/2, 0.2/2, 4/2] */}
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
          {hovered ? (
            <meshStandardMaterial color={color} emissive={color} />
          ) : (
            <meshStandardMaterial color={color} emissive={color} />
          )}
          <meshStandardMaterial
            color={hovered ? "#ffffff" : color}
            emissive={hovered ? color : "#000000"}
          />
        </mesh>
      </RigidBody>

      {/* Label Text on the button */}
      <Center position={[0, 0.5, 0]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={0.5}
          height={0.1}
        >
          {label}
          <meshStandardMaterial color="white" />
        </Text3D>
      </Center>
    </group>
  );
}

export default function HeroZone() {
  return (
    <group position={[0, 0, 0]}>
      {/* Giant 3D Title */}
      <Center position={[0, 5, -10]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={3}
          height={0.5}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.1}
          bevelSize={0.05}
          bevelSegments={5}
        >
          AKSHAI KRISHNAN
          <meshStandardMaterial color="#3b82f6" />
        </Text3D>
      </Center>

      {/* Subtitle */}
      <Center position={[0, 2, -10]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={1}
          height={0.2}
        >
          Full-Stack Developer
          <meshStandardMaterial color="#94a3b8" />
        </Text3D>
      </Center>

      {/* Social Trigger Buttons on the ground */}
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
