# Open-Source Game Research & Integration Policy

Coastal Outlaws is an original browser game. This document records promising references and the license checks to complete before code or assets are copied into this repository.

## Reviewed references

### Courier City — browser-based open world
- Repository: https://github.com/shubhransh-gupta/courier-city
- License file checked: MIT License, copyright Shubhransh Gupta (2026).
- Useful ideas: separation of player/vehicle/camera/traffic systems, procedural city generation, traffic avoidance, minimap/GPS, audio management and flight vehicles.
- Current status: studied as a design/architecture reference only. No Courier City source code or assets have been copied into Coastal Outlaws in this upgrade.
- If code is adapted later, retain the MIT copyright and permission notice in a third-party notices file and document the adapted files.

### Rapier — real-time 3D physics
- Official documentation: https://rapier.rs/docs/
- License: Apache-2.0, according to the official Rapier documentation.
- Candidate uses: rigid-body collision, contact queries, stable fixed-step simulation and future vehicle/world collision.
- Current status: research candidate only; not yet added as a dependency. Integrate behind a small physics adapter and keep a working build before replacing the existing arcade controller.

### Kenney — CC0 game assets
- Official support/license explanation: https://kenney.nl/support
- Example asset packs: https://kenney.nl/assets/car-kit and https://kenney.nl/assets/prototype-kit
- License: verify the license on each individual asset pack; Kenney states its free asset packs are public-domain/CC0.
- Candidate uses: unbranded cars, props, characters and prototype animations. Prefer glTF/GLB where available, optimize textures and geometry, and keep a local credit/asset manifest even where attribution is optional.
- Current status: no Kenney models have been imported yet. Download each selected pack from its official page and verify the included license before committing the assets.

## Integration order

1. Preserve stable deployment and add browser smoke tests.
2. Import selected CC0 vehicle and animated-character assets with a local asset manifest.
3. Add Rapier in a dedicated physics module; start with ground and vehicle colliders, then expand to static buildings and ramps.
4. Improve vehicle handling, traffic navigation, pedestrian steering and pursuit states.
5. Add mission/map systems and original audio, then profile and optimize for desktop and mobile.

## Non-negotiable asset rules

- Publicly viewable source is not automatically licensed for reuse.
- Do not extract or redistribute GTA/Rockstar models, maps, textures, audio, characters, logos or mission content.
- Do not mix a code license with a separate model/texture license; track them independently.
- Keep the upstream license and attribution notices whenever required.
- Prefer original Coastal Outlaws characters, districts, vehicles and story even when learning from other open-source games.

## Current implementation status

The first gameplay upgrade adds a procedural live minimap, nitro boost, vehicle-condition/damage feedback, and synthesized horn audio. The minimap and vehicle mechanics are original additions to this repository; licensed external models and a full rigid-body physics engine remain future integration work.
