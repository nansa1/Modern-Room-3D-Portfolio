import { useEffect, useMemo, useState } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { ROOM_SCALE, certifications } from '../data/content'
import type { SectionId } from '../types'

/**
 * Room shell + furniture is the "Modern Neon Room" Sketchfab asset (CC-BY
 * 4.0, by local.yany — https://sketchfab.com/3d-models/modern-neon-room-4af1991c3c134c839aac1809d33171d2),
 * downloaded, then run through a name-preserving gltf-transform pipeline
 * (dedup + resize + webp textures + prune + draco) to bring it from 71.6MB
 * down to ~1.8MB without merging/renaming any of its ~100 named parts —
 * every object below is addressed by its real node name from that file, not
 * a guess. See public/models/README.md for the exact compression command
 * and the license/attribution note.
 *
 * Positions/sizes for every hotspot and light below were measured directly
 * off the compressed glb's mesh bounding boxes (not eyeballed) — see the
 * inline comments per hotspot for which node each one corresponds to.
 */

const COLOR = {
  accent: '#4fd1c5',
  active: '#f0b656',
}

// TV screen (Experience): drop a real photo/graphic here and it takes over
// the big wall TV. Falls back to the dashboard demo video, then to a soft
// amber glow, if it's missing — see public/experience/README.md.
const EXPERIENCE_IMAGE = '/experience/highlight.jpg'

// Desk monitors (About / Projects): dashboard screenshots — see
// public/dashboards/README.md.
// NOTE: these are NOT the raw names you'd read out of the .glb with a Python
// tool. GLTFLoader runs every node name through
// PropertyBinding.sanitizeNodeName() at parse time — it strips spaces to
// underscores and then *removes* reserved chars ([ ] . : /) outright rather
// than replacing them, so "MCN Screen Large.Shape_Screen_0" becomes
// "MCN_Screen_LargeShape_Screen_0" (the dot disappears, no underscore left
// behind). Verified by running three@0.185.1's actual PropertyBinding
// against every node in this file — these are the exact strings
// clone.getObjectByName() sees at runtime.
const DESK_SCREENS: { node: string; image: string }[] = [
  { node: 'MCN_Screen_LargeShape_Screen_0', image: '/dashboards/flowzynth-dashboard.jpg' },
  { node: 'MCN_Screen_MediumShape_Screen_0', image: '/dashboards/netpulse-dashboard.jpg' },
  { node: 'MCN_Screen_SmallShape_Screen_0', image: '/dashboards/coding-preview.jpg' },
]

type Clickable = { label: string; onSelect: () => void; isActive?: boolean }

/**
 * Loads an mp4, wraps it in a THREE.VideoTexture once it can play, and
 * quietly reports "not ready" (null) rather than throwing if the file
 * doesn't exist yet — same fallback philosophy used everywhere else in this
 * project. flipY is forced false to match glTF's UV convention (the model's
 * own baked textures already assume flipY=false; a freshly loaded
 * VideoTexture defaults to true, which would show the clip upside down).
 */


function useVideoTexture(src: string): THREE.VideoTexture | null {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null)

  useEffect(() => {
    const video = document.createElement('video')
    video.src = src
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true

    let tex: THREE.VideoTexture | null = null
    const onCanPlay = () => {
      tex = new THREE.VideoTexture(video)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.flipY = false
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      setTexture(tex)
    }
    video.addEventListener('canplay', onCanPlay)
    video.play().catch(() => {})

    return () => {
      video.removeEventListener('canplay', onCanPlay)
      video.pause()
      video.src = ''
      tex?.dispose()
    }
  }, [src])

  return texture
}

/**
 * Invisible click/hover zone floating at a known world position — used
 * instead of putting handlers directly on the model's own meshes, since
 * after compression several objects (e.g. the 3 artwork frames) still have
 * separate materials but there's no reason to fight the loader's node
 * typing for a simple hit-box. Positions/sizes come from the bounding-box
 * measurements noted per call site below. Same visual treatment (wireframe
 * halo + label on hover) as every other clickable object in this project.
 */
