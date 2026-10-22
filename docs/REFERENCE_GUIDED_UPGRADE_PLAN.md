# Coastal Outlaws — Reference-Guided Upgrade Plan

This project remains an original browser-first open-world game. The two reference projects are used for architecture and gameplay inspiration, not as a reason to merge unrelated code wholesale.

## References reviewed

- [Courier City](https://github.com/shubhransh-gupta/courier-city) — MIT license confirmed in repository metadata. Study its approaches to city chunking, traffic, vehicle variety, camera/minimap, audio boundaries and responsive browser performance. If code is adapted later, retain its copyright/permission notice and document the exact adapted files.
- [GTA Clone / Open City](https://github.com/25nyak/Gta-Clone) — inspected as a gameplay reference for wanted-level escalation, police pursuit states, vehicle categories, mission loops, world events and procedural audio. The repository metadata does not declare a license, so do not copy or adapt its source code, bundled assets, or module implementations unless the owner provides an explicit compatible license. Feature concepts can be independently reimplemented.
- [Rapier](https://rapier.rs/docs/) — candidate Apache-2.0 physics engine; evaluate in an isolated adapter after recording a baseline and preserving a playable build.
- [Kenney assets](https://kenney.nl/assets) — candidate art source. Verify the exact pack license and included terms per pack; keep an asset manifest and attribution/notices as appropriate.

## Architecture direction

Keep Three.js + TypeScript + Vite and preserve GitHub Pages. Do not replace the currently playable slice with a new engine. Refactor `src/main.ts` incrementally behind tested boundaries:

1. `src/game/scene/` — scene bootstrap, lighting, environment and render quality.
2. `src/game/world/` — district blocks, roads, props, spawn points and world streaming/chunk activation.
3. `src/game/player/` — controller, camera, interaction and animation adapter.
4. `src/game/vehicles/` — vehicle state, handling, damage, enter/exit and camera modes.
5. `src/game/ai/` — road-graph traffic, pedestrian steering and police state machines.
6. `src/game/missions/` — mission definitions, objectives, rewards and reusable contract flow.
7. `src/game/ui/` — HUD, map/radar, pause/settings, touch and gamepad input.
8. `src/game/save/` — versioned local saves and migrations.
9. `src/game/audio/` — user-gesture-gated Web Audio and pooled sound sources.
10. `src/game/performance/` — quality tiers, object pooling, instancing, frame-time diagnostics and resource disposal.

These are target boundaries, not a claim that these files already exist. Migrate one system at a time and build/test after each extraction.

## Gameplay upgrade roadmap

### Phase 1 — Stability and quality baseline
- Keep the current game bootable and GitHub Pages paths correct.
- Add a simple smoke-test checklist and monitor TypeScript/build output.
- Track render frame time and expose low/medium/high graphics settings.
- Avoid random world generation at runtime when it creates unstable layouts; use deterministic seeded placement.

### Phase 2 — Less blocky, more believable world
- Replace high-visibility placeholder people and cars with properly licensed optimized GLB/GLTF models.
- Use consistent materials, baked/detail textures, road markings, curbs, sidewalks, street furniture and varied building silhouettes.
- Add model loading fallbacks; the game must still start if optional assets fail to load.
- Use instancing for repeated lamps, trees, props and windows where appropriate.
- Ensure visible model assets have a recorded license and provenance.

### Phase 3 — Driving and collision
- Define a stable vehicle API and tune throttle, braking, steering response, speed-sensitive camera and handbrake separately.
- Add fixed-step physics behind an adapter, beginning with ground and vehicle collision. Only adopt Rapier after the current driving controls can be compared and regression-tested.
- Separate vehicle condition/damage state from visual feedback. Make collisions deterministic and prevent tunneling where practical.

### Phase 4 — Living city
- Define roads as a graph and give traffic explicit follow-lane, slow, stop, yield, recover and despawn states.
- Give pedestrians simple steering, collision avoidance, crossing behavior, flee/idle states and safe spawn/despawn rules.
- Avoid per-frame allocations; cap active agents and use distance-based update rates.

### Phase 5 — GTA-inspired original action systems
- Wanted levels should escalate via explicit states, not just a timer: witness/alert, dispatch, search, pursuit, lost-sight search, cooldown and arrest/escape.
- Police units need target prediction, road-aware pursuit, obstacle recovery and distance-based spawn limits.
- Reusable mission definitions should cover courier work, street races, vehicle recovery and pursuit escapes.
- Add a waypoint map with route overlay and clear objective feedback.
- Add original procedural audio, time-of-day variation and weather only with quality/performance controls.

### Phase 6 — Release quality
- Test keyboard/mouse, touch controls, gamepad, pause/resume, save/load, asset-load failure and browser resize.
- Use deterministic, versioned save data with validation and migration.
- Verify `npm run check`, `npm run build`, deployment artifact paths and a browser smoke test before release.

## Definition of done

A feature is done only when it is implemented in the repository, integrated into the game loop, validated with build/tests, works with keyboard and touch when relevant, respects performance budgets, and is described accurately in the README. Do not label a planned or placeholder system as completed.

## Current status

The existing project already includes a Three.js coastal district, on-foot movement, a driveable vehicle, basic weapon feedback, one parcel contract, HUD/radar, nitro, vehicle damage feedback, day/night variation, local save/restore, touch controls and GitHub Pages deployment. Its README documents the limits of the current prototype. This plan defines incremental next steps; it does not claim that the roadmap has been implemented.
