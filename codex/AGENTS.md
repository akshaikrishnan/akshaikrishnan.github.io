# AGENTS.md

## Project Snapshot
- Name: `akshaikrishnan.github.io`
- Stack: React 19 + TypeScript + Vite + Tailwind CSS v4 + React Three Fiber + Drei + Rapier + Zustand
- App type: single-page interactive 3D portfolio where a physics-driven vehicle explores content zones.

## Mission For Coding Agents
- Preserve a smooth interactive 3D experience (performance and stable controls are higher priority than visual complexity).
- Keep behavior deterministic across keyboard and mobile touch controls.
- Make content updates easy without breaking scene physics.
- Prefer small, incremental changes that are easy to verify in browser.

## Runbook
- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Production build: `npm run build`
- Preview build: `npm run preview`

## Current Testing Workflow
There is no automated unit/integration test suite yet. Use this baseline workflow for every change:
1. Run `npm run lint` and fix all new issues.
2. Run `npm run build` to catch TypeScript and bundling regressions.
3. Run `npm run dev` and manually validate:
   - Vehicle movement: forward/backward/left/right/jump/brake.
   - Camera follow remains smooth and stable.
   - Mobile controls appear on touch/small viewport and do not stick.
   - Zone interactions trigger correctly (hover/sensor/text overlays).
   - No obvious frame drops when moving through all zones.

## Core Architecture

### Entry and Scene Composition
- `src/main.tsx`: React root mount.
- `src/App.tsx`: top-level scene setup:
  - Keyboard control mapping (`forward`, `backward`, `left`, `right`, `jump`, `brake`).
  - `Canvas`, lighting, environment, physics world.
  - Scene object composition (`Ground`, `Vehicle`, all zones, UI overlays).

### State Management (Zustand)
- `src/store/useStore.ts` is the central app store.
- State slices:
  - `isMobile`: whether touch controls UI should render.
  - `controls`: touch-driven control booleans (same shape as keyboard map).
  - `loadingProgress`: reserved for loading UX state.
- Actions:
  - `setIsMobile(isMobile)`
  - `setControl(controlKey, value)`
  - `setLoadingProgress(progress)`

### Input Control Pipeline
- Keyboard input is provided by Drei `KeyboardControls` in `App.tsx`.
- Touch input is written into Zustand by `src/components/ui/MobileControls.tsx`.
- `src/hooks/useVehicleControls.ts` merges keyboard and touch input each frame.
- `src/components/3d/Vehicle.tsx` consumes merged controls and applies Rapier impulses/torque.

### 3D Scene Components
- `src/components/3d/Ground.tsx`: fixed ground collider + visual grid.
- `src/components/3d/Vehicle.tsx`: rigid body movement, steering, jump/brake, camera follow.
- Zones under `src/components/3d/zones/`:
  - `HeroZone.tsx`: title/subtitle + external link trigger pads.
  - `SkillsZone.tsx`: skill arches + proximity HTML overlays.
  - `ExperienceZone.tsx`: timeline signposts + jump ramp.
  - `ProjectsZone.tsx`: interactive project kiosks.
  - `LabZone.tsx`: homelab-themed props and animated lights.
- UI overlays:
  - `src/components/ui/LoadingScreen.tsx`
  - `src/components/ui/MobileControls.tsx`

## Project Conventions For Agents
- Keep TypeScript strict and avoid `any` unless unavoidable.
- Keep physics updates in `useFrame` paths minimal to protect FPS.
- Avoid heavy allocations inside per-frame loops.
- Keep control keys aligned across:
  - `App.tsx` keyboard map,
  - Zustand `ControlsState`,
  - `useVehicleControls` merge logic,
  - `MobileControls` buttons.
- Prefer extracting repeated content into structured data before adding new hardcoded blocks.

## Known Gaps / Cleanup Targets
- `Vehicle.tsx` logs controls every frame (`console.log`) which can hurt performance.
- Scene content is mostly hardcoded in zone components; migrating to data-driven config will improve maintainability.
- No automated tests currently; only lint/build/manual validation.

## Target Next Steps (Priority Order)
1. Stabilize movement and camera behavior.
   - Remove per-frame logging.
   - Tune impulse/damping constants after manual playtesting.
2. Data-drive portfolio content.
   - Move repeated project/skills/experience entries into typed config/data files.
3. Introduce basic automated tests.
   - Add store/input mapping tests first (fast and stable).
   - Add lightweight component render tests for UI overlays.
4. Improve interaction safety.
   - Debounce or gate sensor-triggered `window.open` calls to avoid accidental repeated opens.
5. Performance guardrails.
   - Add lightweight FPS/perf checks during development and keep geometry/material count under control.

## Change Checklist For Future PRs
1. Describe which layer changed: UI, controls, physics, zone content, or store.
2. Include manual test notes for keyboard + mobile controls.
3. Include `npm run lint` and `npm run build` results.
4. Mention any behavior changes in zone positions, trigger areas, or camera motion.
