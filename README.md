# Coastal Outlaws — Browser 3D Open World

An original, early playable browser-based 3D open-world sandbox. Inspired by the freedom and atmosphere of classic open-world crime-action games, with its own setting, visuals, and gameplay. Opening credit: **@SuryaPrabhas**.

**Live target:** https://suryaprabhaz.github.io/open-world/  
The URL becomes live after GitHub Pages is enabled for the repository and the deployment workflow succeeds.

## Current playable slice

- Three.js 3D coastal district with roads, intersections, sidewalks, varied building facades, palm trees, beach, water, street lamps, traffic and pedestrians.
- Third-person camera, on-foot movement, sprint and jump.
- Enter and exit a vehicle; accelerate, reverse, steer and brake.
- Mouse/keyboard controls plus a virtual touch joystick and touch action buttons.
- Basic sidearm firing feedback, ammunition and reload, civilian flee reactions and a simple wanted/pursuit timer.
- One small parcel contract with a start marker, pickup location and return reward.
- HUD with health, armor, cash, wanted level, current objective, live radar/minimap and vehicle speed.
- Vehicle nitro boost, engine condition/damage, collision cooldown, and synthesized horn audio (H while driving).
- Daylight cycle, fog, shadows, tone mapping, responsive quality options.
- Local browser save/restore and periodic autosave.
- GitHub Actions build-and-deploy workflow for GitHub Pages.

This is an intentionally limited vertical slice, not a finished AAA game. Combat uses simplified range/direction checks rather than physical projectile simulation; NPCs and traffic use lightweight movement rather than full pathfinding; no full skeletal animation, interior streaming, real police vehicle pursuit, multiplayer, or professional audio/asset production is included yet.

## Requirements

- Node.js 22 recommended
- npm
- A modern browser with WebGL support

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

## Validate and build

```bash
npm run check
npm run build
npm run preview
```

The production output is in `dist/`.

## Controls

| Action | Keyboard / Mouse | Touch |
|---|---|---|
| Move / drive | W A S D / arrow keys | Virtual stick |
| Sprint | Shift | Run / Gas button |
| Jump / handbrake | Space | Jump button |
| Interact / enter / exit | E | Enter / Interact |
| Contract action | F | Interact where prompted |
| Fire | Left mouse / K | Fire button |
| Reload | R | — |
| Select sidearm | 1 | — |
| Save | M | Pause → Save |
| Pause | Esc | Pause button |
| Change camera distance | G | — |
| Look around | Mouse movement | Drag virtual stick area |

Click inside the game canvas to capture the mouse on desktop. Press Escape to pause and release the pointer. Browser audio is not required for the current build.

## GitHub Pages deployment

The workflow at `.github/workflows/deploy.yml` runs on every push to `main` and on manual dispatch. It installs dependencies, type-checks, builds, and deploys `dist/` through GitHub Pages.

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Open the **Actions** tab and inspect the latest **Deploy Coastal Outlaws to GitHub Pages** run.
4. Once it succeeds, visit https://suryaprabhaz.github.io/open-world/ and test movement, driving, a contract, refresh/save restore, and mobile layout.

The Vite base is configured as `/open-world/`. Keep it aligned with the repository path if the repository is renamed. If deployment fails, inspect the failed workflow job logs first; the most common issues are Pages source not set to Actions, dependency/build errors, or a TypeScript error.

## Project structure

```
.github/workflows/deploy.yml  # Static site build and Pages deployment
src/main.ts                  # Scene, world, gameplay, UI, controls, save logic
src/style.css                # HUD, menus, responsive desktop/mobile styles
index.html
vite.config.ts
tsconfig.json
package.json
```

## Save data and privacy

The game uses localStorage in the current browser profile. Save data is not a cloud backup and will not synchronize across browsers or devices. Clearing site data deletes local progress. No API keys or backend credentials are required.

## Asset and licensing notes

The game scene and visible geometry are generated in code; the interface loads optional Google Fonts from their public font service. Replace or self-host typography and add licensed models, textures, sound, and animation as the project grows. Do not add ripped game assets, commercial soundtrack recordings, or other unlicensed content.

## Next engineering priorities

1. Replace primitive procedural characters and cars with licensed, optimized, animated models.
2. Add a real physics layer, robust world collision and drivable road navigation.
3. Add a raycast-based aiming system, proper hitboxes, weapon switching and hit reactions.
4. Implement road graph traffic, police units with pursuit states and navigation.
5. Expand the mission framework, save migrations and add a full-screen map with waypoint routing.
6. Add sound, accessibility remapping, gamepad support and browser/device tests.
7. Profile on real low-end phones; improve LOD, asset loading and memory disposal.

## Credits

Original project implementation and opening credit: **@SuryaPrabhas**.
