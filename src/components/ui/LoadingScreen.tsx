import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  console.log(progress);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active) {
      // Small delay before unmounting to allow fade-out animation
      const timeout = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [active]);

  if (!visible) return null;

  return (
    <div
      className={`absolute inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-900 text-white transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="text-4xl font-bold mb-8 animate-pulse">
        Loading Portfolio...
      </div>

      {/* Progress Bar Container */}
      <div className="w-64 h-2 bg-neutral-800 rounded-full overflow-hidden">
        {/* Animated fill */}
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 text-neutral-400 font-mono">
        {Math.round(progress)}%
      </div>

      <div className="mt-12 text-center text-sm text-neutral-500 max-w-xs">
        <p>Desktop: WASD to drive, Space to jump.</p>
        <p className="mt-2 text-xs">A physics-based 3D experience.</p>
      </div>
    </div>
  );
}
