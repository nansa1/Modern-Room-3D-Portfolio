# modern-neon-room.glb

Source: "Modern Neon Room" by local.yany on Sketchfab
https://sketchfab.com/3d-models/modern-neon-room-4af1991c3c134c839aac1809d33171d2
License: CC-BY 4.0 (https://creativecommons.org/licenses/by/4.0/)

**CC-BY requires attribution.** Since this ships live on a public portfolio
site (which counts as redistribution, not just personal viewing), add a
credit line somewhere visible — a footer or an "assets" note is enough:

    3D room model "Modern Neon Room" by local.yany (Sketchfab), CC-BY 4.0

## How this file was built
The original Sketchfab download was 71.6 MB (64 MB of that was oversized
JPEG textures — geometry itself was modest). Compressed with gltf-transform,
deliberately skipping the mesh-merging steps (`join` / `instance` /
`flatten` / `simplify`) so every named part (screens, artwork frames,
speakers, etc.) stays individually addressable by node name — Room.tsx
depends on those exact names to wire up navigation and texture swaps:

```
gltf-transform dedup    in.glb step1.glb
gltf-transform resize   step1.glb step2.glb --width 1024 --height 1024
gltf-transform webp     step2.glb step3.glb
gltf-transform prune    step3.glb step4.glb
gltf-transform draco    step4.glb modern-neon-room.glb
```

Result: 71.6 MB → 1.8 MB, same node graph.

If you regenerate this from a newer export, re-run the same pipeline (or
`gltf-transform inspect modern-neon-room.glb` first to confirm the node
names below still exist) rather than using `gltf-transform optimize`, which
merges by material and would silently break Room.tsx's hotspot wiring.

## Node names Room.tsx depends on
- `MCN_Screen_LargeShape_*`, `MCN_Screen_MediumShape_*`, `MCN_Screen_SmallShape_*` — nav hotspots
- `MCN_TVShape_Screen_0` — gets the dashboard video texture
- `MCN_Artwork_FrameShape_Artwork_0`, `MCN_Artwork_Frame_dup_2Shape_Artwork_0`, `MCN_Artwork_Frame_dup_3Shape_Artwork_0` — get cert images
- `MCN_ShelfShape_*`, `MCN_ComputerShape_*`, `MCN_CouchShape_*`, `MCN_SpeakersShape_*` / `_dup_2` / `_dup_3` — nav / game-trigger hotspots
- Shared materials named `Glow` and `Screen` — get emissive color set in code
