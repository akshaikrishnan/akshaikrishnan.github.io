import { Text3D } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { BUBBLE_TITLE_FONT } from "./constants/fonts";
import { wordToLetterTransforms } from "./utils/textToLetters";

interface PhysicsLettersTextProps {
  text: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: number;
  height?: number;
  color?: string;
  supportDepth?: number;
}

export default function PhysicsLettersText({
  text,
  position,
  rotation = [0, 0, 0],
  size = 1,
  height = 0.2,
  color = "#ffffff",
  supportDepth = 1.5,
}: PhysicsLettersTextProps) {
  const { letters, width } = wordToLetterTransforms(text);
  const letterYOffset = size * 0.5;

  return (
    <group position={position} rotation={rotation}>
      {/* Invisible support rail so letters are stable until the car hits them */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[Math.max(width / 2 + size * 0.3, size), size * 0.08, supportDepth / 2]}
          position={[0, size * 0.08, 0]}
        />
      </RigidBody>

      {letters.map((letter, index) => (
        <RigidBody
          key={`${letter.character}-${index}`}
          type="dynamic"
          colliders="hull"
          position={[letter.x * size, letterYOffset, 0]}
          friction={0.8}
          restitution={0.2}
          linearDamping={0.8}
          angularDamping={0.9}
          canSleep
        >
          <Text3D
            font={BUBBLE_TITLE_FONT}
            size={size}
            height={height}
            curveSegments={8}
            bevelEnabled
            bevelThickness={0.04}
            bevelSize={0.02}
            bevelSegments={3}
            castShadow
          >
            {letter.character}
            <meshStandardMaterial color={color} />
          </Text3D>
        </RigidBody>
      ))}
    </group>
  );
}
