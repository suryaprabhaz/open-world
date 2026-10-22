# Open-Source Game Research & Integration Policy

Coastal Outlaws is an original browser game. This document records promising references and the license checks to complete before code or assets are copied into this repository.

## Reviewed references

### Courier City — browser-based open world
- Repository: https://github.com/shubhransh-gupta/courier-city
- License: MIT License confirmed in repository metadata and LICENSE file.
- Useful ideas: separation of player/vehicle/camera/traffic systems, procedural city generation, traffic avoidance, minimap/GPS, audio management and vehicle variety.
- Current status: studied as a design/architecture reference. The existing game has not imported Courier City assets or wholesale systems.
- If code is adapted later, retain the MIT copyright and permission notice, add it to third-party notices, and document the adapted files.

### GTA Clone / Open City — browser action sandbox
- Repository: https://github.com/25nyak/Gta-Clone
- Useful ideas to independently implement: wanted-level escalation, police pursuit states, vehicle categories, mission loops, world events and procedural audio.
- License status: repository metadata currently reports no declared license. Public availability is not permission to reuse the source code or assets.
- Current status: concept/design reference only. Do not copy or adapt source code, bundled assets, or module implementations unless the owner provides an explicit compatible license.

### Rapier — real-time 3D physics
- Official documentation: https://rapier.rs/docs/
- License: Apache-2.0, according to the official Rapier documentation.
- Candidate uses: rigid-body collision, contact queries, stable fixed-step simulation and future vehicle/world collision.
- Current status: research candidate only; not yet added as a dependency. Integrate behind a small physics adapter and keep a working build before replacing the existing arcade controller.

### Kenney — CC0 game assets
- Official support/license explanation: https://kenney.nl/support
- Example packs: https://kenney.nl/assets/car-kit and https://kenney.nl/assets/prototype-kit
- License: verify the license on each individual asset pack and included terms before committing models. Keep a local asset manifest even where attribution is optional.
- Current status: no Kenney models have been imported yet.

## Integration order

1. Preserve stable deployment and add browser smoke tests.
2. Import selected correctly licensed vehicle and animated-character assets with a local asset manifest and loading fallbacks.
3. Add a physics adapter; evaluate Rapier against the existing driving baseline before migrating collisions.
4. Improve vehicle handling, road-graph traffic, pedestrian steering and police pursuit states.
5. Expand the mission/map systems and original audio, then profile and optimize for desktop and mobile.

## Non-negotiable asset rules

- Publicly viewable source is not automatically licensed for reuse.
- Do not extract or redistribute GTA/Rockstar models, maps, textures, audio, characters, logos or mission content.
- Track source-code license and model/texture/audio licenses independently.
- Retain upstream license and attribution notices when required.
- Keep original Coastal Outlaws characters, districts, vehicles, naming and story.

## Current implementation status

The existing project includes an original procedural Three.js coastal district, on-foot movement, vehicle driving, basic weapon feedback, a parcel contract, HUD/radar, nitro, vehicle-condition feedback, synthesized horn audio, a day/night cycle, local save/restore and touch controls. This research file and the reference-guided upgrade plan describe future work; they do not claim that external assets, Rapier, advanced police AI, or the GTA Clone code have been integrated.
