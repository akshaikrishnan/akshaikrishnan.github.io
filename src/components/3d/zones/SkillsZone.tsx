import { Text3D, Html, Center } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useState } from "react";

interface SkillArchProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  details: string[];
  color: string;
}

function SkillArch({
  position,
  rotation = [0, 0, 0],
  title,
  details,
  color,
}: SkillArchProps) {
  const [isNear, setIsNear] = useState(false);

  return (
    <group position={position} rotation={rotation}>
      {/* Physical Arch pieces */}
      <RigidBody type="fixed" colliders="cuboid">
        {/* Left Pillar */}
        <mesh position={[-2, 2, 0]} castShadow>
          <boxGeometry args={[0.5, 4, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Right Pillar */}
        <mesh position={[2, 2, 0]} castShadow>
          <boxGeometry args={[0.5, 4, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Top Beam */}
        <mesh position={[0, 4.25, 0]} castShadow>
          <boxGeometry args={[4.5, 0.5, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>

      {/* 3D Title on Top */}
      <Center position={[0, 5.5, 0]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={0.8}
          height={0.2}
        >
          {title}
          <meshStandardMaterial color="white" />
        </Text3D>
      </Center>

      {/* Hidden Sensor Trigger inside the arch */}
      <RigidBody type="fixed" colliders={false}>
        {/* Args are HALF of the BoxGeometry [4/2, 4/2, 2/2] */}
        <CuboidCollider
          args={[2, 2, 1]}
          position={[0, 2, 0]}
          sensor
          onIntersectionEnter={() => setIsNear(true)}
          onIntersectionExit={() => setIsNear(false)}
        />

        <mesh position={[0, 2, 0]} visible={false}>
          <boxGeometry args={[4, 4, 2]} />
        </mesh>
      </RigidBody>

      {/* 2D HTML Overlay when car is near */}
      {isNear && (
        <Html position={[0, 3, 0]} center zIndexRange={[100, 0]} transform>
          <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-700 p-6 rounded-2xl w-64 text-white shadow-2xl">
            <h3
              className="text-2xl font-bold mb-3 border-b border-neutral-600 pb-2"
              style={{ color }}
            >
              {title}
            </h3>
            <ul className="space-y-2">
              {details.map((detail, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-blue-400 mt-1">▹</span>
                  <span className="text-gray-200">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function SkillsZone() {
  return (
    <group position={[20, 0, -30]}>
      {" "}
      {/* Spaced out from Hero */}
      <Center position={[0, 1.5, 10]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={2}
          height={0.5}
        >
          TECH STACK
          <meshStandardMaterial color="#fbbf24" />
        </Text3D>
      </Center>
      {/* Arches for different skill categories */}
      <SkillArch
        position={[-10, 0, 0]}
        rotation={[0, Math.PI / 4, 0]}
        title="Frontend"
        details={[
          "React.js & Next.js",
          "Angular",
          "Tailwind CSS & SCSS",
          "Three.js & R3F",
        ]}
        color="#61dafb"
      />
      <SkillArch
        position={[0, 0, -5]}
        title="Backend"
        details={[
          "Node.js & Express",
          "LoopBack 4",
          "Spring Boot",
          "REST APIs",
        ]}
        color="#68a063"
      />
      <SkillArch
        position={[10, 0, 0]}
        rotation={[0, -Math.PI / 4, 0]}
        title="AWS & Infra"
        details={[
          "Lambda, API Gateway",
          "DynamoDB, S3",
          "CloudFormation",
          "Docker & CI/CD",
        ]}
        color="#ff9900"
      />
    </group>
  );
}
