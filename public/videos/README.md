# Dashboard demo video (TV screen)

The room's TV (see src/components/Room.tsx) shows a looping dashboard demo
clip texture-mapped onto its screen. Looks for:

    public/videos/dashboard-demo-loop.mp4

Until that file exists, the TV shows a soft amber glow instead of a broken
texture — drop a clip in and it appears automatically, no code changes
needed.

## Prepping the clip
1. Screen-record a demo pass through the dashboard (~10-20s covering the
   parts you want to show off).
2. Trim/compress with ffmpeg:
   ffmpeg -i input.mp4 -ss 00:00:02 -t 15 -an -vf "scale=960:-2" -c:v libx264 -crf 26 dashboard-demo-loop.mp4
3. Drop the result at the path above.

Note: content.ts marks FlowZynth's production UI as NDA-protected
("Architecture and metrics only"). If that still applies, either record a
sanitized/blurred pass, use a generic mockup, or record the NetPulse
prototype instead — whichever you're clear to show.

(city-street-loop.mp4 is no longer used — the room no longer has a window;
safe to delete if you'd like, harmless to leave.)
