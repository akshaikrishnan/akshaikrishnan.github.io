import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { KeyboardControls, Environment } from "@react-three/drei";
import Ground from "./components/3d/Ground";
import Vehicle from "./components/3d/Vehicle";
import LoadingScreen from "./components/ui/LoadingScreen";
import MobileControls from "./components/ui/MobileControls";
import HeroZone from "./components/3d/zones/HeroZone";
import SkillsZone from "./components/3d/zones/SkillsZone";
import ExperienceZone from "./components/3d/zones/ExperienceZone";
import ProjectsZone from "./components/3d/zones/ProjectsZone";
import LabZone from "./components/3d/zones/LabZone";

export const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "brake", keys: ["Shift"] },
];

export default function App() {
  return (
    <KeyboardControls map={keyboardMap}>
      <div className="relative w-full h-screen bg-[#87CEEB] overflow-hidden">
        <LoadingScreen />

        <Canvas shadows camera={{ position: [10, 10, 10], fov: 45 }}>
          <color attach="background" args={["#87CEEB"]} />
          <ambientLight intensity={0.5} />
          <directionalLight
            castShadow
            position={[100, 100, 50]}
            intensity={1.5}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />

          <Environment preset="city" />

          <Suspense fallback={null}>
            <Physics>
              <Ground />
              <Vehicle />
              <HeroZone />
              <SkillsZone />
              <ExperienceZone />
              <ProjectsZone />
              <LabZone />
            </Physics>
          </Suspense>
        </Canvas>

        <MobileControls />
      </div>
    </KeyboardControls>
  );
}
