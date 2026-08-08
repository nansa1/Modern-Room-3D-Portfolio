import { useEffect, useState } from 'react'
import * as THREE from 'three'

/**
 * Renders the back-wall window as a real frame + glass pane, with a looping
 * video playing behind the glass (a city street with people, per the brief)
 * instead of the old static emissive-glow plane.
 *
 * Video, not <img src="...gif">: three.js can't feed an animated GIF's
 * frames into a WebGL texture without an extra decoding library, and GIFs
 * are large/low-quality for what is effectively a looping clip. A short
 * muted, looping MP4 (THREE.VideoTexture) gives a smoother "gif-like" loop
 * at a fraction of the file size. See README.md for where to source one and
 * exactly where to drop it.
 *
 * Until public/videos/city-street-loop.mp4 exists, this quietly falls back
 * to a soft teal glow so the room still looks intentional out of the box.
 */
/**
 * Renders a wall window as a real frame + glass pane, with a looping video
 * playing behind the glass (a city street with people, or a dashboard demo
 * clip — see `videoSrc`) instead of a static emissive-glow plane.
 *
 * Video, not <img src="...gif">: three.js can't feed an animated GIF's
 * frames into a WebGL texture without an extra decoding library, and GIFs
 * are large/low-quality for what is effectively a looping clip. A short
 * muted, looping MP4 (THREE.VideoTexture) gives a smoother "gif-like" loop
 * at a fraction of the file size. See public/videos/README.md for where to
 * source/prep a clip.
 *
 * Until the file at `videoSrc` exists, this quietly falls back to a soft
 * glow (color set by `fallbackGlow`) so the room still looks intentional
 * out of the box.
 */
export default function WindowView({
  position,
  rotation = [0, 0, 0],
  size = [1.2, 1.4],
  videoSrc = '/videos/city-street-loop.mp4',
  fallbackColor = '#0a2f3a',
  fallbackGlow = '#4fd1c5',
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  size?: [number, number]
  videoSrc?: string
  fallbackColor?: string
  fallbackGlow?: string
}) {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const video = document.createElement('video')
    video.src = videoSrc
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true

    let tex: THREE.VideoTexture | null = null

    const onCanPlay = () => {
      tex = new THREE.VideoTexture(video)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      setTexture(tex)
    }
    const onError = () => setFailed(true)

    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('error', onError)
    // Autoplay can be blocked by the browser until the user interacts with
    // the page at all — orbiting the room counts, so it self-resolves.
    video.play().catch(() => {})

    return () => {
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('error', onError)
      video.pause()
      video.src = ''
      tex?.dispose()
    }
  }, [videoSrc])

  const [w, h] = size
  const frame = 0.07

  return (
    <group position={position} rotation={rotation}>
      {/* outer frame */}
      <mesh castShadow>
        <boxGeometry args={[w + frame * 2, h + frame * 2, 0.06]} />
        <meshStandardMaterial color="#0c1118" metalness={0.5} roughness={0.35} />
      </mesh>

      {/* the view itself */}
      <mesh position={[0, 0, 0.033]}>
        <planeGeometry args={[w, h]} />
        {texture && !failed ? (
          <meshBasicMaterial map={texture} toneMapped={false} />
        ) : (
          <meshStandardMaterial color={fallbackColor} emissive={fallbackGlow} emissiveIntensity={0.18} roughness={0.6} />
        )}
      </mesh>

      {/* mullions, cross pattern over the glass */}
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[w, 0.022, 0.008]} />
        <meshStandardMaterial color="#0c1118" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[0.022, h, 0.008]} />
        <meshStandardMaterial color="#0c1118" metalness={0.5} roughness={0.35} />
      </mesh>

      {/* soft bounce light so the "outside" reads as a light source in the room */}
      <pointLight position={[0, 0, 0.6]} intensity={0.35} color={fallbackGlow} distance={2.4} decay={2} />
    </group>
  )
}
