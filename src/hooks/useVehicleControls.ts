import { useKeyboardControls } from "@react-three/drei";
import { useStore } from "../store/useStore";
import type { ControlsState } from "../store/useStore";

export function useVehicleControls() {
  // 1. Get keyboard controls from Drei
  // We use the subscribe function to get the current state rather than re-rendering
  const [, getKeys] = useKeyboardControls();

  // 2. Get touch controls from our Zustand store
  const getTouchControls = () => useStore.getState().controls;

  // Return a function that merges both control states on demand
  // This is used inside useFrame to avoid React component re-renders every time a key is pressed
  return () => {
    const keys = getKeys();
    const touch = getTouchControls();

    // A control is considered "active" if either the keyboard key is pressed OR the touch button is pressed
    const mergedControls: ControlsState = {
      forward: keys.forward || touch.forward,
      backward: keys.backward || touch.backward,
      left: keys.left || touch.left,
      right: keys.right || touch.right,
      jump: keys.jump || touch.jump,
      brake: keys.brake || touch.brake,
    };

    return mergedControls;
  };
}
