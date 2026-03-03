import { Text3D, Center } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

interface SignProps {
  position: [number, number, number];
  company: string;
  role: string;
  duration: string;
  color: string;
}

// Billboard signpost to show work experience along the road
function SignPost({ position, company, role, duration, color }: SignProps) {
  return (
    <group position={position}>
      {/* Physical Pole */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 4]} />
          <meshStandardMaterial color="#475569" />
        </mesh>

        {/* Billboard Board */}
        <mesh position={[0, 4.5, 0]} castShadow>
          <boxGeometry args={[6, 3, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>

      {/* Company Name */}
      <Center position={[0, 5, 0.3]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={0.6}
          height={0.1}
        >
          {company}
          <meshStandardMaterial color="white" />
        </Text3D>
      </Center>

      {/* Role */}
      <Center position={[0, 4, 0.3]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={0.4}
          height={0.1}
        >
          {role}
          <meshStandardMaterial color="#e2e8f0" />
        </Text3D>
      </Center>

      {/* Duration */}
      <Center position={[0, 3.4, 0.3]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={0.25}
          height={0.1}
        >
          {duration}
          <meshStandardMaterial color="#cbd5e1" />
        </Text3D>
      </Center>
    </group>
  );
}

// A ramp the car can jump off
function JumpRamp({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="hull">
        {/* We use a flattened wedge shape approach via a rotated box for simplicity and good collision */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 1, 8]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Glow stripes on the ramp */}
        <mesh position={[0, 0.51, 0]}>
          <planeGeometry args={[0.5, 8]} />
          <meshStandardMaterial
            color="white"
            emissive="white"
            emissiveIntensity={2}
          />
        </mesh>
      </RigidBody>
    </group>
  );
}

export default function ExperienceZone() {
  return (
    <group position={[50, 0, -20]}>
      {" "}
      {/* The highway stretches to the right */}
      {/* Zone Title */}
      <Center position={[-5, 1.5, 5]}>
        <Text3D
          font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
          size={2}
          height={0.5}
        >
          THE JOURNEY
          <meshStandardMaterial color="#f97316" />
        </Text3D>
      </Center>
      {/* The Road Strip (Visual only) */}
      <mesh
        position={[20, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Center line */}
      <mesh position={[20, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 0.2]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>
      {/* Signposts along the road */}
      <SignPost
        position={[0, 0, -6]}
        company="Resmed India"
        role="Software Engineer"
        duration="May 2025 - Present"
        color="#1f2937"
      />
      <SignPost
        position={[15, 0, 6]}
        company="Armia Systems"
        role="Sr. Software Engineer"
        duration="May 2024 - May 2025"
        color="#1e3a8a"
      />
      <SignPost
        position={[30, 0, -6]}
        company="Webcastle Tech"
        role="Next.js Developer"
        duration="Mar 2023 - Apr 2024"
        color="#065f46"
      />
      {/* Ramp near Webcastle */}
      <JumpRamp position={[30, 0.2, 0]} rotation={[Math.PI / 12, 0, 0]} />
      <SignPost
        position={[45, 0, 6]}
        company="Infosys"
        role="Technology Analyst"
        duration="Nov 2022 - Mar 2023"
        color="#0284c7"
      />
      <SignPost
        position={[55, 0, -6]}
        company="Diksha Tech"
        role="Sr. Software Engineer"
        duration="Jun 2021 - Nov 2022"
        color="#7e22ce"
      />
    </group>
  );
}
