import { useEffect } from "react";
import { useStore } from "../../store/useStore";

export default function MobileControls() {
  const isMobile = useStore((state) => state.isMobile);
  const setIsMobile = useStore((state) => state.setIsMobile);
  const setControl = useStore((state) => state.setControl);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobile]);

  // If not on mobile, don't render the overlay
  if (!isMobile) return null;

  // Helpers for touch events to prevent default behavior (like scrolling)
  const handleTouchStart =
    (control: Parameters<typeof setControl>[0]) => (e: React.TouchEvent) => {
      e.preventDefault();
      setControl(control, true);
    };

  const handleTouchEnd =
    (control: Parameters<typeof setControl>[0]) => (e: React.TouchEvent) => {
      e.preventDefault();
      setControl(control, false);
    };

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-end p-6">
      <div className="flex justify-between w-full max-w-lg mx-auto pointer-events-auto">
        {/* D-Pad (Left Side) */}
        <div className="relative w-32 h-32 opacity-70">
          <button
            className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 flex items-center justify-center active:bg-white/40 active:scale-95 transition-all"
            onTouchStart={handleTouchStart("forward")}
            onTouchEnd={handleTouchEnd("forward")}
            onContextMenu={(e) => e.preventDefault()}
          >
            <span className="text-white text-xl">W</span>
          </button>

          <button
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 flex items-center justify-center active:bg-white/40 active:scale-95 transition-all"
            onTouchStart={handleTouchStart("backward")}
            onTouchEnd={handleTouchEnd("backward")}
            onContextMenu={(e) => e.preventDefault()}
          >
            <span className="text-white text-xl">S</span>
          </button>

          <button
            className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 flex items-center justify-center active:bg-white/40 active:scale-95 transition-all"
            onTouchStart={handleTouchStart("left")}
            onTouchEnd={handleTouchEnd("left")}
            onContextMenu={(e) => e.preventDefault()}
          >
            <span className="text-white text-xl">A</span>
          </button>

          <button
            className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 flex items-center justify-center active:bg-white/40 active:scale-95 transition-all"
            onTouchStart={handleTouchStart("right")}
            onTouchEnd={handleTouchEnd("right")}
            onContextMenu={(e) => e.preventDefault()}
          >
            <span className="text-white text-xl">D</span>
          </button>
        </div>

        {/* Action Buttons (Right Side) */}
        <div className="flex flex-col justify-end gap-4 opacity-70">
          <button
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center active:bg-white/40 active:scale-95 transition-all"
            onTouchStart={handleTouchStart("jump")}
            onTouchEnd={handleTouchEnd("jump")}
            onContextMenu={(e) => e.preventDefault()}
          >
            <span className="text-white font-bold">JUMP</span>
          </button>

          <button
            className="w-16 h-16 rounded-full bg-red-500/30 backdrop-blur-md border border-red-500/50 flex items-center justify-center active:bg-red-500/50 active:scale-95 transition-all"
            onTouchStart={handleTouchStart("brake")}
            onTouchEnd={handleTouchEnd("brake")}
            onContextMenu={(e) => e.preventDefault()}
          >
            <span className="text-white font-bold">BRK</span>
          </button>
        </div>
      </div>
    </div>
  );
}
