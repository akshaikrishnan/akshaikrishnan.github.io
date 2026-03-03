import { Text3D, Html } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useState } from "react";
import PhysicsLettersText from "../PhysicsLettersText";
import { BUBBLE_TITLE_FONT } from "../constants/fonts";

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
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-2, 2, 0]} castShadow>
          <boxGeometry args={[0.5, 4, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[2, 2, 0]} castShadow>
          <boxGeometry args={[0.5, 4, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 4.25, 0]} castShadow>
          <boxGeometry args={[4.5, 0.5, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>

      <group position={[-title.length * 0.22, 5.2, 0]}>
        <Text3D font={BUBBLE_TITLE_FONT} size={0.58} height={0.18}>
          {title}
          <meshStandardMaterial color="white" />
        </Text3D>
      </group>

      <RigidBody type="fixed" colliders={false}>
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
      <PhysicsLettersText
        text="TECH STACK"
        position={[0, 1.3, 10]}
        size={0.95}
        height={0.25}
        color="#fbbf24"
      />

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
