# Experience (big TV) image

The big wall-mounted TV (see the TV effect in `src/components/Room.tsx`) is
now the **Experience** hotspot. It shows, in priority order:

1. `public/experience/highlight.jpg` — a real photo/graphic, if you drop one
   here with this exact filename.
2. `public/videos/dashboard-demo-loop.mp4` — the existing dashboard demo
   loop, if the image above isn't present.
3. A soft amber glow, if neither exists — never a broken/black screen.

## What to put here

Something that represents your work experience — pick whichever fits:
- A photo of you at work / your desk setup
- A company logo (e.g. NETZIYA) or a simple title card
- A screenshot collage of something you shipped at that role

## Prepping the image
1. Landscape orientation works best (TV aspect is roughly 16:9-ish, ~1.4m
   wide x ~0.8m tall in-scene).
2. Resize to roughly 1600px wide — sharp enough up close, keeps the file
   small since it's a background detail on a 3D screen.
3. Save as `public/experience/highlight.jpg` (or update the
   `EXPERIENCE_IMAGE` constant near the top of `Room.tsx` if you'd rather
   use `.png` or a different filename).
