# Dashboard screenshots

The two desk monitors (see src/components/MonitorScreen.tsx, wired up in
Room.tsx) show a static dashboard screenshot texture-mapped onto the screen
face. Drop images here with these exact filenames and they'll appear
automatically:

    public/dashboards/flowzynth-dashboard.jpg   (left screen — About)
    public/dashboards/netpulse-dashboard.jpg    (right screen — Projects)

Until a file exists, that screen shows a soft teal glow instead of a broken
texture.

Note: content.ts's projects entries mark FlowZynth's production UI as
NDA-protected ("Architecture and metrics only"). If that still applies,
either use a sanitized/blurred crop of the real dashboard, or swap in a
generic mockup/diagram instead of the live UI — whichever you're clear to
share.

## Prepping the images
1. Take a clean screenshot of the dashboard (browser chrome cropped out).
2. Resize to roughly 1280px wide — sharp enough up close, keeps the file
   small since it's a background detail on a 3D screen, not a full-res
   image viewer.
3. Save as `.jpg` with the filenames above (or update the `imageSrc` prop
   passed to `<MonitorScreen />` in Room.tsx if you'd rather use `.png`).