function Hotspot({
  center,
  size,
  label,
  clickable,
  padding = 0.08,
}: {
  center: [number, number, number]
  size: [number, number, number]
  label: string
  clickable: Clickable
  padding?: number
}) {
  const [hovered, setHovered] = useState(false)
  const boxArgs: [number, number, number] = [size[0] + padding, size[1] + padding, size[2] + padding]

  return (
    <group
      position={center}
      onClick={(e) => {
        e.stopPropagation()
        clickable.onSelect()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh>
        <boxGeometry args={boxArgs} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {(hovered || clickable.isActive) && (
        <mesh>
          <boxGeometry args={boxArgs} />
          <meshBasicMaterial
            color={clickable.isActive ? COLOR.active : COLOR.accent}
            wireframe
            transparent
            opacity={hovered ? 0.9 : 0.5}
          />
        </mesh>
      )}
      {hovered && (
        <Html center distanceFactor={6} position={[0, size[1] / 2 + 0.16, 0]} occlude={false}>
          <div className="font-mono-ui text-[10px] tracking-[0.15em] uppercase bg-command-panel/95 text-command-accent border border-command-border px-2 py-1 rounded whitespace-nowrap pointer-events-none">
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}

/**
 * Core planar-UV computation, shared by the two wrappers below. Projects
 * onto the mesh's face plane — the 2 axes that aren't its normal — which
 * works for any flat rectangular panel (TV, desk screens, artwork frames
 * all qualify).
 *
 * Axis picking is NOT done by raw size ordering. An earlier version
 * assigned U = largest extent, V = second-largest, which happens to put
 * V on the height (Y) axis for panels that are wider than they are tall
 * (the desk screens/TV) but puts V on the WIDTH axis for panels that are
 * taller than wide (the artwork frames, Y=0.787 > X=0.592) — silently
 * swapping which in-plane axis "vertical" means between mesh types. A
 * V-flip meant to correct upside-down images then flipped the wrong axis
 * for frames, producing a mirrored/reversed result instead of a simple
 * fix.
 *
 * Instead: find the normal axis (the thinnest extent — the direction the
 * panel faces) and exclude it. Of the 2 remaining axes, Y is always V
 * (vertical) when it's one of them — true for every wall-mounted panel in
 * this scene, tall or wide — and the other is U (horizontal). This keeps
 * "V = vertical" true regardless of the panel's aspect ratio.
 *
 * V is inverted (top of mesh -> v=0) to match the flipY=false convention
 * used for every texture loaded in this file: with flipY=false, three.js
 * samples row 0 of the source image at v=0, so v=0 must correspond to the
 * TOP of the mesh, not the bottom.
 */
function computePlanarUV(geo: THREE.BufferGeometry): THREE.BufferAttribute {
  geo.computeBoundingBox()
  const bbox = geo.boundingBox!

  const size = new THREE.Vector3()
  bbox.getSize(size)

  const byExtent = (['x', 'y', 'z'] as const).slice().sort((a, b) => size[a] - size[b])
  const normalAxis = byExtent[0] // thinnest extent = direction the panel faces
  const remaining = (['x', 'y', 'z'] as const).filter((a) => a !== normalAxis)
  // Vertical axis is always Y when it's part of the face plane (true for
  // every wall panel here); only fall back otherwise as a safety net.
  const vAxis = remaining.includes('y') ? 'y' : remaining[0]
  const uAxis = remaining.find((a) => a !== vAxis)!

  const uSize = size[uAxis] || 1
  const vSize = size[vAxis] || 1
  const uIndex = { x: 0, y: 1, z: 2 }[uAxis]
  const vIndex = { x: 0, y: 1, z: 2 }[vAxis]

  const pos = geo.attributes.position
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getComponent(i, uIndex) - bbox.min[uAxis]) / uSize
    uv[i * 2 + 1] = 1 - (pos.getComponent(i, vIndex) - bbox.min[vAxis]) / vSize
  }
  return new THREE.BufferAttribute(uv, 2)
}

/**
 * TV + desk screens: these 3 meshes shipped as plain untextured black PBR
 * materials in the source file (baseColorFactor [0,0,0,1], no
 * baseColorTexture), so the gltf-transform `prune` step in the compression
 * pipeline correctly stripped their now-unused TEXCOORD_0 attribute — the
 * geometry has NO UV coordinates at all. That means assigning `map` /
 * `emissiveMap` in JS loads the texture fine (network tab shows 200s) but
 * there's nothing for the GPU to sample it with, so it silently renders as
 * the base black color — no console error, no warning.
 *
 * This is purely additive: no-op if a UV attribute is somehow already
 * present. Only 3 tiny meshes (49 verts each, per the accessor counts) get
 * touched, so this is cheap and one-time.
 */
function ensureScreenUV(mesh: THREE.Mesh) {
  const geo = mesh.geometry
  if (geo.attributes.uv) return
  geo.setAttribute('uv', computePlanarUV(geo))
}

/**
 * Artwork frames: unlike the screens, these DO already have UVs — but the
 * original UVs only cover a small sub-rect of a shared texture atlas (fine
 * for the original baked art, unusable for a full-size standalone cert
 * image swapped into the same slot: it'd crop down to a sliver). So this
 * always discards and regenerates a full 0–1 planar UV, unlike
 * ensureScreenUV which leaves existing UVs alone.
 */
function ensureArtworkUV(mesh: THREE.Mesh) {
  const geo = mesh.geometry
  geo.setAttribute('uv', computePlanarUV(geo))
}

const LABELS: Record<SectionId, string> = {
  about: 'About',
  projects: 'Projects',
  skills: 'Skills',
  experience: 'Experience',
  education: 'Education',
  contact: 'Contact',
  resume: 'Resume',
}

// Only 3 physical Artwork Frame objects exist in the model — the first 3
// certifications get the wall frames; the full list (all 5) still shows in
// the Education content panel when any frame is clicked.
const FRAMED_CERTS = certifications.slice(0, 3)

export default function Room({
  activeSection,
  onSelect,
  onOpenGame,
  gameActive,
}: {
  activeSection: SectionId | null
  onSelect: (id: SectionId) => void
  onOpenGame: () => void
  gameActive: boolean
}) {
  const sel = (id: SectionId): Clickable => ({
    label: LABELS[id],
    onSelect: () => onSelect(id),
    isActive: activeSection === id,
  })

  const { scene } = useGLTF('/models/modern-neon-room.glb')
  const dashboardVideo = useVideoTexture('/videos/dashboard-demo-loop.mp4')

  const clone = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
    return c
  }, [scene])

  // One-time material tweaks: the source file ships every "glow" strip
  // (ceiling edge, computer tower, mousepad, shelf, all 3 speaker pairs) and
  // both screen types (TV + all 3 monitors) as plain black PBR materials —
  // the neon look in the reference render came from the original Sketchfab
  // viewer's own scene lights, which aren't part of the download. Recreated
  // here as emissive color instead of real point lights at every strip
  // (would be 10+ dynamic lights — expensive for what's a decorative glow).
  useEffect(() => {
    clone.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      const mat = mesh.material as THREE.MeshStandardMaterial
      if (!mat || Array.isArray(mat)) return
      if (mat.name === 'Glow') {
        mat.emissive = new THREE.Color(COLOR.accent)
        mat.emissiveIntensity = 1.4
      } else if (mat.name === 'Screen') {
        // Baseline "on but idle" look for the 3 desk monitors — the TV gets
        // its own cloned material + video texture just below, independent
        // of this shared one.
        mat.emissive = new THREE.Color(COLOR.accent)
        mat.emissiveIntensity = 0.12
      }
    })
  }, [clone])

  // TV screen (now the Experience hotspot): a real photo takes priority,
  // falling back to the dashboard demo video, then to a soft amber glow —
  // never a black dead screen. Cloned onto its own material instance first
  // so this doesn't bleed onto the desk monitors/other screens sharing the
  // base "Screen" material above.
  useEffect(() => {
    const tvScreen = clone.getObjectByName('MCN_TVShape_Screen_0') as THREE.Mesh | undefined
    if (!tvScreen) return
    ensureScreenUV(tvScreen)
    const mat = (tvScreen.material as THREE.MeshStandardMaterial).clone()
    let cancelled = false

    const useVideoOrGlow = () => {
      if (cancelled) return
      if (dashboardVideo) {
        mat.map = dashboardVideo
        mat.emissive = new THREE.Color('#ffffff')
        mat.emissiveMap = dashboardVideo
        mat.emissiveIntensity = 1
      } else {
        mat.map = null
        mat.emissive = new THREE.Color(COLOR.active)
        mat.emissiveIntensity = 0.25
      }
      mat.needsUpdate = true
      tvScreen.material = mat
    }

    const loader = new THREE.TextureLoader()
    loader.load(
      EXPERIENCE_IMAGE,
      (tex) => {
        if (cancelled) return
        tex.colorSpace = THREE.SRGBColorSpace
        tex.flipY = false
        mat.map = tex
        mat.emissive = new THREE.Color('#ffffff')
        mat.emissiveMap = tex
        mat.emissiveIntensity = 0.9
        mat.needsUpdate = true
        tvScreen.material = mat
      },
      undefined,
      useVideoOrGlow
    )

    return () => {
      cancelled = true
    }
  }, [clone, dashboardVideo])

  // Desk monitors: FlowZynth/NetPulse dashboard screenshots. Each target
  // gets its own cloned material so this doesn't bleed onto Screen Small or
  // the TV, which stay on the shared idle-glow "Screen" material set above.
  // On a 404 the node is simply left on that shared material — no separate
  // fallback needed here.
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    let cancelled = false
    DESK_SCREENS.forEach(({ node: name, image }) => {
      const node = clone.getObjectByName(name) as THREE.Mesh | undefined
      if (!node) return
      ensureScreenUV(node)
      loader.load(image, (tex) => {
        if (cancelled) return
        tex.colorSpace = THREE.SRGBColorSpace
        tex.flipY = false
        const mat = (node.material as THREE.MeshStandardMaterial).clone()
        mat.map = tex
        mat.emissive = new THREE.Color('#ffffff')
        mat.emissiveMap = tex
        mat.emissiveIntensity = 0.8
        mat.needsUpdate = true
        node.material = mat
      })
    })
    return () => {
      cancelled = true
    }
  }, [clone])

  // The 3 artwork frames: real cert images. Each frame already has its own
  // material slot in the source file (Artwork / Artwork_0 / Artwork_1), so
  // no cloning is needed here — just load and assign.
  useEffect(() => {
    const targets = [
      'MCN_Artwork_FrameShape_Artwork_0',
      'MCN_Artwork_Frame_dup_2Shape_Artwork_0',
      'MCN_Artwork_Frame_dup_3Shape_Artwork_0',
    ]
    const loader = new THREE.TextureLoader()
    let cancelled = false
    targets.forEach((name, i) => {
      const cert = FRAMED_CERTS[i]
      const node = clone.getObjectByName(name) as THREE.Mesh | undefined
      if (!node || !cert) return
      ensureArtworkUV(node)
      loader.load(cert.image, (tex) => {
        if (cancelled) return
        tex.colorSpace = THREE.SRGBColorSpace
        // Matches the convention used for the desk screens/TV, which use
        // the same computePlanarUV() — flipY=false, no extra rotation.
        tex.flipY = false
        const mat = (node.material as THREE.MeshStandardMaterial).clone()
        mat.map = tex
        mat.needsUpdate = true
        node.material = mat
      })
    })

    // The "glass" pane in front of each frame ships as a flat opaque gray
    // plate (baseColorFactor ~0.73 gray, no alpha/transmission) — likely
    // the KHR_materials_transmission extension got dropped by the
    // compression pipeline. As shipped it fully hides whatever's on the
    // Artwork mesh behind it, cert image or not. Making it properly
    // translucent here so the cert becomes visible through it. All 3
    // frames share one "Glass" material instance in the source file, so
    // clone once and apply the same tweaked material to all 3.
    const glassNames = [
      'MCN_Artwork_FrameShape_Glass_0',
      'MCN_Artwork_Frame_dup_2Shape_Glass_0',
      'MCN_Artwork_Frame_dup_3Shape_Glass_0',
    ]
    let sharedGlassMat: THREE.MeshStandardMaterial | null = null
    glassNames.forEach((name) => {
      const node = clone.getObjectByName(name) as THREE.Mesh | undefined
      if (!node) return
      if (!sharedGlassMat) {
        sharedGlassMat = (node.material as THREE.MeshStandardMaterial).clone()
        sharedGlassMat.transparent = true
        sharedGlassMat.opacity = 0.18
        sharedGlassMat.depthWrite = false
        sharedGlassMat.roughness = 0.15
        sharedGlassMat.needsUpdate = true
      }
      node.material = sharedGlassMat
    })

    return () => {
      cancelled = true
    }
  }, [clone])

  return (
    <group scale={ROOM_SCALE}>
      <primitive object={clone} />

      {/* --- Nav hotspots — positions/sizes measured off the glb's own bounds --- */}

      {/* Screen_Large — left wall */}
      <Hotspot center={[-1.6, 1.114, -0.235]} size={[0.154, 0.716, 0.84]} label="About" clickable={sel('about')} />

      {/* Screen_Medium — back wall */}
      <Hotspot center={[-0.318, 1.064, -1.56]} size={[0.839, 0.615, 0.169]} label="Projects" clickable={sel('projects')} />

      {/* Screen_Small — back-left corner */}
      <Hotspot center={[-1.475, 1.017, -1.018]} size={[0.382, 0.525, 0.645]} label="Resume" clickable={sel('resume')} />

      {/* Shelf — back wall */}
      <Hotspot center={[0, 1.581, -1.616]} size={[2.7, 0.05, 0.306]} label="Skills" clickable={sel('skills')} />

      {/* TV — mounted high on the left wall (measured off MCN TV.Shape_TV_0) */}
      <Hotspot center={[-1.577, 2.008, -0.002]} size={[0.1, 0.8, 1.4]} label="Experience" clickable={sel('experience')} />

      {/* Computer tower — back wall, under the shelf */}
      <Hotspot center={[0.476, 1.013, -1.45]} size={[0.2, 0.5, 0.42]} label="Contact" clickable={sel('contact')} />
      
      {/*
        3 Artwork Frame objects, back wall — all open Education. Each frame
        already shows its own cert image (see the texture-swap effect
        above); the hotspot just needs to sit over each one.
      */}
      <Hotspot center={[-0.672, 2, -1.685]} size={[0.592, 0.787, 0.178]} label={FRAMED_CERTS[2]?.title ?? 'Education'} clickable={sel('education')} />
      <Hotspot center={[0.02, 2, -1.685]} size={[0.592, 0.787, 0.178]} label={FRAMED_CERTS[0]?.title ?? 'Education'} clickable={sel('education')} />
      <Hotspot center={[0.705, 2, -1.685]} size={[0.592, 0.787, 0.178]} label={FRAMED_CERTS[1]?.title ?? 'Education'} clickable={sel('education')} />

      {/*
        Speakers double as the game trigger — "SIGNAL MONITOR" — matches the
        old design's "speaker as easter egg" idea. All 3 speaker placements
        in the room trigger it, so it's discoverable wherever you look.
      */}
      <Hotspot
        center={[1.19, 1.845, -1.615]}
        size={[0.152, 0.481, 0.139]}
        label="Play: Threat Neutralizer"
        clickable={{ label: 'Play: Threat Neutralizer', onSelect: onOpenGame, isActive: gameActive }}
      />
      <Hotspot
        center={[-1.56, 0.996, 0.44]}
        size={[0.139, 0.481, 0.152]}
        label="Play: Threat Neutralizer"
        clickable={{ label: 'Play: Threat Neutralizer', onSelect: onOpenGame, isActive: gameActive }}
      />
      <Hotspot
        center={[-1.177, 1.845, -1.615]}
        size={[0.152, 0.481, 0.139]}
        label="Play: Threat Neutralizer"
        clickable={{ label: 'Play: Threat Neutralizer', onSelect: onOpenGame, isActive: gameActive }}
      />

      {/* --- Fill lights — a handful of real lights rather than one per glow strip (see the material effect above for the rest) --- */}
      <pointLight position={[0, 2.6, 0.3]} intensity={1.1} color="#dbe4ea" distance={7} decay={2} castShadow />
      <pointLight position={[0.48, 1.4, -1.4]} intensity={0.5} color={COLOR.accent} distance={2.2} decay={2} />
      <pointLight position={[0, 1.9, -1.6]} intensity={0.4} color={COLOR.accent} distance={2.4} decay={2} />
    </group>
  )
}

useGLTF.preload('/models/modern-neon-room.glb')
